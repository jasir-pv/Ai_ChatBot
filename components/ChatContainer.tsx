'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { HeyGenAvatar, HeyGenAvatarRef } from './HeyGenAvatar';
import { AvatarSelector } from './AvatarSelector';
import { LiveModeButton } from './LiveModeButton';
import { useChat } from '@/lib/hooks/use-chat';
import { useTextToSpeech } from '@/lib/hooks/use-text-to-speech';
import { useVoiceRecording } from '@/lib/hooks/use-voice-recording';
import { useChatStore } from '@/lib/store/chat-store';

export function ChatContainer() {
  const { messages, isStreaming, sendMessage } = useChat();
  const { isPlaying, audioLevel, speak } = useTextToSpeech();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HeyGenAvatarRef>(null);
  const { currentConversationId } = useChatStore();

  // Live mode state
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const shouldContinueRef = useRef(false);
  const lastMessageCountRef = useRef(0);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState('https://models.readyplayer.me/6585eb9c01aacc03ad2e7f5b.glb');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeak = (content: string) => {
    speak(content);
  };

  // Start live mode
  const startLiveMode = useCallback(async () => {
    setIsLiveMode(true);
    shouldContinueRef.current = true;
    lastMessageCountRef.current = messages.length;
    setLiveStatus('listening');
    await startRecording();
  }, [startRecording, messages.length]);

  // Stop live mode
  const stopLiveMode = useCallback(() => {
    setIsLiveMode(false);
    shouldContinueRef.current = false;
    setLiveStatus('idle');
  }, []);

  // Handle user finished speaking (manual trigger)
  const handleUserFinishedSpeaking = useCallback(async () => {
    if (!isLiveMode || !isRecording) return;

    setLiveStatus('processing');
    const transcribedText = await stopRecording();

    if (transcribedText && shouldContinueRef.current) {
      // Send message to AI
      await sendMessage(transcribedText);
    } else if (shouldContinueRef.current) {
      // No text, restart listening
      setLiveStatus('listening');
      await startRecording();
    }
  }, [isLiveMode, isRecording, stopRecording, sendMessage, startRecording]);

  // Auto-speak AI responses in live mode
  useEffect(() => {
    if (!isLiveMode || isStreaming || isPlaying) return;

    // Check if there's a new AI message
    if (messages.length > lastMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.role === 'assistant' && lastMessage.content) {
        setLiveStatus('speaking');
        lastMessageCountRef.current = messages.length;
        speak(lastMessage.content);
      }
    }
  }, [isLiveMode, messages, isStreaming, isPlaying, speak]);

  // Restart listening after AI finishes speaking
  useEffect(() => {
    if (!isLiveMode || isPlaying || liveStatus !== 'speaking') return;

    const restartListening = async () => {
      if (shouldContinueRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLiveStatus('listening');
        await startRecording();
      }
    };

    restartListening();
  }, [isLiveMode, isPlaying, liveStatus, startRecording]);

  return (
    <div className="flex flex-col h-screen">
      {/* Avatar Section */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        {/* Avatar Selector - Hide in Live Mode */}
        {!isLiveMode && (
          <div className="flex justify-center mb-4">
            <AvatarSelector currentAvatar={avatarUrl} onAvatarChange={setAvatarUrl} />
          </div>
        )}

        {/* HeyGen Live Avatar */}
        <HeyGenAvatar
          ref={avatarRef}
          isListening={isLiveMode && liveStatus === 'listening'}
          isSpeaking={isPlaying}
          audioLevel={audioLevel}
        />

        {/* Buttons Row - Side by Side */}
        <div className="flex gap-2 justify-center pt-3">
          {/* Live Mode Button */}
          <LiveModeButton
            isActive={isLiveMode}
            status={liveStatus}
            onStart={startLiveMode}
            onStop={stopLiveMode}
          />

          {/* Done Speaking button - next to Live Mode button */}
          {isLiveMode && liveStatus === 'listening' && (
            <button
              onClick={handleUserFinishedSpeaking}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Done Speaking
            </button>
          )}
        </div>
      </div>

      {/* Messages Section - HIDE during Live Mode */}
      {!isLiveMode && (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Welcome to AI Avatar Chat
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                  Start a conversation by typing a message, using voice input, or try Live Chat mode for continuous conversation.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    onSpeak={
                      message.role === 'assistant'
                        ? () => handleSpeak(message.content)
                        : undefined
                    }
                  />
                ))}
                {isStreaming && (
                  <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-indigo-500 to-purple-600">
                      AI
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Input Section - HIDE during Live Mode */}
      {!isLiveMode && (
        <div className="flex-shrink-0">
          <ChatInput
            onSend={sendMessage}
            disabled={isStreaming}
          />
        </div>
      )}
    </div>
  );
}
