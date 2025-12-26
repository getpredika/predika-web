import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface WordCardProps {
  word: Word;
  index: number;
  isWordOfDay?: boolean;
}

export function WordCard({ word, index, isWordOfDay }: WordCardProps) {
  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      // Try to select a calm voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && !v.name.includes('Microsoft David')); 
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={`group relative rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${
        isWordOfDay 
          ? 'border-2 border-teal-200' 
          : 'bg-white border border-stone-100'
      }`}
      style={isWordOfDay ? { backgroundColor: '#E8F7F3' } : {}}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 flex-1">
        <div className="space-y-1 flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="text-3xl font-serif font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              {word.word}
            </h3>
            {isWordOfDay && (
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15 border-primary/30">
                Word of the Day
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-muted-foreground bg-stone-100 px-2 py-1 rounded-md">
              {word.ipa}
            </span>
            <p className="text-sm font-medium italic text-accent/90">
              {word.partOfSpeech}
            </p>
          </div>
        </div>

        <button
          onClick={playAudio}
          className="self-start sm:self-center p-3 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`Play pronunciation for ${word.word}`}
          data-testid="button-play-pronunciation"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-lg text-foreground/80 leading-relaxed border-l-2 border-primary/20 pl-4 py-1">
            {word.definition}
          </p>
        </div>
        
        {word.example && (
          <div className="pl-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Example</p>
            <p className="text-base text-foreground/70 italic leading-relaxed bg-muted/40 rounded-lg px-3 py-2">
              "{word.example}"
            </p>
          </div>
        )}

        {((word.synonyms?.length ?? 0) > 0 || (word.antonyms?.length ?? 0) > 0) && (
          <div className="pt-2 space-y-3">
            {word.synonyms && word.synonyms.length > 0 && (
              <div className="pl-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Synonyms</p>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym, i) => (
                    <Badge key={i} variant="secondary" data-testid={`badge-synonym-${i}`}>
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {word.antonyms && word.antonyms.length > 0 && (
              <div className="pl-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Antonyms</p>
                <div className="flex flex-wrap gap-2">
                  {word.antonyms.map((antonym, i) => (
                    <Badge key={i} variant="outline" data-testid={`badge-antonym-${i}`}>
                      {antonym}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
