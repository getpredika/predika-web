import { useMutation } from "@tanstack/react-query";
import * as ttsApi from "@/api/tts";
import type { TTSGenerateRequest } from "@/types/api";

// Re-export static lists for convenience
export { TTS_MODELS, TTS_SPEAKERS } from "@/api/tts";

/**
 * Hook to generate speech from text
 * Returns a mutation that can be triggered with text and options
 */
export function useGenerateSpeech() {
    return useMutation({
        mutationFn: (request: TTSGenerateRequest) => ttsApi.generateSpeech(request),
    });
}
