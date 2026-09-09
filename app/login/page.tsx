'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Dumbbell, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, t } = useApp();

  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
      } else {
        login(data.user, data.profile);
        router.push('/profile');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isRegister ? 'Join Zero FIT' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Start your personalized nutrition and training journey'
              : 'Sign in to access your saved targets and progress logs'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aman Singh"
                  required={isRegister}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors mt-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Create My Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center text-xs text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-bold text-emerald-600 hover:underline"
          >
            {isRegister ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </div>
    </div>
  );
}
