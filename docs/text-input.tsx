"use client"

import { useState } from "react"
import ExampleButtons from "./example-buttons"
import AudioPlayer from "./audio-player"
import { useTTS } from "@/hooks/use-tts"
import type { GenerateMetadata } from "@/lib/api"
import { LoadingButton } from "@/components/ui/loading-button"

export default function TextInput() {
  const [text, setText] = useState("")
  const maxChars = 500
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<GenerateMetadata | null>(null)
  const { isGenerating, error, generate } = useTTS()

  const handleGenerate = async () => {
    if (!text.trim()) return

    // Clean up previous audio URL to prevent memory leaks
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setMetadata(null)
    }

    const result = await generate(text)
    if (result) {
      setAudioUrl(result.audioUrl)
      setMetadata(result.metadata)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-6">
        <label className="block text-sm font-medium text-foreground mb-3">Tape tèks Kreyòl ou:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          placeholder="Ekri Tèks ou vle tande a isit la…"
          rows={6}
          className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          disabled={isGenerating}
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {text.length}/{maxChars} karaktè
          </div>
          <LoadingButton
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            loading={isGenerating}
          >
            {isGenerating ? "Ap Jenere..." : "Jenere Vwa"}
          </LoadingButton>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Metadata Display */}
        {metadata && (
          <div className="mt-3 p-3 bg-secondary/50 rounded-md">
            <p className="text-xs text-muted-foreground">
              Tan jenere: {metadata.total_time.toFixed(2)}s
            </p>
          </div>
        )}
      </div>

      <ExampleButtons onSelect={(example) => setText(example)} />

      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
    </div>
  )
}
