# Speech API Documentation

## Base URL
```
/api/speech
```

---

## 1. Transcribe Audio (ASR)

Converts audio speech to text using Haitian Creole ASR models.

### Endpoint
```
POST /api/speech/transcribe
```

### Request

**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | File | Yes | - | Audio file (MP3, WAV, OGG, WEBM, FLAC, M4A, MP4). Max 25MB. |
| `model` | string | No | `predika-org/ayira-medium` | ASR model to use |
| `language_hint` | string | No | `ht` | Language hint for transcription. Set to empty string to disable. |
| `beam_size` | number | No | `5` | Beam size for decoding (1-10) |
| `temperature` | number | No | `0.0` | Sampling temperature (0.0-1.0) |
| `timestamps` | boolean | No | `true` | Include segment timestamps in response |

**Available Models:**
- `predika-org/ayira-medium` (default)
- `predika-org/ayira-large-turbo-v3`
- `predika-org/ayira-large-v2-2`

### Response

**Success (200 OK):**
```json
{
  "ok": true,
  "model": "predika-org/ayira-medium",
  "language_hint": "ht",
  "text": "Bonjou tout moun, kijan nou ye?",
  "confidence": 0.92,
  "audio": {
    "duration_sec": 3.5,
    "sr": 16000,
    "rms": 0.045
  },
  "segments": [
    {
      "start": 0.0,
      "end": 1.2,
      "text": "Bonjou tout moun,"
    },
    {
      "start": 1.2,
      "end": 3.5,
      "text": "kijan nou ye?"
    }
  ],
  "notes": {
    "timestamps": "chunk",
    "timestamp_error": null
  },
  "decode": {
    "beam_size": 5,
    "temperature": 0.0
  }
}
```

**Validation Error (422 Unprocessable Entity):**
```json
{
  "ok": false,
  "error": "audio_too_short",
  "detail": "Duration 0.150s is below minimum 0.30s"
}
```

**Other Error Codes:**
- `audio_too_long` - Audio exceeds 10 minutes
- `invalid_channel_count` - Invalid audio channels
- `no_speech_detected` - Audio appears silent

**Bad Request (400):**
```json
{
  "ok": false,
  "error": "invalid_audio_type",
  "message": "Tip fichye odyo a pa aksepte."
}
```

```json
{
  "ok": false,
  "error": "file_too_large",
  "message": "Fichye a twò gwo. Maksimòm se 25MB."
}
```

```json
{
  "ok": false,
  "error": "invalid_model",
  "message": "Modèl sa pa valab."
}
```

**Server Error (500):**
```json
{
  "ok": false,
  "error": "server_error",
  "message": "Yon erè fèt pandan transkripsyon an."
}
```

### Example (cURL)
```bash
curl -X POST "https://api.predika.app/api/speech/transcribe" \
  -F "file=@audio.mp3" \
  -F "model=predika-org/ayira-medium" \
  -F "language_hint=ht" \
  -F "timestamps=true"
```

### Example (JavaScript)
```javascript
const formData = new FormData();
formData.append('file', audioFile);
formData.append('model', 'predika-org/ayira-medium');
formData.append('language_hint', 'ht');

const response = await fetch('/api/speech/transcribe', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.text);
```

---

## 2. Text-to-Speech (TTS)

Generates speech audio from Haitian Creole text.

### Endpoint
```
POST /api/speech/tts
```

### Request

**Content-Type:** `application/json`

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | Yes | - | Text to convert to speech (1-500 characters) |
| `speaker` | string | No | `narrateur` | Voice speaker to use |
| `model` | string | No | `kani-tts-haitian-creole-22khz` | TTS model to use |
| `temperature` | number | No | `0.6` | Sampling temperature (0.0-1.0) |
| `top_p` | number | No | `0.95` | Top-p sampling (0.0-1.0) |
| `repetition_penalty` | number | No | `1.1` | Repetition penalty (1.0-2.0) |
| `max_tokens` | number | No | `1200` | Maximum tokens to generate (100-2000) |

**Available Models:**
| ID | Name | Description |
|----|------|-------------|
| `kani-tts-haitian-creole-22khz` | Standard Model | Kalite ak vitès balanse |
| `kani-tts-haitian-creole-22khz-aggressive` | Aggressive Model | Plis ekspresif ak dinamik |

**Available Speakers:**
| ID | Name | Gender | Description |
|----|------|--------|-------------|
| `narrateur` | Narrateur | Male | Gason - Naratè |
| `narrateur_cmu_female` | CMU Female | Female | Fi - CMU Dataset |
| `narrateur_cmu_male` | CMU Male | Male | Gason - CMU Dataset |
| `presentateur` | Prezentatè | Male | Gason - Formal |
| `conteuse` | Kontèz | Female | Fi - Storyteller |
| `assistante` | Asistant | Female | Fi - Assistant |
| `femme_narratrice` | Naratris | Female | Fi - Narrator |
| `homme_jeune` | Jèn Gason | Male | Gason - Young |

