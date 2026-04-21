import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as quizApi from "@/api/quiz";
import type {
    QuizType,
    SubmitQuizRequest,
    QuizHistoryParams,
    QuizHistoryItem,
    QuizStatsParams,
} from "@/types/api";

/**
 * Hook to generate a definition quiz
 */
export function useGenerateDefinitionQuiz() {
    return useMutation({
        mutationFn: () => quizApi.generateDefinitionQuiz(),
    });
}

/**
 * Hook to generate a listening quiz
 */
export function useGenerateListeningQuiz() {
    return useMutation({
        mutationFn: () => quizApi.generateListeningQuiz(),
    });
}

/**
 * Generic hook to generate any quiz type
 */
export function useGenerateQuiz(quizType: QuizType) {
    const definitionQuiz = useGenerateDefinitionQuiz();
    const listeningQuiz = useGenerateListeningQuiz();

    if (quizType === "definition_quiz") {
        return definitionQuiz;
    }
    return listeningQuiz;
}

/**
 * Hook to submit quiz answers
 */
export function useSubmitQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitQuizRequest) => quizApi.submitQuiz(data),
        onSuccess: () => {
            // Invalidate quiz history and stats to show updated data
            queryClient.invalidateQueries({ queryKey: ["quiz", "history"] });
            queryClient.invalidateQueries({ queryKey: ["quiz", "stats"] });
        },
    });
}

/**
 * Hook to fetch quiz history with pagination
 * Requires authentication
 */
export function useQuizHistory(params?: QuizHistoryParams) {
    return useQuery({
        queryKey: ["quiz", "history", params],
        queryFn: () => quizApi.getQuizHistory(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch quiz statistics
 * Requires authentication
 */
export function useQuizStats(params?: QuizStatsParams) {
    return useQuery({
        queryKey: ["quiz", "stats", params],
        queryFn: () => quizApi.getQuizStats(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
