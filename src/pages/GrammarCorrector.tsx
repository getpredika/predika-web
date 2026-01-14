import { useState, useCallback, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Copy, RotateCcw, CheckCircle2, Pencil, Upload, Download, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useCorrectText } from "@/hooks/use-correction";
import { isCorrectedTextResponse } from "@/types/api";

interface UndoAction {
  segments: CorrectionResult["segments"];
  errors: GrammarError[];
  description: string;
}

interface GrammarError {
  original: string;
  corrected: string;
  type: "spelling" | "grammar" | "punctuation" | "style";
  explanation: string;
}

interface CorrectionResult {
  originalText: string;
  correctedText: string;
  errors: GrammarError[];
  segments: { text: string; isError: boolean; errorIndex?: number }[];
}

function generateSegmentsFromBackend(
  originalText: string,
  modifications: { start: number; end: number }[]
): CorrectionResult["segments"] {
  const segments: CorrectionResult["segments"] = [];
  let cursor = 0;

  [...modifications]
    .sort((a, b) => a.start - b.start)
    .forEach((mod, i) => {
      if (mod.start > cursor) {
        segments.push({
          text: originalText.slice(cursor, mod.start),
          isError: false,
        });
      }

      segments.push({
        text: originalText.slice(mod.start, mod.end),
        isError: true,
        errorIndex: i,
      });

      cursor = mod.end;
    });

  if (cursor < originalText.length) {
    segments.push({
      text: originalText.slice(cursor),
      isError: false,
    });
  }

  return segments;
}


