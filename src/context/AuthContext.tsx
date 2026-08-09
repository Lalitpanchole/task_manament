'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { INITIAL_USER } from '../lib/initialData';
import { getStorageItem, setStorageItem, removeStorageItem } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsGuest: () => void;
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const STORAGE_KEY = 'ablespace_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = getStorageItem<User | null>(STORAGE_KEY, INITIAL_USER);
    if (savedUser && savedUser.isAuthenticated) {
      setUser(savedUser);
    } else {
      setUser(INITIAL_USER); // Default to logged in as guest/dexter for seamless experience
    }
    setIsLoading(false);
  }, []);

  const saveUserSession = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      setStorageItem(STORAGE_KEY, newUser);
    } else {
      removeStorageItem(STORAGE_KEY);
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@ablespace.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      title: 'Guest',
      username: 'guestuser',
      userType: 'guest',
      isAuthenticated: true,
    };
    saveUserSession(guestUser);
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      id: 'google-dexter',
      name: 'Dexter',
      email: 'dexter@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      title: 'Designer',
      username: 'Dexuser',
      userType: 'google',
      isAuthenticated: true,
    };
    saveUserSession(googleUser);
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUserSession(updated);
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
