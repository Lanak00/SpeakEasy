"use client"

import { Button } from "@/components/ui/button"
import type { Card } from "@/types"
import { mockCards } from "@/data/mock-cards"
import { useCustomCards } from "@/hooks/use-custom-cards"
import { SmartHomeCards } from "./smart-home-cards"

interface CardGridProps {
  onCardSelect: (card: Card) => void
  settings: any
  language: string
}

export function CardGrid({ onCardSelect, settings, language }: CardGridProps) {
  const { getAllCards } = useCustomCards(language)

  const defaultCards = mockCards[language as keyof typeof mockCards] || mockCards.en
  const cards = getAllCards(defaultCards)

  // Dynamic grid columns based on settings
  const getGridCols = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
        case "medium":
          return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        case "large":
          return "grid-cols-2 sm:grid-cols-3"
        case "extra-large":
          return "grid-cols-1 sm:grid-cols-2"
        default:
          return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
      }
    }
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
  }

  // Dynamic card height based on settings
  const getCardHeight = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "h-24"
        case "medium":
          return "h-28"
        case "large":
          return "h-36"
        case "extra-large":
          return "h-44"
        default:
          return "h-28"
      }
    }
    return settings.touchMode ? "h-24" : "h-20"
  }

  // Dynamic text size
  const getTextSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-xs"
      case "medium":
        return "text-sm"
      case "large":
        return "text-base"
      case "extra-large":
        return "text-lg"
      default:
        return "text-sm"
    }
  }

  // Dynamic icon size
  const getIconSize = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "text-2xl"
        case "medium":
          return "text-3xl"
        case "large":
          return "text-4xl"
        case "extra-large":
          return "text-5xl"
        default:
          return "text-3xl"
      }
    }
    return "text-2xl"
  }

  // Show icons, text, or both based on symbol display setting
  const shouldShowIcon = settings.symbolDisplay === "icons" || settings.symbolDisplay === "both"
  const shouldShowText = settings.symbolDisplay === "text" || settings.symbolDisplay === "both"

  return (
    <div className="space-y-6">
      <h2 className={`font-semibold ${settings.highContrast ? "text-white" : "text-gray-800"} ${getTextSize()}`}>
        Choose a card to start building your sentence
      </h2>

      {/* Smart Home Cards - Show when enabled */}
      {settings.enableSmartHome && (
        <SmartHomeCards onCardSelect={onCardSelect} settings={settings} language={language} />
      )}

      {/* Regular Cards */}
      <div className={`grid gap-4 ${getGridCols()}`}>
        {cards.map((card) => (
          <Button
            key={card.id}
            onClick={() => onCardSelect(card)}
            variant={settings.highContrast ? "outline" : "secondary"}
            className={`
              card-button flex flex-col items-center justify-center gap-2 p-4
              ${getCardHeight()}
              ${
                settings.highContrast
                  ? "border-2 border-white hover:bg-white hover:text-black"
                  : "hover:bg-blue-100 border-2 border-transparent hover:border-blue-300 bg-white shadow-sm rounded-xl"
              }
              ${settings.autismFriendlyMode ? "" : "transition-all duration-200 transform hover:scale-105"}
              ${settings.touchMode ? "min-h-[60px]" : ""}
              ${settings.readingAssistance ? "reading-assistance" : ""}
            `}
          >
            {shouldShowIcon && (
              <span
                className={`${getIconSize()} ${settings.highContrast ? "" : "drop-shadow-sm"}`}
                role="img"
                aria-label={card.label}
              >
                {card.icon}
              </span>
            )}
            {shouldShowText && (
              <span
                className={`font-medium text-center leading-tight ${getTextSize()} ${
                  settings.highContrast ? "" : "text-gray-700"
                }`}
              >
                {card.label}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
