"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, User, LogOut, BarChart3, MessageSquare } from "lucide-react"
import { CustomCardManager } from "./custom-card-manager"
import { useState } from "react"

interface CaregiverDashboardProps {
  caregiver: any
  profile: any
  settings: any
  customCards: any[]
  onAddCustomCard: (card: any) => void
  onEditCustomCard: (id: string, card: any) => void
  onDeleteCustomCard: (id: string) => void
  onOpenSettings: () => void
  onLogout: () => void
  onBackToApp: () => void
}

export function CaregiverDashboard({
  caregiver,
  profile,
  settings,
  customCards,
  onAddCustomCard,
  onEditCustomCard,
  onDeleteCustomCard,
  onOpenSettings,
  onLogout,
  onBackToApp,
}: CaregiverDashboardProps) {
  const [showCustomCardManager, setShowCustomCardManager] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Caregiver Dashboard</h1>
            <p className="text-gray-600">Welcome back, {caregiver.name}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBackToApp}>
              Back to App
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.childName || "No Profile"}</div>
              <p className="text-xs text-muted-foreground">
                Language: {profile?.language === "sr" ? "Serbian" : "English"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Communication Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Suggestions Used</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Total this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Configure accessibility options, communication preferences, AI features, and smart home integration.
              </p>
              <Button onClick={onOpenSettings} className="w-full">
                Open Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Manage child profiles, communication preferences, and usage analytics.</p>
              <Button variant="outline" className="w-full">
                Manage Profiles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Custom Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Create and manage personalized communication cards for specific needs.</p>
              <Button onClick={() => setShowCustomCardManager(true)} className="w-full">
                Manage Custom Cards
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Settings Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Settings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">High Contrast:</span>{" "}
                <span className={settings.highContrast ? "text-green-600" : "text-gray-500"}>
                  {settings.highContrast ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <span className="font-medium">Font Size:</span>{" "}
                <span className="text-gray-700">{settings.fontSize || "Normal"}</span>
              </div>
              <div>
                <span className="font-medium">Text-to-Speech:</span>{" "}
                <span className={settings.voiceEnabled !== false ? "text-green-600" : "text-gray-500"}>
                  {settings.voiceEnabled !== false ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <span className="font-medium">AI Assistance:</span>{" "}
                <span className={settings.enableAI !== false ? "text-green-600" : "text-gray-500"}>
                  {settings.enableAI !== false ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {showCustomCardManager && (
          <CustomCardManager
            customCards={customCards}
            onAddCard={onAddCustomCard}
            onEditCard={onEditCustomCard}
            onDeleteCard={onDeleteCustomCard}
            onClose={() => setShowCustomCardManager(false)}
            language={profile?.language || "en"}
            settings={settings}
          />
        )}
      </div>
    </div>
  )
}
