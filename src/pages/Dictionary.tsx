import { useEffect, useMemo, useState } from "react";
import { useWords } from "@/hooks/use-words";
import { useWordOfTheDay } from "@/hooks/use-dictionary";
import { SearchBar } from "@/components/SearchBar";
import { WordCard } from "@/components/WordCard";
import { WordCardSkeleton } from "@/components/WordCardSkeleton";
import { Book, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import type { Word } from "@/types/api";
import { getErrorMessage } from "@/lib/api-client";

/**
 * Debounce a string value to reduce refetch + re-animations on every keystroke.
 */
function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}

/**
 * Safer key helper (even though Word.id is required in your types).
 * This prevents hard-to-debug animation glitches if backend shape changes.
 */
function getWordKey(word: Word): string {
  // id is number per your type, but return string for React keys
  return typeof word.id === "number" ? String(word.id) : `${word.word}-${word.createdAt}`;
}

export default function Dictionary() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 250);

  /**
   * Query A: words for the grid
   * - debounced search prevents refetch + re-animate spam
   */
  const listQueryParams = useMemo(
    () => (debouncedSearch ? { search: debouncedSearch } : undefined),
    [debouncedSearch]
  );

  const {
    data: listResponse,
    isLoading: isListLoading,
    error: listError,
  } = useWords(listQueryParams);

  const listWords = listResponse?.data ?? [];

  /**
   * Query B: Word of the Day from dedicated endpoint
   * - Only enabled when not searching
   * - Uses cached backend endpoint for efficiency
   */
  const {
    data: wordOfTheDayData,
    isLoading: isWotdLoading,
    error: wotdError,
  } = useWordOfTheDay({ enabled: !debouncedSearch });

  const wordOfTheDay = debouncedSearch ? null : wordOfTheDayData ?? null;

  /**
   * Remove WOTD from the list to prevent duplicate rendering.
   */
  const visibleWords = useMemo(() => {
    if (!wordOfTheDay) return listWords;
    return listWords.filter((w) => w.id !== wordOfTheDay.id);
  }, [listWords, wordOfTheDay]);

  /**
   * Use one coherent error display:
   * - prefer list error (main UX)
   * - otherwise show WOTD error only if it matters (when not searching)
   */
  const errorToShow = listError ?? (!debouncedSearch ? wotdError : null);

  const isLoading = isListLoading || (!debouncedSearch && isWotdLoading);

  return (
    <div className="min-h-screen bg-[#f0faf7] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50/40 via-transparent to-transparent" />

        <div className="absolute -top-40 -right-32 w-96 h-96 bg-teal-100/25 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-40 w-72 h-72 bg-emerald-100/15 rounded-full blur-3xl" />

        <motion.div
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-teal-200 rounded-full opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-200 rounded-full opacity-15"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-cyan-200 rounded-full opacity-20"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col min-h-screen">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-stone-100 mb-4"
          >
            <Book className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PointerHighlight containerClassName="inline-flex">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
                Diksyonè Konfòtab
              </h1>
            </PointerHighlight>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-lg mx-auto text-balance"
          >
            Yon espas senp e chalere pou dekouvri mo ki bel ak siyifikasyon yo.
          </motion.p>
        </div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 sticky top-6 z-10"
        >
          <SearchBar value={search} onChange={setSearch} isLoading={isLoading} />
        </motion.div>

        {/* Content Section */}
        <div className="flex-1">
          {isLoading ? (
            // ✅ Removed AnimatePresence around skeletons (it was doing nothing)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <WordCardSkeleton key={`skeleton-${index}`} index={index} />
              ))}
            </div>
          ) : errorToShow ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 text-destructive bg-destructive/5 rounded-2xl border border-destructive/10"
            >
              <p className="font-medium">Ayaya! Gen yon bagay ki mal.é.</p>
              <p className="text-sm mt-1 opacity-80">{getErrorMessage(errorToShow)}</p>
            </motion.div>
          ) : (wordOfTheDay || visibleWords.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ✅ Removed mode="popLayout" to avoid grid span layout jumps */}
              <AnimatePresence initial={false}>
                {wordOfTheDay && !debouncedSearch && (
                  <motion.div
                    key="word-of-day"
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="md:col-span-2 lg:col-span-3 h-full"
                  >
                    <WordCard word={wordOfTheDay} index={0} isWordOfDay />
                  </motion.div>
                )}

                {visibleWords.map((word, idx) => (
                  <motion.div
                    key={getWordKey(word)}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.25, delay: idx * 0.03, ease: "easeOut" }}
                    className="h-full"
                  >
                    <WordCard
                      word={word}
                      // ✅ Correct indexing: after featured WOTD, list starts at 1
                      index={wordOfTheDay && !debouncedSearch ? idx + 1 : idx}
                      // ✅ No longer needed since we removed WOTD from list, but safe to keep false
                      isWordOfDay={false}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-stone-400" />
              </motion.div>
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">
                Pa gen mo
              </h3>
              <p className="text-muted-foreground">
                Eseye chèche lòt bagay, oswa efase rechèch la pou wè tout mo yo.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground py-6 border-t border-stone-100">
          <p>Konsepsyon ak chalè & atansyon</p>
        </footer>
      </main>
    </div>
  );
}
