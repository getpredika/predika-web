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

const mockCorrections: Record<string, CorrectionResult> = {
  default: {
    originalText: "",
    correctedText: "",
    errors: [],
    segments: [],
  },
};

function generateMockCorrection(text: string): CorrectionResult {
  const errorPatterns: { pattern: RegExp; correction: string; type: GrammarError["type"]; explanation: string }[] = [
    { pattern: /\btheir\s+is\b/gi, correction: "there is", type: "grammar", explanation: "Use 'there' for location/existence, not 'their' (possessive)" },
    { pattern: /\bthier\b/gi, correction: "their", type: "spelling", explanation: "Correct spelling is 'their'" },
    { pattern: /\bteh\b/gi, correction: "the", type: "spelling", explanation: "Typo: 'teh' should be 'the'" },
    { pattern: /\brecieve\b/gi, correction: "receive", type: "spelling", explanation: "'i' before 'e' except after 'c'" },
    { pattern: /\boccured\b/gi, correction: "occurred", type: "spelling", explanation: "Double 'r' in 'occurred'" },
    { pattern: /\bdefinate\b/gi, correction: "definite", type: "spelling", explanation: "Correct spelling is 'definite'" },
    { pattern: /\bseperate\b/gi, correction: "separate", type: "spelling", explanation: "Correct spelling is 'separate'" },
    { pattern: /\baccomodate\b/gi, correction: "accommodate", type: "spelling", explanation: "Double 'c' and double 'm'" },
    { pattern: /\buntill\b/gi, correction: "until", type: "spelling", explanation: "Only one 'l' in 'until'" },
    { pattern: /\bwich\b/gi, correction: "which", type: "spelling", explanation: "Correct spelling is 'which'" },
    { pattern: /\bwoud\b/gi, correction: "would", type: "spelling", explanation: "Correct spelling is 'would'" },
    { pattern: /\bcoud\b/gi, correction: "could", type: "spelling", explanation: "Correct spelling is 'could'" },
    { pattern: /\bshoud\b/gi, correction: "should", type: "spelling", explanation: "Correct spelling is 'should'" },
    { pattern: /\byour\s+welcome\b/gi, correction: "you're welcome", type: "grammar", explanation: "Use 'you're' (you are) not 'your' (possessive)" },
    { pattern: /\byour\s+right\b/gi, correction: "you're right", type: "grammar", explanation: "Use 'you're' (you are) not 'your' (possessive)" },
    { pattern: /\bits\s+a\s+good\b/gi, correction: "it's a good", type: "grammar", explanation: "Use 'it's' (it is) not 'its' (possessive)" },
    { pattern: /\bI\s+has\b/gi, correction: "I have", type: "grammar", explanation: "Use 'have' with 'I', not 'has'" },
    { pattern: /\bhe\s+have\b/gi, correction: "he has", type: "grammar", explanation: "Use 'has' with third person singular" },
    { pattern: /\bshe\s+have\b/gi, correction: "she has", type: "grammar", explanation: "Use 'has' with third person singular" },
    { pattern: /\bthey\s+was\b/gi, correction: "they were", type: "grammar", explanation: "Use 'were' with plural subjects" },
    { pattern: /\bwe\s+was\b/gi, correction: "we were", type: "grammar", explanation: "Use 'were' with plural subjects" },
    { pattern: /\bme\s+and\s+him\b/gi, correction: "he and I", type: "grammar", explanation: "Use subject pronouns at the start of a sentence" },
    { pattern: /\balot\b/gi, correction: "a lot", type: "spelling", explanation: "'A lot' is two words" },
    { pattern: /\bdefinately\b/gi, correction: "definitely", type: "spelling", explanation: "Correct spelling is 'definitely'" },
    { pattern: /\bbeacuse\b/gi, correction: "because", type: "spelling", explanation: "Correct spelling is 'because'" },
    { pattern: /\bbeleive\b/gi, correction: "believe", type: "spelling", explanation: "Correct spelling is 'believe'" },
    { pattern: /\bfreind\b/gi, correction: "friend", type: "spelling", explanation: "'i' before 'e' in 'friend'" },
    { pattern: /\bgoverment\b/gi, correction: "government", type: "spelling", explanation: "Missing 'n' in 'government'" },
    { pattern: /\bweather\s+or\s+not\b/gi, correction: "whether or not", type: "grammar", explanation: "Use 'whether' for choices, 'weather' for climate" },
    { pattern: /\beffect\s+on\s+me\b/gi, correction: "affect me", type: "grammar", explanation: "'Affect' is the verb, 'effect' is the noun" },
    { pattern: /\b,\s*,\b/g, correction: ",", type: "punctuation", explanation: "Remove duplicate comma" },
    { pattern: /\s+\./g, correction: ".", type: "punctuation", explanation: "No space before period" },
    { pattern: /\s+,/g, correction: ",", type: "punctuation", explanation: "No space before comma" },
  ];

  const errors: GrammarError[] = [];
  let correctedText = text;
  const foundMatches: { start: number; end: number; original: string; errorIndex: number }[] = [];

  for (const { pattern, correction, type, explanation } of errorPatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const original = match[0];
      errors.push({
        original,
        corrected: correction,
        type,
        explanation,
      });
      foundMatches.push({
        start: match.index,
        end: match.index + original.length,
        original,
        errorIndex: errors.length - 1,
      });
      correctedText = correctedText.replace(original, correction);
    }
  }

  foundMatches.sort((a, b) => a.start - b.start);

  const segments: CorrectionResult["segments"] = [];
  let lastEnd = 0;

  for (const match of foundMatches) {
    if (match.start > lastEnd) {
      segments.push({ text: text.slice(lastEnd, match.start), isError: false });
    }
    segments.push({ text: match.original, isError: true, errorIndex: match.errorIndex });
    lastEnd = match.end;
  }

  if (lastEnd < text.length) {
    segments.push({ text: text.slice(lastEnd), isError: false });
  }

  if (segments.length === 0 && text.length > 0) {
    segments.push({ text, isError: false });
  }

  return {
    originalText: text,
    correctedText,
    errors,
    segments,
  };
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
          <p className="text-xs text-primary">Click to apply correction</p>
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
      toast({ title: "Please upload a .txt file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      setResult(null);
      setIsEditing(true);
      setUndoStack([]);
      toast({ title: "File loaded", description: `Loaded ${file.name}` });
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
    toast({ title: "Downloaded", description: "Text saved as corrected_text.txt" });
  };

  const checkGrammar = useCallback(async () => {
    if (!inputText.trim()) {
      toast({ title: "Please enter some text", variant: "destructive" });
      return;
    }

    setIsChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
    
    const correction = generateMockCorrection(inputText);
    setResult(correction);
    setIsEditing(false);
    setIsChecking(false);

    if (correction.errors.length === 0) {
      toast({ title: "No errors found", description: "Your text looks great!" });
    } else {
      toast({ 
        title: `Found ${correction.errors.length} issue${correction.errors.length > 1 ? 's' : ''}`, 
        description: "Click on highlighted text to apply corrections" 
      });
    }
  }, [inputText, toast]);

  const applyCorrection = (segmentIndex: number, corrected: string) => {
    if (result) {
      // Save current state to undo stack
      const originalSegment = result.segments[segmentIndex];
      setUndoStack(prev => [...prev, {
        segments: [...result.segments],
        errors: [...result.errors],
        description: `"${originalSegment.text}" → "${corrected}"`
      }]);

      const newSegments = [...result.segments];
      newSegments[segmentIndex] = { text: corrected, isError: false };
      const newText = newSegments.map(s => s.text).join("");
      setInputText(newText);
      const newResult = generateMockCorrection(newText);
      setResult(newResult);
      toast({ title: "Correction applied" });
    }
  };

  const applyAllCorrections = () => {
    if (result && result.errors.length > 0) {
      // Save current state to undo stack
      setUndoStack(prev => [...prev, {
        segments: [...result.segments],
        errors: [...result.errors],
        description: "Apply all corrections"
      }]);

      setInputText(result.correctedText);
      setResult({
        ...result,
        originalText: result.correctedText,
        errors: [],
        segments: [{ text: result.correctedText, isError: false }],
      });
      toast({ title: "All corrections applied" });
    }
  };

  const undoLastChange = () => {
    if (undoStack.length === 0) return;
    
    const lastState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    const newText = lastState.segments.map(s => s.text).join("");
    setInputText(newText);
    setResult({
      originalText: newText,
      correctedText: newText,
      errors: lastState.errors,
      segments: lastState.segments
    });
    toast({ title: "Undone", description: lastState.description });
  };

  const copyText = () => {
    const textToCopy = result?.correctedText || inputText;
    navigator.clipboard.writeText(textToCopy);
    toast({ title: "Copied to clipboard" });
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
          <Link href="/app">
            <Button variant="ghost" className="mb-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Grammar Corrector</h1>
              <p className="text-muted-foreground">Fix spelling and grammar errors in your text</p>
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
                <CardTitle>{isEditing ? "Enter Your Text" : "Corrected Text"}</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? "Paste or type your text below" 
                    : result && result.errors.length > 0 
                      ? "Click on highlighted errors to apply corrections"
                      : "No errors found"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text here to check for grammar and spelling errors...

Try typing: 'Their is alot of things I beleive we shoud do. Me and him went to teh store.'"
                    className="min-h-[300px] text-base"
                    data-testid="input-text"
                  />
                ) : (
                  <div 
                    className="min-h-[300px] p-3 rounded-md border bg-background leading-relaxed text-base whitespace-pre-wrap"
                    data-testid="result-text"
                  >
                    {result?.segments.map((segment, index) => (
                      segment.isError && segment.errorIndex !== undefined ? (
                        <ErrorHighlight 
                          key={index}
                          text={segment.text}
                          error={result.errors[segment.errorIndex]}
                          segmentIndex={index}
                          onApplyCorrection={applyCorrection}
                        />
                      ) : (
                        <span key={index}>{segment.text}</span>
                      )
                    ))}
                    {result?.errors.length === 0 && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-4">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Your text is error-free!</span>
                      </div>
                    )}
                  </div>
                )}

                {!isEditing && Object.keys(errorCounts).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {errorCounts.spelling && (
                      <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                        {errorCounts.spelling} Spelling
                      </Badge>
                    )}
                    {errorCounts.grammar && (
                      <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
                        {errorCounts.grammar} Grammar
                      </Badge>
                    )}
                    {errorCounts.punctuation && (
                      <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                        {errorCounts.punctuation} Punctuation
                      </Badge>
                    )}
                    {errorCounts.style && (
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                        {errorCounts.style} Style
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
                            Checking...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Check Grammar
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={editText} data-testid="button-edit">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        {undoStack.length > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={undoLastChange} data-testid="button-undo">
                                <Undo2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">
                              Undo ({undoStack.length})
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {result && result.errors.length > 0 && (
                          <Button onClick={applyAllCorrections} data-testid="button-apply-all">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Apply All
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
                          Upload .txt
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
                        Copy
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
                        Download .txt
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={reset} data-testid="button-reset">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-zinc-900 border shadow-lg">
                        Clear
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {inputText.length} characters | {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
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
                <CardTitle className="text-base">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-red-200 dark:bg-red-800 border-b-2 border-red-500" />
                    <span>Spelling Error</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-800 border-b-2 border-yellow-500" />
                    <span>Grammar Error</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-orange-200 dark:bg-orange-800 border-b-2 border-orange-500" />
                    <span>Punctuation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-800 border-b-2 border-blue-500" />
                    <span>Style</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Paste or type your text in the box</li>
                  <li>Click "Check Grammar" to analyze</li>
                  <li>Hover over highlighted errors for details</li>
                  <li>Click errors to apply corrections</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
