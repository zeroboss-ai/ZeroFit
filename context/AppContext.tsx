'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, UserProfile } from '@/types';
import { translations, getTranslation } from '@/lib/i18n';
import { computePersonalizedTargets } from '@/lib/personalization';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
  isDark: boolean;
  toggleDarkMode: () => void;
  user: { id: string; name: string; email: string } | null;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  login: (userData: any, profileData: any) => void;
  logout: () => void;
  showAiChat: boolean;
  setShowAiChat: (show: boolean) => void;
  notificationsEnabled: boolean;
  requestNotificationPermission: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [showAiChat, setShowAiChat] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('zero_fit_lang') as Language;
      if (savedLang && ['en', 'hi', 'pa'].includes(savedLang)) {
        setLangState(savedLang);
      }

      const savedTheme = localStorage.getItem('zero_fit_theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      }

      // Check Notification status
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }

      // Check session
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            setProfileState(data.profile);
          } else {
            // Check if visitor has saved blueprint locally
            const savedBlueprint = localStorage.getItem('zero_fit_profile');
            if (savedBlueprint) {
              try {
                const parsed = JSON.parse(savedBlueprint);
                if (parsed && parsed.weightKg) {
                  setProfileState(parsed);
                  return;
                }
              } catch {}
            }

            // Default visitor profile for calculators & plans
            const defaultProf = computePersonalizedTargets({
              name: 'Guest Athlete',
              age: 28,
              gender: 'male',
              heightCm: 175,
              weightKg: 72,
              targetWeightKg: 70,
              activityLevel: 'moderate',
              goal: 'lose_fat',
              dietPreference: 'veg',
              cuisinePreference: 'north_indian',
            });
            setProfileState(defaultProf);
          }
        })
        .catch(() => {
          const savedBlueprint = localStorage.getItem('zero_fit_profile');
          if (savedBlueprint) {
            try {
              const parsed = JSON.parse(savedBlueprint);
              if (parsed && parsed.weightKg) {
                setProfileState(parsed);
                return;
              }
            } catch {}
          }
          const defaultProf = computePersonalizedTargets({});
          setProfileState(defaultProf);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('zero_fit_lang', newLang);
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('zero_fit_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('zero_fit_theme', 'light');
      }
      return next;
    });
  };

  const login = (userData: any, profileData: any) => {
    setUser(userData);
    setProfileState(profileData);
    if (profileData) {
      localStorage.setItem('zero_fit_profile', JSON.stringify(profileData));
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    const defaultProf = computePersonalizedTargets({});
    setProfileState(defaultProf);
  };

  const setProfile = (newProf: UserProfile) => {
    setProfileState(newProf);
    try {
      localStorage.setItem('zero_fit_profile', JSON.stringify(newProf));
    } catch {}
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setNotificationsEnabled(granted);
      if (granted) {
        new Notification('Zero FIT Reminders Active', {
          body: 'Stay hydrated! Time to drink a glass of water.',
          icon: '/favicon.ico',
        });
      }
      return granted;
    }
    return false;
  };

  const t = getTranslation(lang);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        isDark,
        toggleDarkMode,
        user,
        profile,
        setProfile,
        login,
        logout,
        showAiChat,
        setShowAiChat,
        notificationsEnabled,
        requestNotificationPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
