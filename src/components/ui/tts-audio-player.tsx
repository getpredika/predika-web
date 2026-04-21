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
import { Card, CardContent } from "@/components/ui/card"
import type { TTSGenerateMetadata } from "@/types/api"

interface TTSAudioPlayerProps {
    audioUrl: string
    fileName?: string
    metadata?: TTSGenerateMetadata | null | undefined
}

export function TTSAudioPlayer({
    audioUrl,
    fileName = "speech.wav",
    metadata,
}: TTSAudioPlayerProps) {
    return (
        <AudioPlayerProvider>
            <TTSAudioPlayerContent
                audioUrl={audioUrl}
                fileName={fileName}
                metadata={metadata}
            />
        </AudioPlayerProvider>
    )
}

function TTSAudioPlayerContent({
    audioUrl,
    fileName,
    metadata,
}: TTSAudioPlayerProps) {
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
        <Card className="border-secondary/30 bg-gradient-to-br from-white to-secondary/5">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground">
                        Odyo Jenere
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <Download className="h-4 w-4" />
                        Telechaje
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <AudioPlayerButton
                        item={audioItem}
                        variant="default"
                        size="icon"
                        className="shrink-0 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
                    />
                    <div className="flex flex-1 items-center gap-3">
                        <AudioPlayerTime className="text-xs w-10 text-right" />
                        <AudioPlayerProgress className="flex-1" />
                        <AudioPlayerDuration className="text-xs w-10" />
                        <AudioPlayerSpeed variant="ghost" size="icon" />
                    </div>
                </div>

                {metadata && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <div>
                                <span className="font-medium text-foreground/70">Tan Jenere:</span>{" "}
                                {metadata.totalTime.toFixed(2)}s
                            </div>
                            <div>
                                <span className="font-medium text-foreground/70">Vwa:</span>{" "}
                                {metadata.speaker}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
