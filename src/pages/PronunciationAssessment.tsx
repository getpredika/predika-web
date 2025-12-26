import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Square, RotateCcw, Volume2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const sampleTexts = [
  { id: 1, title: "Simple Greeting", text: "Hello, how are you doing today? I hope you are having a wonderful day." },
  { id: 2, title: "Weather Talk", text: "The weather is quite pleasant today. The sun is shining and there is a gentle breeze." },
  { id: 3, title: "Introduction", text: "My name is John and I am learning English. I practice speaking every day to improve." },
  { id: 4, title: "Daily Routine", text: "I wake up early in the morning and have breakfast. Then I go to work by bus." },
];

interface TranscriptWord {
  word: string;
  type: "correct" | "mispronunciation" | "unexpected_break" | "missing_break" | "monotone" | "omission" | "insertion";
}

interface AssessmentResult {
  overallScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
  transcript: TranscriptWord[];
  stats: {
    unexpectedBreaks: number;
    missingBreaks: number;
    monotoneIssues: number;
    mispronunciations: number;
    omissions: number;
    insertions: number;
  };
}

function runMockAssessment(): AssessmentResult {
  return {
    overallScore: 86,
    accuracy: 92,
    fluency: 86,
    completeness: 92,
    prosody: 80,
    transcript: [
      { word: "Hello", type: "mispronunciation" },
      { word: ",", type: "correct" },
      { word: "how", type: "correct" },
      { word: "are", type: "correct" },
      { word: "[break]", type: "unexpected_break" },
      { word: "you", type: "correct" },
      { word: "doing", type: "correct" },
      { word: "today", type: "correct" },
      { word: "?", type: "correct" },
      { word: "I", type: "correct" },
      { word: "[pause needed]", type: "missing_break" },
      { word: "hope", type: "correct" },
      { word: "you", type: "correct" },
      { word: "[break]", type: "unexpected_break" },
      { word: "are", type: "correct" },
      { word: "having", type: "monotone" },
      { word: "a", type: "correct" },
      { word: "[break]", type: "unexpected_break" },
      { word: "wonderful", type: "correct" },
      { word: "[pause needed]", type: "missing_break" },
      { word: "day", type: "correct" },
      { word: ".", type: "correct" },
      { word: "[break]", type: "unexpected_break" },
      { word: "[pause needed]", type: "missing_break" },
      { word: "[pause needed]", type: "missing_break" },
      { word: "um", type: "insertion" },
      { word: "[missing: great]", type: "omission" },
    ],
    stats: {
      unexpectedBreaks: 4,
      missingBreaks: 4,
      monotoneIssues: 0,
      mispronunciations: 1,
      omissions: 1,
      insertions: 1,
    },
  };
}

function CircularProgress({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getStrokeColor = () => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    return "#ef4444";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Fair";
    return "Needs Work";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}</span>
        <span className="text-xs text-muted-foreground">{getScoreLabel()}</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  const getColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score} / 100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function TranscriptChip({ word }: { word: TranscriptWord }) {
  const getStyle = () => {
    switch (word.type) {
      case "mispronunciation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300";
      case "unexpected_break":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300";
      case "missing_break":
        return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-gray-400";
      case "monotone":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300";
      case "omission":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 line-through";
      case "insertion":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 italic";
      default:
        return "bg-transparent text-foreground";
    }
  };

  if (word.type === "correct") {
    return <span className="mx-0.5">{word.word}</span>;
  }

  return (
    <span className={`inline-block px-1.5 py-0.5 mx-0.5 rounded border text-sm ${getStyle()}`}>
      {word.word}
    </span>
  );
}

