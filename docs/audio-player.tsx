"use client"

import { Download } from "lucide-react"
import { useEffect, useMemo } from "react"
import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerSpeed,
  AudioPlayerTime,
  useAudioPlayer,
} from "@/components/ui/audio-player-core"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  audioUrl: string
  fileName?: string
}

export default function AudioPlayer({ audioUrl, fileName = "speech.wav" }: AudioPlayerProps) {
  return (
    <AudioPlayerProvider>
      <AudioPlayerContent audioUrl={audioUrl} fileName={fileName} />
    </AudioPlayerProvider>
  )
}

function AudioPlayerContent({ audioUrl, fileName }: AudioPlayerProps) {
  const player = useAudioPlayer()

  const audioItem = useMemo(
    () => ({
      id: "tts-audio",
      src: audioUrl,
      data: { fileName },
    }),
    [audioUrl, fileName]
  )

  useEffect(() => {
    // Auto-load the audio when URL changes
    player.setActiveItem(audioItem)
  }, [audioUrl, audioItem, player])

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = audioUrl
    a.download = fileName || "speech.wav"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Odyo Jenere</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="size-4" />
          Telechaje
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <AudioPlayerButton
          item={audioItem}
          variant="outline"
          size="icon"
          className="shrink-0"
        />
        <div className="flex flex-1 items-center gap-2">
          <AudioPlayerTime className="text-xs tabular-nums" />
          <AudioPlayerProgress className="flex-1" />
          <AudioPlayerDuration className="text-xs tabular-nums" />
          <AudioPlayerSpeed variant="ghost" size="icon-sm" />
        </div>
      </div>
    </div>
  )
}
