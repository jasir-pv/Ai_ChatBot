# System Architecture

## High-Level Overview

This application follows a modern Next.js architecture with the App Router, combining server-side API routes with client-side interactive components.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
├─────────────────────────────────────────────────────────┤
│  React Components (Client-Side)                          │
│  ├── Chat UI (ChatContainer, ChatMessage, ChatInput)    │
│  ├── Avatar (Canvas-based animation)                     │
│  ├── Sidebar (Conversation management)                   │
│  └── Theme Toggle                                        │
├─────────────────────────────────────────────────────────┤
│  State Management (Zustand)                              │
│  ├── Chat Store (messages, conversation state)          │
│  └── Theme Store (dark/light mode)                       │
├─────────────────────────────────────────────────────────┤
│  Custom Hooks                                            │
│  ├── useChat (chat logic, streaming)                    │
│  ├── useVoiceRecording (STT)                            │
│  └── useTextToSpeech (TTS with audio analysis)          │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes (Server)                 │
├─────────────────────────────────────────────────────────┤
│  /api/chat                → OpenAI ChatGPT (streaming)  │
│  /api/speech-to-text      → OpenAI Whisper API          │
│  /api/text-to-speech      → OpenAI TTS API              │
│  /api/conversations       → CRUD operations              │
│  /api/conversations/[id]  → Single conversation ops     │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
├─────────────────────────────────────────────────────────┤
│  OpenAI API                                              │
│  ├── GPT-4o (Chat completions)                          │
│  ├── Whisper-1 (Speech-to-text)                         │
│  └── TTS-1 (Text-to-speech)                             │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Database Layer (Drizzle ORM)                │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL (Neon DB)                                    │
│  ├── conversations (id, title, timestamps)              │
│  └── messages (id, role, content, metadata)             │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Text Chat Flow

```
User Input → ChatInput Component
    ↓
useChat Hook (adds message to store)
    ↓
POST /api/chat (streaming)
    ↓
OpenAI ChatGPT API
    ↓
Stream Response → Update UI incrementally
    ↓
Save to Database (conversations & messages tables)
```

### 2. Voice Input Flow (STT)

```
User Clicks Mic → useVoiceRecording Hook
    ↓
MediaRecorder API (browser)
    ↓
Record Audio Blob (WebM format)
    ↓
POST /api/speech-to-text
    ↓
OpenAI Whisper API
    ↓
Transcribed Text → Insert into ChatInput
```

### 3. Voice Output Flow (TTS)

```
User Clicks "Speak" → useTextToSpeech Hook
    ↓
POST /api/text-to-speech
    ↓
OpenAI TTS API
    ↓
Audio Buffer (MP3)
    ↓
Web Audio API (AudioContext + AnalyserNode)
    ↓
Play Audio + Analyze Frequency Data
    ↓
Update Avatar (lip-sync based on audio level)
```

### 4. Avatar Animation Flow

```
Audio Analysis (Web Audio API)
    ↓
Extract Audio Level (0-1 normalized)
    ↓
Avatar Component (Canvas redraw)
    ↓
Mouth Opening = f(audioLevel)
```

## Component Architecture

### Core Components

1. **ChatContainer** (Main orchestrator)
   - Manages chat UI layout
   - Coordinates avatar, messages, and input
   - Handles auto-scrolling

2. **Avatar** (Visual feedback)
   - Canvas-based rendering
   - State-based animations (idle, listening, speaking)
   - Lip-sync using audio level data

3. **ChatMessage** (Message display)
   - Markdown rendering with syntax highlighting
   - Code block copy functionality
   - TTS trigger button

4. **ChatInput** (User input)
   - Text input with auto-resize
   - Voice recording integration
   - Submit handling

5. **Sidebar** (Conversation management)
   - List all conversations
   - Create new conversations
   - Delete conversations
   - Select active conversation

### State Management

**Zustand Stores:**

1. **chatStore**
   - messages: Array of chat messages
   - isLoading/isStreaming: Loading states
   - currentConversationId: Active conversation
   - Actions: addMessage, updateLastMessage, etc.

2. **themeStore**
   - theme: 'light' | 'dark'
   - Persisted to localStorage
   - Actions: toggleTheme, setTheme

### Custom Hooks

1. **useChat**
   - Manages chat logic
   - Handles streaming responses
   - Integrates with chat store

