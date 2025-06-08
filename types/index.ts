export interface Card {
  id: string
  icon: string
  label: string
  category: string
  audioUrl?: string
}

export interface UserProfile {
  childName: string
  caregiverName?: string
  language: "en" | "sr"
  createdAt: string
}

export interface AccessibilitySettings {
  highContrast: boolean
  fontSize: "normal" | "large"
  voiceEnabled: boolean
}
