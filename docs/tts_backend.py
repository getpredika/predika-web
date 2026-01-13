"""
Modal.com Deployment - Backend API Only
Serverless GPU inference for Haitian Creole TTS

Deploy: modal deploy modal_deploy.py
Cost: ~$0.60/hour when running, $0 when idle
"""

import modal
from pathlib import Path

# Create Modal app
app = modal.App("haitian-creole-tts-api")

PREVIEW_DIR = "/previews"

# Define container image with all dependencies
image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("ffmpeg", "git", "libsndfile1")
    .pip_install(
        "packaging",
        "setuptools",
        "wheel",
        "cmake",
        "ninja",
    )
    .pip_install(
        "torch",
        "numpy",
        "scipy",
        "librosa",
        "omegaconf",
        "peft",
        "datasets==3.6.0",
    )
    .pip_install("nemo_toolkit[all]")
    .pip_install(
        "git+https://github.com/huggingface/transformers.git",
        "fastapi",
        "python-multipart"
    )
)


# GPU inference function -------------------------------------------------------

@app.function(
    image=image,
    gpu="T4",
    timeout=300,
    secrets=[modal.Secret.from_name("huggingface-token")],
    min_containers=0,
)
def generate_speech(
    text: str,
    speaker: str = "narrateur",
    model_name: str = "kani-tts-haitian-creole-22khz",
    temperature: float = 0.6,
    top_p: float = 0.95,
    repetition_penalty: float = 1.1,
    max_tokens: int = 1200,
    num_return_sequences: int = 1
):
    """Generate speech - only charged when this runs!"""
    import os
    import numpy as np

    # --- Inline helper classes ------------------------------------------------

    class NemoAudioPlayer:
        def __init__(self, model_name):
            from nemo.collections.tts.models import AudioCodecModel
            import torch

            self.codec = AudioCodecModel.from_pretrained(model_name).eval()
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
            self.codec.to(self.device)

            self.start_of_speech = 64401
            self.end_of_speech = 64402
            self.start_of_human = 64403
            self.end_of_human = 64404
            self.start_of_ai = 64405
            self.end_of_ai = 64406
            self.audio_tokens_start = 64410
            self.codebook_size = 4032

        def get_nano_codes(self, out_ids):
            import torch

            start_a_idx = (out_ids == self.start_of_speech).nonzero(
                as_tuple=True)[0].item()
            end_a_idx = (out_ids == self.end_of_speech).nonzero(
                as_tuple=True)[0].item()

            audio_codes = out_ids[start_a_idx+1: end_a_idx]
            audio_codes = audio_codes.reshape(-1, 4)
            audio_codes = audio_codes - \
                torch.tensor([self.codebook_size * i for i in range(4)])
            audio_codes = audio_codes - self.audio_tokens_start

            audio_codes = audio_codes.T.unsqueeze(0)
            len_ = torch.tensor([audio_codes.shape[-1]])
            return audio_codes, len_

        def get_waveform(self, out_ids):
            import torch

            out_ids = out_ids.flatten()
            audio_codes, len_ = self.get_nano_codes(out_ids)
            audio_codes, len_ = audio_codes.to(
                self.device), len_.to(self.device)

            with torch.inference_mode():
                reconstructed_audio, _ = self.codec.decode(
                    tokens=audio_codes, tokens_len=len_)
                output_audio = reconstructed_audio.cpu().numpy().squeeze()

            return output_audio

    class KaniModel:
        def __init__(self, model_name, player, hf_token=None):
            from transformers import AutoModelForCausalLM, AutoTokenizer
            import torch

            self.player = player
            self.device = "cuda" if torch.cuda.is_available() else "cpu"

            self.tokenizer = AutoTokenizer.from_pretrained(
                model_name,
                token=hf_token,
                clean_up_tokenization_spaces=False,
                trust_remote_code=True,
            )

            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                token=hf_token,
                torch_dtype=torch.bfloat16,
                device_map="cuda",
                trust_remote_code=True,
            ).eval()

        def get_input_ids(self, text_prompt):
            import torch

            START_OF_HUMAN = self.player.start_of_human
            END_OF_TEXT = 2
            END_OF_HUMAN = self.player.end_of_human

            input_ids = self.tokenizer(
                text_prompt, return_tensors="pt").input_ids
            start_token = torch.tensor([[START_OF_HUMAN]], dtype=torch.int64)
            end_tokens = torch.tensor(
                [[END_OF_TEXT, END_OF_HUMAN]], dtype=torch.int64)

            modified_input_ids = torch.cat(
                [start_token, input_ids, end_tokens], dim=1)
            attention_mask = torch.ones(
                1, modified_input_ids.shape[1], dtype=torch.int64)
            return modified_input_ids, attention_mask

        def model_request(self, input_ids, attention_mask, temperature, top_p, repetition_penalty, max_new_tokens, num_return_sequences):
            import torch
            import time

            start = time.time()
            input_ids = input_ids.to(self.device)
            attention_mask = attention_mask.to(self.device)

            with torch.no_grad():
                output = self.model.generate(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    max_new_tokens=max_new_tokens,
                    do_sample=True,
                    temperature=temperature,
                    top_p=top_p,
                    repetition_penalty=repetition_penalty,
                    num_return_sequences=num_return_sequences,
                    eos_token_id=self.player.end_of_speech,
                )
            gen_time = time.time() - start
            return output.cpu(), gen_time

        def run_model(self, text, speaker_name, temperature, top_p, repetition_penalty, max_new_tokens, num_return_sequences):
            import time

            text_prompt = f"{speaker_name.lower()}: {text}" if speaker_name else text
            input_ids, attention_mask = self.get_input_ids(text_prompt)

            output, gen_time = self.model_request(
                input_ids, attention_mask, temperature, top_p, repetition_penalty, max_new_tokens, num_return_sequences
            )

            start = time.time()
            audio = self.player.get_waveform(output)
            decode_time = time.time() - start

            return audio, gen_time, decode_time

    # Initialize models
    player = NemoAudioPlayer("nvidia/nemo-nano-codec-22khz-0.6kbps-12.5fps")
    model = KaniModel(f"predika-org/{model_name}",
                      player, os.environ["HF_TOKEN"])

    # Generate
    audio, gen_time, decode_time = model.run_model(
        text, speaker, temperature, top_p, repetition_penalty, max_tokens, num_return_sequences
    )

    return {
        "audio": audio.tolist(),
        "sample_rate": 22050,
        "generation_time": gen_time,
        "decode_time": decode_time,
        "total_time": gen_time + decode_time,
        "speaker": speaker,
        "model": model_name
    }


