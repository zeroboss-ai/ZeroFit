'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import BMICalculator from '@/components/calculators/BMICalculator';
import DailyTipWidget from '@/components/DailyTipWidget';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { KNOWLEDGE_ARTICLES } from '@/lib/knowledge-data';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Users,
  CheckCircle2,
  Utensils,
  Dumbbell,
  Clock,
  HeartHandshake,
} from 'lucide-react';

export default function HomePage() {
  const { t, lang } = useApp();
  const featuredArticles = KNOWLEDGE_ARTICLES.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-emerald-500/5 via-teal-500/5 to-transparent">
        {/* Glow ambient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Messaging & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.heroBadge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.1]">
                {t.heroTitle}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t.heroSubtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/profile"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>{t.getYourPlan}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/knowledge"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>{t.exploreKnowledge}</span>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No Crash Starvation Diets</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Punjabi & Indian Food Adaptations</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Joint-Safe 45+ Exercise Options</span>
                </span>
              </div>
            </div>

            {/* Right Col: Instant Calculator Widget */}
            <div className="lg:col-span-5">
              <BMICalculator />
            </div>
          </div>
        </div>
      </section>

      {/* DAILY TIP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DailyTipWidget />
      </section>

      {/* 3 CORE PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            The Zero FIT Difference
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Rooted in Science. Adapted for Your Lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t.ageWiseTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.ageWiseDesc}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/workout-plans"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>View age-specific workout splits</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t.dietCuisineTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.dietCuisineDesc}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/diet-plans"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Generate customized meal plan</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t.medicalSafetyTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.medicalSafetyDesc}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/knowledge?category=conditions"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Read chronic condition guides</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED KNOWLEDGE ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
              Knowledge Hub
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Featured Scientific Articles
            </p>
          </div>
          <Link
            href="/knowledge"
            className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>Browse All {KNOWLEDGE_ARTICLES.length} Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                    {article.category.replace('_', ' ')}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTimeMinutes} min</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 hover:text-emerald-600 transition-colors">
                  <Link href={`/knowledge/${article.slug}`}>
                    {lang === 'pa' && article.titlePa
                      ? article.titlePa
                      : lang === 'hi' && article.titleHi
                      ? article.titleHi
                      : article.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/knowledge/${article.slug}`}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS & COMMUNITY SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Transformations
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Real Results from Evidence-Based Habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm">
                  GS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Gurpreet S. (34, Ludhiana)
                  </h4>
                  <p className="text-xs text-emerald-600">Lost 9.5 kg in 16 weeks</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "I thought I had to give up roti and dal completely to lose my belly. Zero FIT taught me how to measure cooking oil and add low-fat paneer and sattu. The 4-day gym split was easy to sustain."
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-black flex items-center justify-center text-sm">
                  MK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Manpreet K. (29, Toronto)
                  </h4>
                  <p className="text-xs text-teal-600">PCOS Management & Strength</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "The PCOS guide and insulin resistance advice changed everything. Doing 10-minute post-meal walks and strength training 3x a week regulated my cycles without extreme starvation."
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-black flex items-center justify-center text-sm">
                  JS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Jaswinder S. (54, Mohali)
                  </h4>
                  <p className="text-xs text-orange-600">Joint Longevity & Mobility</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "At age 54, heavy squats were hurting my knees. The 50+ joint-safe exercises and box squats gave me back my strength and eliminated morning joint stiffness."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA GET STARTED */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-emerald-600/20 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Build Your Evidence-Based Plan?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Answer a few quick questions about your age, weight, goals, and diet preference. Our engine automatically calculates your safe calorie target, macro split, and joint-friendly workouts.
          </p>
          <div className="pt-2">
            <Link
              href="/profile"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm shadow-md transition-all hover:scale-105"
            >
              <span>Get Started Free — 2 Min Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BOTTOM DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimer />
      </section>
    </div>
  );
}
