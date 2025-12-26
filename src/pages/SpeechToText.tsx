import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Square, RotateCcw, Copy, Download, FileText, Upload, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface WordSegment {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

interface TranscriptResult {
  text: string;
  segments: WordSegment[];
  duration: number;
  language: string;
}

const generateMockTranscript = (duration: number): TranscriptResult => {
  const sentences = [
    "Hello and welcome to our speech recognition demonstration",
    "This system can transcribe your voice with impressive accuracy",
    "Each word is timestamped for precise synchronization",
    "You can see the words highlight as the audio plays",
    "This technology enables many accessibility features"
  ];
  
  const text = sentences.slice(0, Math.min(3, Math.ceil(duration / 5))).join(". ") + ".";
  const words = text.split(/\s+/);
  const avgWordDuration = (duration * 1000) / words.length;
  
  let currentTime = 0;
  const segments: WordSegment[] = words.map((word) => {
    const wordDuration = avgWordDuration * (0.7 + Math.random() * 0.6);
    const segment: WordSegment = {
      word,
      startTime: currentTime,
      endTime: currentTime + wordDuration,
      confidence: 0.85 + Math.random() * 0.15,
    };
    currentTime += wordDuration + (Math.random() * 100);
    return segment;
  });

  return {
    text,
    segments,
    duration: duration * 1000,
    language: "en-US",
  };
};

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && currentTime >= 0) {
      const timeMs = currentTime * 1000;
      const idx = transcript.segments.findIndex(
        (seg) => timeMs >= seg.startTime && timeMs < seg.endTime
      );
      setCurrentWordIndex(idx);
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);
        setAudioFileName("Recording");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setTranscript(null);
      setCurrentWordIndex(-1);

      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);

      toast({ title: "Recording started", description: "Speak clearly into your microphone" });
    } catch {
      toast({ title: "Microphone access denied", description: "Please allow microphone access to record", variant: "destructive" });
    }
  }, [toast, audioUrl]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      const duration = recordingDuration;
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setIsTranscribing(true);
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

      const result = generateMockTranscript(Math.max(duration, 3));
      setTranscript(result);
      setIsTranscribing(false);

      toast({ title: "Transcription complete" });
    }
  }, [isRecording, recordingDuration, toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav", "audio/webm"];
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      toast({ title: "Invalid file type", description: "Please upload an MP3 or WAV file", variant: "destructive" });
      return;
    }

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFileName(file.name);
    setTranscript(null);
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    
    toast({ title: "Audio loaded", description: file.name });
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const transcribeUploadedAudio = async () => {
    if (!audioUrl) return;
    
    setIsTranscribing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    const audio = new Audio(audioUrl);
    await new Promise<void>((resolve) => {
      audio.onloadedmetadata = () => resolve();
      audio.onerror = () => resolve();
    });
    
    const duration = audio.duration || 10;
    const result = generateMockTranscript(duration);
    setTranscript(result);
    setIsTranscribing(false);
    
    toast({ title: "Transcription complete" });
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
    setCurrentWordIndex(-1);
    setCurrentTime(0);
  };

  const seekToWord = (segment: WordSegment) => {
    if (audioRef.current) {
      audioRef.current.currentTime = segment.startTime / 1000;
      setCurrentTime(segment.startTime / 1000);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioFileName(null);
    setTranscript(null);
    setRecordingDuration(0);
    setCurrentWordIndex(-1);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const copyToClipboard = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript.text);
      toast({ title: "Copied to clipboard" });
    }
  };

  const downloadTranscript = () => {
    if (!transcript) return;
    
    let content = `Transcript\n${"=".repeat(50)}\n\n`;
    content += `${transcript.text}\n\n`;
    content += `Word Segments\n${"-".repeat(50)}\n\n`;
    
    transcript.segments.forEach((seg, i) => {
      content += `${i + 1}. "${seg.word}" [${(seg.startTime / 1000).toFixed(2)}s - ${(seg.endTime / 1000).toFixed(2)}s] (${(seg.confidence * 100).toFixed(0)}% confidence)\n`;
    });
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Download started" });
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
          <Link href="/app">
            <Button variant="ghost" className="mb-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Speech to Text</h1>
              <p className="text-muted-foreground">Convert audio to text with word-level timestamps (demo)</p>
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
                <CardTitle>Audio Input</CardTitle>
                <CardDescription>Record audio or upload an audio file (MP3, WAV)</CardDescription>
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
                      {isRecording ? "Recording..." : "Record"}
                    </span>
                  </div>

                  <div className="text-muted-foreground text-lg">or</div>

                  <div className="flex flex-col items-center gap-3">
                    <input
                      type="file"
                      accept=".mp3,.wav,audio/mpeg,audio/wav"
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
                    <span className="text-sm text-muted-foreground">Upload File</span>
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
                    <span className="text-muted-foreground">Transcribing audio...</span>
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
                      Transcribe Audio
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
                    <CardTitle>Transcript</CardTitle>
                    <CardDescription>
                      Click any word to jump to that position in the audio
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={copyToClipboard} data-testid="button-copy">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">Copy</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={downloadTranscript} data-testid="button-download">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">Download</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={reset} data-testid="button-reset">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">Clear</TooltipContent>
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
                          {formatDuration(currentTime)} / {formatDuration((transcript?.duration || 0) / 1000)}
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
                              onClick={() => seekToWord(segment)}
                              className={`cursor-pointer px-0.5 rounded transition-all duration-150 ${
                                index === currentWordIndex
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                              data-testid={`word-${index}`}
                            >
                              {segment.word}{" "}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="bg-white dark:bg-zinc-900 border shadow-lg z-[100]"
                          >
                            <div className="text-xs space-y-1">
                              <div className="font-medium">{segment.word}</div>
                              <div className="text-muted-foreground">
                                {(segment.startTime / 1000).toFixed(2)}s - {(segment.endTime / 1000).toFixed(2)}s
                              </div>
                              <div className={getConfidenceColor(segment.confidence)}>
                                {(segment.confidence * 100).toFixed(0)}% confidence
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{transcript.segments.length} words</span>
                      <span>{transcript.text.length} characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {transcript.language}
                      </Badge>
                      <Badge variant="outline">
                        {formatDuration(transcript.duration / 1000)}
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
                  <CardTitle className="text-lg">Word Segments</CardTitle>
                  <CardDescription>Detailed timing and confidence for each word</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-card border-b">
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2 font-medium">#</th>
                          <th className="pb-2 font-medium">Word</th>
                          <th className="pb-2 font-medium">Start</th>
                          <th className="pb-2 font-medium">End</th>
                          <th className="pb-2 font-medium">Duration</th>
                          <th className="pb-2 font-medium">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transcript.segments.map((segment, index) => (
                          <tr
                            key={index}
                            onClick={() => seekToWord(segment)}
                            className={`cursor-pointer border-b border-border/50 transition-colors ${
                              index === currentWordIndex
                                ? "bg-primary/10"
                                : "hover:bg-muted/50"
                            }`}
                            data-testid={`segment-row-${index}`}
                          >
                            <td className="py-2 text-muted-foreground">{index + 1}</td>
                            <td className="py-2 font-medium">{segment.word}</td>
                            <td className="py-2 font-mono text-xs">{(segment.startTime / 1000).toFixed(2)}s</td>
                            <td className="py-2 font-mono text-xs">{(segment.endTime / 1000).toFixed(2)}s</td>
                            <td className="py-2 font-mono text-xs">{((segment.endTime - segment.startTime) / 1000).toFixed(2)}s</td>
                            <td className="py-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getConfidenceColor(segment.confidence)}`}
                              >
                                {(segment.confidence * 100).toFixed(0)}%
                              </Badge>
                            </td>
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
                    <h4 className="font-medium text-foreground mb-1">Supported Formats</h4>
                    <p className="text-sm text-muted-foreground">MP3, WAV, WebM</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Word Timestamps</h4>
                    <p className="text-sm text-muted-foreground">Precise timing for each word</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Sync Playback</h4>
                    <p className="text-sm text-muted-foreground">Words highlight as audio plays</p>
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
