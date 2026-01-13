import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Loader2, Sparkles, Settings2, ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { VoicePicker, type Voice } from "@/components/ui/voice-picker";
import { TTSAudioPlayer } from "@/components/ui/tts-audio-player";
import { Orb } from "@/components/ui/orb";
import { useGenerateSpeech, TTS_SPEAKERS, TTS_MODELS } from "@/hooks/use-tts";
import { useToast } from "@/hooks/use-toast";
import type { TTSGenerateResponse } from "@/types/api";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { cn } from "@/lib/utils";

// Example phrases for quick testing
const EXAMPLE_PHRASES = [
    "Bonjou! Kijan ou ye jodi a?",
    "Mwen kontan rankontre ou.",
    "Kreyòl se lang manman m.",
    "Ayiti se peyi m, mwen renmen l anpil.",
    "Mèsi anpil pou èd ou.",
];

// Orb colors - different for model vs speaker
const MODEL_ORB_COLORS: [string, string] = ["#E5E7EB", "#9CA3AF"]; // Indigo
const SPEAKER_ORB_COLORS: [string, string] = ["#CADCFC", "#A0B9D1"]; // Teal/Primary

export default function TextToSpeech() {
    const [text, setText] = useState("");
    const [selectedSpeaker, setSelectedSpeaker] = useState(TTS_SPEAKERS[0]?.id ?? "narrateur");
    const [selectedModel, setSelectedModel] = useState(TTS_MODELS[0]?.id ?? "kani-tts-haitian-creole-22khz");
    const [temperature, setTemperature] = useState<number[]>([0.6]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [audioResult, setAudioResult] = useState<TTSGenerateResponse | null>(null);
    const [modelPickerOpen, setModelPickerOpen] = useState(false);
    const { toast } = useToast();

    const generateSpeech = useGenerateSpeech();
    const maxChars = 500;

    // Convert TTS_SPEAKERS to Voice format for the picker
    const voices: Voice[] = TTS_SPEAKERS.map((speaker) => ({
        id: speaker.id,
        name: speaker.name,
        gender: speaker.gender,
        description: speaker.description,
        previewUrl: speaker.previewUrl,
    }));

    // Cleanup audio URL on unmount
    useEffect(() => {
        return () => {
            if (audioResult?.audioUrl) {
                URL.revokeObjectURL(audioResult.audioUrl);
            }
        };
    }, [audioResult]);

    const handleGenerate = async () => {
        if (!text.trim()) {
            toast({
                title: "Tanpri ekri tèks",
                description: "Ou bezwen ekri kèk tèks anvan ou ka jenere vwa.",
                variant: "destructive",
            });
            return;
        }

        // Cleanup previous audio URL
        if (audioResult?.audioUrl) {
            URL.revokeObjectURL(audioResult.audioUrl);
            setAudioResult(null);
        }

        try {
            const result = await generateSpeech.mutateAsync({
                text: text.trim(),
                speaker: selectedSpeaker,
                model: selectedModel,
                temperature: temperature[0] ?? 0.6,
            });

            setAudioResult(result);
            toast({
                title: "Odyo jenere avèk siksè!",
                description: `Tan: ${result.metadata.totalTime.toFixed(2)}s`,
            });
        } catch (error) {
            toast({
                title: "Erè",
                description: error instanceof Error ? error.message : "Gen yon erè ki pase.",
                variant: "destructive",
            });
        }
    };

    const handleExampleClick = (example: string) => {
        setText(example);
    };

    const selectedVoice = TTS_SPEAKERS.find(s => s.id === selectedSpeaker);

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
                            <Volume2 className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                                Tèks pou Vwa
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Konvèti tèks Kreyòl ou an vwa natirèl avèk AI
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Main content - Text input */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 space-y-6"
                    >
                        <Card className="shadow-sm border-0 bg-white">
                            <CardContent className="p-6">
                                <Label className="text-sm font-medium mb-3 block">
                                    Tape tèks Kreyòl ou:
                                </Label>
                                <Textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value.slice(0, maxChars))}
                                    placeholder="Ekri tèks ou vle tande a isit la..."
                                    className="min-h-[200px] text-base resize-none border-muted/50 focus:border-primary"
                                    disabled={generateSpeech.isPending}
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-muted-foreground">
                                        {text.length}/{maxChars} karaktè
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {text.split(/\s+/).filter(Boolean).length} mo
                                    </span>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={generateSpeech.isPending || !text.trim()}
                                        className="px-6"
                                    >
                                        {generateSpeech.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Ap Jenere...
                                            </>
                                        ) : (
                                            "Jenere Vwa"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Example phrases */}
                        <Card className="shadow-sm border-dashed border-muted bg-white/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-secondary" />
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Egzanp fraz pou eseye
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {EXAMPLE_PHRASES.map((phrase, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleExampleClick(phrase)}
                                            disabled={generateSpeech.isPending}
                                            className="px-3 py-1.5 text-sm rounded-full border border-border bg-white hover:bg-secondary/10 hover:border-secondary/50 hover:text-foreground transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {phrase}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Generated audio player */}
                        {audioResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <TTSAudioPlayer
                                    audioUrl={audioResult.audioUrl}
                                    metadata={audioResult.metadata}
                                />
                            </motion.div>
                        )}

                        {/* Error display */}
                        {generateSpeech.isError && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                            >
                                <p className="text-sm text-destructive">
                                    {generateSpeech.error instanceof Error
                                        ? generateSpeech.error.message
                                        : "Gen yon erè ki pase."}
                                </p>
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
                        {/* Model and Voice selection */}
                        <Card className="shadow-sm border-0 bg-white overflow-hidden">
                            <CardContent className="p-6 space-y-5">
                                {/* Model Selection */}
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
                                                disabled={generateSpeech.isPending}
                                                className="w-full justify-between h-12 px-3 border-input bg-background hover:bg-muted/50 shadow-sm"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="relative w-8 h-8 shrink-0">
                                                        <Orb agentState={null} colors={MODEL_ORB_COLORS} className="absolute inset-0" />
                                                    </div>
                                                    <div className="flex flex-col items-start text-left">
                                                        <span className="text-sm font-medium truncate">
                                                            {TTS_MODELS.find(m => m.id === selectedModel)?.name ?? "Standard Model"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {TTS_MODELS.find(m => m.id === selectedModel)?.description}
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
                                                        {TTS_MODELS.map((model) => (
                                                            <CommandItem
                                                                key={model.id}
                                                                value={`${model.id} ${model.name} ${model.description}`}
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
                                                                    <span className="text-xs text-muted-foreground truncate">
                                                                        {model.description}
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

                                {/* Voice Selection */}
                                <div>
                                    <Label className="text-sm text-muted-foreground mb-2 block">
                                        Kalite Vwa:
                                    </Label>
                                    <VoicePicker
                                        voices={voices}
                                        value={selectedSpeaker}
                                        onValueChange={setSelectedSpeaker}
                                        disabled={generateSpeech.isPending}
                                        placeholder="Chwazi yon vwa..."
                                    />
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
                                    <CardContent className="pt-0 space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <Label className="text-sm">
                                                    Tanperati
                                                </Label>
                                                <span className="text-sm font-semibold text-primary tabular-nums">
                                                    {(temperature[0] ?? 0.6).toFixed(1)}
                                                </span>
                                            </div>
                                            <Slider
                                                value={temperature}
                                                onValueChange={setTemperature}
                                                min={0.1}
                                                max={1.5}
                                                step={0.1}
                                                disabled={generateSpeech.isPending}
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                <span>Estab</span>
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
                                    Sistèm TTS sa a itilize modèl AI pou jenere vwa natirèl nan lang Kreyòl Ayisyen.
                                    Klike sou orb la nan lis vwa yo pou tande yon egzanp.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
