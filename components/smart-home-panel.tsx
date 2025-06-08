"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Home, Loader2, X } from "lucide-react"

interface SmartHomeDevice {
  id: string
  name: string
  type: "light" | "thermostat" | "lock" | "fan"
  room: string
  state: boolean
  icon: string
}

interface SmartHomePanelProps {
  onClose: () => void
  settings: any
  language: string
}

export function SmartHomePanel({ onClose, settings, language }: SmartHomePanelProps) {
  const [devices, setDevices] = useState<SmartHomeDevice[]>([
    {
      id: "livingroom-light",
      name: language === "sr" ? "Светло у дневној соби" : "Living Room Light",
      type: "light",
      room: language === "sr" ? "дневна соба" : "living room",
      state: false,
      icon: "💡",
    },
    {
      id: "bedroom-light",
      name: language === "sr" ? "Светло у спаваћој соби" : "Bedroom Light",
      type: "light",
      room: language === "sr" ? "спаваћа соба" : "bedroom",
      state: false,
      icon: "🛏️",
    },
  ])

  const [loadingDevices, setLoadingDevices] = useState<Set<string>>(new Set())

  const isHighContrast = settings.highContrast

  const toggleDevice = async (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    setLoadingDevices((prev) => new Set(prev).add(deviceId))

    try {
      const response = await fetch("/api/smart-home/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: device.id,
          action: device.state ? "off" : "on",
          deviceType: device.type,
          room: device.room,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Update device state on successful API call
        setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, state: !d.state } : d)))

        console.log(`Device ${deviceId} controlled successfully:`, result)
      } else {
        // Handle API error
        console.error("Smart home API error:", result)
        alert(
          language === "sr"
            ? `Грешка при контроли уређаја: ${result.error || "Непозната грешка"}`
            : `Error controlling device: ${result.error || "Unknown error"}`,
        )
      }
    } catch (error) {
      console.error("Smart home control error:", error)
      alert(
        language === "sr"
          ? "Грешка мреже. Проверите да ли је уређај доступан."
          : "Network error. Please check if the device is available.",
      )
    } finally {
      setLoadingDevices((prev) => {
        const newSet = new Set(prev)
        newSet.delete(deviceId)
        return newSet
      })
    }
  }

  const getDeviceStatusText = (device: SmartHomeDevice) => {
    if (language === "sr") {
      return device.state ? "Укључено" : "Искључено"
    }
    return device.state ? "On" : "Off"
  }

  const getToggleButtonText = (device: SmartHomeDevice) => {
    if (language === "sr") {
      return device.state ? "Искључи" : "Укључи"
    }
    return device.state ? "Turn Off" : "Turn On"
  }

  return (
    <Card
      className={`border-2 shadow-lg ${
        isHighContrast ? "border-white bg-gray-900 text-white" : "border-blue-200 bg-white"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Home className={`w-5 h-5 ${isHighContrast ? "text-white" : "text-blue-600"}`} />
          <CardTitle
            className={`${
              settings.fontSize === "large" ? "text-xl" : "text-lg"
            } ${isHighContrast ? "text-white" : "text-blue-800"}`}
          >
            {language === "sr" ? "Паметна кућа" : "Smart Home"}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={isHighContrast ? "text-white hover:bg-gray-800" : ""}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {devices.map((device) => {
            const isLoading = loadingDevices.has(device.id)
            return (
              <div
                key={device.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  device.state
                    ? isHighContrast
                      ? "border-white bg-gray-800"
                      : "border-yellow-300 bg-yellow-50"
                    : isHighContrast
                      ? "border-gray-600 bg-gray-900"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{device.icon}</span>
                    <div>
                      <h3
                        className={`font-medium ${
                          settings.fontSize === "large" ? "text-lg" : "text-base"
                        } ${isHighContrast ? "text-white" : "text-gray-900"}`}
                      >
                        {device.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          device.state
                            ? isHighContrast
                              ? "text-green-300"
                              : "text-green-600"
                            : isHighContrast
                              ? "text-gray-400"
                              : "text-gray-500"
                        }`}
                      >
                        {getDeviceStatusText(device)}
                      </p>
                    </div>
                  </div>
                  <Lightbulb
                    className={`w-6 h-6 ${
                      device.state
                        ? isHighContrast
                          ? "text-yellow-300"
                          : "text-yellow-500"
                        : isHighContrast
                          ? "text-gray-600"
                          : "text-gray-400"
                    }`}
                  />
                </div>

                <Button
                  onClick={() => toggleDevice(device.id)}
                  disabled={isLoading}
                  className={`w-full ${
                    device.state
                      ? isHighContrast
                        ? "bg-red-800 hover:bg-red-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                      : isHighContrast
                        ? "bg-green-800 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                  } ${settings.fontSize === "large" ? "text-lg p-4" : "p-3"}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === "sr" ? "Контролишем..." : "Controlling..."}
                    </>
                  ) : (
                    getToggleButtonText(device)
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Status indicator */}
        <div
          className={`text-center text-sm p-2 rounded ${
            isHighContrast ? "bg-gray-800 text-gray-300" : "bg-blue-50 text-blue-700"
          }`}
        >
          {language === "sr" ? "Контролишите уређаје додиром на дугмад" : "Control devices by tapping the buttons"}
        </div>
      </CardContent>
    </Card>
  )
}
