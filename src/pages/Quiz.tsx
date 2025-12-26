import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useWords } from "@/hooks/use-words";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy, 
  RotateCcw, 
  Home,
  Sparkles,
  Target,
  Volume2,
  Zap,
  Grid3X3,
  Link2,
  Headphones,
  Timer,
  TrendingUp
} from "lucide-react";

type QuizMode = "classic" | "speed" | "listening" | "match" | "wordsearch";

interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestions(words: Word[], count: number = 10): QuizQuestion[] {
  if (words.length < 4) return [];
  
  const shuffledWords = shuffleArray(words);
  const questionsCount = Math.min(count, shuffledWords.length);
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < questionsCount; i++) {
    const correctWord = shuffledWords[i];
    const wrongOptions = shuffledWords
      .filter(w => w.id !== correctWord.id)
      .slice(0, 3)
      .map(w => w.word);
    
    const options = shuffleArray([correctWord.word, ...wrongOptions]);
    
    questions.push({
      word: correctWord,
      options,
      correctAnswer: correctWord.word
    });
  }

  return questions;
}

const modeInfo = {
  classic: { icon: Brain, label: "Classic", description: "Match definitions to words" },
  speed: { icon: Zap, label: "Speed Round", description: "60 seconds, answer fast!" },
  listening: { icon: Headphones, label: "Listening", description: "Hear words, pick definitions" },
  match: { icon: Link2, label: "Match", description: "Match synonyms & antonyms" },
  wordsearch: { icon: Grid3X3, label: "Word Search", description: "Find hidden words" },
};

async function updateWordMastery(wordId: number, correct: boolean) {
  try {
    await apiRequest("POST", "/api/progress/mastery", { wordId, correct });
  } catch (e) {
    console.error("Failed to update word mastery:", e);
  }
}

