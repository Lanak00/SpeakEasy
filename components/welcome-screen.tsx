"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Heart } from "lucide-react"

interface WelcomeScreenProps {
  onComplete: (profile: any) => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [childName, setChildName] = useState("")
  const [language, setLanguage] = useState("en")
  const [caregiverName, setCaregiverName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (childName.trim()) {
      onComplete({
        childName: childName.trim(),
        caregiverName: caregiverName.trim(),
        language,
        createdAt: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-blue-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Volume2 className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-800">Welcome to SpeakEasy</CardTitle>
          <p className="text-gray-600 text-lg">Let's set up your communication profile</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="childName" className="text-lg font-medium">
                Child's Name *
              </Label>
              <Input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter child's name"
                className="text-lg p-4 border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caregiverName" className="text-lg font-medium">
                Caregiver's Name
              </Label>
              <Input
                id="caregiverName"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                placeholder="Enter caregiver's name"
                className="text-lg p-4 border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-lg font-medium">
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="text-lg p-4 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sr">Српски (Serbian)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full text-xl p-6 bg-blue-600 hover:bg-blue-700"
              disabled={!childName.trim()}
            >
              <Heart className="w-6 h-6 mr-2" />
              Start Communicating
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
