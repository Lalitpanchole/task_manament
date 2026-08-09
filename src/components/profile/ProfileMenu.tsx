'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Palette, Settings, ChevronRight, Check } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ColorAccentMode } from '../../types/theme';

export const ProfileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [activeSubmenu, setActiveSubmenu] = useState<'none' | 'theme' | 'color'>('none');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const colorOptions: { key: ColorAccentMode; label: string; bg: string }[] = [
    { key: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { key: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { key: 'pink', label: 'Pink', bg: 'bg-pink-500' },
    { key: 'rose', label: 'Rose', bg: 'bg-rose-500' },
    { key: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
    { key: 'black', label: 'Black', bg: 'bg-slate-900 dark:bg-slate-100' },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute top-12 left-0 z-50 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 text-sm animate-in fade-in zoom-in-95"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center p-3 mb-2 border-b border-slate-100 dark:border-slate-800 text-center">
        <Avatar src={user?.avatar} name={user?.name || 'Dexter'} size="lg" className="mb-2" />
        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{user?.name || 'Dexter'}</span>
        <span className="text-xs text-slate-400">{user?.email || 'dexter@gmail.com'}</span>
      </div>

      {/* Main Menu Options */}
      <div className="space-y-1 relative">
        {/* Change Theme Option */}
        <div className="relative">
          <button
            onClick={() => setActiveSubmenu(activeSubmenu === 'theme' ? 'none' : 'theme')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-slate-500" />
              <span>Change Theme</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Theme Submenu Popover */}
          {activeSubmenu === 'theme' && (
            <div className="absolute top-0 left-full ml-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 space-y-1">
              <span className="px-2 py-1 text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                Theme
              </span>
              <button
                onClick={() => setTheme('light')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </div>
                {theme === 'light' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </div>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Color Mode Option */}
        <div className="relative">
          <button
            onClick={() => setActiveSubmenu(activeSubmenu === 'color' ? 'none' : 'color')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-slate-500" />
              <span>Color Mode</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Color Mode Submenu Popover */}
          {activeSubmenu === 'color' && (
            <div className="absolute top-0 left-full ml-2 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 space-y-1">
              <span className="px-2 py-1 text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                Color Mode
              </span>
              {colorOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setColorMode(opt.key)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded ${opt.bg}`} />
                    <span>{opt.label}</span>
                  </div>
                  {colorMode === opt.key && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings Option */}
        <button
          onClick={() => {
            onClose();
            router.push('/settings/profile');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
