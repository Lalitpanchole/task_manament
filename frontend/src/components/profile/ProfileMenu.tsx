'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Palette, Settings, ChevronDown, Check, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ColorAccentMode } from '../../types/theme';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, anchorRef }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [activeSubmenu, setActiveSubmenu] = useState<'none' | 'theme' | 'color'>('none');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const leftPos = Math.min(
        Math.max(12, rect.left),
        window.innerWidth - 300
      );
      setCoords({
        top: rect.bottom + 8,
        left: leftPos,
      });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen || !mounted) return null;

  const colorOptions: { key: ColorAccentMode; label: string; bg: string }[] = [
    { key: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { key: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { key: 'pink', label: 'Pink', bg: 'bg-pink-500' },
    { key: 'rose', label: 'Rose', bg: 'bg-rose-500' },
    { key: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
    { key: 'black', label: 'Black', bg: 'bg-slate-900 dark:bg-slate-100' },
  ];

  const menuContent = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 99999,
      }}
      className="w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 text-sm ring-1 ring-slate-900/10 dark:ring-slate-100/10 animate-in fade-in zoom-in-95"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center p-3 mb-2 border-b border-slate-100 dark:border-slate-800 text-center">
        <Avatar src={user?.avatar} name={user?.name || 'Dexter'} size="lg" className="mb-2 ring-2 ring-slate-100 dark:ring-slate-800" />
        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{user?.name || 'Dexter'}</span>
        <span className="text-xs text-slate-400">{user?.email || 'dexter@gmail.com'}</span>
      </div>

      {/* Main Menu Options */}
      <div className="space-y-1">
        {/* Change Theme Accordion */}
        <div>
          <button
            type="button"
            onClick={() => setActiveSubmenu(activeSubmenu === 'theme' ? 'none' : 'theme')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-medium text-xs">Change Theme</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                activeSubmenu === 'theme' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Inline Theme Submenu Options */}
          {activeSubmenu === 'theme' && (
            <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 py-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </div>
                {theme === 'light' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark</span>
                </div>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Color Mode Accordion */}
        <div>
          <button
            type="button"
            onClick={() => setActiveSubmenu(activeSubmenu === 'color' ? 'none' : 'color')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-xs">Color Mode</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                activeSubmenu === 'color' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Inline Color Submenu Options */}
          {activeSubmenu === 'color' && (
            <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 py-1">
              {colorOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setColorMode(opt.key)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full ${opt.bg} shadow-xs`} />
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
          type="button"
          onClick={() => {
            onClose();
            router.push('/settings/profile');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-xs"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>

        {/* Logout Option */}
        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={async () => {
              onClose();
              await logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium text-xs text-left"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
};

