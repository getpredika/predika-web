import { useState, useMemo } from "react";
import { useWords } from "@/hooks/use-words";
import { SearchBar } from "@/components/SearchBar";
import { WordCard } from "@/components/WordCard";
import { WordCardSkeleton } from "@/components/WordCardSkeleton";
import { Book, Sparkles, Brain, TrendingUp, Volume2, Mic, FileText, SpellCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

function getWordOfTheDay(words: any[]) {
  if (!words || words.length === 0) return null;
  
  // Use date to consistently pick the same word each day
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) % words.length;
  return words[dayIndex];
}

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: words, isLoading, error } = useWords(search);
  
  const wordOfTheDay = useMemo(() => {
    // Only show Word of the Day when not searching
    if (!search && words && words.length > 0) {
      return getWordOfTheDay(words);
    }
    return null;
  }, [words, search]);

  return (
    <div className="min-h-screen bg-[#f0faf7] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Main gradient wash */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50/40 via-transparent to-transparent" />
        
        {/* Large blur orbs */}
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-teal-100/25 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-40 w-72 h-72 bg-emerald-100/15 rounded-full blur-3xl" />
        
        {/* Floating decorative elements */}
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
                Cozy Dictionary
              </h1>
            </PointerHighlight>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-lg mx-auto text-balance"
          >
            A warm, simple space to discover beautiful words and their meanings.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <Link href="/quiz">
              <Button variant="outline" className="gap-2" data-testid="button-start-quiz">
                <Brain className="w-4 h-4" />
                Start Quiz
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline" className="gap-2" data-testid="button-progress">
                <TrendingUp className="w-4 h-4" />
                Progress
              </Button>
            </Link>
            <Link href="/text-to-speech">
              <Button variant="outline" className="gap-2" data-testid="button-tts">
                <Volume2 className="w-4 h-4" />
                Text to Speech
              </Button>
            </Link>
            <Link href="/pronunciation">
              <Button variant="outline" className="gap-2" data-testid="button-pronunciation">
                <Mic className="w-4 h-4" />
                Pronunciation
              </Button>
            </Link>
            <Link href="/speech-to-text">
              <Button variant="outline" className="gap-2" data-testid="button-stt">
                <FileText className="w-4 h-4" />
                Speech to Text
              </Button>
            </Link>
            <Link href="/grammar">
              <Button variant="outline" className="gap-2" data-testid="button-grammar">
                <SpellCheck className="w-4 h-4" />
                Grammar Check
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 sticky top-6 z-10"
        >
          <SearchBar value={search} onChange={setSearch} />
        </motion.div>

        {/* Content Section */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <WordCardSkeleton key={`skeleton-${index}`} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 text-destructive bg-destructive/5 rounded-2xl border border-destructive/10"
            >
              <p className="font-medium">Oops! Something went wrong.</p>
              <p className="text-sm mt-1 opacity-80">{(error as Error).message}</p>
            </motion.div>
          ) : words && words.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {wordOfTheDay && !search && (
                  <motion.div
                    key="word-of-day"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="md:col-span-2 lg:col-span-3 h-full"
                  >
                    <WordCard word={wordOfTheDay} index={0} isWordOfDay={true} />
                  </motion.div>
                )}
                {words.map((word, index) => (
                  <motion.div
                    key={word.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: (index) * 0.05, ease: "easeOut" }}
                    className="h-full"
                  >
                    <WordCard 
                      word={word} 
                      index={index + 1}
                      isWordOfDay={wordOfTheDay?.id === word.id && !search}
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
                No words found
              </h3>
              <p className="text-muted-foreground">
                Try searching for something else, or clear the search to see all words.
              </p>
            </motion.div>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground py-6 border-t border-stone-100">
          <p>Designed with warmth & care</p>
        </footer>
      </main>
    </div>
  );
}
