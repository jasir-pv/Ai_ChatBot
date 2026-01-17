You are a senior full-stack engineer and AI product architect.
I want you to design and generate a production-ready Next.js web application that functions like ChatGPT / Google Gemini, with text, voice, and live avatar interaction.

🔹 Project Overview

Build an AI chatbot web app using Next.js (App Router) that supports:

Text-based chat

Voice input (Speech-to-Text)

Voice output (Text-to-Speech)

Live avatar interaction during conversations

Uses ChatGPT API (I will provide the API key)

🔹 Core Features
1. Chat System

Real-time chat UI (ChatGPT-style)

Streaming AI responses

Conversation memory per session

Markdown rendering (code blocks, lists, tables)

2. Voice Features

Speech-to-Text (STT):

Convert microphone audio to text

Auto-insert text into chat input

Support start / stop recording

Text-to-Speech (TTS):

AI responses spoken aloud

Natural-sounding voice

Play / pause / stop controls

3. Live Avatar Interaction

2D or 3D avatar visible during live chat

Avatar reacts while:

User is speaking

AI is responding

Lip-sync with TTS audio

Idle / listening / speaking animations

(Avatar can be implemented using Canvas / WebGL / Three.js / ReadyPlayerMe / Live2D — choose the most practical approach)

🔹 Tech Stack Requirements

Frontend

Next.js (latest, App Router)

TypeScript

Tailwind CSS

Web Audio API

Web Speech API (if suitable)

AI Integration

ChatGPT API (OpenAI compatible)

Streaming responses

Secure API key handling via env variables

Optional Enhancements

Avatar customization (gender, style)

Theme switch (light/dark)

Chat history persistence

🔹 Architecture Expectations

Clean folder structure

Separation of concerns (UI, API, hooks, services)

Reusable components

Scalable design

Provide:

Folder structure

Core components

API routes

Hooks for chat, STT, TTS

Avatar integration logic

Example code snippets

🔹 UX Expectations

Modern, polished UI

Smooth animations

Low latency

Mobile-responsive

🔹 Deliverables

High-level system architecture

Next.js project structure

Key implementation code

Explanation of avatar + voice pipeline

Security best practices for API keys

Important:
Build this as if it will be used in a real production AI product similar to ChatGPT or Gemini.