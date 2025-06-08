"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save } from "lucide-react"

interface CaregiverSettingsProps {
  profile: any
  settings: any
  onUpdateProfile: (profile: any) => void
  onUpdateSettings: (settings: any) => void
  onClose: () => void
}

type SettingsTab = "accessibility" | "communication" | "ai-features" | "smart-home"

export function CaregiverSettings({
  profile,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onClose,
}: CaregiverSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("accessibility")
  const [localSettings, setLocalSettings] = useState({
    // Accessibility settings
    highContrastMode: settings.highContrast || false,
    largeText: settings.fontSize === "large",
    largeIcons: settings.largeIcons || false,
    fontSize: settings.fontSize || "medium",
    symbolDisplay: settings.symbolDisplay || "both",

    // Interaction settings
    touchMode: settings.touchMode || false,
    keyboardNavigation: settings.keyboardNavigation || false,
    switchScanning: settings.switchScanning || false,
    eyeTracking: settings.eyeTracking || false,
    autismFriendlyMode: settings.autismFriendlyMode || false,
    readingAssistance: settings.readingAssistance || false,

    // Communication settings
    enableTTS: settings.voiceEnabled !== false,
    language: profile?.language || "en",

    // AI Features
    enableAI: settings.enableAI !== false,

    // Smart Home
    enableSmartHome: settings.enableSmartHome || false,
  })

  const handleSave = () => {
    // Update profile
    onUpdateProfile({
      ...profile,
      language: localSettings.language,
    })

    // Update settings
    onUpdateSettings({
      ...settings,
      highContrast: localSettings.highContrastMode,
      fontSize: localSettings.largeText ? "large" : localSettings.fontSize,
      largeIcons: localSettings.largeIcons,
      symbolDisplay: localSettings.symbolDisplay,
      touchMode: localSettings.touchMode,
      keyboardNavigation: localSettings.keyboardNavigation,
      switchScanning: localSettings.switchScanning,
      eyeTracking: localSettings.eyeTracking,
      autismFriendlyMode: localSettings.autismFriendlyMode,
      readingAssistance: localSettings.readingAssistance,
      voiceEnabled: localSettings.enableTTS,
      enableAI: localSettings.enableAI,
      enableSmartHome: localSettings.enableSmartHome,
    })

    onClose()
  }

  const updateLocalSetting = (key: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: "accessibility", label: "Accessibility", shortLabel: "Access" },
    { id: "communication", label: "Communication", shortLabel: "Comm" },
    { id: "ai-features", label: "AI Features", shortLabel: "AI" },
    { id: "smart-home", label: "Smart Home", shortLabel: "Smart" },
  ]

  // Use current high contrast setting (either from settings or local preview)
  const isHighContrast = localSettings.highContrastMode

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div
        className={`rounded-lg shadow-2xl w-full max-w-4xl flex flex-col h-[95vh] sm:h-[85vh] sm:max-h-[700px] ${
          isHighContrast ? "bg-black text-white border-2 border-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0 ${
            isHighContrast ? "border-white" : "border-gray-200"
          }`}
        >
          <h2 className={`text-xl sm:text-2xl font-bold ${isHighContrast ? "text-white" : "text-gray-900"}`}>
            Settings
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${isHighContrast ? "text-white hover:bg-gray-800 border border-white" : ""} p-2`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>

        {/* Mobile Tab Navigation - Horizontal Scroll */}
        <div
          className={`border-b flex-shrink-0 ${
            isHighContrast ? "bg-gray-900 border-white" : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 min-w-0 ${
                  activeTab === tab.id
                    ? isHighContrast
                      ? "bg-black border-b-2 border-white text-white"
                      : "bg-white border-b-2 border-blue-500 text-blue-600"
                    : isHighContrast
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {/* Show short label on mobile, full label on desktop */}
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "accessibility" && (
            <div className="space-y-6">
              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                  Visual Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      High Contrast Mode
                    </span>
                    <Switch
                      checked={localSettings.highContrastMode}
                      onCheckedChange={(checked) => updateLocalSetting("highContrastMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Large Text
                    </span>
                    <Switch
                      checked={localSettings.largeText}
                      onCheckedChange={(checked) => updateLocalSetting("largeText", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Large Icons
                    </span>
                    <Switch
                      checked={localSettings.largeIcons}
                      onCheckedChange={(checked) => updateLocalSetting("largeIcons", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Font Size
                    </label>
                    <Select
                      value={localSettings.fontSize}
                      onValueChange={(value) => updateLocalSetting("fontSize", value)}
                    >
                      <SelectTrigger
                        className={
                          isHighContrast ? "bg-black text-white border-white" : "bg-white text-gray-900 border-gray-300"
                        }
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className={
                          isHighContrast ? "bg-black text-white border-white" : "bg-white text-gray-900 border-gray-300"
                        }
                      >
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Symbol Display
                    </label>
                    <Select
                      value={localSettings.symbolDisplay}
                      onValueChange={(value) => updateLocalSetting("symbolDisplay", value)}
                    >
                      <SelectTrigger
                        className={
                          isHighContrast ? "bg-black text-white border-white" : "bg-white text-gray-900 border-gray-300"
                        }
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className={
                          isHighContrast ? "bg-black text-white border-white" : "bg-white text-gray-900 border-gray-300"
                        }
                      >
                        <SelectItem value="icons">Icons Only</SelectItem>
                        <SelectItem value="text">Text Only</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Interaction Settings */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                  Interaction Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Touch Mode
                    </span>
                    <Switch
                      checked={localSettings.touchMode}
                      onCheckedChange={(checked) => updateLocalSetting("touchMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Keyboard Navigation
                    </span>
                    <Switch
                      checked={localSettings.keyboardNavigation}
                      onCheckedChange={(checked) => updateLocalSetting("keyboardNavigation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Switch Scanning
                    </span>
                    <Switch
                      checked={localSettings.switchScanning}
                      onCheckedChange={(checked) => updateLocalSetting("switchScanning", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Eye Tracking
                    </span>
                    <Switch
                      checked={localSettings.eyeTracking}
                      onCheckedChange={(checked) => updateLocalSetting("eyeTracking", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Autism-Friendly Mode
                    </span>
                    <Switch
                      checked={localSettings.autismFriendlyMode}
                      onCheckedChange={(checked) => updateLocalSetting("autismFriendlyMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                      Reading Assistance
                    </span>
                    <Switch
                      checked={localSettings.readingAssistance}
                      onCheckedChange={(checked) => updateLocalSetting("readingAssistance", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "communication" && (
            <div className="max-w-md">
              <h3 className={`text-lg font-semibold mb-6 ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                Text-to-Speech
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                    Enable Text-to-Speech
                  </span>
                  <Switch
                    checked={localSettings.enableTTS}
                    onCheckedChange={(checked) => updateLocalSetting("enableTTS", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm sm:text-base font-medium ${isHighContrast ? "text-white" : "text-gray-900"}`}
                  >
                    Language
                  </label>
                  <Select
                    value={localSettings.language}
                    onValueChange={(value) => updateLocalSetting("language", value)}
                  >
                    <SelectTrigger
                      className={
                        isHighContrast ? "bg-black text-white border-white" : "bg-white text-gray-900 border-gray-300"
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        isHighContrast ? "bg-black text-white border-white" : "bg-white text-gray-900 border-gray-300"
                      }
                    >
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sr">Српски (Serbian)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai-features" && (
            <div className="max-w-md">
              <h3 className={`text-lg font-semibold mb-6 ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                AI Features
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                    Enable AI Assistance
                  </span>
                  <Switch
                    checked={localSettings.enableAI}
                    onCheckedChange={(checked) => updateLocalSetting("enableAI", checked)}
                  />
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed ${isHighContrast ? "text-gray-300" : "text-gray-600"}`}
                >
                  AI features include sentence generation and word suggestions to help improve communication.
                </p>
              </div>
            </div>
          )}

          {activeTab === "smart-home" && (
            <div className="max-w-md">
              <h3 className={`text-lg font-semibold mb-6 ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                Smart Home Integration
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <span className={`text-sm sm:text-base ${isHighContrast ? "text-white" : "text-gray-900"}`}>
                    Enable Smart Home Control
                  </span>
                  <Switch
                    checked={localSettings.enableSmartHome}
                    onCheckedChange={(checked) => updateLocalSetting("enableSmartHome", checked)}
                  />
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed ${isHighContrast ? "text-gray-300" : "text-gray-600"}`}
                >
                  Connect to Home Assistant or other smart home systems to control lights, temperature, and other
                  devices through communication cards.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t flex-shrink-0 ${
            isHighContrast ? "bg-gray-900 border-white" : "bg-gray-50 border-gray-200"
          }`}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={`${
              isHighContrast
                ? "text-white border-white hover:bg-gray-800"
                : "text-gray-900 border-gray-300 hover:bg-gray-100"
            } w-full sm:w-auto`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className={`${
              isHighContrast
                ? "bg-white text-black hover:bg-gray-200 border border-white"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            } w-full sm:w-auto`}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
