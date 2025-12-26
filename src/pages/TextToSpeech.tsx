import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Play, Pause, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const models = [
  { id: "tts-1", name: "Standard", description: "Fast, good quality" },
  { id: "tts-1-hd", name: "HD", description: "Highest quality, slower" },
  { id: "eleven-v2", name: "ElevenLabs v2", description: "Natural sounding" },
  { id: "azure-neural", name: "Azure Neural", description: "Microsoft neural TTS" },
];

const voices = [
  { id: "alloy", name: "Alloy", gender: "Neutral", accent: "American", sampleText: "Hello, I'm Alloy. I have a neutral, balanced tone." },
  { id: "echo", name: "Echo", gender: "Male", accent: "American", sampleText: "Hi there, I'm Echo. My voice is clear and confident." },
  { id: "fable", name: "Fable", gender: "Male", accent: "British", sampleText: "Good day, I'm Fable. I speak with a British accent." },
  { id: "onyx", name: "Onyx", gender: "Male", accent: "Deep", sampleText: "Hello, I'm Onyx. I have a deep, resonant voice." },
  { id: "nova", name: "Nova", gender: "Female", accent: "American", sampleText: "Hi, I'm Nova. My voice is friendly and warm." },
  { id: "shimmer", name: "Shimmer", gender: "Female", accent: "Soft", sampleText: "Hello, I'm Shimmer. I speak with a soft, gentle tone." },
  { id: "coral", name: "Coral", gender: "Female", accent: "Warm", sampleText: "Hi there, I'm Coral. My voice is warm and inviting." },
  { id: "sage", name: "Sage", gender: "Neutral", accent: "Calm", sampleText: "Hello, I'm Sage. I have a calm, soothing voice." },
];

export default function TextToSpeech() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. This is a sample text for testing text-to-speech functionality.");
  const [model, setModel] = useState("tts-1");
  const [voice, setVoice] = useState("nova");
  const [speed, setSpeed] = useState([1.0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  const selectedVoice = voices.find(v => v.id === voice);
  const selectedModel = models.find(m => m.id === model);

  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      setBrowserVoices(available);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getBrowserVoiceForGender = useCallback((gender: string) => {
    const femaleVoice = browserVoices.find(v => 
      v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Karen")
    );
    const maleVoice = browserVoices.find(v => 
      v.name.includes("Male") || v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("David")
    );
    
    if (gender === "Female" && femaleVoice) return femaleVoice;
    if (gender === "Male" && maleVoice) return maleVoice;
    return browserVoices[0] || null;
  }, [browserVoices]);

  const previewVoice = useCallback((voiceId: string) => {
    const voiceData = voices.find(v => v.id === voiceId);
    if (!voiceData) return;

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(voiceData.sampleText);
    utterance.rate = 1.0;
    
    const browserVoice = getBrowserVoiceForGender(voiceData.gender);
    if (browserVoice) utterance.voice = browserVoice;

    utterance.onstart = () => setPreviewingVoice(voiceId);
    utterance.onend = () => setPreviewingVoice(null);
    utterance.onerror = () => setPreviewingVoice(null);

    speechSynthesis.speak(utterance);
  }, [getBrowserVoiceForGender]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({ title: "Please enter some text", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setAudioGenerated(false);

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    setIsGenerating(false);
    setAudioGenerated(true);
    toast({ title: "Audio generated successfully!" });
  };

  const handlePlay = () => {
    if (!audioGenerated) return;
    
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed[0];
    
    if (selectedVoice) {
      const browserVoice = getBrowserVoiceForGender(selectedVoice.gender);
      if (browserVoice) utterance.voice = browserVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const handleDownload = () => {
    toast({ title: "Download started", description: "audio_output.mp3" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
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
              <Volume2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Text to Speech</h1>
              <p className="text-muted-foreground">Convert text to natural-sounding audio</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Enter Text</CardTitle>
                <CardDescription>Type or paste the text you want to convert to speech</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here..."
                  className="min-h-[200px] text-base"
                  data-testid="input-text"
                />
                <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                  <span>{text.length} characters</span>
                  <span>{text.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </CardContent>
            </Card>

            {audioGenerated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Generated Audio</CardTitle>
                    <CardDescription>
                      Model: {selectedModel?.name} | Voice: {selectedVoice?.name} | Speed: {speed[0]}x
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button
                        size="lg"
                        onClick={handlePlay}
                        data-testid="button-play-audio"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Play
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                        data-testid="button-download-audio"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download MP3
                      </Button>
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-muted/50">
                      <div className="h-12 flex items-center gap-1">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 bg-primary rounded-full"
                            initial={{ height: 4 }}
                            animate={{ 
                              height: isPlaying ? Math.random() * 40 + 8 : 4 
                            }}
                            transition={{ 
                              duration: 0.15,
                              repeat: isPlaying ? Infinity : 0,
                              repeatType: "reverse"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModel(m.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        model === m.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted/50"
                      }`}
                      data-testid={`option-model-${m.id}`}
                    >
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Voice</CardTitle>
                <CardDescription>Click the play button to preview each voice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {voices.map((v) => (
                    <div
                      key={v.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        voice === v.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => setVoice(v.id)}
                      data-testid={`option-voice-${v.id}`}
                    >
                      <Button
                        size="icon"
                        variant={previewingVoice === v.id ? "default" : "outline"}
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (previewingVoice === v.id) {
                            speechSynthesis.cancel();
                            setPreviewingVoice(null);
                          } else {
                            previewVoice(v.id);
                          }
                        }}
                        data-testid={`button-preview-${v.id}`}
                      >
                        {previewingVoice === v.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{v.name}</div>
                        <div className="text-xs text-muted-foreground">{v.gender} - {v.accent}</div>
                      </div>
                      {voice === v.id && (
                        <Badge variant="outline" className="shrink-0 bg-primary/10 text-primary border-primary/30">
                          Selected
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between gap-2">
                    <Label>Speed</Label>
                    <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                  </div>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.5}
                    max={2}
                    step={0.1}
                    data-testid="slider-speed"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5x</span>
                    <span>2x</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || !text.trim()}
                  data-testid="button-generate"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Generate Audio
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
