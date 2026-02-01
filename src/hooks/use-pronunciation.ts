import { useMutation } from "@tanstack/react-query";
import { assessPronunciation } from "@/api/pronunciation";
import type { AssessPronunciationOptions } from "@/types/api";

interface AssessPronunciationInput {
    file: File | Blob;
    text: string;
    options?: AssessPronunciationOptions;
}

/**
 * Hook to assess pronunciation against reference text
 */
export function useAssessPronunciation() {
    return useMutation({
        mutationFn: ({ file, text, options }: AssessPronunciationInput) =>
            assessPronunciation(file, text, options),
    });
}
