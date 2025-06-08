import { type NextRequest, NextResponse } from "next/server"

interface SmartHomeRequest {
  deviceId: string
  action: "on" | "off"
  deviceType: string
  room: string
}

// Map device IDs to pin numbers
const DEVICE_PIN_MAP = {
  "livingroom-light": 0,
  "bedroom-light": 1,
} as const

// Exact URL as specified
const ESP_ENDPOINT = "http://node.local/esp/gpio/write"

export async function POST(request: NextRequest) {
  try {
    const { deviceId, action, deviceType, room }: SmartHomeRequest = await request.json()

    // Validate request
    if (!deviceId || !action || !deviceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get pin number for the device
    const pin = DEVICE_PIN_MAP[deviceId as keyof typeof DEVICE_PIN_MAP]
    if (pin === undefined) {
      return NextResponse.json({ error: "Unknown device" }, { status: 400 })
    }

    // Convert action to boolean level
    const level = action === "on"

    // Prepare payload for your ESP endpoint
    const payload = {
      pin,
      level,
    }

    console.log(`Smart Home Control: ${deviceId} -> pin ${pin}, level ${level}`)
    console.log(`Sending request to: ${ESP_ENDPOINT}`)

    try {
      // Call your ESP endpoint with exact URL
      const response = await fetch(ESP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) {
        throw new Error(`ESP API error: ${response.status} ${response.statusText}`)
      }

      // Try to parse response, but don't fail if it's not JSON
      let espResponse
      try {
        espResponse = await response.json()
      } catch {
        espResponse = { status: "ok" }
      }

      return NextResponse.json({
        success: true,
        deviceId,
        action,
        pin,
        level,
        timestamp: new Date().toISOString(),
        espResponse,
      })
    } catch (fetchError) {
      console.error("ESP API call failed:", fetchError)

      // Return error but don't crash
      return NextResponse.json(
        {
          error: "Failed to communicate with smart home device",
          details: fetchError instanceof Error ? fetchError.message : "Network error",
          deviceId,
          action,
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Smart home control error:", error)
    return NextResponse.json(
      {
        error: "Failed to process smart home request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
