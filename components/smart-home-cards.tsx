"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Loader2 } from "lucide-react"
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
      name: language === "sr" ? "дневна соба" : "living room",
      room: language === "sr" ? "дневна соба" : "living room",
      state: false,
      icon: "💡",
      pin: 0,
    },
    {
      id: "bedroom-light",
      name: language === "sr" ? "спаваћа соба" : "bedroom",
      room: language === "sr" ? "спаваћа соба" : "bedroom",
      state: false,
      icon: "🛏️",
      pin: 1,
    },
  ])

  const [loadingDevices, setLoadingDevices] = useState<Set<string>>(new Set())

  const toggleDevice = async (device: SmartHomeDevice) => {
    setLoadingDevices((prev) => new Set(prev).add(device.id))

    try {
      const response = await fetch("/api/smart-home/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: device.id,
          action: device.state ? "off" : "on",
          deviceType: "light",
          room: device.room,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Update device state on successful API call
        setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, state: !d.state } : d)))
      } else {
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
        newSet.delete(device.id)
        return newSet
      })
    }
  }

  // Dynamic grid styling (reuse from main card grid)
  const getGridCols = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "grid-cols-2"
        case "medium":
          return "grid-cols-2"
        case "large":
          return "grid-cols-1 sm:grid-cols-2"
        case "extra-large":
          return "grid-cols-1"
        default:
          return "grid-cols-2"
      }
    }
    return "grid-cols-2"
  }

  const getCardHeight = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "h-28"
        case "medium":
          return "h-32"
        case "large":
          return "h-40"
        case "extra-large":
          return "h-48"
        default:
          return "h-32"
      }
    }
    return settings.touchMode ? "h-28" : "h-24"
  }

  const getTextSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-xs"
      case "medium":
        return "text-sm"
      case "large":
        return "text-base"
      case "extra-large":
        return "text-lg"
      default:
        return "text-sm"
    }
  }

  const getIconSize = () => {
    if (settings.largeIcons) {
      switch (settings.fontSize) {
        case "small":
          return "text-3xl"
        case "medium":
          return "text-4xl"
        case "large":
          return "text-5xl"
        case "extra-large":
          return "text-6xl"
        default:
          return "text-4xl"
      }
    }
    return "text-3xl"
  }

  const shouldShowIcon = settings.symbolDisplay === "icons" || settings.symbolDisplay === "both"
  const shouldShowText = settings.symbolDisplay === "text" || settings.symbolDisplay === "both"

  const getStateText = (device: SmartHomeDevice) => {
    if (language === "sr") {
      return device.state ? "укључено" : "искључено"
    }
    return device.state ? "on" : "off"
  }

  const getDeviceLabel = (device: SmartHomeDevice) => {
    const stateText = getStateText(device)
    return `${device.name} ${stateText}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Home className={`w-5 h-5 ${settings.highContrast ? "text-white" : "text-blue-600"}`} />
        <h3 className={`font-semibold ${settings.highContrast ? "text-white" : "text-gray-800"} ${getTextSize()}`}>
          {language === "sr" ? "Паметна кућа" : "Smart Home Controls"}
        </h3>
      </div>

      <div className={`grid gap-4 ${getGridCols()}`}>
        {devices.map((device) => {
          const isLoading = loadingDevices.has(device.id)
          return (
            <Button
              key={device.id}
              onClick={() => toggleDevice(device)}
              disabled={isLoading}
              variant={settings.highContrast ? "outline" : "secondary"}
              className={`
                card-button flex flex-col items-center justify-center gap-2 p-4
                ${getCardHeight()}
                ${
                  device.state
                    ? settings.highContrast
                      ? "border-2 border-white bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-yellow-100 border-2 border-yellow-400 hover:bg-yellow-200 text-yellow-900"
                    : settings.highContrast
                      ? "border-2 border-gray-600 bg-gray-900 hover:bg-gray-800 text-gray-300"
                      : "bg-gray-100 border-2 border-gray-300 hover:bg-gray-200 text-gray-700"
                }
                ${settings.autismFriendlyMode ? "" : "transition-all duration-200"}
                ${settings.touchMode ? "min-h-[60px]" : ""}
                ${settings.readingAssistance ? "reading-assistance" : ""}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className={`${getIconSize()} animate-spin`} />
                  {shouldShowText && (
                    <span className={`font-medium text-center leading-tight ${getTextSize()}`}>
                      {language === "sr" ? "Контролишем..." : "Controlling..."}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {shouldShowIcon && (
                    <span
                      className={`${getIconSize()} ${
                        device.state
                          ? settings.highContrast
                            ? "brightness-125"
                            : "brightness-110"
                          : settings.highContrast
                            ? "brightness-75"
                            : "brightness-75"
                      }`}
                      role="img"
                      aria-label={getDeviceLabel(device)}
                    >
                      {device.icon}
                    </span>
                  )}
                  {shouldShowText && (
                    <div className="text-center">
                      <span className={`font-medium leading-tight ${getTextSize()}`}>{device.name}</span>
                      <br />
                      <span
                        className={`font-bold ${getTextSize()} ${
                          device.state
                            ? settings.highContrast
                              ? "text-green-300"
                              : "text-green-700"
                            : settings.highContrast
                              ? "text-red-300"
                              : "text-red-600"
                        }`}
                      >
                        {getStateText(device)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
