"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"

interface CaregiverLoginProps {
  onLogin: (caregiverData: any) => void
  onBack: () => void
}

export function CaregiverLogin({ onLogin, onBack }: CaregiverLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication - in real app, this would call an API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - accept any email/password for demo
      if (email && password) {
        const caregiverData = {
          id: "caregiver-1",
          email,
          name: email.split("@")[0],
          role: "caregiver",
          loginTime: new Date().toISOString(),
        }
        onLogin(caregiverData)
      } else {
        setError("Please enter both email and password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-blue-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-800">Caregiver Access</CardTitle>
          <p className="text-gray-600 text-lg">Sign in to manage settings and profiles</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="text-lg p-4 border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="text-lg p-4 border-2 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {error && <div className="text-red-600 text-center p-2 bg-red-50 rounded-md">{error}</div>}

            <div className="space-y-3">
              <Button type="submit" className="w-full text-xl p-6 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <Button type="button" variant="outline" className="w-full text-lg p-4" onClick={onBack}>
                Back to App
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 text-center">
              <strong>Demo Access:</strong> Use any email and password to sign in
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
