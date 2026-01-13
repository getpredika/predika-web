"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    AudioPlayerProvider,
    useAudioPlayer,
} from "@/components/ui/audio-player-core"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Orb, type AgentState } from "@/components/ui/orb"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface Voice {
    id: string
    name: string
    gender: string
    description: string
    previewUrl?: string
}

interface VoicePickerProps {
    voices: Voice[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    className?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
}

export function VoicePicker({
    voices,
    value,
    onValueChange,
    placeholder = "Chwazi yon vwa...",
    className,
    open,
    onOpenChange,
    disabled = false,
}: VoicePickerProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen

    const selectedVoice = voices.find((v) => v.id === value)

    return (
        <AudioPlayerProvider>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        disabled={disabled}
                        className={cn("w-full justify-between", className)}
                    >
                        {selectedVoice ? (
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="relative size-6 shrink-0 overflow-visible">
                                    <Orb agentState={null} className="absolute inset-0" />
                                </div>
                                <span className="truncate">{selectedVoice.description}</span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command>
                        <CommandInput placeholder="Chèche vwa..." />
                        <CommandList>
                            <CommandEmpty>Pa gen vwa.</CommandEmpty>
                            <CommandGroup>
                                {voices.map((voice) => (
                                    <VoicePickerItem
                                        key={voice.id}
                                        voice={voice}
                                        isSelected={value === voice.id}
                                        onSelect={() => {
                                            onValueChange?.(voice.id)
                                            // Keep dropdown open to allow preview testing
                                        }}
                                    />
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </AudioPlayerProvider>
    )
}

interface VoicePickerItemProps {
    voice: Voice
    isSelected: boolean
    onSelect: () => void
}

function VoicePickerItem({
    voice,
    isSelected,
    onSelect,
}: VoicePickerItemProps) {
    const [isHovered, setIsHovered] = React.useState(false)
    const player = useAudioPlayer()

    const preview = voice.previewUrl
    const audioItem = React.useMemo(
        () => (preview ? { id: voice.id, src: preview, data: voice } : null),
        [preview, voice]
    )

    const isPlaying =
        audioItem && player.isItemActive(audioItem.id) && player.isPlaying

    const handlePreview = React.useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()

            if (!audioItem) return

            if (isPlaying) {
                player.pause()
            } else {
                player.play(audioItem)
            }
        },
        [audioItem, isPlaying, player]
    )

    return (
        <CommandItem
            value={`${voice.id} ${voice.name} ${voice.description}`}
            onSelect={onSelect}
            className="flex items-center gap-3"
        >
            <div
                className="relative z-10 size-8 shrink-0 cursor-pointer overflow-visible"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handlePreview}
            >
                <Orb
                    agentState={isPlaying ? "talking" : null}
                    className="pointer-events-none absolute inset-0"
                />
                {preview && (isHovered || isPlaying) && (
                    <div className={cn(
                        "pointer-events-none absolute inset-0 flex size-8 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all duration-200",
                        isHovered && "bg-black/50"
                    )}>
                        {isPlaying ? (
                            <Pause className="size-3.5 text-white" />
                        ) : (
                            <Play className="size-3.5 text-white fill-white" />
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-medium">{voice.description}</span>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <span className="capitalize">{voice.gender === "male" ? "Gason" : "Fi"}</span>
                    <span>•</span>
                    <span className="opacity-70">{voice.name}</span>
                </div>
            </div>

            <Check
                className={cn(
                    "ml-auto size-4 shrink-0",
                    isSelected ? "opacity-100" : "opacity-0"
                )}
            />
        </CommandItem>
    )
}

export { VoicePickerItem }
