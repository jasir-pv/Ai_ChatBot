import { useState } from 'react';
import { useChatStore } from '../store/chat-store';

export function useChat() {
  const {
    messages,
    isStreaming,
    addMessage,
    updateLastMessage,
    setIsStreaming,
    currentConversationId,
  } = useChatStore();

  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    try {
      setError(null);

      // Add user message
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content,
        timestamp: new Date(),
      };
      addMessage(userMessage);

      // Create assistant message placeholder
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: '',
        timestamp: new Date(),
      };
      addMessage(assistantMessage);

      setIsStreaming(true);

      // Prepare messages for API
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Stream response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          conversationId: currentConversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullContent += chunk;
          updateLastMessage(fullContent);
        }
      }

      setIsStreaming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsStreaming(false);
    }
  };

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
  };
}
