'use client';

import { Radio, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveModeButtonProps {
  isActive: boolean;
  status: 'idle' | 'listening' | 'processing' | 'speaking';
  onStart: () => void;
  onStop: () => void;
}

export function LiveModeButton({
  isActive,
  status,
  onStart,
  onStop,
}: LiveModeButtonProps) {
  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      default:
        return 'Start Live Chat';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'from-blue-500 to-blue-600';
      case 'processing':
        return 'from-yellow-500 to-orange-600';
      case 'speaking':
        return 'from-green-500 to-green-600';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {!isActive ? (
        <button
          onClick={onStart}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <Radio size={24} />
          <span>Start Live Chat</span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{
              scale: status === 'listening' || status === 'speaking' ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: status === 'listening' || status === 'speaking' ? Infinity : 0,
            }}
            className={`flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${getStatusColor()} text-white font-semibold rounded-full shadow-lg`}
          >
            <div className="flex gap-1">
              <motion.div
                className="w-1 h-6 bg-white rounded-full"
                animate={{
                  height: status === 'listening' || status === 'speaking' ? ['24px', '32px', '24px'] : '24px',
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: 0,
                }}
              />
              <motion.div
                className="w-1 h-6 bg-white rounded-full"
                animate={{
                  height: status === 'listening' || status === 'speaking' ? ['24px', '32px', '24px'] : '24px',
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: 0.1,
                }}
              />
              <motion.div
                className="w-1 h-6 bg-white rounded-full"
                animate={{
                  height: status === 'listening' || status === 'speaking' ? ['24px', '32px', '24px'] : '24px',
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: 0.2,
                }}
              />
            </div>
            <span>{getStatusText()}</span>
          </motion.div>

          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
          >
            <Square size={16} />
            <span>Stop Live Chat</span>
          </button>

          {status === 'listening' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Speak now... Click "Stop Live Chat" when done
            </p>
          )}
        </div>
      )}

      {!isActive && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
          Continuous voice conversation mode: Speak, AI responds, repeats automatically
        </p>
      )}
    </div>
  );
}
