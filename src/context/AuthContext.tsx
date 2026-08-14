'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { INITIAL_USER } from '../lib/initialData';
import { authApi, usersApi, getAuthToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = getAuthToken();
      if (token) {
        try {
          const backendUser = await authApi.getMe();
          setUser(backendUser);
        } catch (e) {
          // Token invalid or backend unreachable, fallback to guest login
          try {
            const guestUser = await authApi.loginAsGuest();
            setUser(guestUser);
          } catch {
            setUser(INITIAL_USER);
          }
        }
      } else {
        // Automatically create guest session via API if no token
        try {
          const guestUser = await authApi.loginAsGuest();
          setUser(guestUser);
        } catch (e) {
          setUser(INITIAL_USER);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      const guestUser = await authApi.loginAsGuest();
      setUser(guestUser);
    } catch (e) {
      console.error('Guest login API failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const googleUser = await authApi.loginWithGoogle();
      setUser(googleUser);
    } catch (e) {
      console.error('Google login API failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = await usersApi.updateProfile(data);
      setUser(updatedUser);
    } catch (e) {
      console.error('Update profile API failed:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isAuthenticated,
        isLoading,
        loginAsGuest,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
