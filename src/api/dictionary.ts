import { api } from "@/lib/api-client";
import type {
    Word,
    WordsListParams,
    WordsListResponse,
    CreateWordRequest,
    UpdateWordRequest,
} from "@/types/api";

/**
 * Dictionary API functions for managing Haitian Creole words
 */

/**
 * Get paginated list of dictionary words with optional search
 * GET /api/words
 */
export async function listWords(params?: WordsListParams): Promise<WordsListResponse> {
    return api.get<WordsListResponse>("/api/words", params);
}

/**
 * Get detailed information about a specific word
 * GET /api/words/:id
 */
export async function getWord(id: number): Promise<Word> {
    return api.get<Word>(`/api/words/${id}`);
}

/**
 * Create a new word in the dictionary
 * POST /api/words
 * Requires authentication
 */
export async function createWord(data: CreateWordRequest): Promise<Word> {
    return api.post<Word>("/api/words", data);
}

/**
 * Update an existing word
 * PUT /api/words/:id
 * Requires authentication
 */
export async function updateWord(id: number, data: UpdateWordRequest): Promise<Word> {
    return api.put<Word>(`/api/words/${id}`, data);
}

/**
 * Delete a word from the dictionary
 * DELETE /api/words/:id
 * Requires authentication
 */
export async function deleteWord(id: number): Promise<null> {
    return api.delete<null>(`/api/words/${id}`);
}

/**
 * Get the word of the day
 * GET /api/words/word-of-the-day
 */
export async function getWordOfTheDay(): Promise<Word> {
    return api.get<Word>("/api/words/word-of-the-day");
}
