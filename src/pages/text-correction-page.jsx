'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Copy, Check, Edit, RotateCcw } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import SecondaryHeader from "@/components/secondary-header.jsx";

export default function TextCorrectionPage() {
    const [text, setText] = useState("")
    const [originalText, setOriginalText] = useState("")
    const [model, setModel] = useState("hairobert-1.0")
    const [isChecking, setIsChecking] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isEditing, setIsEditing] = useState(true)

    const handleGrammarCheck = () => {
        setIsChecking(true)
        setIsEditing(false)
        setOriginalText(text)

        setTimeout(() => {
            console.log("Grammar check completed with model:", model)
            setIsChecking(false)
        }, 3000)
    }

    const handleClearText = useCallback(() => {
        setText("")
    }, [])

    const handleCopyText = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        })
    }, [text])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleRevert = () => {
        setText(originalText)
        setIsEditing(true)
    }

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const characterCount = text.length

    return (
        <div className="flex flex-col min-h-screen">
            <SecondaryHeader/>
            <main className="flex-grow bg-[#f0faf7] px-4 py-16 pt-40">
                <div className="container mx-auto">
                    {/*<div className="text-center mb-8">*/}
                    {/*    <h1 className="text-4xl font-bold text-[#2d2d5f] mb-3">*/}
                    {/*        Korije Gramè & Òtograf*/}
                    {/*    </h1>*/}
                    {/*    <p className="text-lg text-gray-600">*/}
                    {/*        Zouti ki baze sou AI pou korije òtograf ak gramè nan lang kreyòl*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
                        <div className="p-6 relative">
                            <div className="flex justify-between items-center mb-4 text-gray-600">
                                <Select defaultValue={model} onValueChange={setModel}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select model"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hairobert-1.0">HaiRobert-1.0</SelectItem>
                                        <SelectItem value="hairobert-2.1">HaiRobert-2.1</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleCopyText}
                                    variant="outline"
                                    size="icon"
                                    className={`ml-2 text-gray-400 bg-white hover:bg-gray-100 hover:text-[#2d2d5f] border-gray-300 ${isCopied ? 'bg-gray-100' : ''}`}
                                    aria-label={isCopied ? "Copied" : "Copy text"}
                                >
                                    {isCopied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                                </Button>
                            </div>

                            <div className="relative mb-4">
                                <Textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Tape oubyen kole tèks la isit la"
                                    className="min-h-[200px] sm:min-h-[300px] p-3 sm:p-4 text-base sm:text-lg text-gray-600 border-2 border-gray-200 rounded-lg focus:border-gray-200 pr-10 transition-colors resize-none"
                                    disabled={!isEditing}
                                />
                                {text && isEditing && (
                                    <button
                                        onClick={handleClearText}
                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        aria-label="Efase"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

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
                                            className="mr-2 h-5 w-5 inline-block"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M8 12L11 15L16 9"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                    {isChecking ? 'Tann...' : 'Korije'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )
}