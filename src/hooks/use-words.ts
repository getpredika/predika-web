import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { listWords, getWord } from "@/api/dictionary";
import type { WordsListParams, Word, WordsListResponse } from "@/types/api";

function stableStringify(value: unknown): string {
  if (!value || typeof value !== "object") return JSON.stringify(value);

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const entries = keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`);
  return `{${entries.join(",")}}`;
}

// Fetch list of words (optionally filtered by search)
export function useWords(
  params?: WordsListParams,
  options?: Omit<UseQueryOptions<WordsListResponse>, "queryKey" | "queryFn">
) {
  // Serialize params so the queryKey is stable across renders
  const paramsKey = stableStringify(params ?? null);

  return useQuery({
    queryKey: ["/api/words", paramsKey],
    queryFn: () => listWords(params),
    ...options,
  });
}

// Fetch single word by ID
export function useWord(id: number) {
  return useQuery<Word | null>({
    queryKey: ["/api/words", id],
    queryFn: () => getWord(id),
    enabled: !!id,
  });
}
