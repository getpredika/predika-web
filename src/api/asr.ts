/**
 * ASR (Automatic Speech Recognition) API
 * Uses the Predika Speech API for Haitian Creole transcription
 */

const API_URL = import.meta.env.VITE_API_URL || "https://api.predika.app";

/**
 * Available ASR models
 */
export const ASR_MODELS = [
    { id: "predika-org/ayira-medium", name: "Ayira Medium" },
    { id: "predika-org/ayira-large-turbo-v3", name: "Ayira Large Turbo V3" },
    { id: "predika-org/ayira-large-v2-2", name: "Ayira Large V2.2" },
] as const;

export type ASRModelId = (typeof ASR_MODELS)[number]["id"];

/**
 * Transcription request options
 */
export interface TranscribeOptions {
    model?: ASRModelId;
    languageHint?: string;
    beamSize?: number;
    temperature?: number;
    timestamps?: boolean;
}

/**
 * Segment with timing information
 */
export interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
}

/**
 * Audio metadata from transcription
 */
export interface AudioInfo {
    duration_sec: number;
    sr: number;
    rms: number;
}

/**
 * Transcription response from the API
 */
export interface TranscribeResponse {
    ok: boolean;
    model: string;
    language_hint: string;
    text: string;
    confidence: number;
    segments: TranscriptSegment[] | null;
    audio: AudioInfo;
    decode: {
        beam_size: number;
        temperature: number;
    };
}

/**
 * Error response from the API
 */
export interface TranscribeError {
    ok: false;
    error: string;
    message?: string;
    detail?: string;
}

/**
 * Transcribe audio file to text
 * POST /api/speech/transcribe
 * @param file - Audio file to transcribe (MP3, WAV, OGG, WEBM, FLAC, M4A, MP4)
 * @param options - Transcription options
 * @returns Transcription result with text and segments
 */
export async function transcribeAudio(
    file: File,
    options: TranscribeOptions = {}
): Promise<TranscribeResponse> {
    const formData = new FormData();
    formData.append("file", file);

    if (options.model) {
        formData.append("model", options.model);
    }
    if (options.languageHint !== undefined) {
        formData.append("language_hint", options.languageHint);
    }
    if (options.beamSize !== undefined) {
        formData.append("beam_size", options.beamSize.toString());
    }
    if (options.temperature !== undefined) {
        formData.append("temperature", options.temperature.toString());
    }
    if (options.timestamps !== undefined) {
        formData.append("timestamps", options.timestamps.toString());
    }

    const response = await fetch(`${API_URL}/api/speech/transcribe`, {
        method: "POST",
        credentials: "include", // Include cookies for session-based auth
        body: formData,
    });

    const result = await response.json();

    if (!response.ok || result.ok === false) {
        const error = result as TranscribeError;
        throw new Error(
            error.message || error.detail || error.error || "Transkrisyon echwe"
        );
    }

    return result as TranscribeResponse;
}
