"use client"

import { Button } from "@/components/ui/button"
import type { Card } from "@/types"
import { X, Volume2, Trash2 } from "lucide-react"
import { useState } from "react"

interface SentenceBuilderProps {
  cards: Card[]
  onRemoveCard: (index: number) => void
  onClearSentence: () => void
  onSpeakSentence: (text: string) => void
  settings: any
  profile?: any
}

export function SentenceBuilder({
  cards,
  onRemoveCard,
  onClearSentence,
  onSpeakSentence,
  settings,
  profile,
}: SentenceBuilderProps) {
  const sentenceText = cards.map((card) => card.label).join(" ")
  const [isSpeaking, setIsSpeaking] = useState(false)

  const isSerbian = profile?.language === "sr"

  // Dynamic text size
  const getTextSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-sm"
      case "medium":
        return "text-base"
      case "large":
        return "text-lg"
      case "extra-large":
        return "text-xl"
      default:
        return "text-base"
    }
  }

  // Dynamic button size
  const getButtonSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-sm p-3"
      case "medium":
        return "text-base p-4"
      case "large":
        return "text-lg p-5"
      case "extra-large":
        return "text-xl p-6"
      default:
        return "text-base p-4"
    }
  }

  // Dynamic icon size
  const getIconSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "w-4 h-4"
      case "medium":
        return "w-5 h-5"
      case "large":
        return "w-6 h-6"
      case "extra-large":
        return "w-7 h-7"
      default:
        return "w-5 h-5"
    }
  }

  if (cards.length === 0) {
    return (
      <div
        className={`
        border-2 border-dashed rounded-lg p-8 text-center
        ${settings.highContrast ? "border-white text-white" : "border-gray-300 text-gray-500"}
        ${settings.readingAssistance ? "reading-assistance" : ""}
      `}
      >
        <p className={getTextSize()}>
          {isSerbian ? "Ваша реченица ће се појавити овде" : "Your sentence will appear here"}
        </p>
      </div>
    )
  }

  const handleSpeak = () => {
    setIsSpeaking(true)
    onSpeakSentence(sentenceText)

    // Reset speaking state after a reasonable time
    setTimeout(() => setIsSpeaking(false), Math.max(3000, sentenceText.length * 100))
  }

  return (
    <div
      className={`
      border-2 rounded-lg p-4 space-y-4
      ${settings.highContrast ? "border-white bg-gray-900" : "border-blue-200 bg-white shadow-sm"}
      ${settings.readingAssistance ? "reading-assistance" : ""}
    `}
    >
      <div className="flex flex-wrap gap-2">
        {cards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border-2
              ${settings.highContrast ? "bg-gray-800 border-white text-white" : "bg-blue-50 border-blue-200"}
            `}
          >
            <span className="text-lg" role="img" aria-label={card.label}>
              {card.icon}
            </span>
            <span className={`font-medium ${getTextSize()}`}>{card.label}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveCard(index)}
              className={`
                h-6 w-6 p-0 hover:bg-red-100
                ${settings.highContrast ? "hover:bg-red-900 text-white" : ""}
                ${settings.touchMode ? "min-h-[48px] min-w-[48px]" : ""}
              `}
            >
              <X className={getIconSize()} />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className={`
            flex items-center gap-2 ${isSpeaking ? "bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white
            ${getButtonSize()}
            ${settings.autismFriendlyMode ? "" : "transition-colors duration-200"}
          `}
        >
          <Volume2 className={`${getIconSize()} ${isSpeaking ? "animate-pulse" : ""}`} />
          {isSpeaking ? (isSerbian ? "Говорим..." : "Speaking...") : isSerbian ? "Изговори реченицу" : "Speak Sentence"}
        </Button>

        <Button
          onClick={onClearSentence}
          variant={settings.highContrast ? "outline" : "secondary"}
          className={`
            flex items-center gap-2
            ${getButtonSize()}
            ${settings.autismFriendlyMode ? "" : "transition-colors duration-200"}
          `}
        >
          <Trash2 className={getIconSize()} />
          {isSerbian ? "Обриши све" : "Clear All"}
        </Button>
      </div>

      {sentenceText && (
        <div
          className={`
          p-3 rounded-lg border
          ${settings.highContrast ? "bg-gray-800 border-white text-white" : "bg-gray-50 border-gray-200"}
          ${settings.readingAssistance ? "reading-assistance" : ""}
        `}
        >
          <p className={`font-medium ${getTextSize()}`}>"{sentenceText}"</p>
        </div>
      )}
    </div>
  )
}
