"use client"

import { useLocalStorage } from "./use-local-storage"

export function useAccessibility() {
  const [settings, setSettings] = useLocalStorage("speakeasy-accessibility", {
    // Visual settings
    highContrast: false,
    largeText: false,
    largeIcons: false,
    fontSize: "medium",
    symbolDisplay: "both",

    // Interaction settings
    touchMode: false,
    keyboardNavigation: false,
    switchScanning: false,
    eyeTracking: false,
    autismFriendlyMode: false,
    readingAssistance: false,

    // Communication settings
    voiceEnabled: true,

    // AI Features
    enableAI: true,

    // Smart Home - NOW ENABLED BY DEFAULT
    enableSmartHome: true,
  })

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings)
  }

  // Helper functions to get computed styles
  const getTextSize = () => {
    if (settings.largeText) return "large"
    return settings.fontSize
  }

  const getIconSize = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "w-8 h-8"
        case "medium":
          return "w-10 h-10"
        case "large":
          return "w-12 h-12"
        case "extra-large":
          return "w-16 h-16"
        default:
          return "w-10 h-10"
      }
    }
    return "w-6 h-6"
  }

  const getButtonSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-sm p-2"
      case "medium":
        return "text-base p-3"
      case "large":
        return "text-lg p-4"
      case "extra-large":
        return "text-xl p-6"
      default:
        return "text-base p-3"
    }
  }

  const getCardSize = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "h-20"
        case "medium":
          return "h-24"
        case "large":
          return "h-32"
        case "extra-large":
          return "h-40"
        default:
          return "h-24"
      }
    }
    return "h-20"
  }

  const getThemeClasses = () => {
    let classes = ""

    if (settings.highContrast) {
      classes += " high-contrast"
    }

    if (settings.autismFriendlyMode) {
      classes += " autism-friendly"
    }

    if (settings.touchMode) {
      classes += " touch-mode"
    }

    return classes
  }

  return {
    settings,
    updateSettings,
    getTextSize,
    getIconSize,
    getButtonSize,
    getCardSize,
    getThemeClasses,
  }
}
