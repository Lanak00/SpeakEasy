"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Save } from "lucide-react"
import type { Card as CardType } from "@/types"

interface CustomCardCreatorProps {
  onSave: (card: Omit<CardType, "id">) => void
  onClose: () => void
  language: string
  settings: any
}

export function CustomCardCreator({ onSave, onClose, language, settings }: CustomCardCreatorProps) {
  const [cardData, setCardData] = useState({
    icon: "",
    label: "",
    category: "",
    customCategory: "",
  })

  const isHighContrast = settings.highContrast

  // Predefined categories based on language
  const categories =
    language === "sr"
      ? [
          "храна",
          "пиће",
          "место",
          "превоз",
          "породица",
          "емоција",
          "акција",
          "предмет",
          "играчка",
          "животиња",
          "природа",
        ]
      : ["food", "drink", "place", "transport", "family", "emotion", "action", "object", "toy", "animal", "nature"]

  // Common emojis for quick selection
  const commonEmojis = [
    "😊",
    "😢",
    "😡",
    "😴",
    "🤗",
    "👋",
    "👍",
    "👎",
    "❤️",
    "⭐",
    "🍎",
    "🍌",
    "🍞",
    "🥛",
    "🍕",
    "🍰",
    "🍪",
    "🥤",
    "🧃",
    "🍯",
    "🏠",
    "🏫",
    "🏥",
    "🚗",
    "🚌",
    "✈️",
    "🚲",
    "⛵",
    "🎈",
    "🎁",
    "📱",
    "💻",
    "📚",
    "✏️",
    "🎨",
    "🎵",
    "⚽",
    "🏀",
    "🎮",
    "🧸",
    "🐕",
    "🐱",
    "🐰",
    "🐸",
    "🦋",
    "🐝",
    "🌞",
    "🌙",
    "⭐",
    "🌈",
    "👨",
    "👩",
    "👶",
    "👴",
    "👵",
    "👮",
    "👩‍⚕️",
    "👩‍🏫",
    "👩‍🍳",
    "👨‍🔧",
  ]

  const handleSave = () => {
    if (!cardData.icon || !cardData.label) {
      alert(language === "sr" ? "Молимо унесите икону и назив картице" : "Please enter both icon and label")
      return
    }

    const finalCategory = cardData.category === "custom" ? cardData.customCategory : cardData.category

    if (!finalCategory) {
      alert(language === "sr" ? "Молимо изаберите или унесите категорију" : "Please select or enter a category")
      return
    }

    onSave({
      icon: cardData.icon,
      label: cardData.label.trim(),
      category: finalCategory,
    })
  }

  const handleEmojiSelect = (emoji: string) => {
    setCardData((prev) => ({ ...prev, icon: emoji }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-[60]">
      <div
        className={`w-full max-w-2xl flex flex-col h-[95vh] sm:h-auto sm:max-h-[85vh] rounded-lg shadow-2xl ${
          isHighContrast ? "bg-black text-white border-2 border-white" : "bg-white"
        }`}
      >
        {/* Header - Fixed */}
        <div className={`border-b flex-shrink-0 ${isHighContrast ? "border-white" : "border-gray-200"}`}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-lg sm:text-xl ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                {language === "sr" ? "Направи нову картицу" : "Create New Card"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className={`${isHighContrast ? "text-white hover:bg-gray-800 border border-white" : ""} p-2`}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Icon Selection */}
            <div className="space-y-3">
              <Label className={`text-base sm:text-lg font-medium ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                {language === "sr" ? "Икона" : "Icon"}
              </Label>

              {/* Current selected icon */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 border-2 rounded-lg flex items-center justify-center text-2xl sm:text-3xl ${
                    isHighContrast ? "border-white bg-gray-900" : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {cardData.icon || "?"}
                </div>
                <Input
                  value={cardData.icon}
                  onChange={(e) => setCardData((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder={language === "sr" ? "Унесите емоји или икону" : "Enter emoji or icon"}
                  className={`flex-1 text-xl sm:text-2xl ${isHighContrast ? "bg-black text-white border-white" : ""}`}
                  maxLength={4}
                />
              </div>

              {/* Emoji picker */}
              <div className="space-y-2">
                <Label className={`text-sm ${isHighContrast ? "text-gray-300" : "text-gray-600"}`}>
                  {language === "sr" ? "Или изаберите из честих:" : "Or choose from common ones:"}
                </Label>
                <div
                  className={`grid grid-cols-8 sm:grid-cols-10 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg ${
                    isHighContrast ? "border-white" : "border-gray-300"
                  }`}
                >
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiSelect(emoji)}
                      className={`w-8 h-8 text-lg sm:text-xl hover:bg-blue-100 rounded transition-colors ${
                        cardData.icon === emoji ? "bg-blue-200" : ""
                      } ${isHighContrast ? "hover:bg-gray-800" : ""}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label className={`text-base sm:text-lg font-medium ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                {language === "sr" ? "Назив" : "Label"}
              </Label>
              <Input
                value={cardData.label}
                onChange={(e) => setCardData((prev) => ({ ...prev, label: e.target.value }))}
                placeholder={language === "sr" ? "Унесите назив картице" : "Enter card label"}
                className={`text-base sm:text-lg ${isHighContrast ? "bg-black text-white border-white" : ""}`}
                maxLength={20}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className={`text-base sm:text-lg font-medium ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                {language === "sr" ? "Категорија" : "Category"}
              </Label>
              <Select
                value={cardData.category}
                onValueChange={(value) => setCardData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={isHighContrast ? "bg-black text-white border-white" : ""}>
                  <SelectValue placeholder={language === "sr" ? "Изаберите категорију" : "Select category"} />
                </SelectTrigger>
                <SelectContent className={isHighContrast ? "bg-black text-white border-white" : ""}>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">{language === "sr" ? "Нова категорија..." : "New category..."}</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom category input */}
              {cardData.category === "custom" && (
                <Input
                  value={cardData.customCategory}
                  onChange={(e) => setCardData((prev) => ({ ...prev, customCategory: e.target.value }))}
                  placeholder={language === "sr" ? "Унесите нову категорију" : "Enter new category"}
                  className={`mt-2 ${isHighContrast ? "bg-black text-white border-white" : ""}`}
                  maxLength={15}
                />
              )}
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className={`text-base sm:text-lg font-medium ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                {language === "sr" ? "Преглед" : "Preview"}
              </Label>
              <div
                className={`border-2 rounded-lg p-4 ${
                  isHighContrast ? "border-white bg-gray-900" : "border-gray-300 bg-gray-50"
                }`}
              >
                <Button
                  variant={isHighContrast ? "outline" : "secondary"}
                  className={`h-20 w-32 flex flex-col items-center justify-center gap-2 ${
                    isHighContrast ? "border-white hover:bg-white hover:text-black" : "hover:bg-blue-100"
                  }`}
                  disabled
                >
                  <span className="text-2xl">{cardData.icon || "?"}</span>
                  <span className="text-sm font-medium">{cardData.label || "Label"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Footer - Fixed */}
        <div
          className={`flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t flex-shrink-0 ${
            isHighContrast ? "border-white" : "border-gray-200"
          }`}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={`${
              isHighContrast ? "text-white border-white hover:bg-gray-800" : ""
            } w-full sm:w-auto order-2 sm:order-1`}
          >
            {language === "sr" ? "Откажи" : "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            className={`${
              isHighContrast ? "bg-white text-black hover:bg-gray-200" : "bg-blue-600 hover:bg-blue-700"
            } w-full sm:w-auto order-1 sm:order-2`}
          >
            <Save className="w-4 h-4 mr-2" />
            {language === "sr" ? "Сачувај картицу" : "Save Card"}
          </Button>
        </div>
      </div>
    </div>
  )
}
