"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, X, Loader2 } from "lucide-react"
import type { Card as CardType } from "@/types"

interface AISuggestionsProps {
  selectedCards: CardType[]
  onSpeakSuggestion: (text: string) => void
  onClose: () => void
  settings: any
  language: string
}

export function AISuggestions({ selectedCards, onSpeakSuggestion, onClose, settings, language }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isAiGenerated, setIsAiGenerated] = useState(true)

  useEffect(() => {
    generateSuggestions()
  }, [selectedCards])

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      const cardLabels = selectedCards.map((card) => card.label).join(" ")
      const cardCategories = [...new Set(selectedCards.map((card) => card.category))]

      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: cardLabels,
          language: language,
          categories: cardCategories,
          context: getContextualHints(selectedCards),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions)
        setIsAiGenerated(data.aiGenerated !== false)

        // Show a subtle indicator if fallback suggestions were used
        if (data.fallback) {
          console.log("Using fallback suggestions due to API error")
          setIsAiGenerated(false)
        }
      } else {
        // Fallback suggestions
        setSuggestions(getFallbackSuggestions(cardLabels, language))
        setIsAiGenerated(false)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      // Fallback suggestions
      const cardLabels = selectedCards.map((card) => card.label).join(" ")
      setSuggestions(getFallbackSuggestions(cardLabels, language))
    }
    setLoading(false)
  }

  const getContextualHints = (cards: CardType[]): string => {
    const categories = cards.map((card) => card.category)
    const hasFood = categories.includes("food") || categories.includes("храна")
    const hasEmotion = categories.includes("emotion") || categories.includes("емоција")
    const hasFamily = categories.includes("family") || categories.includes("породица")
    const hasAction = categories.includes("action") || categories.includes("акција")

    if (hasFood && hasAction) return "meal_request"
    if (hasEmotion && hasFamily) return "emotional_expression"
    if (hasAction) return "activity_request"
    return "general_communication"
  }

  const getFallbackSuggestions = (cards: string, lang: string): string[] => {
    if (lang === "sr") {
      return [`${cards} молим`, `Желим ${cards}`, `${cards} је добро`]
    }
    return [`I want ${cards} please`, `Can I have ${cards}?`, `${cards} is good`]
  }

  return (
    <Card
      className={`
      border-2 shadow-lg
      ${settings.highContrast ? "border-white bg-gray-900 text-white" : "border-purple-200 bg-white"}
    `}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle
            className={`
              ${settings.fontSize === "large" ? "text-xl" : "text-lg"}
              ${settings.highContrast ? "text-white" : "text-purple-800"}
            `}
          >
            AI Suggestions
          </CardTitle>
          {isAiGenerated && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">AI Powered</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={settings.highContrast ? "text-white hover:bg-gray-800" : ""}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-2">Creating smart suggestions...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No suggestions available. Try selecting different cards.</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <Button
              key={index}
              onClick={() => onSpeakSuggestion(suggestion)}
              variant={settings.highContrast ? "outline" : "secondary"}
              className={`
                w-full text-left justify-start p-4 h-auto min-h-[60px]
                ${settings.fontSize === "large" ? "text-lg" : ""}
                ${
                  settings.highContrast
                    ? "border-white hover:bg-white hover:text-black"
                    : "hover:bg-purple-50 border-2 border-transparent hover:border-purple-300"
                }
                transition-all duration-200
              `}
            >
              <Volume2 className="w-5 h-5 mr-3 flex-shrink-0 text-green-600" />
              <span className="text-left leading-relaxed">{suggestion}</span>
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  )
}
