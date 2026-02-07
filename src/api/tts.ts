import { apiFetch } from "@/lib/api-client";
import type {
    TTSModel,
    TTSSpeaker,
    TTSGenerateRequest,
    TTSGenerateResponse,
    TTSGenerateMetadata,
} from "@/types/api";

/**
 * Static list of available TTS models
 */
export const TTS_MODELS: TTSModel[] = [
    {
        id: "kani-tts-haitian-creole-22khz",
        name: "Standard Model",
        description: "Balanced quality and speed",
    },
    {
        id: "kani-tts-haitian-creole-22khz-aggressive",
        name: "Aggressive Model",
        description: "More expressive and dynamic",
    },
];

/**
 * Static list of available voice speakers
 * Preview URLs point to local audio files in public/audio/previews
 */
export const TTS_SPEAKERS: TTSSpeaker[] = [
    {
        id: "narrateur",
        name: "Narrateur",
        gender: "male",
        description: "Narrator",
        previewUrl: "/audio/previews/narrateur.wav",
    },
    {
        id: "presentateur",
        name: "Prezentatè",
        gender: "male",
        description: "Formal",
        previewUrl: "/audio/previews/presentateur.wav",
    },
    {
        id: "conteuse",
        name: "Kontèz",
        gender: "female",
        description: "Storyteller",
        previewUrl: "/audio/previews/conteuse.wav",
    },
    {
        id: "assistante",
        name: "Asistant",
        gender: "female",
        description: "Asistan",
        previewUrl: "/audio/previews/assistante.wav",
    },
];

/**
 * Generate speech from text
 * POST /api/speech/tts
 * Returns audio blob with metadata from response headers
 */
export async function generateSpeech(
    request: TTSGenerateRequest
): Promise<TTSGenerateResponse> {
    const response = await apiFetch("/api/speech/tts", {
        method: "POST",
        body: JSON.stringify(request),
    });

    // Get audio blob
    const audioBlob = await response.blob();

    // Extract metadata from response headers
    const metadata: TTSGenerateMetadata = {
        generationTime: parseFloat(response.headers.get("X-Generation-Time") || "0"),
        decodeTime: parseFloat(response.headers.get("X-Decode-Time") || "0"),
        totalTime: parseFloat(response.headers.get("X-Total-Time") || "0"),
        speaker: response.headers.get("X-Speaker") || request.speaker || "narrateur",
        model: response.headers.get("X-Model") || request.model || "kani-tts-haitian-creole-22khz",
    };

    return {
        audioBlob,
        metadata,
    };
}