2. **useVoiceRecording**
   - Controls MediaRecorder
   - Sends audio to Whisper API
   - Returns transcribed text

3. **useTextToSpeech**
   - Fetches audio from TTS API
   - Manages audio playback
   - Provides audio level for lip-sync

## Database Schema

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Design

### RESTful Endpoints

- **Conversations**
  - `GET /api/conversations` - List all
  - `POST /api/conversations` - Create new
  - `GET /api/conversations/[id]` - Get one
  - `PATCH /api/conversations/[id]` - Update
  - `DELETE /api/conversations/[id]` - Delete

- **Messages**
  - `GET /api/conversations/[id]/messages` - Get all messages for conversation

- **AI Services**
  - `POST /api/chat` - Stream chat responses
  - `POST /api/speech-to-text` - Transcribe audio
  - `POST /api/text-to-speech` - Generate speech

### Streaming Implementation

The chat API uses Server-Sent Events (SSE) via ReadableStream:

```typescript
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of openaiStream) {
      controller.enqueue(encoder.encode(chunk));
    }
    controller.close();
  }
});
```

## Security Considerations

1. **API Key Protection**
   - Stored in environment variables
   - Never exposed to client
   - Server-side only

2. **Input Validation**
   - All API routes validate input
   - Type checking with TypeScript
   - Sanitization before database operations

3. **Database Security**
   - Parameterized queries via Drizzle ORM
   - No SQL injection vulnerabilities
   - Cascade deletes for data integrity

4. **CORS & Headers**
   - Next.js handles CORS by default
   - Appropriate cache headers for streaming

## Performance Optimizations

1. **Streaming Responses**
   - Reduces perceived latency
   - Shows progress immediately
   - Better UX for long responses

2. **Audio Context Reuse**
   - Single AudioContext instance
   - Reduces memory usage
   - Better performance

3. **State Management**
   - Zustand for minimal re-renders
   - Selective component updates
   - Efficient message list rendering

4. **Database Indexing**
   - Primary keys on UUIDs
   - Foreign key constraints
   - Timestamp indexing for sorting

## Scalability Considerations

### Current Architecture
- Serverless Next.js deployment
- Neon DB (serverless PostgreSQL)
- Stateless API routes

### Future Enhancements
1. **Caching Layer**
   - Redis for conversation caching
   - Reduce database queries

2. **Rate Limiting**
   - Protect API endpoints
   - Per-user quotas

3. **WebSocket Support**
   - Real-time updates
   - Multi-device sync

4. **CDN Integration**
   - Static asset caching
   - Audio file caching

5. **Avatar Upgrades**
   - 3D avatars (Three.js/ReadyPlayerMe)
   - More sophisticated animations
   - Avatar customization

## Technology Choices

### Why Next.js 15?
- App Router for better performance
- Server Components support
- Built-in API routes
- Excellent TypeScript support

### Why Zustand?
- Lightweight (1KB)
- Simple API
- No boilerplate
- Easy persistence

### Why Drizzle ORM?
- Type-safe queries
- Excellent TypeScript integration
- Lightweight
- SQL-like syntax

### Why OpenAI APIs?
- Best-in-class models
- Reliable performance
- Unified platform (Chat, STT, TTS)
- Good documentation

### Why Neon DB?
- Serverless PostgreSQL
- Auto-scaling
- Generous free tier
- Easy Vercel integration

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Database Migrations**
   ```bash
   npm run db:generate  # Generate migrations
   npm run db:push      # Apply to database
   ```

3. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Monitoring & Debugging

### Recommended Tools
- Vercel Analytics (performance)
- OpenAI Dashboard (API usage)
- Neon Console (database monitoring)
- Browser DevTools (client-side debugging)

### Logging
- Server-side: console.error in API routes
- Client-side: React DevTools
- Network: Browser Network tab

## Future Roadmap

1. **User Authentication**
   - NextAuth.js integration
   - Per-user conversations
   - User preferences

2. **Advanced Avatar**
   - 3D models
   - Custom avatars
   - Emotion detection

3. **Multi-language Support**
   - i18n integration
   - Language detection
   - Translated UI

4. **Export/Import**
   - Export conversations
   - Share conversations
   - Import chat history

5. **Analytics Dashboard**
   - Usage statistics
   - Cost tracking
   - Performance metrics
