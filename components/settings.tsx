"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Volume2, Eye, Type } from "lucide-react"
import { speak, checkSpeechSupport, listAvailableVoices } from "@/utils/speech-utils"
import { useState, useEffect } from "react"

interface SettingsProps {
  profile: any
  settings: any
  onUpdateProfile: (profile: any) => void
  onUpdateSettings: (settings: any) => void
  onBack: () => void
}

export function Settings({ profile, settings, onUpdateProfile, onUpdateSettings, onBack }: SettingsProps) {
  const [speechStatus, setSpeechStatus] = useState<{
    isSupported: boolean
    bestVoice: string | null
    allVoices: string[]
  } | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const checkSupport = async () => {
      const status = await checkSpeechSupport(profile?.language || "en")
      setSpeechStatus(status)

      // List all voices for debugging
      listAvailableVoices()
    }

    checkSupport()
  }, [profile?.language])

  const testSpeech = () => {
    setIsSpeaking(true)

    // Use simple, natural test phrases
    const text = profile?.language === "sr" ? "Здраво! Како си данас?" : "Hello! How are you today?"

    speak({
      text,
      language: profile?.language || "en",
      rate: 0.8, // Slower rate for better clarity
      onError: (error) => {
        console.error("Speech error:", error)
        setIsSpeaking(false)
      },
      onStart: () => {
        console.log("Speech started successfully")
      },
      onEnd: () => {
        setIsSpeaking(false)
        console.log("Speech completed")
      },
    })
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        settings.highContrast ? "bg-black text-white" : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <header className={`p-4 border-b-2 ${settings.highContrast ? "border-white" : "border-blue-200"}`}>
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant={settings.highContrast ? "outline" : "ghost"} size="lg" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1
            className={`text-2xl font-bold ${
              settings.fontSize === "large" ? "text-3xl" : ""
            } ${settings.highContrast ? "text-white" : "text-blue-800"}`}
          >
            Settings
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Settings */}
        <Card
          className={`border-2 ${
            settings.highContrast ? "border-white bg-gray-900 text-white" : "border-blue-200 bg-white"
          }`}
        >
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${settings.fontSize === "large" ? "text-xl" : ""}`}>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Child's Name</Label>
              <p className={`text-lg ${settings.highContrast ? "text-gray-300" : "text-gray-600"}`}>
                {profile?.childName}
              </p>
            </div>
            <div>
              <Label className="text-lg font-medium">Language</Label>
              <Select
                value={profile?.language || "en"}
                onValueChange={(value) => onUpdateProfile({ ...profile, language: value })}
              >
                <SelectTrigger className={`mt-2 ${settings.highContrast ? "border-white bg-gray-800" : ""}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sr">Српски (Serbian)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card
          className={`border-2 ${
            settings.highContrast ? "border-white bg-gray-900 text-white" : "border-blue-200 bg-white"
          }`}
        >
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${settings.fontSize === "large" ? "text-xl" : ""}`}>
              <Eye className="w-6 h-6" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-medium">High Contrast Mode</Label>
                <p className={`text-sm ${settings.highContrast ? "text-gray-300" : "text-gray-600"}`}>
                  Better visibility for low vision users
                </p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, highContrast: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium flex items-center gap-2">
                <Type className="w-5 h-5" />
                Font Size
              </Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value) => onUpdateSettings({ ...settings, fontSize: value })}
              >
                <SelectTrigger className={settings.highContrast ? "border-white bg-gray-800" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Speech Settings */}
        <Card
          className={`border-2 ${
            settings.highContrast ? "border-white bg-gray-900 text-white" : "border-blue-200 bg-white"
          }`}
        >
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${settings.fontSize === "large" ? "text-xl" : ""}`}>
              <Volume2 className="w-6 h-6" />
              Speech Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {speechStatus?.bestVoice && (
              <div className="p-3 bg-green-50 text-green-800 rounded-md">
                <p className="font-medium">{profile?.language === "sr" ? "Пронађен глас:" : "Voice found:"}</p>
                <p className="text-sm">{speechStatus.bestVoice}</p>
              </div>
            )}

            {!speechStatus?.bestVoice && profile?.language === "sr" && (
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md">
                <p className="font-medium">Напомена о српском гласу</p>
                <p className="text-sm">
                  Нисмо пронашли специфичан српски глас на вашем уређају. Користићемо најбољу доступну алтернативу.
                </p>
              </div>
            )}

            <Button
              onClick={testSpeech}
              disabled={isSpeaking}
              className={`w-full ${settings.fontSize === "large" ? "text-lg p-6" : "p-4"}`}
            >
              <Volume2 className={`w-5 h-5 mr-2 ${isSpeaking ? "animate-pulse" : ""}`} />
              {isSpeaking
                ? profile?.language === "sr"
                  ? "Тестирам говор..."
                  : "Testing speech..."
                : profile?.language === "sr"
                  ? "Тестирај говор"
                  : "Test Speech Output"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
