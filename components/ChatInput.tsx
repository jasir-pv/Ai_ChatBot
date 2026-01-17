'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square } from 'lucide-react';
import { useVoiceRecording } from '@/lib/hooks/use-voice-recording';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setInput((prev) => (prev ? `${prev} ${text}` : text));
      }
    } else {
      await startRecording();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isProcessing ? 'Processing voice...' : 'Type your message... (Shift+Enter for new line)'}
            disabled={disabled || isProcessing}
            rows={1}
            className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 max-h-32 overflow-y-auto"
          />
        </div>

        <button
          type="button"
          onClick={handleVoiceToggle}
          disabled={disabled || isProcessing}
          className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </button>

        <button
          type="submit"
          disabled={!input.trim() || disabled || isProcessing}
          className="flex-shrink-0 p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>

      {isProcessing && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Transcribing audio...
        </p>
      )}
    </form>
  );
}