# Preview generation function --------------------------------------------------

@app.function(
    image=image,
    gpu="T4",
    timeout=600,
    secrets=[modal.Secret.from_name("huggingface-token")],
)
def generate_all_previews():
    """Generate preview audio for all speakers and save to volume."""
    import numpy as np
    from scipy.io import wavfile
    import os

    PREVIEW_TEXT = "Bonjou. Mwen se yon sistèm TTS pou lang Kreyòl."

    SPEAKER_IDS = [
        "narrateur",
        "narrateur_cmu_female",
        "narrateur_cmu_male",
        "presentateur",
        "conteuse",
        "assistante",
        "femme_narratrice",
        "homme_jeune",
    ]

    os.makedirs(PREVIEW_DIR, exist_ok=True)

    results = []
    for speaker_id in SPEAKER_IDS:
        try:
            print(f"Generating preview for {speaker_id}...")

            # Generate preview
            result = generate_speech.local(
                text=PREVIEW_TEXT,
                speaker=speaker_id,
                model_name="kani-tts-haitian-creole-22khz",
                temperature=0.6,
                top_p=0.95,
                repetition_penalty=1.1,
                max_tokens=600,
                num_return_sequences=1
            )

            # Save to volume
            audio_array = np.array(result["audio"], dtype=np.float32)
            filepath = f"{PREVIEW_DIR}/{speaker_id}_preview.wav"
            wavfile.write(filepath, result["sample_rate"], audio_array)

            results.append({
                "speaker": speaker_id,
                "status": "success",
                "filepath": filepath,
                "duration": len(audio_array) / result["sample_rate"]
            })
            print(f"✓ Saved {speaker_id} preview to {filepath}")

        except Exception as e:
            results.append({
                "speaker": speaker_id,
                "status": "failed",
                "error": str(e)
            })
            print(f"✗ Failed to generate {speaker_id}: {str(e)}")

    return {
        "message": "Preview generation complete",
        "results": results
    }


# FastAPI Backend API ----------------------------------------------------------

