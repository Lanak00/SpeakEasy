type SpeechOptions = {
  text: string
  language: string
  rate?: number
  pitch?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
}

// Function to get the best voice for a language
const getBestVoice = (language: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices()

  if (language === "sr") {
    // Look for Serbian voices first
    const serbianVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase().includes("sr") ||
        voice.name.toLowerCase().includes("serbian") ||
        voice.name.toLowerCase().includes("srpski"),
    )

    if (serbianVoice) {
      console.log("Found Serbian voice:", serbianVoice.name, serbianVoice.lang)
      return serbianVoice
    }

    // Try Croatian as it's very similar to Serbian
    const croatianVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase().includes("hr") ||
        voice.name.toLowerCase().includes("croatian") ||
        voice.name.toLowerCase().includes("hrvatski"),
    )

    if (croatianVoice) {
      console.log("Using Croatian voice for Serbian:", croatianVoice.name, croatianVoice.lang)
      return croatianVoice
    }

    // Try any Slavic language
    const slavicVoice = voices.find((voice) =>
      ["bs", "sl", "mk", "bg", "cs", "sk", "pl"].some((code) => voice.lang.toLowerCase().startsWith(code)),
    )

    if (slavicVoice) {
      console.log("Using Slavic voice for Serbian:", slavicVoice.name, slavicVoice.lang)
      return slavicVoice
    }
  }

  // For English or fallback
  const englishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("en"))

  return englishVoice || voices[0] || null
}

export const speak = async ({
  text,
  language,
  rate = 0.8,
  pitch = 1,
  onStart,
  onEnd,
  onError,
}: SpeechOptions): Promise<boolean> => {
  if (!("speechSynthesis" in window)) {
    onError?.("Speech synthesis not supported in this browser")
    return false
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  // Wait a bit for the cancel to take effect
  await new Promise((resolve) => setTimeout(resolve, 100))

  const utterance = new SpeechSynthesisUtterance(text)

  // Get the best available voice
  const voice = getBestVoice(language)

  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
    console.log(`Using voice: ${voice.name} (${voice.lang}) for text: "${text}"`)
  } else {
    // Set language directly if no specific voice found
    utterance.lang = language === "sr" ? "sr-RS" : "en-US"
    console.log(`No specific voice found, using language: ${utterance.lang}`)
  }

  // Set speech parameters for more natural speech
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = 1

  // Set up event handlers
  utterance.onstart = () => {
    console.log("Speech started")
    onStart?.()
  }

  utterance.onend = () => {
    console.log("Speech ended")
    onEnd?.()
  }

  utterance.onerror = (event) => {
    console.error("Speech error:", event.error)
    onError?.(event.error)
  }

  try {
    // Speak the text
    window.speechSynthesis.speak(utterance)

    // Chrome workaround for long text
    if (text.length > 100) {
      const interval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(interval)
        } else {
          window.speechSynthesis.pause()
          window.speechSynthesis.resume()
        }
      }, 14000)
    }

    return true
  } catch (error) {
    console.error("Error starting speech:", error)
    onError?.(error instanceof Error ? error.message : "Unknown speech error")
    return false
  }
}

// Function to list all available voices for debugging
export const listAvailableVoices = (): void => {
  const voices = window.speechSynthesis.getVoices()
  console.log("All available voices:")
  voices.forEach((voice, index) => {
    console.log(`${index + 1}. ${voice.name} (${voice.lang}) - ${voice.localService ? "Local" : "Remote"}`)
  })
}

// Function to check speech support
export const checkSpeechSupport = async (
  language: string,
): Promise<{
  isSupported: boolean
  bestVoice: string | null
  allVoices: string[]
}> => {
  if (!("speechSynthesis" in window)) {
    return {
      isSupported: false,
      bestVoice: null,
      allVoices: [],
    }
  }

  // Wait for voices to load
  let voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) {
    await new Promise<void>((resolve) => {
      const handler = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler)
        resolve()
      }
      window.speechSynthesis.addEventListener("voiceschanged", handler)
      setTimeout(resolve, 2000) // Fallback timeout
    })
    voices = window.speechSynthesis.getVoices()
  }

  const bestVoice = getBestVoice(language)
  const allVoices = voices.map((v) => `${v.name} (${v.lang})`)

  return {
    isSupported: voices.length > 0,
    bestVoice: bestVoice ? `${bestVoice.name} (${bestVoice.lang})` : null,
    allVoices,
  }
}
