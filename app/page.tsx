'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ChatContainer } from '@/components/ChatContainer';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useChatStore } from '@/lib/store/chat-store';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    setMessages,
    setCurrentConversationId,
    currentConversationId,
    clearMessages,
  } = useChatStore();

  const handleNewConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });

      if (response.ok) {
        const conversation = await response.json();
        setCurrentConversationId(conversation.id);
        clearMessages();
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleSelectConversation = async (id: string) => {
    try {
      setCurrentConversationId(id);

      // Fetch messages for this conversation
      const response = await fetch(`/api/conversations/${id}/messages`);
      if (response.ok) {
        const dbMessages = await response.json();

        // Convert to chat store format
        const formattedMessages = dbMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }));

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleDeleteConversation = (id: string) => {
    if (currentConversationId === id) {
      clearMessages();
      setCurrentConversationId(null);
    }
  };

  // Create initial conversation on mount if none exists
  useEffect(() => {
    if (!currentConversationId) {
      handleNewConversation();
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-40 transition-transform duration-300 h-full`}
      >
        <Sidebar
          currentConversationId={currentConversationId}
          onNewConversation={handleNewConversation}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer />
      </div>
    </div>
  );
}