@app.function(
    image=image,
    gpu="T4",
    timeout=600,
    secrets=[modal.Secret.from_name("huggingface-token")],
    min_containers=0,
)
@modal.asgi_app()
def fastapi_app():
    """FastAPI backend for React frontend."""
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import StreamingResponse
    from pydantic import BaseModel
    import io
    import numpy as np
    from scipy.io import wavfile

    app = FastAPI(
        title="🇭🇹 Haitian Creole TTS API",
        description="Serverless GPU-powered Text-to-Speech for Haitian Creole",
        version="1.0.0"
    )

    # CORS for React frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=[
            "X-Generation-Time",
            "X-Decode-Time",
            "X-Total-Time",
            "X-Speaker",
            "X-Model"
        ],
    )

    # Request/Response models
    class GenerateRequest(BaseModel):
        text: str
        speaker: str = "narrateur"
        model: str = "kani-tts-haitian-creole-22khz"
        temperature: float = 0.6
        top_p: float = 0.95
        repetition_penalty: float = 1.1
        max_tokens: int = 1200
        num_return_sequences: int = 1

    class SpeakerInfo(BaseModel):
        id: str
        name: str
        gender: str
        description: str

    MODELS = [
        {
            "id": "kani-tts-haitian-creole-22khz",
            "name": "Standard Model",
            "description": "Balanced quality and speed"
        },
        {
            "id": "kani-tts-haitian-creole-22khz-aggressive",
            "name": "Aggressive Model",
            "description": "More expressive and dynamic"
        },
    ]

    SPEAKERS = [
        {"id": "narrateur", "name": "Narrateur",
            "gender": "female", "description": "Fi - Vitès Nòmal",
            "previewUrl": "/api/preview/narrateur"},
        {"id": "presentateur", "name": "Prezentatè",
            "gender": "male", "description": "Gason - Formal",
            "previewUrl": "/api/preview/presentateur"},
        {"id": "conteuse", "name": "Kontèz", "gender": "female",
            "description": "Fi - Storyteller",
            "previewUrl": "/api/preview/conteuse"},
        {"id": "assistante", "name": "Asistant",
            "gender": "female", "description": "Fi - Assistant",
            "previewUrl": "/api/preview/assistante"},
    ]

    @app.get("/")
    def root():
        return {
            "message": "🇭🇹 Haitian Creole TTS API",
            "status": "online",
            "docs": "/docs",
            "endpoints": {
                "models": "/api/models",
                "speakers": "/api/speakers",
                "generate": "/api/generate (POST)"
            }
        }

    @app.get("/api/models")
    def get_models():
        """Get list of available TTS models."""
        return {"models": MODELS}

    @app.get("/api/speakers")
    def get_speakers():
        """Get list of available voice speakers."""
        return {"speakers": SPEAKERS}

    @app.get("/api/preview/{speaker_id}")
    def get_speaker_preview(speaker_id: str):
        """Serve pre-generated preview audio for a speaker."""
        from fastapi.responses import FileResponse
        import os

        if speaker_id not in [s["id"] for s in SPEAKERS]:
            raise HTTPException(
                status_code=404, detail=f"Speaker not found: {speaker_id}")

        filepath = f"{PREVIEW_DIR}/{speaker_id}_preview.wav"

        # Check if preview file exists
        if not os.path.exists(filepath):
            raise HTTPException(
                status_code=404,
                detail=f"Preview not found. Run: modal run modal_deploy.py::generate_all_previews"
            )

        return FileResponse(
            filepath,
            media_type="audio/wav",
            headers={
                "Content-Disposition": f"inline; filename={speaker_id}_preview.wav",
                # Cache for 1 year (static files)
                "Cache-Control": "public, max-age=31536000",
            }
        )

    @app.post("/api/generate")
    def generate_audio(request: GenerateRequest):
        """Generate speech from Haitian Creole text."""
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        if request.model not in [m["id"] for m in MODELS]:
            raise HTTPException(
                status_code=400, detail=f"Invalid model: {request.model}")

        if request.speaker not in [s["id"] for s in SPEAKERS]:
            raise HTTPException(
                status_code=400, detail=f"Invalid speaker: {request.speaker}")

        try:
            # Call GPU function
            result = generate_speech.remote(
                text=request.text,
                speaker=request.speaker,
                model_name=request.model,
                temperature=request.temperature,
                top_p=request.top_p,
                repetition_penalty=request.repetition_penalty,
                max_tokens=request.max_tokens,
                num_return_sequences=request.num_return_sequences
            )

            # Convert to WAV
            audio_array = np.array(result["audio"], dtype=np.float32)
            buffer = io.BytesIO()
            wavfile.write(buffer, result["sample_rate"], audio_array)
            buffer.seek(0)

            return StreamingResponse(
                buffer,
                media_type="audio/wav",
                headers={
                    "Content-Disposition": "attachment; filename=speech.wav",
                    "X-Generation-Time": str(result["generation_time"]),
                    "X-Decode-Time": str(result["decode_time"]),
                    "X-Total-Time": str(result["total_time"]),
                    "X-Speaker": result["speaker"],
                    "X-Model": result["model"]
                }
            )

        except Exception as e:
            import traceback
            print(f"❌ Error: {str(e)}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/health")
    def health():
        return {"status": "healthy"}

    return app
