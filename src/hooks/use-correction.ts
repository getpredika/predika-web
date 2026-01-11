import { useMutation } from "@tanstack/react-query";
import * as correctionApi from "@/api/correction";
import type { CorrectTextRequest } from "@/types/api";

/**
 * Hook to correct Haitian Creole text
 * Uses Anthropic Claude API for AI-powered corrections
 * Requires authentication
 */
export function useCorrectText() {
    return useMutation({
        mutationFn: (data: CorrectTextRequest) => correctionApi.correctText(data),
    });
}
