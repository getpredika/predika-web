"use client"

import { useTTS } from "@/hooks/use-tts"
import { VoicePicker, type Voice } from "@/components/ui/voice-picker"
import { ModelPicker, type Model } from "@/components/ui/model-picker"

interface VoiceSettingsProps {
  isGenerating?: boolean
}

export default function VoiceSettings({ isGenerating = false }: VoiceSettingsProps) {
  const { models, speakers, settings, setSettings, isLoading, error } = useTTS()

  // Convert speakers to Voice format for the picker
  const voices: Voice[] = speakers.map((speaker) => ({
    id: speaker.id,
    name: speaker.name,
    gender: speaker.gender,
    description: speaker.description,
    previewUrl: speaker.previewUrl,
  }))

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-secondary rounded w-3/4" />
          <div className="h-10 bg-secondary rounded" />
          <div className="h-4 bg-secondary rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-sm font-medium text-foreground">Paramèt Vwa</h2>

      <div className="space-y-4">
        {/* Model Selection */}
        {models.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-foreground mb-2">Modèl:</label>
            <ModelPicker
              models={models}
              value={settings.model}
              onValueChange={(value) => setSettings({ ...settings, model: value })}
              disabled={isGenerating}
              placeholder="Chwazi yon modèl..."
            />
          </div>
        )}

        {/* Speaker Selection with Voice Picker */}
        {voices.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-foreground mb-2">Kalite Vwa:</label>
            <VoicePicker
              voices={voices}
              value={settings.speaker}
              onValueChange={(value) => setSettings({ ...settings, speaker: value })}
              disabled={isGenerating}
              placeholder="Chwazi yon vwa..."
            />
          </div>
        )}

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-foreground">Tanperati (Creativity)</label>
            <span className="text-xs font-semibold text-primary">{settings.temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: Number.parseFloat(e.target.value) })}
            disabled={isGenerating}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
          />
        </div>

        {/* Top P */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-foreground">Top P (Variety)</label>
            <span className="text-xs font-semibold text-primary">{settings.top_p.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={settings.top_p}
            onChange={(e) => setSettings({ ...settings, top_p: Number.parseFloat(e.target.value) })}
            disabled={isGenerating}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
          />
        </div>

        {/* Repetition Penalty */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-foreground">Repetition Penalty</label>
            <span className="text-xs font-semibold text-primary">{settings.repetition_penalty.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.1"
            value={settings.repetition_penalty}
            onChange={(e) => setSettings({ ...settings, repetition_penalty: Number.parseFloat(e.target.value) })}
            disabled={isGenerating}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
          />
        </div>

        {/* Max Tokens */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-foreground">Max Tokens</label>
            <span className="text-xs font-semibold text-primary">{settings.max_tokens}</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={settings.max_tokens}
            onChange={(e) => setSettings({ ...settings, max_tokens: Number.parseInt(e.target.value) })}
            disabled={isGenerating}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