function ModeSelector({ selectedMode, onSelectMode }: { selectedMode: QuizMode; onSelectMode: (mode: QuizMode) => void }) {
  return (
    <Tabs value={selectedMode} onValueChange={(v) => onSelectMode(v as QuizMode)} className="w-full">
      <TabsList className="w-full h-auto flex-wrap gap-1 bg-white/50 p-2">
        {(Object.keys(modeInfo) as QuizMode[]).map((mode) => {
          const { icon: Icon, label } = modeInfo[mode];
          return (
            <TabsTrigger 
              key={mode} 
              value={mode}
              className="flex-1 min-w-[100px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid={`tab-mode-${mode}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

function ClassicQuiz({ words, onBack }: { words: Word[]; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions = useMemo(() => generateQuestions(words, 10), [words]);
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = useCallback((answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, isCorrect]);
    updateWordMastery(currentQuestion.word.id, isCorrect);
  }, [showResult, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  }, [currentIndex, questions.length]);

  const restartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setAnswers([]);
  }, []);

  const getOptionStyle = (option: string) => {
    if (!showResult) return "border-stone-200 hover:border-primary/50 hover:bg-primary/5";
    if (option === currentQuestion.correctAnswer) return "border-green-500 bg-green-50 text-green-800";
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return "border-red-500 bg-red-50 text-red-800";
    return "border-stone-200 opacity-50";
  };

  if (quizComplete) {
    return <QuizResults score={score} total={questions.length} answers={answers} onRestart={restartQuiz} onBack={onBack} mode="classic" />;
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold mb-2">Not Enough Words</h2>
        <p className="text-muted-foreground mb-6">We need at least 4 words to create a quiz.</p>
        <Button onClick={onBack}>Back to Menu</Button>
      </Card>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
          <Badge variant="secondary" data-testid="badge-score">Score: {score}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 sm:p-8 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Definition</p>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-2">{currentQuestion.word.definition}</p>
            {currentQuestion.word.partOfSpeech && <Badge variant="outline" className="mt-2">{currentQuestion.word.partOfSpeech}</Badge>}
          </Card>

          <p className="text-sm font-medium text-muted-foreground mb-4">Which word matches this definition?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, i) => (
              <motion.button key={option} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handleAnswer(option)} disabled={showResult}
                className={`p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${getOptionStyle(option)} ${!showResult ? "active:scale-[0.98]" : ""}`} data-testid={`button-option-${i}`}>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                  <span className="text-lg">{option}</span>
                  {showResult && option === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                  {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                </div>
              </motion.button>
            ))}
          </div>

          {showResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Card className={`p-4 ${selectedAnswer === currentQuestion.correctAnswer ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-start gap-3">
                  {selectedAnswer === currentQuestion.correctAnswer ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className={`font-medium ${selectedAnswer === currentQuestion.correctAnswer ? "text-green-800" : "text-red-800"}`}>
                      {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : `Incorrect. The answer is "${currentQuestion.correctAnswer}"`}
                    </p>
                    {currentQuestion.word.example && <p className="text-sm mt-1 opacity-80">Example: "{currentQuestion.word.example}"</p>}
                  </div>
                </div>
              </Card>
              <Button onClick={handleNext} className="w-full mt-4" data-testid="button-next-question">
                {currentIndex < questions.length - 1 ? (<>Next Question<ArrowRight className="w-4 h-4 ml-2" /></>) : (<>See Results<Trophy className="w-4 h-4 ml-2" /></>)}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function SpeedRound({ words, onBack }: { words: Word[]; onBack: () => void }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions = useMemo(() => generateQuestions(words, 50), [words]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft]);

  const handleAnswer = (answer: string) => {
    if (gameOver || currentIndex >= questions.length) return;
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, isCorrect]);
    updateWordMastery(questions[currentIndex].word.id, isCorrect);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(60);
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setAnswers([]);
  };

  if (gameOver) {
    return <QuizResults score={score} total={answers.length} answers={answers} onRestart={startGame} onBack={onBack} timedMode mode="speed" />;
  }

  if (questions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold mb-2">Not Enough Words</h2>
        <p className="text-muted-foreground mb-6">We need at least 4 words to create a speed quiz.</p>
        <Button onClick={onBack}>Back to Menu</Button>
      </Card>
    );
  }

  if (!gameStarted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">Speed Round</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Answer as many questions as you can in 60 seconds. No time to hesitate!</p>
        <Button size="lg" onClick={startGame} data-testid="button-start-speed">
          <Timer className="w-4 h-4 mr-2" />
          Start Speed Round
        </Button>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    setGameOver(true);
    return null;
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-primary"}`} />
            <span className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500" : ""}`}>{timeLeft}s</span>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1" data-testid="badge-speed-score">Score: {score}</Badge>
        </div>
        <Progress value={(timeLeft / 60) * 100} className={`h-3 ${timeLeft <= 10 ? "[&>div]:bg-red-500" : ""}`} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.15 }}>
          <Card className="p-6 mb-4">
            <p className="text-lg text-foreground leading-relaxed">{currentQuestion.word.definition}</p>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.options.map((option, i) => (
              <motion.button key={option} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(option)}
                className="p-4 rounded-xl border-2 border-stone-200 hover:border-primary hover:bg-primary/5 text-left font-medium transition-colors" data-testid={`button-speed-option-${i}`}>
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function ListeningChallenge({ words, onBack }: { words: Word[]; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [hasPlayed, setHasPlayed] = useState(false);

  const questions = useMemo(() => {
    if (words.length < 4) return [];
    const shuffledWords = shuffleArray(words).slice(0, 10);
    return shuffledWords.map(word => {
      const wrongOptions = words.filter(w => w.id !== word.id).slice(0, 3).map(w => w.definition);
      return { word, options: shuffleArray([word.definition, ...wrongOptions]), correctAnswer: word.definition };
    });
  }, [words]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (questions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold mb-2">Not Enough Words</h2>
        <p className="text-muted-foreground mb-6">We need at least 4 words for the listening challenge.</p>
        <Button onClick={onBack}>Back to Menu</Button>
      </Card>
    );
  }

  const playWord = useCallback(() => {
    if (!currentQuestion) return;
    const utterance = new SpeechSynthesisUtterance(currentQuestion.word.word);
    utterance.rate = 0.8;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    setHasPlayed(true);
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, isCorrect]);
    updateWordMastery(currentQuestion.word.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHasPlayed(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setAnswers([]);
    setHasPlayed(false);
  };

  if (quizComplete) {
    return <QuizResults score={score} total={questions.length} answers={answers} onRestart={restartQuiz} onBack={onBack} mode="listening" />;
  }

  const getOptionStyle = (option: string) => {
    if (!showResult) return "border-stone-200 hover:border-primary/50 hover:bg-primary/5";
    if (option === currentQuestion.correctAnswer) return "border-green-500 bg-green-50 text-green-800";
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return "border-red-500 bg-red-50 text-red-800";
    return "border-stone-200 opacity-50";
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
          <Badge variant="secondary" data-testid="badge-listening-score">Score: {score}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <Card className="p-8 mb-6 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Listen to the word</p>
            <Button size="lg" variant={hasPlayed ? "outline" : "default"} onClick={playWord} className="gap-2" data-testid="button-play-word">
              <Volume2 className="w-5 h-5" />
              {hasPlayed ? "Play Again" : "Play Word"}
            </Button>
            {showResult && <p className="mt-4 text-xl font-serif font-bold text-primary">{currentQuestion.word.word}</p>}
          </Card>

          <p className="text-sm font-medium text-muted-foreground mb-4">Select the correct definition:</p>

          <div className="space-y-2">
            {currentQuestion.options.map((option, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => handleAnswer(option)} disabled={showResult}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionStyle(option)}`} data-testid={`button-listen-option-${i}`}>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                  <span className="text-sm">{option}</span>
                  {showResult && option === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />}
                  {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />}
                </div>
              </motion.button>
            ))}
          </div>

          {showResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Button onClick={handleNext} className="w-full" data-testid="button-listening-next">
                {currentIndex < questions.length - 1 ? (<>Next Question<ArrowRight className="w-4 h-4 ml-2" /></>) : (<>See Results<Trophy className="w-4 h-4 ml-2" /></>)}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

interface MatchPair { id: number; text: string; type: "word" | "match"; matchId: number; }

function SynonymAntonymMatch({ words, onBack }: { words: Word[]; onBack: () => void }) {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const wordsWithSynonyms = words.filter(w => w.synonyms && w.synonyms.length > 0);
    const wordsWithAntonyms = words.filter(w => w.antonyms && w.antonyms.length > 0);
    const allPairs: MatchPair[] = [];
    let id = 0;

    const synWords = shuffleArray(wordsWithSynonyms).slice(0, 4);
    synWords.forEach(w => {
      if (w.synonyms && w.synonyms[0]) {
        const matchId = id;
        allPairs.push({ id: id++, text: w.word, type: "word", matchId });
        allPairs.push({ id: id++, text: w.synonyms[0], type: "match", matchId });
      }
    });

    const antWords = shuffleArray(wordsWithAntonyms).slice(0, 4);
    antWords.forEach(w => {
      if (w.antonyms && w.antonyms[0]) {
        const matchId = id;
        allPairs.push({ id: id++, text: w.word, type: "word", matchId });
        allPairs.push({ id: id++, text: w.antonyms[0], type: "match", matchId });
      }
    });

    setPairs(shuffleArray(allPairs));
    setTotalPairs(allPairs.length / 2);
  }, [words]);

  const handleSelect = (pair: MatchPair) => {
    if (matchedIds.has(pair.id)) return;
    if (wrongPair) return;

    if (selectedId === null) {
      setSelectedId(pair.id);
    } else {
      const first = pairs.find(p => p.id === selectedId);
      if (!first) return;
      
      if (first.matchId === pair.matchId && first.id !== pair.id) {
        setMatchedIds(prev => new Set([...Array.from(prev), first.id, pair.id]));
        setScore(prev => prev + 1);
        setSelectedId(null);
        if (matchedIds.size + 2 === pairs.length) {
          setTimeout(() => setGameComplete(true), 500);
        }
      } else {
        setWrongPair([first.id, pair.id]);
        setTimeout(() => {
          setWrongPair(null);
          setSelectedId(null);
        }, 800);
      }
    }
  };

  const restartGame = () => {
    setMatchedIds(new Set());
    setSelectedId(null);
    setWrongPair(null);
    setScore(0);
    setGameComplete(false);
  };

  if (pairs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold mb-2">Not Enough Data</h2>
        <p className="text-muted-foreground mb-6">We need words with synonyms or antonyms for this game.</p>
        <Button onClick={onBack}>Back to Menu</Button>
      </Card>
    );
  }

  if (gameComplete) {
    const answers = Array(totalPairs).fill(true);
    return <QuizResults score={score} total={totalPairs} answers={answers} onRestart={restartGame} onBack={onBack} mode="match" />;
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">Match words with their synonyms or antonyms</p>
          <Badge variant="secondary">Matched: {score}/{totalPairs}</Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pairs.map((pair) => {
          const isSelected = selectedId === pair.id;
          const isMatched = matchedIds.has(pair.id);
          const isWrong = wrongPair?.includes(pair.id);

          return (
            <motion.button
              key={pair.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: isMatched ? 0.5 : 1, 
                scale: isWrong ? [1, 1.05, 1] : 1,
                backgroundColor: isWrong ? "rgb(254 202 202)" : isMatched ? "rgb(187 247 208)" : isSelected ? "rgb(219 234 254)" : "white"
              }}
              onClick={() => handleSelect(pair)}
              disabled={isMatched}
              className={`p-4 rounded-xl border-2 font-medium transition-all min-h-[80px] flex items-center justify-center text-center
                ${isSelected ? "border-primary" : isMatched ? "border-green-300" : isWrong ? "border-red-400" : "border-stone-200"}`}
              data-testid={`button-match-${pair.id}`}
            >
              {pair.text}
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

function WordSearch({ words, onBack }: { words: Word[]; onBack: () => void }) {
  const gridSize = 10;
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordList, setWordList] = useState<{ word: string; found: boolean }[]>([]);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const shortWords = words.filter(w => w.word.length <= 8 && w.word.length >= 3).map(w => w.word.toUpperCase());
    const selectedWords = shuffleArray(shortWords).slice(0, 6);
    
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
    const placedWords: { word: string; found: boolean }[] = [];

    const directions = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0]];

    selectedWords.forEach(word => {
      let placed = false;
      for (let attempt = 0; attempt < 100 && !placed; attempt++) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        const endRow = startRow + dir[0] * (word.length - 1);
        const endCol = startCol + dir[1] * (word.length - 1);

        if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) continue;

        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = startRow + dir[0] * i;
          const c = startCol + dir[1] * i;
          if (newGrid[r][c] !== "" && newGrid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dir[0] * i;
            const c = startCol + dir[1] * i;
            newGrid[r][c] = word[i];
          }
          placedWords.push({ word, found: false });
          placed = true;
        }
      }
    });

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (newGrid[r][c] === "") {
          newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    setGrid(newGrid);
    setWordList(placedWords);
  }, [words]);

  const getSelectedWord = (start: [number, number], end: [number, number]) => {
    const [sr, sc] = start;
    const [er, ec] = end;
    const dr = er === sr ? 0 : er > sr ? 1 : -1;
    const dc = ec === sc ? 0 : ec > sc ? 1 : -1;
    const length = Math.max(Math.abs(er - sr), Math.abs(ec - sc)) + 1;

    let word = "";
    const cells: string[] = [];
    for (let i = 0; i < length; i++) {
      const r = sr + dr * i;
      const c = sc + dc * i;
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        word += grid[r][c];
        cells.push(`${r}-${c}`);
      }
    }
    return { word, cells };
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setStartCell([row, col]);
    setSelectedCells(new Set([`${row}-${col}`]));
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !startCell) return;
    const { cells } = getSelectedWord(startCell, [row, col]);
    setSelectedCells(new Set(cells));
  };

  const handleMouseUp = (row: number, col: number) => {
    if (!startCell) return;
    setIsSelecting(false);
    
    const { word, cells } = getSelectedWord(startCell, [row, col]);
    const reversedWord = word.split("").reverse().join("");

    const foundIndex = wordList.findIndex(w => !w.found && (w.word === word || w.word === reversedWord));
    if (foundIndex !== -1) {
      setWordList(prev => prev.map((w, i) => i === foundIndex ? { ...w, found: true } : w));
      setFoundCells(prev => new Set([...Array.from(prev), ...cells]));
      
      const newFoundCount = wordList.filter(w => w.found).length + 1;
      if (newFoundCount === wordList.length) {
        setTimeout(() => setGameComplete(true), 500);
      }
    }

    setSelectedCells(new Set());
    setStartCell(null);
  };

  const restartGame = () => {
    setFoundCells(new Set());
    setGameComplete(false);
    setWordList(prev => prev.map(w => ({ ...w, found: false })));
  };

  if (wordList.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Generating puzzle...</p>
      </Card>
    );
  }

  if (gameComplete) {
    const answers = Array(wordList.length).fill(true);
    return <QuizResults score={wordList.length} total={wordList.length} answers={answers} onRestart={restartGame} onBack={onBack} mode="wordsearch" />;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Card className="p-4 overflow-x-auto flex-shrink-0">
        <div className="inline-grid gap-1 select-none" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {grid.map((row, ri) => row.map((cell, ci) => {
            const cellKey = `${ri}-${ci}`;
            const isFound = foundCells.has(cellKey);
            const isSelected = selectedCells.has(cellKey);

            return (
              <motion.div
                key={cellKey}
                onMouseDown={() => handleMouseDown(ri, ci)}
                onMouseEnter={() => handleMouseEnter(ri, ci)}
                onMouseUp={() => handleMouseUp(ri, ci)}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-sm sm:text-base rounded cursor-pointer transition-colors
                  ${isFound ? "bg-green-200 text-green-800" : isSelected ? "bg-primary/30" : "bg-stone-100 hover:bg-stone-200"}`}
                data-testid={`cell-${ri}-${ci}`}
              >
                {cell}
              </motion.div>
            );
          }))}
        </div>
      </Card>

      <Card className="p-4 flex-1">
        <p className="text-sm text-muted-foreground mb-3 font-medium">Find these words:</p>
        <div className="flex flex-col gap-2">
          {wordList.map((w, i) => (
            <Badge key={i} variant={w.found ? "default" : "outline"} className={`justify-start ${w.found ? "line-through opacity-60" : ""}`}>
              {w.word}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {wordList.filter(w => w.found).length} / {wordList.length} found
        </p>
      </Card>
    </div>
  );
}

function QuizResults({ score, total, answers, onRestart, onBack, timedMode, mode = "classic" }: { score: number; total: number; answers: boolean[]; onRestart: () => void; onBack: () => void; timedMode?: boolean; mode?: string }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const savedRef = useRef(false);
  
  useEffect(() => {
    if (savedRef.current || total === 0) return;
    savedRef.current = true;
    
    const saveResults = async () => {
      try {
        await apiRequest("POST", "/api/progress/attempts", {
          mode,
          score,
          totalQuestions: total,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/progress/stats"] });
      } catch (e) {
        console.error("Failed to save quiz results:", e);
      }
    };
    saveResults();
  }, [score, total, mode]);
  
  const getMessage = () => {
    if (percentage === 100) return { text: "Perfect!", icon: Trophy };
    if (percentage >= 80) return { text: "Excellent!", icon: Sparkles };
    if (percentage >= 60) return { text: "Good Job!", icon: Target };
    return { text: "Keep Learning!", icon: Brain };
  };
  const result = getMessage();
  const ResultIcon = result.icon;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
        <ResultIcon className="w-10 h-10 text-primary" />
      </motion.div>
      
      <h2 className="text-3xl font-serif font-bold mb-2">{result.text}</h2>
      
      <div className="mb-6">
        <p className="text-5xl font-bold text-primary mb-1">{score}/{total}</p>
        <p className="text-muted-foreground">{timedMode ? `${total} questions in 60 seconds` : `${percentage}% correct`}</p>
      </div>

      {answers.length > 0 && answers.length <= 20 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {answers.map((correct, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.03 }}>
              {correct ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRestart} data-testid="button-results-restart">
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
        <Button variant="outline" onClick={onBack} data-testid="button-results-menu">
          Back to Menu
        </Button>
      </div>
    </motion.div>
  );
}

export default function Quiz() {
  const { data: words, isLoading } = useWords();
  const [mode, setMode] = useState<QuizMode>("classic");
  const [inGame, setInGame] = useState(false);

  const startGame = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setInGame(true);
  };

  const backToMenu = () => {
    setInGame(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0faf7] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </motion.div>
      </div>
    );
  }

  if (!words || words.length < 4) {
    return (
      <div className="min-h-screen bg-[#f0faf7] flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold mb-2">Not Enough Words</h2>
          <p className="text-muted-foreground mb-6">We need at least 4 words in the dictionary to create a quiz.</p>
          <Link href="/app"><Button data-testid="button-back-home"><Home className="w-4 h-4 mr-2" />Back to Dictionary</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0faf7] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50/40 via-transparent to-transparent" />
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-teal-100/25 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-stone-100 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-2">Quiz Hub</h1>
          <p className="text-muted-foreground">Choose your challenge</p>
        </motion.div>

        {!inGame ? (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
              <ModeSelector selectedMode={mode} onSelectMode={setMode} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-8 text-center">
                {(() => {
                  const { icon: Icon, label, description } = modeInfo[mode];
                  return (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-serif font-bold mb-2">{label}</h2>
                      <p className="text-muted-foreground mb-6">{description}</p>
                      <Button size="lg" onClick={() => startGame(mode)} data-testid="button-start-mode">
                        Start {label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  );
                })()}
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button variant="ghost" size="sm" onClick={backToMenu} className="mb-4" data-testid="button-back-menu">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Menu
            </Button>

            {mode === "classic" && <ClassicQuiz words={words} onBack={backToMenu} />}
            {mode === "speed" && <SpeedRound words={words} onBack={backToMenu} />}
            {mode === "listening" && <ListeningChallenge words={words} onBack={backToMenu} />}
            {mode === "match" && <SynonymAntonymMatch words={words} onBack={backToMenu} />}
            {mode === "wordsearch" && <WordSearch words={words} onBack={backToMenu} />}
          </motion.div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/app"><Button variant="ghost" size="sm" data-testid="button-back-home"><Home className="w-4 h-4 mr-2" />Dictionary</Button></Link>
          <Link href="/progress"><Button variant="ghost" size="sm" data-testid="button-progress"><TrendingUp className="w-4 h-4 mr-2" />Progress</Button></Link>
        </div>
      </div>
    </div>
  );
}
