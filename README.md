# SpeakEasy - Communication PWA

A multilingual progressive web app designed for children with speech disabilities.

## Features

- **Card-based Communication**: Visual cards with icons and labels
- **AI-Powered Suggestions**: Smart sentence completion using OpenAI
- **Text-to-Speech**: Built-in speech synthesis
- **Multilingual Support**: English and Serbian
- **Accessibility Features**: High contrast mode, large fonts
- **Progressive Web App**: Installable on mobile devices

## Setup

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### OpenAI API Key

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Add it to your `.env.local` file

**Note**: The app will work with fallback suggestions if no API key is provided.

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

### Deployment

The app is designed to work on Vercel with automatic environment variable detection.

## Usage

1. **Setup**: Enter child's name and select language
2. **Communication**: Tap cards to build sentences
3. **AI Suggestions**: Get smart sentence completions
4. **Speech**: Tap to hear sentences spoken aloud
5. **Settings**: Adjust accessibility options

## Accessibility

- Large touch targets (48px+)
- High contrast mode
- Screen reader compatible
- Voice output
- Simple navigation

## Languages Supported

- English
- Serbian (Српски)

## Technical Stack

- Next.js 15
- React
- Tailwind CSS
- OpenAI API (via AI SDK)
- Web Speech API
- Progressive Web App
