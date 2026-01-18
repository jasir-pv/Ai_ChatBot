'use client';

import { useState } from 'react';
import { User, Sparkles } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (url: string) => void;
}

// Predefined Ready Player Me avatars
const PRESET_AVATARS = [
  {
    id: 'male-1',
    name: 'Professional Male',
    url: 'https://models.readyplayer.me/6585eb9c01aacc03ad2e7f5b.glb',
    thumbnail: 'https://models.readyplayer.me/6585eb9c01aacc03ad2e7f5b.png'
  },
  {
    id: 'female-1',
    name: 'Professional Female',
    url: 'https://models.readyplayer.me/657c3b3d76f76a58cdf59979.glb',
    thumbnail: 'https://models.readyplayer.me/657c3b3d76f76a58cdf59979.png'
  },
  {
    id: 'male-2',
    name: 'Casual Male',
    url: 'https://models.readyplayer.me/64bfa94f0e72c63d7c3934a6.glb',
    thumbnail: 'https://models.readyplayer.me/64bfa94f0e72c63d7c3934a6.png'
  },
  {
    id: 'female-2',
    name: 'Casual Female',
    url: 'https://models.readyplayer.me/65d85bd21a29f50e3289dc26.glb',
    thumbnail: 'https://models.readyplayer.me/65d85bd21a29f50e3289dc26.png'
  }
];

export function AvatarSelector({ currentAvatar, onAvatarChange }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleSelectAvatar = (url: string) => {
    onAvatarChange(url);
    setIsOpen(false);
  };

  const handleCustomAvatar = () => {
    if (customUrl.trim() && customUrl.includes('readyplayer.me')) {
      onAvatarChange(customUrl.trim());
      setCustomUrl('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <User size={18} />
        <span className="text-sm font-medium">Change Avatar</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="absolute top-full mt-2 left-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-500" />
              Choose Your Avatar
            </h3>

            {/* Preset Avatars Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {PRESET_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleSelectAvatar(avatar.url)}
                  className={`relative group overflow-hidden rounded-lg border-2 transition-all ${
                    currentAvatar === avatar.url
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-medium">{avatar.name}</p>
                  </div>
                  {currentAvatar === avatar.url && (
                    <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Avatar URL */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <label className="block text-sm font-medium mb-2">
                Custom Ready Player Me URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://models.readyplayer.me/..."
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleCustomAvatar}
                  disabled={!customUrl.trim() || !customUrl.includes('readyplayer.me')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Use
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Create your own at{' '}
                <a
                  href="https://readyplayer.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  readyplayer.me
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
