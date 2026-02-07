import { useQuery, useMutation, useQueryClient, useInfiniteQuery, type UseQueryOptions } from "@tanstack/react-query";
import * as dictionaryApi from "@/api/dictionary";
import type { WordsListParams, Word, WordsListResponse, CreateWordRequest, UpdateWordRequest } from "@/types/api";

/**
 * Hook to fetch paginated list of words with optional search
 */
export function useWords(
    params?: WordsListParams,
    options?: Omit<UseQueryOptions<WordsListResponse>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["words", params],
        queryFn: () => dictionaryApi.listWords(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

/**
 * Hook for infinite scrolling word list
 */
export function useInfiniteWords(searchTerm?: string) {
    return useInfiniteQuery({
        queryKey: ["words", "infinite", searchTerm],
        queryFn: ({ pageParam = 1 }) =>
            dictionaryApi.listWords({
                page: pageParam,
                limit: 20,
                ...(searchTerm && { search: searchTerm }),
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage.meta;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch a single word by ID
 */
export function useWord(id: number | undefined) {
    return useQuery({
        queryKey: ["words", id],
        queryFn: () => dictionaryApi.getWord(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Hook to create a new word
 */
export function useCreateWord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateWordRequest) => dictionaryApi.createWord(data),
        onSuccess: () => {
            // Invalidate all word queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ["words"] });
        },
    });
}

/**
 * Hook to update an existing word
 */
export function useUpdateWord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateWordRequest }) =>
            dictionaryApi.updateWord(id, data),
        onSuccess: (updatedWord) => {
            // Update the specific word in cache
            queryClient.setQueryData(["words", updatedWord.id], updatedWord);
            // Invalidate the list to refresh
            queryClient.invalidateQueries({ queryKey: ["words"], exact: false });
        },
    });
}

/**
 * Hook to delete a word
 */
export function useDeleteWord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => dictionaryApi.deleteWord(id),
        onSuccess: (_, deletedId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: ["words", deletedId] });
            // Invalidate the list
            queryClient.invalidateQueries({ queryKey: ["words"], exact: false });
        },
    });
}

/**
 * Hook to fetch the word of the day from the backend
 */
export function useWordOfTheDay(
    options?: Omit<UseQueryOptions<Word>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["words", "word-of-the-day"],
        queryFn: () => dictionaryApi.getWordOfTheDay(),
        staleTime: 1000 * 60 * 60, // Cache for 1 hour since it changes daily
        ...options,
    });
}