function ErrorHighlight({
  text,
  error,
  segmentIndex,
  onApplyCorrection
}: {
  text: string;
  error: GrammarError;
  segmentIndex: number;
  onApplyCorrection: (segmentIndex: number, corrected: string) => void;
}) {
  const getErrorStyle = () => {
    switch (error.type) {
      case "spelling":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-b-2 border-red-500";
      case "grammar":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-b-2 border-yellow-500";
      case "punctuation":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-b-2 border-orange-500";
      case "style":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-b-2 border-blue-500";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-b-2 border-red-500";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`cursor-pointer px-0.5 rounded-sm ${getErrorStyle()}`}
          onClick={() => onApplyCorrection(segmentIndex, error.corrected)}
          data-testid={`error-${segmentIndex}`}
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs bg-white dark:bg-zinc-900 border border-border shadow-xl z-[100]"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">{error.type}</Badge>
          </div>
          <p className="text-sm">
            <span className="line-through text-muted-foreground">{error.original}</span>
            {" "}
            <span className="text-green-600 dark:text-green-400 font-medium">{error.corrected}</span>
          </p>
          <p className="text-xs text-muted-foreground">{error.explanation}</p>
          <p className="text-xs text-primary">Klike pou aplike koreksyon</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function GrammarCorrector() {
  const [inputText, setInputText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      toast({ title: "Tanpri telechaje yon fichye .txt", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      setResult(null);
      setIsEditing(true);
      setUndoStack([]);
      toast({ title: "Fichye chaje", description: `Chaje ${file.name}` });
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadText = () => {
    const textToDownload = result
      ? result.segments.map(s => s.text).join('')
      : inputText;

    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corrected_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Telechaje", description: "Tèks sove kòm corrected_text.txt" });
  };

  const correctTextMutation = useCorrectText();

  const checkGrammar = useCallback(async () => {
    if (!inputText.trim()) {
      toast({ title: "Tanpri antre kèk tèks", variant: "destructive" });
      return;
    }

    setIsChecking(true);

    try {
      let response = await correctTextMutation.mutateAsync({ text: inputText });

      // Handle null/undefined response from API
      if (!response) {
        throw new Error("Pa gen repons nan sèvè a. Tanpri eseye ankò.");
      }

      // Handle case where response is a JSON string instead of object
      if (typeof response === 'string') {
        try {
          response = JSON.parse(response);
        } catch {
          throw new Error("Fòma repons nan sèvè a pa valid");
        }
      }

      let correction: CorrectionResult;

      if (isCorrectedTextResponse(response)) {
        // Has corrections - convert API response to CorrectionResult format
        const errors: GrammarError[] = response.modifications.map(mod => ({
          original: mod.original,
          corrected: mod.corrected,
          type: mod.type,
          explanation: mod.explanation,
        }));


        // Generate segments for highlighting
        const segments = generateSegmentsFromBackend(
          inputText,
          response.modifications
        );


        correction = {
          originalText: inputText,
          correctedText: response.corrected_text,
          errors,
          segments,
        };
      } else {
        // No corrections needed
        correction = {
          originalText: inputText,
          correctedText: inputText,
          errors: [],
          segments: [{ text: inputText, isError: false }],
        };
      }

      setResult(correction);
      setIsEditing(false);

      if (correction.errors.length === 0) {
        toast({ title: "Pa gen erè jwenn", description: "Tèks ou gade byen!" });
      } else {
        toast({
          title: `Jwenn ${correction.errors.length} pwoblèm${correction.errors.length > 1 ? '' : ''}`,
          description: "Klike sou tèks ki mare pou aplike koreksyon"
        });
      }
    } catch (error) {
      toast({
        title: "Erè nan verifye tèks",
        description: error instanceof Error ? error.message : "Yon erè rive",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  }, [inputText, toast, correctTextMutation]);

  const applyCorrection = async (segmentIndex: number, corrected: string) => {
    if (result) {
      // Save current state to undo stack
      const originalSegment = result.segments[segmentIndex];
      if (!originalSegment) return;

      setUndoStack(prev => [...prev, {
        segments: [...result.segments],
        errors: [...result.errors],
        description: `"${originalSegment.text}" → "${corrected}"`
      }]);

      const newSegments = [...result.segments];
      newSegments[segmentIndex] = { text: corrected, isError: false };
      const newText = newSegments.map(s => s.text).join("");
      setInputText(newText);

      // Re-check the corrected text with API
      try {
        const rawResponse = await correctTextMutation.mutateAsync({ text: newText });

        // Handle case where response is a JSON string instead of object
        let response: typeof rawResponse | null = rawResponse;
        if (typeof rawResponse === 'string') {
          try {
            response = JSON.parse(rawResponse);
          } catch {
            response = null;
          }
        }

        let newResult: CorrectionResult;
        if (response && isCorrectedTextResponse(response)) {
          const errors: GrammarError[] = response.modifications.map(mod => ({
            original: mod.original,
            corrected: mod.corrected,
            type: mod.type,
            explanation: mod.explanation,
          }));

          const segments = generateSegmentsFromBackend(
            newText,
            response.modifications
          );

          newResult = {
            originalText: newText,
            correctedText: response.corrected_text,
            errors,
            segments,
          };
        }
        else {
          newResult = {
            originalText: newText,
            correctedText: newText,
            errors: [],
            segments: [{ text: newText, isError: false }],
          };
        }
        setResult(newResult);
      } catch (error) {
        // If API fails, just update with the corrected text
        setResult({
          originalText: newText,
          correctedText: newText,
          errors: [],
          segments: [{ text: newText, isError: false }],
        });
      }

      toast({ title: "Koreksyon aplike" });
    }
  };

  const applyAllCorrections = () => {
    if (result && result.errors.length > 0) {
      // Save current state to undo stack
      setUndoStack(prev => [...prev, {
        segments: [...result.segments],
        errors: [...result.errors],
        description: "Aplike tout koreksyon"
      }]);

      setInputText(result.correctedText);
      setResult({
        ...result,
        originalText: result.correctedText,
        errors: [],
        segments: [{ text: result.correctedText, isError: false }],
      });
      toast({ title: "Tout koreksyon aplike" });
    }
  };

  const undoLastChange = () => {
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    if (!lastState) return;

    setUndoStack(prev => prev.slice(0, -1));

    const newText = lastState.segments.map(s => s.text).join("");
    setInputText(newText);
    setResult({
      originalText: newText,
      correctedText: newText,
      errors: lastState.errors,
      segments: lastState.segments
    });
    toast({ title: "Defèt", description: lastState.description });
  };

  const copyText = () => {
    const textToCopy = result?.correctedText || inputText;
    navigator.clipboard.writeText(textToCopy);
    toast({ title: "Kopye nan klib" });
  };

  const reset = () => {
    setInputText("");
    setResult(null);
    setIsEditing(true);
    setUndoStack([]);
  };

  const editText = () => {
    setIsEditing(true);
    setResult(null);
    setUndoStack([]);
  };

  const errorCounts = result?.errors.reduce((acc, err) => {
    acc[err.type] = (acc[err.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

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
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Korektè Gramè</h1>
              <p className="text-muted-foreground">Korije fòtògraf ak gramè nan tèks ou</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Antre Tèks Ou" : "Tèks Korije"}</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Kole oswa tape tèks ou anba a"
                    : result && result.errors.length > 0
                      ? "Klike sou erè ki mare pou aplike koreksyon"
                      : "Pa gen erè jwenn"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Antre tèks ou la a pou verifye fòtògraf ak gramè...

Eseye tape: 'Li te ale nan magazen an. Nou te manje yon pen tre bon. Se yon bagay ki important pou nou fè.'"
                    className="min-h-[300px] text-base"
                    data-testid="input-text"
                  />
                ) : (
                  <div
                    className="min-h-[300px] p-3 rounded-md border bg-background leading-relaxed text-base whitespace-pre-wrap"
                    data-testid="result-text"
                  >
                    {result?.segments.map((segment, index) => {
                      const error = segment.errorIndex !== undefined ? result.errors[segment.errorIndex] : undefined;
                      return segment.isError && error ? (
                        <ErrorHighlight
                          key={index}
                          text={segment.text}
                          error={error}
                          segmentIndex={index}
                          onApplyCorrection={applyCorrection}
                        />
                      ) : (
                        <span key={index}>{segment.text}</span>
                      );
                    })}
                    {result?.errors.length === 0 && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-4">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Tèks ou san erè!</span>
                      </div>
                    )}
                  </div>
                )}

                {!isEditing && Object.keys(errorCounts).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {errorCounts.spelling && (
                      <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                        {errorCounts.spelling} Fòtògraf
                      </Badge>
                    )}
                    {errorCounts.grammar && (
                      <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
                        {errorCounts.grammar} Gramè
                      </Badge>
                    )}
                    {errorCounts.punctuation && (
                      <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                        {errorCounts.punctuation} Ponktyasyon
                      </Badge>
                    )}
                    {errorCounts.style && (
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                        {errorCounts.style} Stil
                      </Badge>
                    )}
                  </div>
                )}

                <input
                  type="file"
                  accept=".txt"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-file-upload"
                />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isEditing ? (
                      <Button
                        onClick={checkGrammar}
                        disabled={isChecking || !inputText.trim()}
                        data-testid="button-check"
                      >
                        {isChecking ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Ap verifye...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Verifye Gramè
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={editText} data-testid="button-edit">
                          <Pencil className="w-4 h-4 mr-2" />
                          Modifye
                        </Button>
                        {undoStack.length > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={undoLastChange} data-testid="button-undo">
                                <Undo2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">
                              Defèt ({undoStack.length})
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {result && result.errors.length > 0 && (
                          <Button onClick={applyAllCorrections} data-testid="button-apply-all">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Aplike Tout
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {isEditing && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            data-testid="button-upload"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">
                          Telechaje .txt
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={copyText} data-testid="button-copy">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">
                        Kopye
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={downloadText}
                          disabled={!inputText.trim()}
                          data-testid="button-download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">
                        Telechaje .txt
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={reset} data-testid="button-reset">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">
                        Efase
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {inputText.length} karaktè | {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} mo
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lejann</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-red-200 dark:bg-red-800 border-b-2 border-red-500" />
                    <span>Fòtògraf</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-800 border-b-2 border-yellow-500" />
                    <span>Erè Gramè</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-orange-200 dark:bg-orange-800 border-b-2 border-orange-500" />
                    <span>Ponktyasyon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-800 border-b-2 border-blue-500" />
                    <span>Stil</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Konsey</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Kole oswa tape tèks ou nan bwat la</li>
                  <li>Klike "Verifye Gramè" pou analize</li>
                  <li>Pase sourit sou erè ki mare pou detay</li>
                  <li>Klike erè yo pou aplike koreksyon</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
