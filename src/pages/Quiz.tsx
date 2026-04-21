import { useState, useCallback, useEffect } from "react";
import { useWords } from "@/hooks/use-dictionary";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
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
  TrendingUp,
  Loader2
} from "lucide-react";
import { useGenerateDefinitionQuiz, useGenerateListeningQuiz, useSubmitQuiz } from "@/hooks/use-quiz";
import type { Word, QuizSession, QuizAnswer, DefinitionQuizQuestion, ListeningQuizQuestion } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { getBestAudioUrl } from "@/lib/api-client";

type QuizMode = "classic" | "listening" | "wordsearch";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const swapWith = shuffled[j];
    if (temp !== undefined && swapWith !== undefined) {
      shuffled[i] = swapWith;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

const modeInfo = {
  classic: { icon: Brain, label: "Klasik", description: "Asosye definisyon ak mo" },
  listening: { icon: Headphones, label: "Koute", description: "Tande mo yo, chwazi definisyon" },
  wordsearch: { icon: Grid3X3, label: "Chèche Mo", description: "Jwenn mo kache yo" },
};


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

function ClassicQuiz({ onBack }: { onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [collectedAnswers, setCollectedAnswers] = useState<QuizAnswer[]>([]);
  const [startTime] = useState(Date.now());

  const generateQuiz = useGenerateDefinitionQuiz();
  const submitQuiz = useSubmitQuiz();
  const { toast } = useToast();

  const questions = quizSession?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const correctAnswer = (currentQuestion as DefinitionQuizQuestion).options[(currentQuestion as DefinitionQuizQuestion).correctIndex];
    const isCorrect = answer === correctAnswer;

    if (isCorrect) setScore(prev => prev + 1);

    // Collect answer for submission
    setCollectedAnswers(prev => [...prev, {
      questionNumber: currentIndex + 1,
      wordId: currentQuestion.wordId,
      userAnswer: answer,
      timeTaken
    }]);
  }, [showResult, currentQuestion, currentIndex, startTime]);

  const handleNext = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Submit quiz to API
      if (quizSession) {
        try {
          await submitQuiz.mutateAsync({
            sessionId: quizSession.sessionId,
            answers: collectedAnswers
          });
        } catch (error) {
          console.error("Failed to submit quiz:", error);
        }
      }
      setQuizComplete(true);
    }
  }, [currentIndex, questions.length, quizSession, collectedAnswers, submitQuiz]);

  const restartQuiz = useCallback(async () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setCollectedAnswers([]);

    // Generate new quiz
    try {
      const session = await generateQuiz.mutateAsync();
      setQuizSession(session);
    } catch (error) {
      toast({
        title: "Echwe chajman quiz la",
        description: "Tanpri eseye ankò",
        variant: "destructive"
      });
      onBack();
    }
  }, [generateQuiz, toast, onBack]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const session = await generateQuiz.mutateAsync();
        setQuizSession(session);
      } catch (error) {
        toast({
          title: "Echwe chajman quiz la",
          description: error instanceof Error ? error.message : "Tanpri eseye ankò",
          variant: "destructive"
        });
        onBack();
      }
    };
    loadQuiz();
  }, []);

  if (generateQuiz.isPending || !quizSession) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getOptionStyle = (option: string) => {
    if (!showResult || !currentQuestion) return "border-stone-200 hover:border-primary/50 hover:bg-primary/5";
    const q = currentQuestion as DefinitionQuizQuestion;
    const correctAnswer = q.options[q.correctIndex];
    if (option === correctAnswer) return "border-green-500 bg-green-50 text-green-800";
    if (option === selectedAnswer && option !== correctAnswer) return "border-red-500 bg-red-50 text-red-800";
    return "border-stone-200 opacity-50";
  };

  if (quizComplete) {
    const answers = collectedAnswers.map(a => {
      const question = questions.find(q => q.wordId === a.wordId) as DefinitionQuizQuestion | undefined;
      return question ? a.userAnswer === question.options[question.correctIndex] : false;
    });
    return <QuizResults score={score} total={questions.length} answers={answers} onRestart={restartQuiz} onBack={onBack} />;
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold mb-2">Pa Gen Ase Mo</h2>
        <p className="text-muted-foreground mb-6">Nou bezwen omwen 4 mo pou kreye yon quiz.</p>
        <Button onClick={onBack}>Retounen nan Meni</Button>
      </Card>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
          <Badge variant="secondary" data-testid="badge-score">Nòt: {score}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 sm:p-8 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Definisyon</p>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-2">{(currentQuestion as DefinitionQuizQuestion).definition}</p>
            {currentQuestion.partOfSpeech && <Badge variant="outline" className="mt-2">{currentQuestion.partOfSpeech}</Badge>}
          </Card>

          <p className="text-sm font-medium text-muted-foreground mb-4">Ki mo ki koresponn ak definisyon sa a?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(currentQuestion as DefinitionQuizQuestion).options.map((option, i) => {
              const q = currentQuestion as DefinitionQuizQuestion;
              const correctAnswer = q.options[q.correctIndex];
              return (
                <motion.button key={option} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handleAnswer(option)} disabled={showResult}
                  className={`p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${getOptionStyle(option)} ${!showResult ? "active:scale-[0.98]" : ""}`} data-testid={`button-option-${i}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                    <span className="text-lg">{option}</span>
                    {showResult && option === correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                    {showResult && option === selectedAnswer && option !== correctAnswer && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showResult && (() => {
            const q = currentQuestion as DefinitionQuizQuestion;
            const correctAnswer = q.options[q.correctIndex];
            const isCorrect = selectedAnswer === correctAnswer;
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Card className={`p-4 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className={`font-medium ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                        {isCorrect ? "Korèk!" : `Enkòrèk. Repons lan se "${correctAnswer}"`}
                      </p>
                      {q.example && <p className="text-sm mt-1 opacity-80">Egzanp: "{q.example}"</p>}
                    </div>
                  </div>
                </Card>
                <Button onClick={handleNext} className="w-full mt-4" data-testid="button-next-question">
                  {currentIndex < questions.length - 1 ? (<>Kesyon Swivan<ArrowRight className="w-4 h-4 ml-2" /></>) : (<>Gade Rezilta<Trophy className="w-4 h-4 ml-2" /></>)}
                </Button>
              </motion.div>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function ListeningChallenge({ onBack }: { onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [collectedAnswers, setCollectedAnswers] = useState<QuizAnswer[]>([]);
  const [startTime] = useState(Date.now());

  const generateQuiz = useGenerateListeningQuiz();
  const submitQuiz = useSubmitQuiz();
  const { toast } = useToast();

  const questions = quizSession?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const [playCount, setPlayCount] = useState(0);
  const maxPlays = 2;

  const playWord = useCallback(() => {
    const q = currentQuestion as ListeningQuizQuestion;
    if (!q || !q.audioUrl) return;
    if (playCount >= maxPlays) return;

    // Fix duplicate path segments in URL (e.g., /conteuse/conteuse/ -> /conteuse/)
    let audioUrl = q.audioUrl;
    audioUrl = audioUrl.replace(/\/conteuse\/conteuse\//g, "/conteuse/");
    audioUrl = audioUrl.replace(/\/presentateur\/presentateur\//g, "/presentateur/");
    audioUrl = audioUrl.replace(/\/narrateur\/narrateur\//g, "/narrateur/");

    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
      console.error("Audio playback failed:", err, "URL:", audioUrl);
    });

    setPlayCount(prev => prev + 1);
    if (playCount + 1 >= maxPlays) {
      setHasPlayed(true);
    }
  }, [currentQuestion, playCount]);

  const handleAnswer = useCallback((selectedWord: string) => {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(selectedWord);
    setShowResult(true);

    const q = currentQuestion as ListeningQuizQuestion;
    const correctOption = q.options[q.correctIndex];
    const correctWord = correctOption?.word ?? "";
    const isCorrect = selectedWord === correctWord;

    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, isCorrect]);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setCollectedAnswers(prev => [...prev, {
      questionNumber: currentIndex + 1,
      wordId: currentQuestion.wordId,
      userAnswer: selectedWord,
      timeTaken
    }]);
  }, [showResult, currentQuestion, currentIndex, startTime]);

  const handleNext = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHasPlayed(false);
      setPlayCount(0);
    } else {
      // Submit quiz to API
      if (quizSession) {
        try {
          await submitQuiz.mutateAsync({
            sessionId: quizSession.sessionId,
            answers: collectedAnswers
          });
        } catch (error) {
          console.error("Failed to submit quiz:", error);
        }
      }
      setQuizComplete(true);
    }
  }, [currentIndex, questions.length, quizSession, collectedAnswers, submitQuiz]);

  const restartQuiz = useCallback(async () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setAnswers([]);
    setHasPlayed(false);
    setPlayCount(0);
    setCollectedAnswers([]);

    // Generate new quiz
    try {
      const session = await generateQuiz.mutateAsync();
      setQuizSession(session);
    } catch (error) {
      toast({
        title: "Echwe chajman quiz la",
        description: "Tanpri eseye ankò",
        variant: "destructive"
      });
      onBack();
    }
  }, [generateQuiz, toast, onBack]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const session = await generateQuiz.mutateAsync();
        setQuizSession(session);
      } catch (error) {
        toast({
          title: "Echwe chajman quiz la",
          description: error instanceof Error ? error.message : "Tanpri eseye ankò",
          variant: "destructive"
        });
        onBack();
      }
    };
    loadQuiz();
  }, []);

  if (generateQuiz.isPending || !quizSession) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (quizComplete) {
    const answersArray = collectedAnswers.map(a => {
      const question = questions.find(q => q.wordId === a.wordId) as ListeningQuizQuestion | undefined;
      const correctOption = question?.options[question?.correctIndex ?? 0];
      return question && correctOption ? a.userAnswer === correctOption.word : false;
    });
    return <QuizResults score={score} total={questions.length} answers={answersArray} onRestart={restartQuiz} onBack={onBack} />;
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold mb-2">Pa Gen Ase Mo</h2>
        <p className="text-muted-foreground mb-6">Nou bezwen omwen 4 mo pou defi koute a.</p>
        <Button onClick={onBack}>Retounen nan Meni</Button>
      </Card>
    );
  }

  const getOptionStyle = (optionWord: string) => {
    if (!showResult || !currentQuestion) return "border-stone-200 hover:border-primary/50 hover:bg-primary/5";
    const q = currentQuestion as ListeningQuizQuestion;
    const correctOption = q.options[q.correctIndex];
    const correctWord = correctOption?.word ?? "";
    if (optionWord === correctWord) return "border-green-500 bg-green-50 text-green-800";
    if (optionWord === selectedAnswer && optionWord !== correctWord) return "border-red-500 bg-red-50 text-red-800";
    return "border-stone-200 opacity-50";
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
          <Badge variant="secondary" data-testid="badge-listening-score">Nòt: {score}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <Card className="p-8 mb-6 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Koute mo a</p>
            <Button
              size="lg"
              variant={playCount > 0 ? "outline" : "default"}
              onClick={playWord}
              disabled={playCount >= maxPlays}
              className="gap-2"
              data-testid="button-play-word"
            >
              <Volume2 className="w-5 h-5" />
              {playCount >= maxPlays ? "Pa gen jwe ki rete" : playCount > 0 ? `Jwe Ankò (${maxPlays - playCount} rete)` : "Jwe Mo"}
            </Button>
            {showResult && (() => {
              const q = currentQuestion as ListeningQuizQuestion;
              const correctOption = q.options[q.correctIndex];
              return <p className="mt-4 text-xl font-serif font-bold text-primary">{correctOption?.word ?? ""}</p>;
            })()}
          </Card>

          <p className="text-sm font-medium text-muted-foreground mb-4">Chwazi definisyon ki korèk la:</p>

          <div className="space-y-2">
            {(currentQuestion as ListeningQuizQuestion).options.map((option, i) => {
              const q = currentQuestion as ListeningQuizQuestion;
              const correctOption = q.options[q.correctIndex];
              const correctWord = correctOption?.word ?? "";
              return (
                <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => handleAnswer(option.word)} disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionStyle(option.word)}`} data-testid={`button-listen-option-${i}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-muted-foreground">{option.id}</span>
                    <div className="flex-1">
                      <span className="text-sm block">{option.definition}</span>
                      {option.example && <span className="text-xs text-muted-foreground block mt-1 italic">"{option.example}"</span>}
                    </div>
                    {showResult && option.word === correctWord && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />}
                    {showResult && option.word === selectedAnswer && option.word !== correctWord && <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Button onClick={handleNext} className="w-full" data-testid="button-listening-next">
                {currentIndex < questions.length - 1 ? (<>Kesyon Swivan<ArrowRight className="w-4 h-4 ml-2" /></>) : (<>Gade Rezilta<Trophy className="w-4 h-4 ml-2" /></>)}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
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
        if (!dir) continue;
        const dirRow = dir[0] ?? 0;
        const dirCol = dir[1] ?? 0;

        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        const endRow = startRow + dirRow * (word.length - 1);
        const endCol = startCol + dirCol * (word.length - 1);

        if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) continue;

        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = startRow + dirRow * i;
          const c = startCol + dirCol * i;
          const cell = newGrid[r]?.[c];
          const char = word[i];
          if (cell !== "" && cell !== char) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dirRow * i;
            const c = startCol + dirCol * i;
            const char = word[i];
            const row = newGrid[r];
            if (row && char) {
              row[c] = char;
            }
          }
          placedWords.push({ word, found: false });
          placed = true;
        }
      }
    });

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < gridSize; r++) {
      const row = newGrid[r];
      if (!row) continue;
      for (let c = 0; c < gridSize; c++) {
        if (row[c] === "") {
          row[c] = letters[Math.floor(Math.random() * letters.length)] ?? "A";
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
        const cell = grid[r]?.[c];
        if (cell) {
          word += cell;
          cells.push(`${r}-${c}`);
        }
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
        <p className="text-muted-foreground">Ap kreye puzzle...</p>
      </Card>
    );
  }

  if (gameComplete) {
    const answers = Array(wordList.length).fill(true);
    return <QuizResults score={wordList.length} total={wordList.length} answers={answers} onRestart={restartGame} onBack={onBack} />;
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
        <p className="text-sm text-muted-foreground mb-3 font-medium">Jwenn mo sa yo:</p>
        <div className="flex flex-col gap-2">
          {wordList.map((w, i) => (
            <Badge key={i} variant={w.found ? "default" : "outline"} className={`justify-start ${w.found ? "line-through opacity-60" : ""}`}>
              {w.word}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {wordList.filter(w => w.found).length} / {wordList.length} jwenn
        </p>
      </Card>
    </div>
  );
}

function QuizResults({ score, total, answers, onRestart, onBack, timedMode }: { score: number; total: number; answers: boolean[]; onRestart: () => void; onBack: () => void; timedMode?: boolean }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  // Quiz results are saved via /api/quiz/submit - no separate endpoint needed

  const getMessage = () => {
    if (percentage === 100) return { text: "Pafè!", icon: Trophy };
    if (percentage >= 80) return { text: "Ekselan!", icon: Sparkles };
    if (percentage >= 60) return { text: "Bèl travay!", icon: Target };
    return { text: "Kontinye aprann!", icon: Brain };
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
        <p className="text-muted-foreground">{timedMode ? `${total} kesyon nan 60 segonn` : `${percentage}% korèk`}</p>
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
          Jwe Ankò
        </Button>
        <Button variant="outline" onClick={onBack} data-testid="button-results-menu">
          Retounen nan Meni
        </Button>
      </div>
    </motion.div>
  );
}

export default function Quiz() {
  const [mode, setMode] = useState<QuizMode>("classic");
  const [inGame, setInGame] = useState(false);

  // Only load words for wordsearch mode (local game that needs word data)
  const needsWords = mode === "wordsearch";
  const { data: wordsResponse, isLoading } = useWords();

  const startGame = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setInGame(true);
  };

  const backToMenu = () => {
    setInGame(false);
  };

  // Only show loading for modes that need words
  if (needsWords && isLoading) {
    return (
      <div className="min-h-screen bg-[#f0faf7] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Ap chaje quiz...</p>
        </motion.div>
      </div>
    );
  }

  // Only show error for modes that need words
  if (needsWords && (!wordsResponse?.data || wordsResponse.data.length < 4)) {
    return (
      <div className="min-h-screen bg-[#f0faf7] flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold mb-2">Pa Gen Ase Mo</h2>
          <p className="text-muted-foreground mb-6">Nou bezwen omwen 4 mo nan diksyonè a pou kreye mòd quiz sa a.</p>
          <Link href="/studio"><Button data-testid="button-back-home"><Home className="w-4 h-4 mr-2" />Retounen nan Diksyonè</Button></Link>
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
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-2">Quiz</h1>
          <p className="text-muted-foreground">Chwazi defi ou</p>
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
                      <Button disabled={label === "Chèche Mo"} size="lg" onClick={() => startGame(mode)} data-testid="button-start-mode">
                        Kòmanse {label}
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
              Retounen nan Meni
            </Button>

            {mode === "classic" && <ClassicQuiz onBack={backToMenu} />}
            {mode === "listening" && <ListeningChallenge onBack={backToMenu} />}
            {mode === "wordsearch" && wordsResponse?.data && <WordSearch words={wordsResponse.data} onBack={backToMenu} />}
          </motion.div>
        )}
      </div>
    </div>
  );
}
