'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AvatarFallbackProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
}

export function AvatarFallback({
  isListening = false,
  isSpeaking = false,
  audioLevel = 0
}: AvatarFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw face circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();

    // Draw eyes
    const eyeY = centerY - 20;
    const eyeSize = 8;

    // Left eye
    ctx.beginPath();
    ctx.arc(centerX - 25, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Right eye
    ctx.beginPath();
    ctx.arc(centerX + 25, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw mouth (changes based on state)
    if (isSpeaking) {
      // Animated mouth for speaking
      const mouthOpenness = audioLevel * 30 + 10;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 25, 25, mouthOpenness, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1f2937';
      ctx.fill();
    } else if (isListening) {
      // Small circle for listening
      ctx.beginPath();
      ctx.arc(centerX, centerY + 25, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#1f2937';
      ctx.fill();
    } else {
      // Smile for idle
      ctx.beginPath();
      ctx.arc(centerX, centerY + 15, 25, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }, [isListening, isSpeaking, audioLevel]);

  return (
    <div className="w-full h-80 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full p-8">
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : isListening ? [1, 1.03, 1] : 1,
          }}
          transition={{
            duration: isSpeaking ? 0.3 : 1,
            repeat: isSpeaking || isListening ? Infinity : 0,
          }}
        >
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="rounded-full shadow-lg"
          />
        </motion.div>

        <div className="mt-4 text-center">
          {isSpeaking && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Speaking...
            </motion.p>
          )}
          {isListening && !isSpeaking && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Listening...
            </motion.p>
          )}
          {!isSpeaking && !isListening && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Idle</p>
          )}
        </div>

        {/* Audio level indicator */}
        {isSpeaking && (
          <div className="mt-4 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500"
              style={{ width: `${audioLevel * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        {/* WebGL Not Available Notice */}
        <div className="mt-4 text-xs text-yellow-600 dark:text-yellow-400 text-center max-w-xs">
          ⚠️ 3D avatar unavailable (WebGL disabled). Using 2D avatar.
        </div>
      </div>
    </div>
  );
}
