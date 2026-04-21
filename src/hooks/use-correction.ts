import { useMutation } from "@tanstack/react-query";
import * as correctionApi from "@/api/correction";
import type { CorrectTextRequest } from "@/types/api";

/**
 * Hook to correct Haitian Creole text
 * Requires authentication
 */
export function useCorrectText() {
    return useMutation({
        mutationFn: (data: CorrectTextRequest) => correctionApi.correctText(data),
    });
}
