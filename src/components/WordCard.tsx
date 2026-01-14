import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { type Word, getPartOfSpeechLabel } from "@/types/api";
import { getBestAudioUrl } from "@/lib/api-client";

interface WordCardProps {
  word: Word;
  index: number;
  isWordOfDay?: boolean;
}

export function WordCard({ word, index, isWordOfDay }: WordCardProps) {
  // Get the first sense for display (most words have at least one sense)
  const primarySense = word.senses[0];

  // Calculate font size based on word length to prevent overflow
  const getWordFontSize = (wordText: string) => {
    const len = wordText.length;
    if (len <= 7) return "text-3xl";
    if (len <= 10) return "text-2xl";
    if (len <= 14) return "text-xl";
    return "text-lg";
  };

  const wordFontSize = getWordFontSize(word.word);

  const playAudio = () => {
    const url = getBestAudioUrl(word.audio);

    if (url) {
      const audio = new Audio(url);
      audio.play();
      return;
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={`group relative rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden ${isWordOfDay
        ? 'border-2 border-teal-200'
        : 'bg-white border border-stone-100'
        }`}
      style={isWordOfDay ? { backgroundColor: '#E8F7F3' } : {}}
    >
      {/* Play button - fixed position top right */}
      <button
        onClick={playAudio}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 p-3 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
        aria-label={`Play pronunciation for ${word.word}`}
        data-testid="button-play-pronunciation"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      {/* Word header - with padding to avoid play button */}
      <div className="pr-16 space-y-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3
            className={`${wordFontSize} font-serif font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300`}
            title={word.word}
          >
            {word.word}
          </h3>
          {isWordOfDay && (
            <Badge className="bg-primary/15 text-primary hover:bg-primary/15 border-primary/30">
              Mo Jou a
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {word.ipa && (
            <span className="font-mono text-sm text-muted-foreground bg-stone-100 px-2 py-1 rounded-md">
              {word.ipa}
            </span>
          )}
          {primarySense && (
            <p className="text-sm font-medium italic text-accent/90">
              {getPartOfSpeechLabel(primarySense.partOfSpeech)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-4 flex-1">
        {primarySense && (
          <>
            <div>
              <p className="text-lg text-foreground/80 leading-relaxed border-l-2 border-primary/20 pl-4 py-1">
                {primarySense.definition}
              </p>
            </div>

            {primarySense.example && (
              <div className="pl-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Egzanp</p>
                <p className="text-base text-foreground/70 italic leading-relaxed bg-muted/40 rounded-lg px-3 py-2">
                  "{primarySense.example}"
                </p>
              </div>
            )}

            {((primarySense.synonyms?.length ?? 0) > 0 || (primarySense.antonyms?.length ?? 0) > 0) && (
              <div className="pt-2 space-y-3">
                {primarySense.synonyms && primarySense.synonyms.length > 0 && (
                  <div className="pl-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sinonim</p>
                    <div className="flex flex-wrap gap-2">
                      {primarySense.synonyms.map((synonym: string, i: number) => (
                        <Badge key={i} variant="secondary" data-testid={`badge-synonym-${i}`}>
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {primarySense.antonyms && primarySense.antonyms.length > 0 && (
                  <div className="pl-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Antonim</p>
                    <div className="flex flex-wrap gap-2">
                      {primarySense.antonyms.map((antonym: string, i: number) => (
                        <Badge key={i} variant="outline" data-testid={`badge-antonym-${i}`}>
                          {antonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
