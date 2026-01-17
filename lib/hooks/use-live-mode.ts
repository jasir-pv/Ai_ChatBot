import { useState, useCallback, useRef, useEffect } from 'react';
import { useVoiceRecording } from './use-voice-recording';
import { useTextToSpeech } from './use-text-to-speech';

interface UseLiveModeProps {
  onUserSpeech: (text: string) => Promise<void>;
  onAIResponse: (text: string) => void;
  isAIResponding: boolean;
}

export function useLiveMode({
  onUserSpeech,
  onAIResponse,
  isAIResponding,
}: UseLiveModeProps) {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { isPlaying, speak, stop: stopSpeaking } = useTextToSpeech();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastResponseRef = useRef<string>('');
  const shouldContinueRef = useRef(false);

  // Start live mode
  const startLiveMode = useCallback(async () => {
    setIsLiveMode(true);
    shouldContinueRef.current = true;
    setStatus('listening');
    await startRecording();
  }, [startRecording]);

  // Stop live mode
  const stopLiveMode = useCallback(() => {
    setIsLiveMode(false);
    shouldContinueRef.current = false;
    setStatus('idle');
    stopSpeaking();

    // Clear any pending operations
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [stopSpeaking]);

  // Handle the conversation loop
  const continueConversation = useCallback(async () => {
    if (!shouldContinueRef.current) return;

    try {
      // Step 1: Listen to user
      setStatus('listening');
      await startRecording();

      // Wait for user to finish speaking (manual stop in UI)
    } catch (error) {
      console.error('Live mode error:', error);
      stopLiveMode();
    }
  }, [startRecording, stopLiveMode]);

  // When user finishes speaking
  const handleUserFinishedSpeaking = useCallback(async () => {
    if (!isLiveMode) return;

    try {
      setStatus('processing');
      const transcribedText = await stopRecording();

      if (!transcribedText || !shouldContinueRef.current) {
        // If no text, restart listening
        if (shouldContinueRef.current) {
          await continueConversation();
        }
        return;
      }

      // Step 2: Send to AI and get response
      await onUserSpeech(transcribedText);

    } catch (error) {
      console.error('Error processing speech:', error);
      if (shouldContinueRef.current) {
        await continueConversation();
      }
    }
  }, [isLiveMode, stopRecording, onUserSpeech, continueConversation]);

  // When AI finishes responding (text streaming complete)
  useEffect(() => {
    if (!isLiveMode || isAIResponding || status !== 'processing') return;

    const speakAndContinue = async () => {
      try {
        // Get the last AI response from the parent component
        setStatus('speaking');

        // Parent will handle speaking via callback
        onAIResponse('trigger-speak');

      } catch (error) {
        console.error('Error in AI response:', error);
        if (shouldContinueRef.current) {
          await continueConversation();
        }
      }
    };

    speakAndContinue();
  }, [isLiveMode, isAIResponding, status, onAIResponse, continueConversation]);

  // When AI finishes speaking, restart listening
  useEffect(() => {
    if (!isLiveMode || isPlaying || status !== 'speaking') return;

    const restartListening = async () => {
      if (shouldContinueRef.current) {
        // Small delay before restarting
        await new Promise(resolve => setTimeout(resolve, 500));
        await continueConversation();
      }
    };

    restartListening();
  }, [isLiveMode, isPlaying, status, continueConversation]);

  return {
    isLiveMode,
    status,
    isListening: isRecording,
    isProcessing: isProcessing || isAIResponding,
    isSpeaking: isPlaying,
    startLiveMode,
    stopLiveMode,
    handleUserFinishedSpeaking,
  };
}
