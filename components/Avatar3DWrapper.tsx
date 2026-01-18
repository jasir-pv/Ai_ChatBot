'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { AvatarFallback } from './AvatarFallback';

// Dynamically import Avatar3D with no SSR to avoid Three.js issues
const Avatar3D = dynamic(() => import('./Avatar3D').then(mod => ({ default: mod.Avatar3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading 3D Avatar...</p>
      </div>
    </div>
  ),
});

interface Avatar3DWrapperProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  avatarUrl?: string;
}

// Check if WebGL is supported
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export function Avatar3DWrapper(props: Avatar3DWrapperProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Check WebGL support on client side
    const supported = isWebGLAvailable();
    setWebglSupported(supported);

    // If not supported, show fallback after a brief delay
    if (!supported) {
      const timer = setTimeout(() => setShowFallback(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Show loading while checking
  if (webglSupported === null) {
    return (
      <div className="w-full h-80 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking WebGL support...</p>
        </div>
      </div>
    );
  }

  // Show fallback if WebGL not supported
  if (!webglSupported || showFallback) {
    return <AvatarFallback {...props} />;
  }

  // Try to show 3D avatar with error boundary fallback
  return (
    <Suspense fallback={
      <div className="w-full h-80 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading 3D Avatar...</p>
        </div>
      </div>
    }>
      <ErrorBoundary fallback={<AvatarFallback {...props} />}>
        <Avatar3D {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}

// Simple Error Boundary for catching WebGL errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Avatar3D Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

import React from 'react';
