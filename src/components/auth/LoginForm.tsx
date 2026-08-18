'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Triangle, Loader2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { loginAsGuest, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleGuest = async () => {
    setLoading('guest');
    try {
      await loginAsGuest();
      router.push('/tasks');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    setLoading('google');
    try {
      await loginWithGoogle();
      router.push('/tasks');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      {/* Decorative side floating avatars matching Figma Screen 1 */}
      <div className="absolute top-1/3 right-12 hidden md:flex items-center -space-x-2 bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          alt="Avatar 1"
          className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
          alt="Avatar 2"
          className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
        />
      </div>

      <div className="absolute bottom-1/4 right-1/4 hidden md:flex items-center justify-center w-12 h-12 bg-emerald-600 text-white font-bold text-lg rounded-full shadow-md">
        A
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
        {/* Pyramid Logo Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="p-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg">
            <Triangle className="w-4 h-4 fill-current" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Pyramid</span>
        </div>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
          Let&apos;s get back on track
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Enter your email below to login to your account.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGuest}
            disabled={!!loading}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-75"
          >
            {loading === 'guest' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue as Guest'}
          </button>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={!!loading}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-75"
          >
            {loading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Login with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Legal Terms */}
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};