### Response

**Success (200 OK):**

Returns binary WAV audio file.

**Content-Type:** `audio/wav`

**Response Headers:**
| Header | Description |
|--------|-------------|
| `X-Generation-Time` | Model generation time in seconds |
| `X-Decode-Time` | Audio decoding time in seconds |
| `X-Total-Time` | Total processing time in seconds |
| `X-Speaker` | Speaker used |
| `X-Model` | Model used |
| `Content-Disposition` | `attachment; filename=speech.wav` |

**Audio Properties:**
- Sample Rate: 22050 Hz
- Format: WAV (PCM)
- Channels: Mono

**Validation Error (422):**
```json
{
  "ok": false,
  "error": "validation_error",
  "message": "Tèks la dwe gen omwen 1 karaktè"
}
```

**Bad Request (400):**
```json
{
  "ok": false,
  "error": "empty_text",
  "message": "Tèks la pa ka vid."
}
```

```json
{
  "ok": false,
  "error": "text_too_long",
  "message": "Tèks la twò long. Maksimòm se 500 karaktè."
}
```

```json
{
  "ok": false,
  "error": "invalid_model",
  "message": "Modèl sa pa valab."
}
```

```json
{
  "ok": false,
  "error": "invalid_speaker",
  "message": "Vwa sa pa valab."
}
```

**Server Error (500):**
```json
{
  "ok": false,
  "error": "server_error",
  "message": "Yon erè fèt pandan jenerasyon vwa a."
}
```

### Example (cURL)
```bash
curl -X POST "https://api.predika.app/api/speech/tts" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjou tout moun, kijan nou ye jodi a?",
    "speaker": "narrateur",
    "model": "kani-tts-haitian-creole-22khz"
  }' \
  --output speech.wav
```

### Example (JavaScript)
```javascript
const response = await fetch('/api/speech/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Bonjou tout moun, kijan nou ye jodi a?',
    speaker: 'narrateur',
    model: 'kani-tts-haitian-creole-22khz'
  })
});

// Get timing info from headers
const generationTime = response.headers.get('X-Generation-Time');
const totalTime = response.headers.get('X-Total-Time');

// Get audio blob
const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);

// Play audio
const audio = new Audio(audioUrl);
audio.play();
```

---

## Helper Endpoints

### Get ASR Models
```
GET /api/speech/asr/models
```

**Response:**
```json
{
  "models": [
    { "id": "predika-org/ayira-medium", "name": "ayira medium" },
    { "id": "predika-org/ayira-large-turbo-v3", "name": "ayira large turbo v3" },
    { "id": "predika-org/ayira-large-v2-2", "name": "ayira large v2 2" }
  ]
}
```

### Get TTS Models
```
GET /api/speech/tts/models
```

**Response:**
```json
{
  "models": [
    {
      "id": "kani-tts-haitian-creole-22khz",
      "name": "Standard Model",
      "description": "Kalite ak vitès balanse"
    },
    {
      "id": "kani-tts-haitian-creole-22khz-aggressive",
      "name": "Aggressive Model",
      "description": "Plis ekspresif ak dinamik"
    }
  ]
}
```

### Get TTS Speakers
```
GET /api/speech/tts/speakers
```

**Response:**
```json
{
  "speakers": [
    { "id": "narrateur", "name": "Narrateur", "gender": "male", "description": "Gason - Naratè" },
    { "id": "narrateur_cmu_female", "name": "CMU Female", "gender": "female", "description": "Fi - CMU Dataset" },
    { "id": "narrateur_cmu_male", "name": "CMU Male", "gender": "male", "description": "Gason - CMU Dataset" },
    { "id": "presentateur", "name": "Prezentatè", "gender": "male", "description": "Gason - Formal" },
    { "id": "conteuse", "name": "Kontèz", "gender": "female", "description": "Fi - Storyteller" },
    { "id": "assistante", "name": "Asistant", "gender": "female", "description": "Fi - Assistant" },
    { "id": "femme_narratrice", "name": "Naratris", "gender": "female", "description": "Fi - Narrator" },
    { "id": "homme_jeune", "name": "Jèn Gason", "gender": "male", "description": "Gason - Young" }
  ]
}
```

---

## Error Messages (Kreyòl)

All error messages are returned in Haitian Creole:

| Error Code | Message |
|------------|---------|
| `invalid_audio_type` | Tip fichye odyo a pa aksepte. |
| `file_too_large` | Fichye a twò gwo. Maksimòm se 25MB. |
| `invalid_model` | Modèl sa pa valab. |
| `empty_text` | Tèks la pa ka vid. |
| `text_too_long` | Tèks la twò long. Maksimòm se 500 karaktè. |
| `invalid_speaker` | Vwa sa pa valab. |
| `server_error` (ASR) | Yon erè fèt pandan transkripsyon an. |
| `server_error` (TTS) | Yon erè fèt pandan jenerasyon vwa a. |
