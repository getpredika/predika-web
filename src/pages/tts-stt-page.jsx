"use client"
import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Play, Square, Volume2, Copy, RotateCcw } from "lucide-react"
import SecondaryHeader from "@/components/secondary-header"

const TtsSttSimple = () => {
  const [ttsText, setTtsText] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sttText, setSttText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState("")

  const recognitionRef = useRef(null)

  const samplePhrases = [
    "Bonjou, kijan ou ye?",
    "Mèsi anpil pou èd ou.",
    "Mwen renmen Ayiti.",
    "Kote ou rete?",
    "Nou wè nou pita.",
    "Bondye beni ou.",
  ]


  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "ht" 

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript

            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setSttText((prev) => prev + finalTranscript + " ")
            setInterimText("")
          } else {
            setInterimText(interimTranscript)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          setInterimText("")
        }
      }
    }
  }, [])

 
  const handleSpeak = () => {
    if (!ttsText.trim()) return

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(ttsText)

  
    const voices = speechSynthesis.getVoices()
    const frenchVoice = voices.find((voice) => voice.lang.startsWith("fr"))

    if (frenchVoice) {
      utterance.voice = frenchVoice
    }

    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  // STT Functions
  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    }
  }

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const insertSamplePhrase = (phrase) => {
    setTtsText(phrase)
  }

  const transferText = () => {
    setTtsText(sttText)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f0faf7]">
        <SecondaryHeader />

      <main className="max-w-4xl mx-auto space-y-6 pt-40">

      

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#2d2d5f] text-white p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Volume2 className="h-5 w-5" />
                Tèks nan Vwa
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Egzanp fraz yo:</label>
                <div className="flex flex-wrap gap-2">
                  {samplePhrases.map((phrase, index) => (
                    <button
                      key={index}
                      onClick={() => insertSamplePhrase(phrase)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md border transition-colors"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>

             
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ekri tèks ou a:</label>
                <textarea
                  placeholder="Ekri sa ou vle di a..."
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                />
                <div className="text-xs text-gray-500">{ttsText.length} karaktè</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking || !ttsText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2d2d5f] hover:bg-[#2d2d5f] disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {isSpeaking ? "Ap pale..." : "Pale"}
                </button>

                {isSpeaking && (
                  <button
                    onClick={handleStop}
                    className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => copyToClipboard(ttsText)}
                  disabled={!ttsText.trim()}
                  className="px-3 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

            
              {isSpeaking && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Ap pale...</span>
                </div>
              )}
            </div>
          </div>

          {/* Speech-to-Text Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#2d2d5f] text-white p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Mic className="h-5 w-5" />
                Vwa nan Tèks
              </h2>
            </div>
            <div className="p-4 space-y-4">
            
              <div className="flex gap-2">
                {!isListening ? (
                  <button
                    onClick={handleStartListening}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2d2d5f] hover:bg-[#2d2d5f]-300 text-white rounded-lg transition-colors"
                  >
                    <Mic className="h-4 w-4" />
                    Kòmanse koute
                  </button>
                ) : (
                  <button
                    onClick={handleStopListening}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <MicOff className="h-4 w-4" />
                    Sispann koute
                  </button>
                )}

                <button
                  onClick={() => setSttText("")}
                  disabled={!sttText.trim()}
                  className="px-3 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

            
              {isListening && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Ap koute...</span>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full border">Kreyòl</span>
                </div>
              )}

              {/* Transcription Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sa ou di a:</label>
                <div className="min-h-[100px] p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                  {sttText}
                  {interimText && <span className="text-gray-400 italic">{interimText}</span>}
                  {!sttText && !interimText && <span className="text-gray-400 italic">Pale, nou pral tande ou...</span>}
                </div>
                <div className="text-xs text-gray-500">{sttText.length} karaktè</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(sttText)}
                  disabled={!sttText.trim()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  Kopye
                </button>

                <button
                  onClick={transferText}
                  disabled={!sttText.trim()}
                  title="Voye nan TTS"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 rounded-lg transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                  Voye
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TtsSttSimple
