/**
 * Pronunciation Assessment API
 * Uses the Predika Speech API for Haitian Creole pronunciation assessment
 */

import type {
    AssessmentResult,
    AssessmentError,
    AssessPronunciationOptions,
} from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL || "https://api.predika.app";

/**
 * Assess pronunciation by comparing audio against reference text
 * POST /api/speech/assess
 * @param file - Audio file (mp3, wav, ogg, webm, flac, m4a, mp4 — max 15MB, max 120s)
 * @param text - Reference text to assess against
 * @param options - Assessment options (method, mode)
 * @returns Assessment result with word and phone-level scores
 */
export async function assessPronunciation(
    file: File | Blob,
    text: string,
    options: AssessPronunciationOptions = {}
): Promise<AssessmentResult> {
    const formData = new FormData();
    formData.append("file", file, file instanceof File ? file.name : "recording.webm");

    const params = new URLSearchParams();
    params.append("text", text);
    if (options.method) params.append("method", options.method);
    if (options.mode) params.append("mode", options.mode);
    params.append("asr", String(options.asr ?? true));

    const response = await fetch(`${API_URL}/api/speech/assess?${params.toString()}`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok || result.ok === false) {
        const error = result as AssessmentError;
        throw new Error(
            error.message || error.detail || error.error || "Evalyasyon pwononsyasyon echwe"
        );
    }

    return result as AssessmentResult;
}
