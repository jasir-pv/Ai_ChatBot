'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  avatarUrl?: string;
}

// Ready Player Me avatar model component
function AvatarModel({
  avatarUrl,
  isSpeaking,
  audioLevel
}: {
  avatarUrl: string;
  isSpeaking: boolean;
  audioLevel: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(avatarUrl);
  const headBoneRef = useRef<THREE.Bone | null>(null);

  useEffect(() => {
    if (scene) {
      // Find the head bone for head movements
      scene.traverse((child) => {
        if (child instanceof THREE.Bone) {
          if (child.name.toLowerCase().includes('head')) {
            headBoneRef.current = child;
          }
        }
      });
    }
  }, [scene]);

  // Animate based on speaking state
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Gentle breathing/idle animation
    if (!isSpeaking) {
      meshRef.current.position.y = Math.sin(time * 2) * 0.02;

      // Gentle head rotation
      if (headBoneRef.current) {
        headBoneRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      }
    } else {
      // Speaking animation - more dynamic movement
      meshRef.current.position.y = Math.sin(time * 8) * 0.03 * audioLevel;

      // Head movements based on audio
      if (headBoneRef.current) {
        headBoneRef.current.rotation.y = Math.sin(time * 3) * 0.1 * audioLevel;
        headBoneRef.current.rotation.x = Math.sin(time * 4) * 0.05 * audioLevel;
      }
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={2} position={[0, -1.5, 0]} />
    </group>
  );
}

// Fallback avatar if Ready Player Me URL is not provided
function FallbackAvatar({ isSpeaking, audioLevel }: { isSpeaking: boolean; audioLevel: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    if (isSpeaking) {
      meshRef.current.scale.y = 1 + Math.sin(time * 10) * 0.1 * audioLevel;
    } else {
      meshRef.current.position.y = Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}

export function Avatar3D({
  isListening = false,
  isSpeaking = false,
  audioLevel = 0,
  avatarUrl = 'https://models.readyplayer.me/6585eb9c01aacc03ad2e7f5b.glb' // Default RPM avatar
}: Avatar3DProps) {
  return (
    <div className="w-full h-80 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />

        {/* Avatar */}
        <Suspense fallback={<FallbackAvatar isSpeaking={isSpeaking} audioLevel={audioLevel} />}>
          <AvatarModel
            avatarUrl={avatarUrl}
            isSpeaking={isSpeaking}
            audioLevel={audioLevel}
          />
        </Suspense>

        {/* Camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Status indicator */}
      <div className="relative -mt-16 mb-4 text-center">
        <div className="inline-block px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
          {isSpeaking && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Speaking...</span>
            </div>
          )}
          {isListening && !isSpeaking && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Listening...</span>
            </div>
          )}
          {!isSpeaking && !isListening && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-white text-sm font-medium">Idle</span>
            </div>
          )}
        </div>
      </div>

      {/* Audio level indicator */}
      {isSpeaking && (
        <div className="px-8 pb-4">
          <div className="h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-100"
              style={{ width: `${audioLevel * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Preload the default avatar
useGLTF.preload('https://models.readyplayer.me/6585eb9c01aacc03ad2e7f5b.glb');
