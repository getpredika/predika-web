"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
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

export interface Model {
    id: string
    name: string
    description?: string
}

interface ModelPickerProps {
    models: Model[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    className?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
}

export function ModelPicker({
    models,
    value,
    onValueChange,
    placeholder = "Chwazi yon modèl...",
    className,
    open,
    onOpenChange,
    disabled = false,
}: ModelPickerProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen

    const selectedModel = models.find((m) => m.id === value)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedModel ? (
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="relative size-6 shrink-0 overflow-visible">
                                <Orb agentState={null} className="absolute inset-0" colors={["#E5E7EB", "#9CA3AF"]} />
                            </div>
                            <span className="truncate">{selectedModel.name}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder="Chèche modèl..." />
                    <CommandList>
                        <CommandEmpty>Pa gen modèl.</CommandEmpty>
                        <CommandGroup>
                            {models.map((model) => (
                                <ModelPickerItem
                                    key={model.id}
                                    model={model}
                                    isSelected={value === model.id}
                                    onSelect={() => {
                                        onValueChange?.(model.id)
                                        // Keep dropdown open to allow selection review
                                    }}
                                />
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

interface ModelPickerItemProps {
    model: Model
    isSelected: boolean
    onSelect: () => void
}

function ModelPickerItem({
    model,
    isSelected,
    onSelect,
}: ModelPickerItemProps) {
    const [isHovered, setIsHovered] = React.useState(false)

    return (
        <CommandItem
            value={`${model.id} ${model.name} ${model.description || ""}`}
            onSelect={onSelect}
            className="flex items-center gap-3"
        >
            <div
                className="relative z-10 size-8 shrink-0 cursor-pointer overflow-visible"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Orb
                    agentState={isHovered ? "thinking" : null}
                    className="pointer-events-none absolute inset-0"
                    colors={["#E5E7EB", "#9CA3AF"]}
                />
            </div>

            <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-medium">{model.name}</span>
                {model.description && (
                    <span className="text-muted-foreground text-xs opacity-70">
                        {model.description}
                    </span>
                )}
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

export { ModelPickerItem }
