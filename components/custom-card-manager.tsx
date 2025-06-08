"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { CustomCardCreator } from "./custom-card-creator"
import { Plus, Edit, Trash2, X } from "lucide-react"
import type { Card as CardType } from "@/types"

interface CustomCardManagerProps {
  customCards: CardType[]
  onAddCard: (card: Omit<CardType, "id">) => void
  onEditCard: (id: string, card: Omit<CardType, "id">) => void
  onDeleteCard: (id: string) => void
  onClose: () => void
  language: string
  settings: any
}

export function CustomCardManager({
  customCards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onClose,
  language,
  settings,
}: CustomCardManagerProps) {
  const [showCreator, setShowCreator] = useState(false)
  const [editingCard, setEditingCard] = useState<CardType | null>(null)

  const isHighContrast = settings.highContrast

  const handleSaveCard = (cardData: Omit<CardType, "id">) => {
    if (editingCard) {
      onEditCard(editingCard.id, cardData)
      setEditingCard(null)
    } else {
      onAddCard(cardData)
    }
    setShowCreator(false)
  }

  const handleEditCard = (card: CardType) => {
    setEditingCard(card)
    setShowCreator(true)
  }

  const handleDeleteCard = (id: string) => {
    if (
      confirm(
        language === "sr"
          ? "Да ли сте сигурни да желите да обришете ову картицу?"
          : "Are you sure you want to delete this card?",
      )
    ) {
      onDeleteCard(id)
    }
  }

  // Group cards by category
  const cardsByCategory = customCards.reduce(
    (acc, card) => {
      if (!acc[card.category]) {
        acc[card.category] = []
      }
      acc[card.category].push(card)
      return acc
    },
    {} as Record<string, CardType[]>,
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div
        className={`rounded-lg shadow-2xl w-full max-w-4xl flex flex-col h-[95vh] sm:h-[85vh] sm:max-h-[700px] ${
          isHighContrast ? "bg-black text-white border-2 border-white" : "bg-white"
        }`}
      >
        {/* Header - Fixed */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0 ${
            isHighContrast ? "border-white" : "border-gray-200"
          }`}
        >
          <CardTitle className={`text-lg sm:text-xl ${isHighContrast ? "text-white" : "text-gray-900"}`}>
            {language === "sr" ? "Управљај прилагођеним картицама" : "Manage Custom Cards"}
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

        {/* Add Button - Fixed */}
        <div className={`p-4 sm:p-6 border-b flex-shrink-0 ${isHighContrast ? "border-white" : "border-gray-200"}`}>
          <Button
            onClick={() => {
              setEditingCard(null)
              setShowCreator(true)
            }}
            className={`w-full sm:w-auto ${
              isHighContrast ? "bg-white text-black hover:bg-gray-200" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === "sr" ? "Додај нову картицу" : "Add New Card"}
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {Object.keys(cardsByCategory).length === 0 ? (
              <div className={`text-center py-12 ${isHighContrast ? "text-gray-300" : "text-gray-500"}`}>
                <p className="text-base sm:text-lg mb-2">
                  {language === "sr" ? "Нема прилагођених картица" : "No custom cards yet"}
                </p>
                <p className="text-sm">
                  {language === "sr"
                    ? "Кликните 'Додај нову картицу' да направите своју прву картицу"
                    : "Click 'Add New Card' to create your first custom card"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(cardsByCategory).map(([category, cards]) => (
                  <div key={category}>
                    <h3
                      className={`text-base sm:text-lg font-semibold mb-3 capitalize ${
                        isHighContrast ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                      {cards.map((card) => (
                        <div
                          key={card.id}
                          className={`relative group border-2 rounded-lg p-3 transition-all duration-200 ${
                            isHighContrast
                              ? "border-white bg-gray-900 hover:bg-gray-800"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
                          }`}
                        >
                          {/* Card preview */}
                          <div className="flex flex-col items-center gap-2 mb-2">
                            <span className="text-2xl sm:text-3xl">{card.icon}</span>
                            <span
                              className={`text-xs sm:text-sm font-medium text-center leading-tight ${
                                isHighContrast ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {card.label}
                            </span>
                          </div>

                          {/* Action buttons - Always visible on mobile, hover on desktop */}
                          <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCard(card)}
                              className={`flex-1 h-8 text-xs p-1 ${
                                isHighContrast
                                  ? "text-white hover:bg-gray-700 border border-white"
                                  : "hover:bg-blue-100 text-blue-600"
                              }`}
                            >
                              <Edit className="w-3 h-3" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCard(card.id)}
                              className={`flex-1 h-8 text-xs p-1 ${
                                isHighContrast
                                  ? "text-white hover:bg-red-900 border border-white"
                                  : "hover:bg-red-100 text-red-600"
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom card creator modal */}
      {showCreator && (
        <CustomCardCreator
          onSave={handleSaveCard}
          onClose={() => {
            setShowCreator(false)
            setEditingCard(null)
          }}
          language={language}
          settings={settings}
        />
      )}
    </div>
  )
}
