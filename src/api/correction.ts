import { api } from "@/lib/api-client";
import type { CorrectTextRequest, CorrectTextResponse } from "@/types/api";

/**
 * Correct Haitian Creole text for spelling, grammar, and syntax
 * POST /api/correct
 * Requires authentication
 * 
 * Returns either corrections with modifications or a message indicating no corrections needed
 */
export async function correctText(data: CorrectTextRequest): Promise<CorrectTextResponse> {
    return api.post<CorrectTextResponse>("/api/correct", data);
}
