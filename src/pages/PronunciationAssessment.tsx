import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Mic, Square, RotateCcw, Volume2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAssessPronunciation } from "@/hooks/use-pronunciation";
import { useGenerateSpeech } from "@/hooks/use-tts";
import { useObjectUrl } from "@/hooks/use-object-url";
import type { AssessmentResult, TranscriptItem } from "@/types/api";
import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerProgress,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerSpeed,
  useAudioPlayer,
} from "@/components/ui/audio-player-core";

const sampleTexts = [
  { id: 1, title: "Salitasyon", text: "Bonjou, kijan ou ye jodia?" },
  { id: 2, title: "Prezantasyon", text: "Mwen rele Jan, epi mwen ap aprann pale kreyòl ayisyen." },
  { id: 3, title: "Woutinn", text: "Chak maten, mwen leve bonè epi mwen manje." },
  { id: 4, title: "Tan an", text: "Tan an bèl jodia! Solèy la ap klere, epi gen yon ti van fre." },
];


const SCORE_TOOLTIPS = {
  accuracy: "Konbyen mo ou pwononse kòrèkteman konpare ak tèks la.",
  fluency: "Ki jan pawòl ou koule natirèlman san twòp poz oswa ezitasyon.",
  completeness: "Èske ou di tout mo ki te nan tèks la san sote.",
  prosody: "Entonasyon, ritm, ak varyasyon vwa (pa pale monotòn).",
};


function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
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
        <span className={`text-3xl font-bold ${getScoreColor()}`}>{Math.round(score)}</span>
        <span className="text-xs text-muted-foreground font-medium">{getGrade(score)}</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, delay = 0, tooltip }: { label: string; score: number; delay?: number; tooltip?: string }) {
  const getColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-sm">
        <span className="text-muted-foreground flex items-center gap-1.5">
          {label}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
              <Info
                className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help"
                role="button"
                tabIndex={0}
                aria-label={`Eksplikasyon sou ${label}`}
              />
              </TooltipTrigger>
              <TooltipContent side="top" className="px-3 py-1.5 rounded-md shadow-md">
                <p className="text-xs max-w-[200px]">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="font-medium">{Math.round(score)} / 100</span>
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

const errorTypeToToggle: Record<string, string> = {
  mispronunciation: "mispronunciations",
  omission: "omissions",
  insertion: "insertions",
  unexpected_break: "unexpectedBreaks",
  missing_break: "missingBreaks",
  monotone: "monotone",
};

function TranscriptChip({ item, toggles }: { item: TranscriptItem; toggles: Record<string, boolean> }) {
  const toggleKey = errorTypeToToggle[item.type];
  const isHighlighted = item.type === "correct" || (toggleKey ? toggles[toggleKey] : true);

  const getStyle = () => {
    if (!isHighlighted) return "text-foreground border-transparent";
    switch (item.type) {
      case "correct":
        return "text-foreground";
      case "mispronunciation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300";
      case "omission":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 line-through";
      case "insertion":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 italic";
      case "unexpected_break":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300";
      case "missing_break":
        return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-gray-400";
      default:
        return "text-foreground";
    }
  };

  if (item.type === "correct") {
    return <span className="mx-0.5">{item.word}</span>;
  }

  if (item.type === "unexpected_break") {
    if (!isHighlighted) return null;
    return (
      <span
        className={`inline-block px-1.5 py-0.5 mx-0.5 rounded border text-xs cursor-default ${getStyle()}`}
        title={`Poz inatandi: ${item.dur_sec?.toFixed(2)}s (${item.severity})`}
      >
        ⏸ {item.dur_sec?.toFixed(1)}s
      </span>
    );
  }

  if (item.type === "missing_break") {
    if (!isHighlighted) return null;
    return (
      <span
        className={`inline-block px-1.5 py-0.5 mx-0.5 rounded border text-xs cursor-default ${getStyle()}`}
        title="Poz nesesè: ou te dwe fè yon poz isit la"
      >
        [poz nesesè]
      </span>
    );
  }

  return (
    <span
      className={`inline-block px-1.5 py-0.5 mx-0.5 rounded border text-sm cursor-default ${getStyle()}`}
      title={`${item.type}${item.severity ? ` (${item.severity})` : ""}`}
    >
      {item.word}
    </span>
  );
}

function RecordingAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const player = useAudioPlayer();
  const audioItem = useMemo(
    () => ({ id: "pronunciation-recording", src: audioUrl, data: {} }),
    [audioUrl]
  );

  useEffect(() => {
    player.setActiveItem(audioItem);
  }, [audioUrl, audioItem, player]);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3">
        <AudioPlayerButton
          item={audioItem}
          variant="default"
          size="icon"
          className="shrink-0 h-10 w-10 rounded-full"
        />
        <div className="flex flex-1 items-center gap-2">
          <AudioPlayerTime className="text-xs w-10 text-right" />
          <AudioPlayerProgress className="flex-1" />
          <AudioPlayerDuration className="text-xs w-10" />
          <AudioPlayerSpeed variant="ghost" size="icon" />
        </div>
      </div>
    </div>
  );
}

function ReferenceAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const player = useAudioPlayer();
  const audioItem = useMemo(
    () => ({ id: "reference-audio", src: audioUrl, data: {} }),
    [audioUrl]
  );

  useEffect(() => {
    player.setActiveItem(audioItem);
  }, [audioUrl, audioItem, player]);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3">
        <AudioPlayerButton
          item={audioItem}
          variant="outline"
          size="icon"
          className="shrink-0 h-10 w-10 rounded-full"
        />
        <div className="flex flex-1 items-center gap-2">
          <AudioPlayerTime className="text-xs w-10 text-right" />
          <AudioPlayerProgress className="flex-1" />
          <AudioPlayerDuration className="text-xs w-10" />
          <AudioPlayerSpeed variant="ghost" size="icon" />
        </div>
      </div>
    </div>
  );
}

export default function PronunciationAssessment() {
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const [textValue, setTextValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlobRef, setAudioBlob] = useState<Blob | null>(null);
  const [referenceAudioBlob, setReferenceAudioBlob] = useState<Blob | null>(null);
  const referenceAudioUrl = useObjectUrl(referenceAudioBlob);
  const [toggles, setToggles] = useState({
    mispronunciations: true,
    unexpectedBreaks: true,
    missingBreaks: true,
    monotone: true,
    omissions: true,
    insertions: true,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const assessMutation = useAssessPronunciation();
  const ttsMutation = useGenerateSpeech();
  const result: AssessmentResult | undefined = assessMutation.data;

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

  const handleListenReference = useCallback(() => {
    if (!textValue.trim()) return;
    ttsMutation.mutate(
      { text: textValue, speaker: "conteuse" },
      {
        onSuccess: (response) => {
          setReferenceAudioBlob(response.audioBlob);
        },
        onError: () => {
          toast({ title: "Echèk", description: "Pa kapab jenere odyo referans lan", variant: "destructive" });
        },
      }
    );
  }, [textValue, ttsMutation, toast]);

  const startRecording = useCallback(async () => {
    try {
      audioChunksRef.current = [];
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setAudioBlob(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
        setHasRecorded(true);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "Anrejistreman kòmanse", description: "Pale klè nan mikwofòn ou" });
    } catch {
      toast({ title: "Aksè mikwofòn refize", description: "Tanpri pèmèt aksè mikwofòn pou anrejistre", variant: "destructive" });
    }
  }, [toast, audioUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: "Anrejistreman fini" });
    }
  }, [isRecording, toast]);

  const runEvaluation = useCallback(() => {
    if (!audioBlobRef || !textValue.trim()) return;
    assessMutation.mutate(
      { file: audioBlobRef, text: textValue, options: { asr: true } },
      {
        onError: (error) => {
          toast({
            title: "Evalyasyon echwe",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  }, [audioBlobRef, textValue, assessMutation, toast]);

  const resetAssessment = () => {
    assessMutation.reset();
    setHasRecorded(false);
    setIsRecording(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioChunksRef.current = [];
  };

  const filteredErrors = result
    ? {
        mispronunciation: toggles.mispronunciations ? result.errors.summary.mispronunciation : 0,
        unexpected_break: toggles.unexpectedBreaks ? result.errors.summary.unexpected_break : 0,
        missing_break: toggles.missingBreaks ? result.errors.summary.missing_break : 0,
        monotone: toggles.monotone ? result.errors.summary.monotone : 0,
        omission: toggles.omissions ? result.errors.summary.omission : 0,
        insertion: toggles.insertions ? result.errors.summary.insertion : 0,
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 pt-12">
            <div className="p-3 rounded-lg bg-primary/10">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Evalyasyon Pwononsyasyon</h1>
              <p className="text-muted-foreground">Anrejistre vwa ou epi jwenn fidbak imedyatman</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: text selection + recording */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Chwazi tèks pou li</CardTitle>
                <CardDescription>Chwazi yon echantiyon oswa ekri pwòp fraz ou</CardDescription>
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
                  placeholder="Chwazi yon echantiyon anwo a oswa tape pwòp fraz ou isit la..."
                  className="min-h-[120px]"
                  data-testid="input-custom-text"
                />

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{charCount} karaktè</span>
                  <span>{wordCount} mo</span>
                </div>

                {/* TODO: Listen to reference via TTS — re-enable when TTS is ready
                {textValue.trim() && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Tande referans lan</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleListenReference}
                        disabled={ttsMutation.isPending}
                      >
                        <Volume2 className="w-4 h-4" />
                        {ttsMutation.isPending ? "Ap jenere..." : "Tande"}
                      </Button>
                    </div>
                    {referenceAudioUrl && (
                      <AudioPlayerProvider>
                        <ReferenceAudioPlayer audioUrl={referenceAudioUrl} />
                      </AudioPlayerProvider>
                    )}
                  </div>
                )}
                */}

                {/* Recording controls */}
                <div className="flex items-center justify-center gap-3 pt-2 border-t">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      disabled={!textValue.trim() || assessMutation.isPending}
                      className="gap-2"
                      data-testid="button-start-recording"
                    >
                      <Mic className="w-4 h-4" />
                      Anrejistre
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={stopRecording}
                      className="gap-2"
                      data-testid="button-stop-recording"
                    >
                      <Square className="w-4 h-4" />
                      Kanpe
                    </Button>
                  )}

                  {hasRecorded && !result && (
                    <Button
                      onClick={runEvaluation}
                      disabled={assessMutation.isPending}
                      className="gap-2"
                      data-testid="button-evaluate"
                    >
                      {assessMutation.isPending ? (
                        <>Ap evalye...</>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Evalye
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
                      Eseye ankò
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
                      <span className="text-sm text-muted-foreground">Ap anrejistre...</span>
                    </div>
                  </motion.div>
                )}

                {assessMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {assessMutation.error.message}
                  </motion.div>
                )}

                {audioUrl && hasRecorded && !isRecording && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t"
                  >
                    <div className="mb-2">
                      <p className="text-sm font-medium">Anrejistreman ou</p>
                      <p className="text-xs text-muted-foreground">Koute pwononsyasyon ou</p>
                    </div>
                    <AudioPlayerProvider>
                      <RecordingAudioPlayer audioUrl={audioUrl} />
                    </AudioPlayerProvider>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column: scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {result ? (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Tablo Nòt</CardTitle>
                  <CardDescription>Pèfòmans pwononsyasyon ou</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <CircularProgress score={result.scores.overall.score} size={130} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs">
                    <div className="p-2 rounded bg-red-50 dark:bg-red-900/20">
                      <div className="font-bold text-red-600">0 - 59</div>
                      <div className="text-muted-foreground">Bezwen travay</div>
                    </div>
                    <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="font-bold text-yellow-600">60 - 79</div>
                      <div className="text-muted-foreground">Pasab</div>
                    </div>
                    <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
                      <div className="font-bold text-green-600">80 - 100</div>
                      <div className="text-muted-foreground">Ekselan</div>
                    </div>
                  </div>

                  <TooltipProvider delayDuration={200}>
                    <div className="space-y-3">
                      <ScoreBar
                        label="Presizyon"
                        score={result.scores.accuracy.score}
                        delay={0.2}
                        tooltip={SCORE_TOOLTIPS.accuracy}
                      />
                      <ScoreBar
                        label="Fliyidite"
                        score={result.scores.fluency.score}
                        delay={0.4}
                        tooltip={SCORE_TOOLTIPS.fluency}
                      />
                      <ScoreBar
                        label="Konplètman"
                        score={result.scores.completeness.score}
                        delay={0.6}
                        tooltip={SCORE_TOOLTIPS.completeness}
                      />
                      <ScoreBar
                        label="Pwozodi"
                        score={result.scores.prosody.score}
                        delay={0.8}
                        tooltip={SCORE_TOOLTIPS.prosody}
                      />
                    </div>
                  </TooltipProvider>


                  {result.flags.low_confidence && (
                    <div className="mt-4 flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Nòt ou ba — eseye anrejistre ankò pi klè
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Volume2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Pa gen evalyasyon ankò</h3>
                  <p className="text-muted-foreground text-sm">
                    Chwazi yon tèks epi anrejistre vwa ou pou wè nòt pwononsyasyon ou
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Bottom row: transcript + filters */}
        {result && (
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Fidbak mo pa mo</CardTitle>
                  <CardDescription>Nòt chak mo ou te di</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="outline" className="text-xs">Kòrèk</Badge>
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">Mal pwononse</Badge>
                    <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">Omisyon</Badge>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">Ensèsyon</Badge>
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">Poz inatandi</Badge>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 mb-4 leading-relaxed min-h-[100px]">
                    {result.transcript.map((item, i) => (
                      <TranscriptChip key={i} item={item} toggles={toggles} />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <div className="font-bold">{filteredErrors?.mispronunciation ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Mal pwononse</div>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <div className="font-bold">{filteredErrors?.unexpected_break ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Poz inatandi</div>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <div className="font-bold">{filteredErrors?.omission ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Omisyon</div>
                    </div>
                  </div>

                  {/* Speaking rate info */}
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Vitès pawòl:</span>{" "}
                      <span className="font-medium">{result.scores.fluency.phones_per_sec.toFixed(1)} fon/s</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dire:</span>{" "}
                      <span className="font-medium">{result.metadata.duration_sec.toFixed(1)}s</span>
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
                  <CardTitle>Filt fidbak</CardTitle>
                  <CardDescription>Kontwole ki tip erè ou vle wè</CardDescription>
                </CardHeader>
                <CardContent>
                  <TooltipProvider delayDuration={200}>
                    <div className="space-y-4">
                      {[
                        { key: "mispronunciations", label: "Mal pwononse", color: "bg-yellow-500", textColor: "text-yellow-900 dark:text-yellow-200", bgColor: "bg-yellow-100 dark:bg-yellow-900/40", count: result.errors.summary.mispronunciation, description: "Mo ou te di men pa t pwononse kòrèkteman" },
                        { key: "omissions", label: "Omisyon", color: "bg-orange-500", textColor: "text-orange-900 dark:text-orange-200", bgColor: "bg-orange-100 dark:bg-orange-900/40", count: result.errors.summary.omission, description: "Mo ou te sote, ou pa t di li" },
                        { key: "insertions", label: "Ensèsyon", color: "bg-blue-500", textColor: "text-blue-900 dark:text-blue-200", bgColor: "bg-blue-100 dark:bg-blue-900/40", count: result.errors.summary.insertion, description: "Mo ou te ajoute ki pa t nan tèks la" },
                        { key: "unexpectedBreaks", label: "Poz inatandi", color: "bg-red-500", textColor: "text-red-900 dark:text-red-200", bgColor: "bg-red-100 dark:bg-red-900/40", count: result.errors.summary.unexpected_break, description: "Ou te fè yon poz kote ki pa t nesesè" },
                        { key: "missingBreaks", label: "Poz ki manke", color: "bg-gray-400", textColor: "text-gray-900 dark:text-gray-200", bgColor: "bg-gray-100 dark:bg-gray-700/40", count: result.errors.summary.missing_break, description: "Ou te manke yon poz kote ki te nesesè" },
                        { key: "monotone", label: "Monotòn", color: "bg-purple-500", textColor: "text-purple-900 dark:text-purple-200", bgColor: "bg-purple-100 dark:bg-purple-900/40", count: result.errors.summary.monotone, description: "Vwa ou te twò plat, san varyasyon" },
                      ].map((item) => {
                        const isActive = toggles[item.key as keyof typeof toggles];
                        return (
                          <div key={item.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${item.bgColor} ${item.textColor}`}>
                                {item.count}
                              </span>
                              <Label htmlFor={item.key}>{item.label}</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info
                                  className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help"
                                  role="button"
                                  tabIndex={0}
                                  aria-label={`Eksplikasyon sou ${item.label}`}
                                />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="px-3 py-1.5 rounded-md shadow-md">
                                  <p className="text-xs max-w-[200px]">{item.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Switch
                              id={item.key}
                              checked={isActive}
                              onCheckedChange={(checked) =>
                                setToggles((prev) => ({ ...prev, [item.key]: checked }))
                              }
                              className="data-[state=unchecked]:bg-muted-foreground/30"
                              data-testid={`toggle-${item.key}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </TooltipProvider>

                  {/* ASR: what the user actually said */}
                  {/* result.metadata.asr_text && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Sa ou te di</h4>
                      <p className="text-sm text-muted-foreground italic p-3 rounded-lg bg-muted/30">
                        &ldquo;{result.metadata.asr_text}&rdquo;
                      </p>
                    </div>
                  ) */}

                  {/* Letter-level detail for words with errors */}
                  {result.words.some((w) => w.is_error) && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Detay lèt (mo ki gen erè)</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {result.words
                          .filter((w) => w.is_error)
                          .map((word, wi) => (
                            <div key={wi} className="p-3 rounded-lg bg-muted/30 shrink-0 min-w-[120px]">
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <span className="font-medium text-sm">&ldquo;{word.word}&rdquo;</span>
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  {Math.round(word.score)} / 100
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                {word.phones.map((phone, pi) => (
                                  <span
                                    key={pi}
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      phone.is_error
                                        ? phone.severity === "severe"
                                          ? "bg-red-200 text-red-900 dark:bg-red-900/40 dark:text-red-200"
                                          : "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                    }`}
                                    title={phone.is_error ? `${phone.error_type} (${phone.severity})` : "OK"}
                                  >
                                    {phone.grapheme}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}