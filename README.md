# AI Avatar Chat

A production-ready Next.js web application featuring an AI chatbot with text, voice, and live avatar interaction, similar to ChatGPT and Google Gemini.

## Features

- **Text-Based Chat**: Real-time AI conversations with streaming responses
- **Voice Input**: Speech-to-Text using OpenAI Whisper API
- **Voice Output**: Text-to-Speech with natural-sounding voices (OpenAI TTS)
- **Live Avatar**: Animated avatar with lip-sync and state-based animations
- **Chat History**: Persistent conversations using PostgreSQL (Neon DB)
- **Dark/Light Theme**: Smooth theme switching with preference persistence
- **Markdown Support**: Rich text rendering with code syntax highlighting
- **Mobile Responsive**: Fully responsive design for all screen sizes

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Zustand** (state management)
- **React Markdown** (markdown rendering)

### Backend & AI
- **OpenAI API** (ChatGPT, Whisper, TTS)
- **PostgreSQL** (Neon DB)
- **Drizzle ORM** (database management)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Neon DB account ([Sign up here](https://neon.tech))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd live_interaction_avatar
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=16384

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database**

```bash
# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
live_interaction_avatar/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # ChatGPT streaming API
│   │   ├── speech-to-text/route.ts    # Whisper STT API
│   │   ├── text-to-speech/route.ts    # OpenAI TTS API
│   │   └── conversations/             # Conversation management
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Home page
├── components/
│   ├── Avatar.tsx                      # Animated avatar
│   ├── ChatContainer.tsx               # Main chat interface
│   ├── ChatInput.tsx                   # Message input with voice
│   ├── ChatMessage.tsx                 # Message display
│   ├── Sidebar.tsx                     # Conversation sidebar
│   └── ThemeToggle.tsx                 # Theme switcher
├── lib/
│   ├── db/
│   │   ├── index.ts                    # Database client
│   │   ├── schema.ts                   # Database schema
│   │   └── queries.ts                  # Database queries
│   ├── hooks/
│   │   ├── use-chat.ts                 # Chat logic hook
│   │   ├── use-voice-recording.ts      # Voice recording hook
│   │   └── use-text-to-speech.ts       # TTS hook
│   └── store/
│       ├── chat-store.ts               # Chat state management
│       └── theme-store.ts              # Theme state management
└── package.json
```

## Key Features Explained

### Voice Input
- Click the microphone button to start recording
- Speak your message
- Click the stop button to transcribe using Whisper API
- Transcribed text is automatically inserted into the input field

### Voice Output
- Click the "Speak" button on any AI message
- Avatar animates with lip-sync during speech
- Audio level visualization shows speaking intensity

### Avatar Animations
- **Idle**: Gentle pulsing, smiling face
- **Listening**: Small mouth, breathing animation
- **Speaking**: Mouth opens based on audio levels for lip-sync

### Chat History
- All conversations are automatically saved to PostgreSQL
- Click "New Chat" to start a fresh conversation
- Select previous conversations from the sidebar
- Delete conversations with the trash icon

## API Routes

### POST `/api/chat`
Streams AI responses from ChatGPT
```typescript
{
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
  conversationId?: string
}
```

### POST `/api/speech-to-text`
Transcribes audio to text using Whisper
```typescript
FormData { audio: Blob }
```

### POST `/api/text-to-speech`
Generates speech from text
```typescript
{
  text: string,
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
}
```

### Conversation APIs
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get specific conversation
- `PATCH /api/conversations/[id]` - Update conversation
- `DELETE /api/conversations/[id]` - Delete conversation
- `GET /api/conversations/[id]/messages` - Get conversation messages

## Security Best Practices

- API keys are stored in environment variables (never committed to git)
- `.env` is in `.gitignore`
- All API routes validate input
- Database queries use parameterized statements (Drizzle ORM)
- CORS is handled by Next.js API routes
- Rate limiting should be implemented in production

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables (Production)

Ensure all environment variables from `.env.example` are set in your deployment platform.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI API](https://openai.com/)
- Database by [Neon](https://neon.tech/)
