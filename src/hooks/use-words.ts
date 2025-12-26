import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// Fetch list of words (optionally filtered by search)
export function useWords(search?: string) {
  return useQuery({
    queryKey: [api.words.list.path, search],
    queryFn: async () => {
      const url = search
        ? `${api.words.list.path}?search=${encodeURIComponent(search)}`
        : api.words.list.path;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch words");

      const data = await res.json();
      return api.words.list.responses[200].parse(data);
    },
  });
}

// Fetch single word by ID
export function useWord(id: number) {
  return useQuery({
    queryKey: [api.words.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.words.get.path, { id });
      const res = await fetch(url);

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch word");

      const data = await res.json();
      return api.words.get.responses[200].parse(data);
    },
  });
}
