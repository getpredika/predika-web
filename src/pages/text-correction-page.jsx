'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Copy, Check, Edit, RotateCcw, Zap, Upload } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import SecondaryHeader from "@/components/secondary-header"
import { correctText } from "@/utils/api"

export default function TextCorrectionPage() {
    const [text, setText] = useState("")
    const [originalText, setOriginalText] = useState("")
    const [corrections, setCorrections] = useState([])
    const [model, setModel] = useState("hairobert-1.0")
    const [isChecking, setIsChecking] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isEditing, setIsEditing] = useState(true)
    const [activeCorrection, setActiveCorrection] = useState(null)
    const [error, setError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleGrammarCheck = useCallback(async () => {
        if (!text.trim()) {
            setError("Tanpri antre yon tèks pou korije.");
            return;
        }

        if (text.trim().length > 800) {
            setError("Tèks la twò long. Nou pran premye 800 karaktè yo sèlman.");
            return;
        }

        setIsChecking(true)
        setIsEditing(false)
        setOriginalText(text)

        try {
            const response = await correctText(text)
            const responseData = response.data

            if (responseData && responseData.corrected_text) {
                setCorrections(responseData.modifications)
                setText(responseData.corrected_text)
                setError(null);
            } else {
                setError("Yon erè fèt pandan nap korije tèks ou a.");
            }
        } catch (error) {
            setError(error || "Yon erè fèt pandan nap korije tèks ou a.")
            setIsEditing(true);
        } finally {
            setIsChecking(false)
        }
    }, [text, model])

    const handleClearText = useCallback(() => {
        setText("")
        setCorrections([])
    }, [])

    const handleCopyText = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        })
    }, [text])

    const handleEdit = useCallback(() => {
        setIsEditing(true)
    }, [])

    const handleRevert = useCallback(() => {
        setText(originalText)
        setCorrections([])
        setIsEditing(true)
    }, [originalText])

    const handleUndo = useCallback((original) => {
        setText(text.replace(corrections.find(c => c.original === original).corrected, original))
        setCorrections(corrections.filter(c => c.original !== original))
        setActiveCorrection(null)
    }, [text, corrections])

    const handleFileUpload = useCallback(async (event) => {
        setError(null);
        setIsUploading(true);

        const file = event.target.files[0];
        if (!file) {
            setIsUploading(false);
            return;
        }

        const fileType = file.type;
        const reader = new FileReader();

        reader.onload = async (e) => {
            let content = "";

            try {
                if (fileType === "application/pdf") {
                    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
                    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

                    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise;
                    let extractedText = "";

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        extractedText += textContent.items.map((item) => item.str).join(" ");
                    }
                    content = extractedText;
                } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    const mammoth = await import("mammoth");
                    const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                    content = result.value;
                } else if (fileType === "text/plain") {
                    content = e.target.result;
                } else {
                    setError("Nou pa sipòte tip fichye sa. Tanpri vini ak yon fichye .txt, .pdf oswa .docx.");
                    return;
                }

                if (content.length > 800) {
                    content = content.slice(0, 800);
                    setError("Tèks la twò long. Nou pran premye 800 karaktè yo sèlman.");
                }

                setText(content);
                setIsUploading(false);
            } catch (error) {
                setError("Yon erè pase pandan nou ap trete fichye a. " + error.message);
            }
        };

        if (fileType === "application/pdf" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    }, []);

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const characterCount = text.length

    const HighlightedText = () => {
        if (corrections.length === 0) return <p>{text}</p>

        let result = []
        let lastIndex = 0

        corrections.forEach((correction, index) => {
            const startIndex = text.indexOf(correction.corrected, lastIndex)
            if (startIndex !== -1) {
                result.push(text.slice(lastIndex, startIndex))
                result.push(
                    <Popover key={index} open={activeCorrection === correction.original} onOpenChange={(open) => setActiveCorrection(open ? correction.original : null)}>
                        <PopoverTrigger asChild>
                            <button
                                className="inline-flex text-[#40c4a7] underline decoration-wavy decoration-[#40c4a7] underline-offset-4 hover:text-[#40c4a7]/70 focus:outline-none focus:ring-2 focus:ring-[#40c4a7]/70 focus:ring-offset-2 rounded px-1 -mx-1"
                            >
                                {correction.corrected}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="start">
                            <Card>
                                <CardContent className="p-0">
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#40c4a7] uppercase">
                                            <Zap className="h-4 w-4" />
                                            erè òtograf
                                        </div>
                                        <div className="flex items-center gap-2 text-base">
                                            <span className="line-through text-gray-500">{correction.original}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className="text-[#40c4a7] font-medium">{correction.corrected}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{correction.explanation}</p>
                                    </div>
                                    <div className="border-t p-2 bg-gray-50">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-gray-600 hover:text-gray-900"
                                            onClick={() => handleUndo(correction.original)}
                                        >
                                            <svg
                                                className="mr-2 h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M9 14L4 9l5-5" />
                                                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                                            </svg>
                                            Retounen a &#39;{correction.original}&#39;
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </PopoverContent>
                    </Popover>
                )
                lastIndex = startIndex + correction.corrected.length
            }
        })

        result.push(text.slice(lastIndex))
        return <>{result}</>
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f0faf7]">
            <SecondaryHeader />
            <main className="flex-grow px-4 py-16 pt-40">
                <div className="container mx-auto">
                    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
                        <CardContent className="p-6 relative">
                            <div className="flex justify-between items-center mb-4">
                                <Select defaultValue={model} onValueChange={setModel}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hairobert-1.0">HaiRobert-1.0</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center">
                                    <Button
                                        onClick={triggerFileUpload}
                                        variant="outline"
                                        size="icon"
                                        className="mr-2 text-gray-400 bg-white hover:bg-gray-100 hover:text-[#2d2d5f] border-gray-300"
                                        aria-label="Upload file"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                                            />
                                        ) : (
                                            <Upload className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".txt,.pdf,.doc,.docx"
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={handleCopyText}
                                        variant="outline"
                                        size="icon"
                                        className={`text-gray-400 bg-white hover:bg-gray-100 hover:text-[#2d2d5f] border-gray-300 ${isCopied ? 'bg-gray-100' : ''}`}
                                        aria-label={isCopied ? "Copied" : "Copy text"}
                                    >
                                        {isCopied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                                    </Button>
                                </div>
                            </div>

                            <div className="relative mb-4">
                                {isEditing ? (
                                    <Textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Tape oubyen kole tèks la isit la"
                                        className="min-h-[200px] sm:min-h-[300px] p-3 sm:p-4 text-base sm:text-lg text-gray-600 border-2 border-gray-200 rounded-lg focus:border-gray-200 pr-10 transition-colors resize-none"
                                    />
                                ) : (
                                    <div className="min-h-[200px] sm:min-h-[300px] p-3 sm:p-4 text-base sm:text-lg border-2 border-gray-200 rounded-lg overflow-auto">
                                        <HighlightedText />
                                    </div>
                                )}
                                {text && isEditing && (
                                    <Button
                                        onClick={handleClearText}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label="Efase"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm mb-4">{error.toString()}</p>
                            )}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                {isEditing ? (
                                    <p className="text-sm text-gray-500 order-2 sm:order-1" aria-live="polite">
                                        {characterCount} karaktè, {wordCount} mo
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2 order-2 sm:order-1 w-full sm:w-auto">
                                        <Button
                                            onClick={handleEdit}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 sm:flex-none items-center text-[#2d2d5f] bg-white hover:bg-gray-100 hover:text-[#2d2d5f] border-gray-300"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Modifye
                                        </Button>
                                        <Button
                                            onClick={handleRevert}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 sm:flex-none items-center text-[#2d2d5f] bg-white hover:bg-gray-100 hover:text-[#2d2d5f] border-gray-300"
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Retounen
                                        </Button>
                                    </div>
                                )}
                                <Button
                                    onClick={handleGrammarCheck}
                                    className="w-full sm:w-auto bg-[#2d2d5f] text-white hover:bg-[#2d2d5f]/90 order-1 sm:order-2"
                                    disabled={isChecking || !isEditing}
                                >
                                    {isChecking ? (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                        />
                                    ) : (
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 12l2 2 4-4" />
                                        </svg>
                                    )}
                                    {isChecking ? 'Tann...' : 'Korije'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}