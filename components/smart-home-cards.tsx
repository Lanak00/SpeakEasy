"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Lightbulb, LightbulbOff } from "lucide-react"
import type { Card } from "@/types"

interface SmartHomeDevice {
  id: string
  name: string
  room: string
  state: boolean
  icon: string
  pin: number
}

interface SmartHomeCardsProps {
  onCardSelect: (card: Card) => void
  settings: any
  language: string
}

export function SmartHomeCards({ onCardSelect, settings, language }: SmartHomeCardsProps) {
  const [devices, setDevices] = useState<SmartHomeDevice[]>([
    {
      id: "livingroom-light",
      name: language === "sr" ? "Дневна соба" : "Living Room",
      room: language === "sr" ? "дневна соба" : "living room",
      state: false,
      icon: "🛋️",
      pin: 0,
    },
    {
      id: "bedroom-light",
      name: language === "sr" ? "Спаваћа соба" : "Bedroom",
      room: language === "sr" ? "спаваћа соба" : "bedroom",
      state: false,
      icon: "🛏️",
      pin: 1,
    },
  ])

  const toggleDevice = (deviceId: string) => {
    // Simply toggle the visual state without API call
    setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, state: !d.state } : d)))
  }

  const getTextSize = () => {
    switch (settings.fontSize) {
      case "small":
        return { title: "text-sm", state: "text-xs" }
      case "medium":
        return { title: "text-base", state: "text-sm" }
      case "large":
        return { title: "text-lg", state: "text-base" }
      case "extra-large":
        return { title: "text-xl", state: "text-lg" }
      default:
        return { title: "text-base", state: "text-sm" }
    }
  }

  const getIconSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "w-5 h-5"
      case "medium":
        return "w-6 h-6"
      case "large":
        return "w-7 h-7"
      case "extra-large":
        return "w-8 h-8"
      default:
        return "w-6 h-6"
    }
  }

  const shouldShowIcon = settings.symbolDisplay === "icons" || settings.symbolDisplay === "both"
  const shouldShowText = settings.symbolDisplay === "text" || settings.symbolDisplay === "both"

  const getStateText = (device: SmartHomeDevice) => {
    if (language === "sr") {
      return device.state ? "Укључено" : "Искључено"
    }
    return device.state ? "On" : "Off"
  }

  const textSizes = getTextSize()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            settings.highContrast ? "bg-gray-800 border border-white" : "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}
        >
          <Home className={`w-5 h-5 text-white`} />
        </div>
        <h3
          className={`font-bold ${textSizes.title} ${
            settings.highContrast
              ? "text-white"
              : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          }`}
        >
          {language === "sr" ? "Паметна кућа" : "Smart Home"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {devices.map((device) => (
          <Button
            key={device.id}
            onClick={() => toggleDevice(device.id)}
            variant="ghost"
            className={`
              relative h-20 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2
              ${settings.autismFriendlyMode ? "" : "transition-all duration-200 hover:scale-[1.02]"}
              ${
                device.state
                  ? settings.highContrast
                    ? "bg-gray-800 border-white text-white"
                    : "bg-gradient-to-br from-amber-100 to-yellow-200 border-yellow-300 text-amber-900 shadow-md"
                  : settings.highContrast
                    ? "bg-gray-900 border-gray-600 text-gray-300"
                    : "bg-white border-gray-200 text-gray-700 shadow-sm hover:shadow-md"
              }
            `}
          >
            {/* Subtle glow for ON state */}
            {device.state && !settings.highContrast && (
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-amber-500/10 rounded-xl" />
            )}

            {/* Room icon and light status */}
            <div className="flex items-center gap-2">
              {shouldShowIcon && (
                <>
                  <span className="text-lg" role="img" aria-label={device.name}>
                    {device.icon}
                  </span>
                  {device.state ? (
                    <Lightbulb className={`w-4 h-4 ${settings.highContrast ? "text-yellow-300" : "text-amber-600"}`} />
                  ) : (
                    <LightbulbOff className={`w-4 h-4 ${settings.highContrast ? "text-gray-500" : "text-gray-400"}`} />
                  )}
                </>
              )}
            </div>

            {shouldShowText && (
              <div className="text-center">
                <div className={`font-semibold ${textSizes.state} leading-tight`}>{device.name}</div>
                <div
                  className={`
                    font-bold ${textSizes.state}
                    ${
                      device.state
                        ? settings.highContrast
                          ? "text-green-300"
                          : "text-green-600"
                        : settings.highContrast
                          ? "text-red-300"
                          : "text-red-500"
                    }
                  `}
                >
                  {getStateText(device)}
                </div>
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
