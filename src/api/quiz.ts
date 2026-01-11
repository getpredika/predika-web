import { api } from "@/lib/api-client";
import type {
    QuizSession,
    SubmitQuizRequest,
    SubmitQuizResponse,
    QuizHistoryParams,
    QuizHistoryItem,
    QuizStatsParams,
    QuizStats,
} from "@/types/api";

/**
 * Quiz System API functions
 * Most endpoints support silentAuth (work for both guests and authenticated users)
 */

/**
 * Generate a new definition quiz with 10 random questions
 * GET /api/quiz/definition
 * Works for guests and authenticated users
 */
export async function generateDefinitionQuiz(): Promise<QuizSession> {
    return api.get<QuizSession>("/api/quiz/definition");
}

/**
 * Generate a new listening quiz with 10 random audio questions
 * GET /api/quiz/listening
 * Works for guests and authenticated users
 */
export async function generateListeningQuiz(): Promise<QuizSession> {
    return api.get<QuizSession>("/api/quiz/listening");
}

/**
 * Submit quiz answers and get results
 * POST /api/quiz/submit
 * Works for guests and authenticated users
 */
export async function submitQuiz(data: SubmitQuizRequest): Promise<SubmitQuizResponse> {
    return api.post<SubmitQuizResponse>("/api/quiz/submit", data);
}

/**
 * Get user's quiz history with pagination
 * GET /api/quiz/history
 * Requires authentication
 */
export async function getQuizHistory(params?: QuizHistoryParams): Promise<QuizHistoryItem[]> {
    return api.get<QuizHistoryItem[]>("/api/quiz/history", params);
}

/**
 * Get user's quiz performance statistics
 * GET /api/quiz/stats
 * Requires authentication
 */
export async function getQuizStats(params?: QuizStatsParams): Promise<QuizStats> {
    return api.get<QuizStats>("/api/quiz/stats", params);
}
