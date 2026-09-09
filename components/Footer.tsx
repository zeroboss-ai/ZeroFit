'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Dumbbell, ShieldAlert, Heart, Mail, CheckCircle, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                ZERO<span className="text-emerald-400">FIT</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Democratizing evidence-based fitness and nutrition for Punjabi & Indian communities worldwide. Zero extreme diets, zero misinformation—just pure physiology and sustainable habits.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <h5 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-2 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get Evidence-Based Weekly Tips</span>
              </h5>
              {status === 'success' ? (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs py-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Subscribed! Check your inbox for your first nutrition protocol.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {status === 'loading' ? 'Joining...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Hub & Education */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Knowledge Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/knowledge?category=punjabi_indian" className="hover:text-emerald-400 transition-colors">
                  Punjabi & Indian Diets
                </Link>
              </li>
              <li>
                <Link href="/knowledge?category=fat_loss" className="hover:text-emerald-400 transition-colors">
                  Fat Loss Science & Calorie Deficit
                </Link>
              </li>
              <li>
                <Link href="/knowledge?category=muscle_gain" className="hover:text-emerald-400 transition-colors">
                  Muscle Hypertrophy & Progressive Overload
                </Link>
              </li>
              <li>
                <Link href="/knowledge?category=conditions" className="hover:text-emerald-400 transition-colors">
                  PCOS, Thyroid & Diabetes Nutrition
                </Link>
              </li>
              <li>
                <Link href="/knowledge?category=supplements" className="hover:text-emerald-400 transition-colors">
                  Creatine & Whey Supplement Safety
                </Link>
              </li>
              <li>
                <Link href="/knowledge?category=mobility" className="hover:text-emerald-400 transition-colors">
                  45+ Senior Joint Care & Mobility
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tools & Generators */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Generators & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/diet-plans" className="hover:text-emerald-400 transition-colors">
                  Personalized Diet Generator
                </Link>
              </li>
              <li>
                <Link href="/workout-plans" className="hover:text-emerald-400 transition-colors">
                  Home & Gym Workout Planner
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-emerald-400 transition-colors">
                  BMR & TDEE (Mifflin-St Jeor)
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-emerald-400 transition-colors">
                  Interactive BMI Assessment
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-emerald-400 transition-colors">
                  Hydration & Water Intake
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-emerald-400 transition-colors">
                  Weight & Measurement Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Platform & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Zero FIT Philosophy
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-emerald-400 transition-colors">
                  Personal Profile & Onboarding
                </Link>
              </li>
              <li>
                <Link href="/about#disclaimer" className="hover:text-emerald-400 transition-colors">
                  Clinical & Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-emerald-400 transition-colors">
                  Contact Support & Coaching
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Prominent Mandatory Medical Disclaimer Banner */}
        <div className="my-8 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-slate-400 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              {t.disclaimerTitle}
            </span>
            <p className="leading-relaxed">
              {t.disclaimerText}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80 gap-3">
          <p>© {new Date().getFullYear()} Zero FIT. Built with science for healthy living.</p>
          <div className="flex items-center space-x-4">
            <span>English • हिंदी • ਪੰਜਾਬੀ</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>for Punjabi & Global Fitness</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
