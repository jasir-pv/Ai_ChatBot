'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Volume2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  onSpeak?: () => void;
}

export function ChatMessage({ role, content, onSpeak }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useThemeStore();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-4 p-4 ${
        role === 'user'
          ? 'bg-transparent'
          : 'bg-gray-50 dark:bg-gray-800/50'
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
          role === 'user'
            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}
      >
        {role === 'user' ? 'U' : 'AI'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');

                return !inline && match ? (
                  <div className="relative group">
                    <button
                      onClick={() => copyToClipboard(codeString)}
                      className="absolute right-2 top-2 p-2 rounded bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Copy code"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <SyntaxHighlighter
                      style={theme === 'dark' ? vscDarkPlus : vs}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {role === 'assistant' && onSpeak && (
          <button
            onClick={onSpeak}
            className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Speak message"
          >
            <Volume2 size={16} />
            <span>Speak</span>
          </button>
        )}
      </div>
    </div>
  );
}
