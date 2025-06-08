"use client"

import { useState, useEffect } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { CardGrid } from "@/components/card-grid"
import { SentenceBuilder } from "@/components/sentence-builder"
import { AISuggestions } from "@/components/ai-suggestions"
import { Settings } from "@/components/settings"
import { CaregiverLogin } from "@/components/caregiver-login"
import { CaregiverDashboard } from "@/components/caregiver-dashboard"
import { CaregiverSettings } from "@/components/caregiver-settings"
import { Button } from "@/components/ui/button"
import { SettingsIcon, Volume2, User } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useCustomCards } from "@/hooks/use-custom-cards"
import type { Card } from "@/types"
import { speak } from "@/utils/speech-utils"
import { SmartHomePanel } from "@/components/smart-home-panel"

type Screen = "welcome" | "home" | "settings" | "caregiver-login" | "caregiver-dashboard"

export default function SpeakEasyApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCaregiverSettings, setShowCaregiverSettings] = useState(false)
  const [profile, setProfile] = useLocalStorage("speakeasy-profile", null)
  const [caregiver, setCaregiver] = useLocalStorage("speakeasy-caregiver", null)
  const { settings, updateSettings, getThemeClasses, getTextSize, getButtonSize } = useAccessibility()
  const [showSmartHome, setShowSmartHome] = useState(false)

  // Custom cards functionality
  const { customCards, addCustomCard, editCustomCard, deleteCustomCard } = useCustomCards(profile?.language || "en")

  useEffect(() => {
    if (profile && !caregiver) {
      setCurrentScreen("home")
    } else if (profile && caregiver) {
      setCurrentScreen("caregiver-dashboard")
    }
  }, [profile, caregiver])

  // Apply accessibility classes to body
  useEffect(() => {
    const body = document.body
    const classes = getThemeClasses()

    // Remove existing accessibility classes
    body.classList.remove(
      "high-contrast",
      "autism-friendly",
      "touch-mode",
      "switch-scanning",
      "eye-tracking",
      "keyboard-navigation",
      "reading-assistance",
    )

    // Add current accessibility classes
    if (settings.highContrast) body.classList.add("high-contrast")
    if (settings.autismFriendlyMode) body.classList.add("autism-friendly")
    if (settings.touchMode) body.classList.add("touch-mode")
    if (settings.switchScanning) body.classList.add("switch-scanning")
    if (settings.eyeTracking) body.classList.add("eye-tracking")
    if (settings.keyboardNavigation) body.classList.add("keyboard-navigation")
    if (settings.readingAssistance) body.classList.add("reading-assistance")

    return () => {
      // Cleanup on unmount
      body.classList.remove(
        "high-contrast",
        "autism-friendly",
        "touch-mode",
        "switch-scanning",
        "eye-tracking",
        "keyboard-navigation",
        "reading-assistance",
      )
    }
  }, [settings, getThemeClasses])

  const handleCardSelect = (card: Card) => {
    // Check if it's a smart home card
    if (card.id.startsWith("smart-")) {
      setShowSmartHome(true)
      return
    }

    setSelectedCards((prev) => [...prev, card])
    setShowSuggestions(true)
  }

  const handleRemoveCard = (index: number) => {
    setSelectedCards((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClearSentence = () => {
    setSelectedCards([])
    setShowSuggestions(false)
  }

  const handleSpeakSentence = (text: string) => {
    speak({
      text,
      language: profile?.language || "en",
      onError: (error) => {
        console.error("Speech error:", error)
      },
    })
  }

  const handleCaregiverLogin = (caregiverData: any) => {
    setCaregiver(caregiverData)
    setCurrentScreen("caregiver-dashboard")
  }

  const handleCaregiverLogout = () => {
    setCaregiver(null)
    setCurrentScreen("home")
  }

  // Screen routing
  if (currentScreen === "welcome") {
    return (
      <WelcomeScreen
        onComplete={(profileData) => {
          setProfile(profileData)
          setCurrentScreen("home")
        }}
      />
    )
  }

  if (currentScreen === "caregiver-login") {
    return <CaregiverLogin onLogin={handleCaregiverLogin} onBack={() => setCurrentScreen("home")} />
  }

  if (currentScreen === "caregiver-dashboard") {
    return (
      <>
        <CaregiverDashboard
          caregiver={caregiver}
          profile={profile}
          settings={settings}
          customCards={customCards}
          onAddCustomCard={addCustomCard}
          onEditCustomCard={editCustomCard}
          onDeleteCustomCard={deleteCustomCard}
          onOpenSettings={() => setShowCaregiverSettings(true)}
          onLogout={handleCaregiverLogout}
          onBackToApp={() => setCurrentScreen("home")}
        />
        {showCaregiverSettings && (
          <CaregiverSettings
            profile={profile}
            settings={settings}
            onUpdateProfile={setProfile}
            onUpdateSettings={updateSettings}
            onClose={() => setShowCaregiverSettings(false)}
          />
        )}
      </>
    )
  }

  if (currentScreen === "settings") {
    return (
      <Settings
        profile={profile}
        settings={settings}
        onUpdateProfile={setProfile}
        onUpdateSettings={updateSettings}
        onBack={() => setCurrentScreen("home")}
      />
    )
  }

  const isSerbian = profile?.language === "sr"

  // Dynamic text size for main interface
  const getMainTextSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-xl"
      case "medium":
        return "text-2xl"
      case "large":
        return "text-3xl"
      case "extra-large":
        return "text-4xl"
      default:
        return "text-2xl"
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        settings.highContrast ? "bg-black text-white" : "bg-gradient-to-br from-blue-50 to-purple-50"
      } ${getThemeClasses()}`}
    >
      {/* Header */}
      <header className={`p-4 border-b-2 ${settings.highContrast ? "border-white" : "border-blue-200"}`}>
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Volume2 className={`w-8 h-8 ${settings.highContrast ? "text-white" : "text-blue-600"}`} />
            <h1 className={`font-bold ${getMainTextSize()} ${settings.highContrast ? "text-white" : "text-blue-800"}`}>
              SpeakEasy
            </h1>
          </div>
          <div className="flex gap-3">
            {/* More prominent caregiver button */}
            <Button
              onClick={() => setCurrentScreen("caregiver-login")}
              className={`flex items-center gap-2 px-4 ${
                settings.highContrast
                  ? "bg-white text-black hover:bg-gray-200 border-2 border-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{isSerbian ? "Старатељ" : "Caregiver"}</span>
            </Button>
            <Button
              variant={settings.highContrast ? "outline" : "ghost"}
              size="lg"
              onClick={() => setCurrentScreen("settings")}
              className={`${getButtonSize()}`}
            >
              <SettingsIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Sentence Builder */}
        <SentenceBuilder
          cards={selectedCards}
          onRemoveCard={handleRemoveCard}
          onClearSentence={handleClearSentence}
          onSpeakSentence={handleSpeakSentence}
          settings={settings}
          profile={profile}
        />

        {/* AI Suggestions */}
        {showSuggestions && selectedCards.length > 0 && settings.enableAI && (
          <AISuggestions
            selectedCards={selectedCards}
            onSpeakSuggestion={handleSpeakSentence}
            onClose={() => setShowSuggestions(false)}
            settings={settings}
            language={profile?.language || "en"}
          />
        )}

        {/* Smart Home Panel */}
        {showSmartHome && settings.enableSmartHome && (
          <SmartHomePanel
            onClose={() => setShowSmartHome(false)}
            settings={settings}
            language={profile?.language || "en"}
          />
        )}

        {/* Card Grid */}
        <CardGrid onCardSelect={handleCardSelect} settings={settings} language={profile?.language || "en"} />
      </main>
    </div>
  )
}
