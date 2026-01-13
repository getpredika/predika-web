import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, RotateCcw, Copy, Download, FileText, Upload, Play, Pause, Volume2, ChevronsUpDown, Check, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Orb } from "@/components/ui/orb";
import { useToast } from "@/hooks/use-toast";
import { transcribeAudio, ASR_MODELS, type ASRModelId, type TranscriptSegment } from "@/api/asr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface TranscriptResult {
  text: string;
  segments: TranscriptSegment[];
  confidence: number;
  duration: number;
  language: string;
  model: string;
}

const MODEL_ORB_COLORS: [string, string] = ["#E5E7EB", "#9CA3AF"];

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<ASRModelId>(ASR_MODELS[0].id);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState<number[]>([0.0]);
  const [beamSize, setBeamSize] = useState<number[]>([5]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && currentTime >= 0 && transcript.segments.length > 0) {
      const idx = transcript.segments.findIndex(
        (seg) => currentTime >= seg.start && currentTime < seg.end
      );
      setCurrentSegmentIndex(idx);
    }
  }, [currentTime, transcript]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);
        setAudioFile(new File([blob], "recording.webm", { type: "audio/webm" }));
        setAudioFileName("Anrejistreman");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setTranscript(null);
      setCurrentSegmentIndex(-1);

      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);

      toast({ title: "Anrejistreman kòmanse", description: "Pale klè nan mikwofòn ou" });
    } catch {
      toast({ title: "Aksè mikwofòn refize", description: "Tanpri pèmèt aksè mikwofòn pou anrejistre", variant: "destructive" });
    }
  }, [toast, audioUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast({ title: "Anrejistreman fini", description: "Klike sou 'Transkri Odyo' pou konvèti an tèks" });
    }
  }, [isRecording, toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ["mpeg", "wav", "mp3", "x-wav", "webm", "ogg", "flac", "m4a", "mp4"];
    const fileExtension = file.type.split('/')[1] || '';
    if (!validExtensions.some(ext => fileExtension.includes(ext))) {
      toast({ title: "Tip fichye envalid", description: "Tanpri telechaje yon fichye MP3, WAV, OGG, oswa WEBM", variant: "destructive" });
      return;
    }

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFile(file);
    setAudioFileName(file.name);
    setTranscript(null);
    setCurrentSegmentIndex(-1);
    setIsPlaying(false);

    toast({ title: "Odyo chaje", description: file.name });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const transcribeUploadedAudio = async () => {
    if (!audioFile) {
      toast({ title: "Pa gen odyo", description: "Tanpri anrejistre oswa telechaje yon fichye odyo dabò", variant: "destructive" });
      return;
    }

    setIsTranscribing(true);

    try {
      const response = await transcribeAudio(audioFile, {
        model: selectedModel,
        languageHint: "ht",
        timestamps: true,
        temperature: temperature[0],
        beamSize: beamSize[0],
      });

      const result: TranscriptResult = {
        text: response.text,
        segments: response.segments ?? [],
        confidence: response.confidence,
        duration: response.audio?.duration_sec ?? 0,
        language: response.language_hint,
        model: response.model,
      };

      setTranscript(result);
      toast({ title: "Transkripsyon fini" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Yon erè fèt pandan transkripsyon an";
      toast({ title: "Erè transkripsyon", description: message, variant: "destructive" });
    } finally {
      setIsTranscribing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentSegmentIndex(-1);
    setCurrentTime(0);
  };

  const seekToSegment = (segment: TranscriptSegment) => {
    if (audioRef.current) {
      audioRef.current.currentTime = segment.start;
      setCurrentTime(segment.start);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioFile(null);
    setAudioFileName(null);
    setTranscript(null);
    setRecordingDuration(0);
    setCurrentSegmentIndex(-1);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const copyToClipboard = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript.text);
      toast({ title: "Kopye nan clipboard" });
    }
  };

  const downloadTranscript = () => {
    if (!transcript) return;

    let content = `Transkripsyon\n${"=".repeat(50)}\n\n`;
    content += `Modèl: ${transcript.model}\n`;
    content += `Lang: ${transcript.language}\n`;
    content += `Konfyans: ${(transcript.confidence * 100).toFixed(0)}%\n`;
    content += `Dire: ${formatDuration(transcript.duration)}\n\n`;
    content += `Tèks\n${"-".repeat(50)}\n\n`;
    content += `${transcript.text}\n\n`;

    if (transcript.segments.length > 0) {
      content += `Segman\n${"-".repeat(50)}\n\n`;
      transcript.segments.forEach((seg, i) => {
        content += `${i + 1}. [${seg.start.toFixed(2)}s - ${seg.end.toFixed(2)}s] "${seg.text}"\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transkripsyon.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Telechajman kòmanse" });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600 dark:text-green-400";
    if (confidence >= 0.7) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#f0faf7]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-32 w-96 h-96 bg-teal-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                Vwa an Tèks
              </h1>
              <p className="text-muted-foreground mt-1">
                Konvèti odyo Kreyòl ou an tèks ak AI
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Main content - Audio input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle>Antre Odyo</CardTitle>
                <CardDescription>Anrejistre oswa telechaje yon fichye odyo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-3">
                    {!isRecording ? (
                      <Button
                        size="lg"
                        onClick={startRecording}
                        disabled={isTranscribing}
                        className="w-20 h-20 rounded-full"
                        data-testid="button-start-recording"
                      >
                        <Mic className="w-8 h-8" />
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="destructive"
                        onClick={stopRecording}
                        className="w-20 h-20 rounded-full"
                        data-testid="button-stop-recording"
                      >
                        <Square className="w-8 h-8" />
                      </Button>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {isRecording ? "Anrejistreman..." : "Anrejistre"}
                    </span>
                  </div>

                  <div className="text-muted-foreground text-lg">oswa</div>

                  <div className="flex flex-col items-center gap-3">
                    <input
                      type="file"
                      accept=".mp3,.wav,.ogg,.webm,.flac,.m4a,audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/flac,audio/m4a"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isRecording || isTranscribing}
                      className="w-20 h-20 rounded-full"
                      data-testid="button-upload-audio"
                    >
                      <Upload className="w-8 h-8" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Telechaje Fichye</span>
                  </div>
                </div>

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <motion.div
                      className="w-3 h-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-lg font-mono">{formatDuration(recordingDuration)}</span>
                  </motion.div>
                )}

                {isTranscribing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                    <span className="text-muted-foreground">Ap transkri odyo a...</span>
                  </motion.div>
                )}

                {audioUrl && !transcript && !isTranscribing && !isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Volume2 className="w-4 h-4" />
                      <span>{audioFileName}</span>
                    </div>
                    <Button onClick={transcribeUploadedAudio} data-testid="button-transcribe">
                      <FileText className="w-4 h-4 mr-2" />
                      Transkri Odyo
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Transcript result */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
                    <div>
                      <CardTitle>Transkripsyon</CardTitle>
                      {transcript.segments.length > 0 && (
                        <CardDescription>
                          Klike sou nenpòt segman pou ale nan pozisyon sa nan odyo a
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={copyToClipboard} data-testid="button-copy">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">Kopye</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={downloadTranscript} data-testid="button-download">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">Telechaje</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={reset} data-testid="button-reset">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">Efase</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {audioUrl && (
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={togglePlayback}
                          data-testid="button-play-pause"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{audioFileName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDuration(currentTime)} / {formatDuration(transcript?.duration || 0)}
                          </div>
                        </div>
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={handleAudioEnded}
                          className="hidden"
                        />
                      </div>
                    )}

                    <div className="p-4 rounded-lg bg-muted/30 min-h-[120px]">
                      {transcript.segments.length > 0 ? (
                        <p className="text-lg leading-loose">
                          {transcript.segments.map((segment, index) => (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <span
                                  onClick={() => seekToSegment(segment)}
                                  className={`cursor-pointer px-1 py-0.5 rounded transition-all duration-150 ${
                                    index === currentSegmentIndex
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-muted"
                                  }`}
                                  data-testid={`segment-${index}`}
                                >
                                  {segment.text}{" "}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-white dark:bg-zinc-900 border shadow-lg z-[100]"
                              >
                                <div className="text-xs space-y-1">
                                  <div className="text-muted-foreground">
                                    {segment.start.toFixed(2)}s - {segment.end.toFixed(2)}s
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </p>
                      ) : (
                        <p className="text-lg leading-loose">{transcript.text}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {transcript.segments.length > 0 && (
                          <span>{transcript.segments.length} segman</span>
                        )}
                        <span>{transcript.text.length} karaktè</span>
                        <span className={getConfidenceColor(transcript.confidence)}>
                          {(transcript.confidence * 100).toFixed(0)}% konfyans
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {transcript.language}
                        </Badge>
                        <Badge variant="outline">
                          {formatDuration(transcript.duration)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar - Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Model Selection */}
            <Card className="shadow-sm border-0 bg-white overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Modèl:
                  </Label>
                  <Popover open={modelPickerOpen} onOpenChange={setModelPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={modelPickerOpen}
                        disabled={isTranscribing}
                        className="w-full justify-between h-12 px-3 border-input bg-background hover:bg-muted/50 shadow-sm"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="relative w-8 h-8 shrink-0">
                            <Orb agentState={null} colors={MODEL_ORB_COLORS} className="absolute inset-0" />
                          </div>
                          <div className="flex flex-col items-start text-left">
                            <span className="text-sm font-medium truncate">
                              {ASR_MODELS.find(m => m.id === selectedModel)?.name ?? "Ayira Medium"}
                            </span>
                          </div>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0 bg-white border shadow-md"
                      align="start"
                      sideOffset={4}
                    >
                      <Command className="rounded-lg border-0 bg-white">
                        <CommandInput placeholder="Chèche modèl..." className="h-10 border-0" />
                        <CommandList className="max-h-[220px] bg-white">
                          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                            Pa gen modèl ki koresponn.
                          </CommandEmpty>
                          <CommandGroup className="p-1">
                            {ASR_MODELS.map((model) => (
                              <CommandItem
                                key={model.id}
                                value={`${model.id} ${model.name}`}
                                onSelect={() => {
                                  setSelectedModel(model.id);
                                  setModelPickerOpen(false);
                                }}
                                className={cn(
                                  "flex items-center gap-3 py-2 px-2 cursor-pointer rounded-md",
                                  "aria-selected:bg-muted",
                                  selectedModel === model.id && "bg-muted"
                                )}
                              >
                                <div className="relative w-8 h-8 shrink-0">
                                  <Orb agentState={null} colors={MODEL_ORB_COLORS} className="absolute inset-0" />
                                </div>
                                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                                  <span className="font-medium text-sm text-foreground">
                                    {model.name}
                                  </span>
                                </div>
                                <div className={cn(
                                  "flex items-center justify-center w-5 h-5 rounded-full shrink-0",
                                  selectedModel === model.id ? "bg-primary text-primary-foreground" : "opacity-0"
                                )}>
                                  <Check className="h-3 w-3" />
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Advanced settings */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <Card className="shadow-sm border-0 bg-white">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-xl">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        Paramèt Avanse
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {showAdvanced ? "Kache" : "Montre"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-6">
                    {/* Beam Size */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-sm">
                          Beam Size
                        </Label>
                        <span className="text-sm font-semibold text-primary tabular-nums">
                          {beamSize[0]}
                        </span>
                      </div>
                      <Slider
                        value={beamSize}
                        onValueChange={setBeamSize}
                        min={1}
                        max={10}
                        step={1}
                        disabled={isTranscribing}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Rapid</span>
                        <span>Presi</span>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-sm">
                          Tanperati
                        </Label>
                        <span className="text-sm font-semibold text-primary tabular-nums">
                          {(temperature[0] ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        min={0}
                        max={1}
                        step={0.1}
                        disabled={isTranscribing}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Detèminis</span>
                        <span>Kreyatif</span>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Info card */}
            <Card className="shadow-sm bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sistèm STT sa a itilize modèl AI pou konvèti vwa natirèl an tèks nan lang Kreyòl Ayisyen.
                  Sipòte fòma MP3, WAV, OGG, WEBM, ak FLAC.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
