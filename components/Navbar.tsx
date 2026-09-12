'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Dumbbell,
  BookOpen,
  Utensils,
  Flame,
  Calculator,
  LineChart,
  User,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Sparkles,
  LogOut,
  Shield,
} from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t, isDark, toggleDarkMode, user, logout, setShowAiChat } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {
      href: '/profile',
      label:
        lang === 'pa'
          ? 'ਆਪਣਾ ਪਰਸਨਲਾਈਜ਼ਡ ਪਲੈਨ ਲਵੋ'
          : lang === 'hi'
          ? 'अपना पर्सनलाइज़्ड प्लान लें'
          : 'Get Your Personalized Plan',
      icon: Sparkles,
      highlight: true,
    },
    {
      href: '/progress',
      label:
        lang === 'pa'
          ? 'ਪ੍ਰੋਗਰੈਸ ਟਰੈਕਰ'
          : lang === 'hi'
          ? 'प्रोग्रेस ट्रैकर'
          : 'Progress Tracker',
      icon: LineChart,
      highlight: false,
    },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 transition-colors duration-200">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <Shield className="w-3.5 h-3.5 inline" />
        <span>Evidence-Based Indian & Punjabi Fitness • Personalized Nutrition & Joint-Safe Workouts</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  ZERO<span className="text-emerald-600 dark:text-emerald-400">FIT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                {lang === 'pa' ? 'ਪੰਜਾਬੀ ਫਿਟਨੈਸ' : lang === 'hi' ? 'भारतीय फिटनेस' : 'Evidence-Based'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: AI Button, Lang, Theme, Profile */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* AI Assistant Quick Pill */}
            <button
              onClick={() => setShowAiChat(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Coach</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1 text-xs font-semibold"
                aria-label="Select Language"
              >
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="uppercase">{lang}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code as any);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between ${
                        lang === l.code
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{l.label}</span>
                      {lang === l.code && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
            </button>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                >
                  {t.login}
                </Link>
                <Link
                  href="/profile"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all"
                >
                  {t.getYourPlan}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setShowAiChat(true)}
              className="p-1.5 rounded-full bg-emerald-600 text-white"
              aria-label="AI Coach"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Language:</span>
            <div className="flex space-x-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code as any)}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    lang === l.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
            {user ? (
              <div className="flex items-center justify-between px-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-emerald-600"
                >
                  {user.name} ({t.profile})
                </Link>
                <button onClick={logout} className="text-xs text-red-500 font-semibold">
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-emerald-600 text-emerald-600 font-bold text-sm"
                >
                  {t.login}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
                >
                  {t.getYourPlan}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
