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
    orbColors?: [string, string]
}

const DEFAULT_VOICE_ORB_COLORS: [string, string] = ["#CADCFC", "#A0B9D1"]

export function VoicePicker({
    voices,
    value,
    onValueChange,
    placeholder = "Chwazi yon vwa...",
    className,
    open,
    onOpenChange,
    disabled = false,
    orbColors = DEFAULT_VOICE_ORB_COLORS,
}: VoicePickerProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen

    const selectedVoice = voices.find((v) => v.id === value)

    const handleOpenChange = (open: boolean) => {
        if (setIsOpen) {
            setIsOpen(open)
        }
    }

    return (
        <AudioPlayerProvider>
            <Popover open={isOpen} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between h-12 px-3",
                            "border-input bg-background hover:bg-muted/50",
                            "shadow-sm",
                            className
                        )}
                    >
                        {selectedVoice ? (
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="relative w-8 h-8 shrink-0">
                                    <Orb agentState={null} colors={orbColors} className="absolute inset-0" />
                                </div>
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium truncate">
                                        {selectedVoice.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {selectedVoice.gender === "male" ? "Gason" : "Fi"} • {selectedVoice.description}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0 bg-white border shadow-md"
                    align="start"
                    sideOffset={4}
                >
                    <Command className="rounded-lg border-0 bg-white">
                        <CommandInput
                            placeholder="Chèche vwa..."
                            className="h-10 border-0"
                        />
                        <CommandList className="max-h-[220px] bg-white">
                            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                Pa gen vwa ki koresponn.
                            </CommandEmpty>
                            <CommandGroup className="p-1">
                                {voices.map((voice) => (
                                    <VoicePickerItem
                                        key={voice.id}
                                        voice={voice}
                                        isSelected={value === voice.id}
                                        onSelect={() => {
                                            onValueChange?.(voice.id)
                                            handleOpenChange(false)
                                        }}
                                        orbColors={orbColors}
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
    orbColors: [string, string]
}

function VoicePickerItem({
    voice,
    isSelected,
    onSelect,
    orbColors,
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
        (e: React.MouseEvent) => {
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

    const agentState: AgentState = isPlaying ? "talking" : (isHovered ? "thinking" : null)

    return (
        <CommandItem
            value={`${voice.id} ${voice.name} ${voice.description}`}
            onSelect={onSelect}
            className={cn(
                "flex items-center gap-3 py-2 px-2 cursor-pointer rounded-md",
                "aria-selected:bg-muted",
                isSelected && "bg-muted"
            )}
        >
            {/* Orb with play overlay */}
            <div
                className="relative z-10 w-8 h-8 shrink-0 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handlePreview}
            >
                <Orb
                    agentState={agentState}
                    colors={orbColors}
                    className="absolute inset-0"
                />
                {preview && (isHovered || isPlaying) && (
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center justify-center",
                            "rounded-full bg-black/40 backdrop-blur-sm transition-all duration-200",
                            "hover:bg-black/50"
                        )}
                    >
                        {isPlaying ? (
                            <Pause className="h-3 w-3 text-white" />
                        ) : (
                            <Play className="h-3 w-3 text-white fill-white" />
                        )}
                    </div>
                )}
            </div>

            {/* Voice info */}
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="font-medium text-sm text-foreground">
                    {voice.name}
                </span>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-medium">
                        {voice.gender === "male" ? "Gason" : "Fi"}
                    </span>
                    <span className="truncate opacity-70">
                        {voice.description}
                    </span>
                </div>
            </div>

            {/* Check mark */}
            <div className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full shrink-0",
                isSelected ? "bg-primary text-primary-foreground" : "opacity-0"
            )}>
                <Check className="h-3 w-3" />
            </div>
        </CommandItem>
    )
}
