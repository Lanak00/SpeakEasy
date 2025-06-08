"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Card } from "@/types"

export function useCustomCards(language: string) {
  const [customCards, setCustomCards] = useLocalStorage<Card[]>(`speakeasy-custom-cards-${language}`, [])

  const addCustomCard = (cardData: Omit<Card, "id">) => {
    const newCard: Card = {
      ...cardData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setCustomCards((prev) => [...prev, newCard])
    return newCard
  }

  const editCustomCard = (id: string, cardData: Omit<Card, "id">) => {
    setCustomCards((prev) => prev.map((card) => (card.id === id ? { ...cardData, id } : card)))
  }

  const deleteCustomCard = (id: string) => {
    setCustomCards((prev) => prev.filter((card) => card.id !== id))
  }

  const getAllCards = (defaultCards: Card[]) => {
    return [...defaultCards, ...customCards]
  }

  return {
    customCards,
    addCustomCard,
    editCustomCard,
    deleteCustomCard,
    getAllCards,
  }
}
