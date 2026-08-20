'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { Edit2, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const ProfileSettingsForm: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || 'Dexter');
  const [email, setEmail] = useState(user?.email || 'dexter@gmail.com');
  const [title, setTitle] = useState(user?.title || 'Designer');
  const [username, setUsername] = useState(user?.username || 'Dexuser');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  const [isSaved, setIsSaved] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      title,
      username,
      avatar: avatarUrl,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleConfirmLeave = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Top Header / Back Link */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/tasks"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile</h1>
        </div>
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs text-xs">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Profile picture</span>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Avatar src={avatarUrl} name={name} size="lg" />
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Avatar image URL"
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs flex-1 sm:w-64 max-w-full"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Email</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full sm:w-64"
            />
            <Edit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Full Name */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full sm:w-64"
          />
        </div>

        {/* Title / Role */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">Title</span>
            <span className="text-[10px] text-slate-400">Your job title or role</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full sm:w-64"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">Username</span>
            <span className="text-[10px] text-slate-400">One word, like a nickname or first name</span>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full sm:w-64"
          />
        </div>

        {/* Form Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {isSaved && <span className="text-xs text-emerald-600 font-semibold">Saved successfully!</span>}
          <button type="submit" className="btn-primary px-5 py-2 rounded-lg font-semibold shadow-xs">
            Save Profile
          </button>
        </div>
      </form>

      {/* Workspace Access Section (Screen 13, 14) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xs text-xs">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Workspace access</h3>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-400">Remove yourself from the workspace</span>
          <button
            type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Workspace</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Leaving Workspace */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Workspace"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to leave the workspace? You will be logged out and returned to the login screen.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLeave}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Confirm & Leave
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
