'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from '@heygen/streaming-avatar';

interface HeyGenAvatarProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  onAvatarReady?: () => void;
  onError?: (error: string) => void;
}

export interface HeyGenAvatarRef {
  speak: (text: string) => Promise<void>;
}

export const HeyGenAvatar = forwardRef<HeyGenAvatarRef, HeyGenAvatarProps>(
  function HeyGenAvatar(
    {
      isListening = false,
      isSpeaking = false,
      audioLevel = 0,
      onAvatarReady,
      onError,
    },
    ref
  ) {
    const mediaStreamRef = useRef<HTMLVideoElement>(null);
    const avatarRef = useRef<StreamingAvatar | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Initialize avatar session
    useEffect(() => {
      initializeAvatar();

      return () => {
        // Cleanup on unmount
        if (avatarRef.current) {
          avatarRef.current.stopAvatar();
        }
      };
    }, []);

    // Update video stream when available
    useEffect(() => {
      if (stream && mediaStreamRef.current) {
        mediaStreamRef.current.srcObject = stream;
      }
    }, [stream]);

    const initializeAvatar = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get streaming token from our backend
        const tokenResponse = await fetch('/api/heygen/create-token', {
          method: 'POST',
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.error || 'Failed to get streaming token');
        }

        const { token } = await tokenResponse.json();

        // Initialize StreamingAvatar with token
        const avatar = new StreamingAvatar({ token });
        avatarRef.current = avatar;

        // Set up event listeners
        avatar.on(StreamingEvents.STREAM_READY, (event) => {
          console.log('Stream ready:', event);
          if (event.detail) {
            setStream(event.detail);
          }
        });

        avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          console.log('Stream disconnected');
          setStream(null);
          setIsReady(false);
        });

        avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
          console.log('Avatar started talking');
        });

        avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
          console.log('Avatar stopped talking');
        });

        // Start avatar session
        const sessionData = await avatar.createStartAvatar({
          quality: AvatarQuality.High,
          avatarName: 'Anna_public_3_20240108',
          voice: {
            voiceId: 'en-US-JennyNeural',
          },
        });

        console.log('Avatar session started:', sessionData);
        setSessionId(sessionData.session_id);
        setIsReady(true);
        setIsLoading(false);
        onAvatarReady?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to initialize avatar';
        console.error('HeyGen Avatar Error:', err);
        setError(errorMessage);
        setIsLoading(false);
        onError?.(errorMessage);
      }
    };

    // Expose speak method to parent
    useImperativeHandle(ref, () => ({
      speak: async (text: string) => {
        if (!avatarRef.current || !sessionId || !isReady) {
          console.error('Avatar not ready');
          throw new Error('Avatar not ready');
        }

        try {
          await avatarRef.current.speak({
            text: text,
            taskType: TaskType.TALK,
          });
        } catch (err) {
          console.error('Speak error:', err);
          throw err;
        }
      },
    }));

    if (error) {
      return (
        <div className="w-full h-96 bg-gradient-to-b from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Avatar Error
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button
              onClick={initializeAvatar}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-96 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white font-medium">
                Initializing HeyGen Avatar...
              </p>
              <p className="text-white/70 text-sm mt-2">
                Getting streaming token and starting session
              </p>
            </div>
          </div>
        )}

        {/* Video Stream */}
        <video
          ref={mediaStreamRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Status Indicators */}
        {isReady && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full"
            >
              {isSpeaking && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">
                    Speaking...
                  </span>
                </div>
              )}
              {isListening && !isSpeaking && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">
                    Listening...
                  </span>
                </div>
              )}
              {!isSpeaking && !isListening && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-white text-sm font-medium">
                    Ready
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Audio Level Indicator */}
        {isSpeaking && audioLevel > 0 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-64">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                style={{ width: `${audioLevel * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Powered by HeyGen Badge */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white/80 text-xs">
            Powered by HeyGen
          </div>
        </div>
      </div>
    );
  }
);
