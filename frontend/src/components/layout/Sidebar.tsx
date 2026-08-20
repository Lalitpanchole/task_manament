'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Folder, ChevronDown, X, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { ProfileMenu } from '../profile/ProfileMenu';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const desktopButtonRef = React.useRef<HTMLButtonElement>(null);
  const mobileButtonRef = React.useRef<HTMLButtonElement>(null);

  const navItems = [
    { name: 'Tasks', href: '/tasks', icon: LayoutGrid },
    { name: 'Projects', href: '/projects', icon: Folder },
  ];

  const renderContent = (btnRef: React.RefObject<HTMLButtonElement | null>) => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 w-64 p-4">
      {/* Workspace Header Selector */}
      <div className="relative mb-6">
        <button
          ref={btnRef}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Avatar src={user?.avatar} name={user?.name || 'Dexter'} size="md" />
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {user?.name || 'Dexter'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Workspace Navigation Links */}
      <div className="flex-1 space-y-6">
        <div>
          <span className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            Workspace
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'accent-text' : 'text-slate-400')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-900 dark:text-white text-sm">
            {user?.name || 'Dexter'}
          </span>
        </div>
      </div>

      {/* Mobile Overlay & Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-50 w-64 max-w-full bg-white dark:bg-slate-950 h-full shadow-2xl">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            {renderContent(mobileButtonRef)}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-40">
        {renderContent(desktopButtonRef)}
      </aside>

      {/* Global Portal Profile Menu */}
      <ProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        anchorRef={isMobileOpen ? mobileButtonRef : desktopButtonRef}
      />
    </>
  );
};
