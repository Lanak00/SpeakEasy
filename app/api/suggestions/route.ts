import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Helper function to get contextual prompts
const getContextualPrompt = (cards: string, language: string, context?: string) => {
  const basePrompts = {
    en: {
      meal_request: `A child wants to communicate about food/eating. Using "${cards}", create 3 natural sentences a child might say about meals, hunger, or food preferences:`,
      emotional_expression: `A child wants to express feelings about family. Using "${cards}", create 3 sentences a child might use to share emotions with family members:`,
      activity_request: `A child wants to communicate about activities. Using "${cards}", create 3 sentences about what they want to do or are doing:`,
      general_communication: `A child is building a sentence for communication. Using "${cards}", create 3 natural, everyday sentences a child might say:`,
    },
    sr: {
      meal_request: `Дете жели да комуницира о храни/јелу. Користећи "${cards}", направи 3 природне реченице које дете може рећи о оброцима, глади или преференцијама хране:`,
      emotional_expression: `Дете жели да изрази осећања о породици. Користећи "${cards}", направи 3 реченице које дете може користити да подели емоције са члановима породице:`,
      activity_request: `Дете жели да комуницира о активностима. Користећи "${cards}", направи 3 реченице о томе шта жели да ради или шта ради:`,
      general_communication: `Дете гради реченицу за комуникацију. Користећи "${cards}", направи 3 природне, свакодневне реченице које дете може рећи:`,
    },
  }

  const contextKey = context || "general_communication"
  return (
    basePrompts[language as keyof typeof basePrompts][contextKey as keyof typeof basePrompts.en] ||
    basePrompts[language as keyof typeof basePrompts].general_communication
  )
}

// Helper function for fallback suggestions
const getFallbackSuggestions = (cards: string, language: string): string[] => {
  if (language === "sr") {
    return [`${cards} молим`, `Желим ${cards}`, `${cards} је добро`]
  }
  return [`I want ${cards} please`, `Can I have ${cards}?`, `${cards} is good`]
}

export async function POST(request: NextRequest) {
  try {
    const { cards, language, context, categories } = await request.json()

    if (!cards || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using fallback suggestions")
      return NextResponse.json({
        suggestions: getFallbackSuggestions(cards, language),
        fallback: true,
      })
    }

    // Create sophisticated system prompt
    const systemPrompt =
      language === "sr"
        ? `Ти си стручни помоћник за комуникацију за децу са потешкоћама у говору. Твој задатак је да генеришеш природне, корисне реченице које деца могу лако да разумеју и користе. Фокусирај се на свакодневну комуникацију и практичне потребе. Реченице треба да буду кратке (максимално 8 речи) и једноставне за изговор. Одговори само са реченицама, свака у новом реду.`
        : `You are an expert communication assistant for children with speech disabilities. Your task is to generate natural, useful sentences that children can easily understand and use. Focus on everyday communication and practical needs. Sentences should be short (maximum 8 words) and easy to pronounce. Respond only with sentences, each on a new line.`

    const userPrompt = getContextualPrompt(cards, language, context)

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 150,
    })

    // Parse the response to extract individual sentences
    const suggestions = text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) =>
        line
          .replace(/^\d+\.\s*/, "")
          .replace(/^[-•]\s*/, "")
          .trim(),
      )
      .filter((line) => line.length > 0 && line.length < 100) // Filter out overly long responses
      .slice(0, 3) // Ensure we only get 3 suggestions

    // Validate suggestions quality
    const validSuggestions = suggestions.filter((suggestion) => {
      const words = suggestion.toLowerCase().split(" ")
      const cardWords = cards.toLowerCase().split(" ")
      // Check if suggestion contains at least one of the selected card words
      return cardWords.some((cardWord) => words.some((word) => word.includes(cardWord) || cardWord.includes(word)))
    })

    // Use valid suggestions or fallback
    const finalSuggestions = validSuggestions.length >= 2 ? validSuggestions : getFallbackSuggestions(cards, language)

    return NextResponse.json({
      suggestions: finalSuggestions,
      aiGenerated: validSuggestions.length >= 2,
    })
  } catch (error) {
    console.error("Error generating AI suggestions:", error)

    // Provide fallback suggestions on error
    const { cards, language } = await request.json().catch(() => ({ cards: "", language: "en" }))

    return NextResponse.json({
      suggestions: getFallbackSuggestions(cards, language),
      fallback: true,
      error: "AI service temporarily unavailable",
    })
  }
}
