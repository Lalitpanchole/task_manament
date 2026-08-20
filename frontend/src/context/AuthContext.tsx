'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { INITIAL_USER } from '../lib/initialData';
import { authApi, usersApi, getAuthToken, setAuthToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: (params?: { email?: string; name?: string; avatar?: string }) => Promise<void>;
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
          setAuthToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
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
      // Fallback guest user if API fails
      setUser({ ...INITIAL_USER, isAuthenticated: true });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (params?: { email?: string; name?: string; avatar?: string }) => {
    setIsLoading(true);
    try {
      const googleUser = await authApi.loginWithGoogle(params);
      setUser(googleUser);
    } catch (e) {
      console.error('Google login API failed:', e);
      setUser({
        ...INITIAL_USER,
        email: params?.email || INITIAL_USER.email,
        name: params?.name || INITIAL_USER.name,
        avatar: params?.avatar || INITIAL_USER.avatar,
        userType: 'google',
        isAuthenticated: true,
      });
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
      console.warn('Update profile API warning (using local fallback):', e);
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
