/**
 * Pronunciation Assessment API
 * Uses the Predika Speech API for Haitian Creole pronunciation assessment
 */

import { apiFetch } from "@/lib/api-client";
import type {
    AssessmentResult,
    AssessmentError,
    AssessPronunciationOptions,
} from "@/types/api";

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

    const queryParams: Record<string, string | number | boolean | undefined> = {
        text,
        asr: options.asr ?? true,
    };
    if (options.method) queryParams.method = options.method;
    if (options.mode) queryParams.mode = options.mode;

    const response = await apiFetch("/api/speech/assess", {
        method: "POST",
        body: formData,
        params: queryParams,
    });

    const result = await response.json();

    if (result.ok === false) {
        const error = result as AssessmentError;
        throw new Error(
            error.message || error.detail || error.error || "Evalyasyon pwononsyasyon echwe"
        );
    }

    return result as AssessmentResult;
}