export default function PronunciationAssessment() {
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const [textValue, setTextValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [toggles, setToggles] = useState({
    mispronunciations: true,
    unexpectedBreaks: true,
    missingBreaks: true,
    monotone: true,
    omissions: true,
    insertions: true,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const charCount = textValue.length;
  const wordCount = textValue.trim() ? textValue.trim().split(/\s+/).length : 0;

  const handleSampleSelect = (sampleId: number) => {
    const sample = sampleTexts.find((s) => s.id === sampleId);
    if (sample) {
      setSelectedSample(sampleId);
      setTextValue(sample.text);
    }
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    setSelectedSample(null);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = () => {
        setHasRecorded(true);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "Recording started", description: "Speak clearly into your microphone" });
    } catch (err) {
      toast({ title: "Microphone access denied", description: "Please allow microphone access to record", variant: "destructive" });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: "Recording stopped" });
    }
  }, [isRecording, toast]);

  const runEvaluation = useCallback(async () => {
    setIsEvaluating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const mockResult = runMockAssessment();
    setResult(mockResult);
    
    try {
      await apiRequest("POST", "/api/progress/pronunciation", {
        text: textValue,
        overallScore: mockResult.overallScore,
        accuracyScore: mockResult.accuracy,
        fluencyScore: mockResult.fluency,
        completenessScore: mockResult.completeness,
        prosodyScore: mockResult.prosody,
      });
    } catch (e) {
      console.error("Failed to save pronunciation attempt:", e);
    }
    
    setIsEvaluating(false);
  }, [textValue]);

  const resetAssessment = () => {
    setResult(null);
    setHasRecorded(false);
    setIsRecording(false);
  };

  const filteredTranscript = result?.transcript.filter((word) => {
    if (word.type === "correct") return true;
    if (word.type === "mispronunciation" && !toggles.mispronunciations) return false;
    if (word.type === "unexpected_break" && !toggles.unexpectedBreaks) return false;
    if (word.type === "missing_break" && !toggles.missingBreaks) return false;
    if (word.type === "monotone" && !toggles.monotone) return false;
    if (word.type === "omission" && !toggles.omissions) return false;
    if (word.type === "insertion" && !toggles.insertions) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/app">
            <Button variant="ghost" className="mb-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Pronunciation Assessment</h1>
              <p className="text-muted-foreground">Record your speech and get instant feedback</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Choose Text to Read</CardTitle>
                <CardDescription>Select a sample or write your own sentence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {sampleTexts.map((sample) => (
                    <Button
                      key={sample.id}
                      variant={selectedSample === sample.id ? "default" : "outline"}
                      className="h-auto py-2 px-3 justify-start text-left"
                      onClick={() => handleSampleSelect(sample.id)}
                      data-testid={`button-sample-${sample.id}`}
                    >
                      <span className="text-sm">{sample.title}</span>
                    </Button>
                  ))}
                </div>

                <Textarea
                  value={textValue}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Select a sample above or type your own sentence here..."
                  className="min-h-[120px]"
                  data-testid="input-custom-text"
                />

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{charCount} characters</span>
                  <span>{wordCount} words</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 border-t">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      disabled={!textValue.trim() || isEvaluating}
                      className="gap-2"
                      data-testid="button-start-recording"
                    >
                      <Mic className="w-4 h-4" />
                      Record
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={stopRecording}
                      className="gap-2"
                      data-testid="button-stop-recording"
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </Button>
                  )}

                  {hasRecorded && !result && (
                    <Button
                      onClick={runEvaluation}
                      disabled={isEvaluating}
                      className="gap-2"
                      data-testid="button-evaluate"
                    >
                      {isEvaluating ? (
                        <>Evaluating...</>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Evaluate
                        </>
                      )}
                    </Button>
                  )}

                  {result && (
                    <Button
                      variant="outline"
                      onClick={resetAssessment}
                      className="gap-2"
                      data-testid="button-reset"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-3 h-3 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-sm text-muted-foreground">Recording...</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {result ? (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Score Dashboard</CardTitle>
                  <CardDescription>Your pronunciation performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <CircularProgress score={result.overallScore} size={130} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs">
                    <div className="p-2 rounded bg-red-50 dark:bg-red-900/20">
                      <div className="font-bold text-red-600">0 - 59</div>
                      <div className="text-muted-foreground">Needs Work</div>
                    </div>
                    <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="font-bold text-yellow-600">60 - 79</div>
                      <div className="text-muted-foreground">Fair</div>
                    </div>
                    <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
                      <div className="font-bold text-green-600">80 - 100</div>
                      <div className="text-muted-foreground">Excellent</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ScoreBar label="Accuracy score" score={result.accuracy} delay={0.2} />
                    <ScoreBar label="Fluency score" score={result.fluency} delay={0.4} />
                    <ScoreBar label="Completeness score" score={result.completeness} delay={0.6} />
                    <ScoreBar label="Prosody score" score={result.prosody} delay={0.8} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Volume2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Assessment Yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Select a text and record your voice to see your pronunciation scores
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {result && (
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Transcript Feedback</CardTitle>
                  <CardDescription>Color-coded pronunciation analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">Mispronunciation</Badge>
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">Unexpected Break</Badge>
                    <Badge variant="outline" className="text-xs bg-gray-200 text-gray-600 border-gray-400">Missing Break</Badge>
                    <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-300">Monotone</Badge>
                    <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">Omission</Badge>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">Insertion</Badge>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 mb-4 leading-relaxed min-h-[100px]">
                    {filteredTranscript?.map((word, i) => (
                      <TranscriptChip key={i} word={word} />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <div className="font-bold">{result.stats.mispronunciations}</div>
                      <div className="text-xs text-muted-foreground">Mispronounced</div>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <div className="font-bold">{result.stats.unexpectedBreaks}</div>
                      <div className="text-xs text-muted-foreground">Unexpected Breaks</div>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <div className="font-bold">{result.stats.missingBreaks}</div>
                      <div className="text-xs text-muted-foreground">Missing Breaks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Feedback Filters</CardTitle>
                  <CardDescription>Toggle visibility of feedback types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: "mispronunciations", label: "Mispronunciations", color: "bg-yellow-500" },
                      { key: "unexpectedBreaks", label: "Unexpected Breaks", color: "bg-red-500" },
                      { key: "missingBreaks", label: "Missing Breaks", color: "bg-gray-400" },
                      { key: "monotone", label: "Monotone", color: "bg-purple-500" },
                      { key: "omissions", label: "Omissions", color: "bg-orange-500" },
                      { key: "insertions", label: "Insertions", color: "bg-blue-500" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <Label htmlFor={item.key}>{item.label}</Label>
                        </div>
                        <Switch
                          id={item.key}
                          checked={toggles[item.key as keyof typeof toggles]}
                          onCheckedChange={(checked) =>
                            setToggles((prev) => ({ ...prev, [item.key]: checked }))
                          }
                          data-testid={`toggle-${item.key}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
