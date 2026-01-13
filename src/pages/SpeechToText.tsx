import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, RotateCcw, Copy, Download, FileText, Upload, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { transcribeAudio, type TranscribeResponse, type TranscriptSegment } from "@/api/asr";

interface TranscriptResult {
  text: string;
  segments: TranscriptSegment[];
  confidence: number;
  duration: number;
  language: string;
  model: string;
}

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && currentTime >= 0) {
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
        languageHint: "ht",
        timestamps: true,
      });

      const result: TranscriptResult = {
        text: response.text,
        segments: response.segments,
        confidence: response.confidence,
        duration: response.audio.duration_sec,
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
    content += `Segman\n${"-".repeat(50)}\n\n`;

    transcript.segments.forEach((seg, i) => {
      content += `${i + 1}. [${seg.start.toFixed(2)}s - ${seg.end.toFixed(2)}s] "${seg.text}"\n`;
    });

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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 pt-12">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Vwa an Tèks</h1>
              <p className="text-muted-foreground">Konvèti odyo an tèks ak estanp tan</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Antre Odyo</CardTitle>
                <CardDescription>Anrejistre odyo oswa telechaje yon fichye odyo (MP3, WAV, OGG, WEBM)</CardDescription>
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
          </motion.div>

          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
                  <div>
                    <CardTitle>Transkripsyon</CardTitle>
                    <CardDescription>
                      Klike sou nenpòt segman pou ale nan pozisyon sa nan odyo a
                    </CardDescription>
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
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{transcript.segments.length} segman</span>
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

          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Segman</CardTitle>
                  <CardDescription>Tan detaye pou chak segman</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-card border-b">
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2 font-medium">#</th>
                          <th className="pb-2 font-medium">Tèks</th>
                          <th className="pb-2 font-medium">Kòmanse</th>
                          <th className="pb-2 font-medium">Fini</th>
                          <th className="pb-2 font-medium">Dire</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transcript.segments.map((segment, index) => (
                          <tr
                            key={index}
                            onClick={() => seekToSegment(segment)}
                            className={`cursor-pointer border-b border-border/50 transition-colors ${
                              index === currentSegmentIndex
                                ? "bg-primary/10"
                                : "hover:bg-muted/50"
                            }`}
                            data-testid={`segment-row-${index}`}
                          >
                            <td className="py-2 text-muted-foreground">{index + 1}</td>
                            <td className="py-2 font-medium">{segment.text}</td>
                            <td className="py-2 font-mono text-xs">{segment.start.toFixed(2)}s</td>
                            <td className="py-2 font-mono text-xs">{segment.end.toFixed(2)}s</td>
                            <td className="py-2 font-mono text-xs">{(segment.end - segment.start).toFixed(2)}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Fòma Sipòte</h4>
                    <p className="text-sm text-muted-foreground">MP3, WAV, OGG, WEBM, FLAC</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Estanp Tan</h4>
                    <p className="text-sm text-muted-foreground">Tan presi pou chak segman</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Jwe Senkronize</h4>
                    <p className="text-sm text-muted-foreground">Segman yo klere pandan odyo a jwe</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
