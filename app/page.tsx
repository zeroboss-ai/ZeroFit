'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import BMICalculator from '@/components/calculators/BMICalculator';
import DailyTipWidget from '@/components/DailyTipWidget';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Dumbbell,
  LineChart,
  Scale,
  Flame,
  FileDown,
  Calendar,
} from 'lucide-react';

export default function HomePage() {
  const { lang } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-10 lg:pt-12 lg:pb-14 bg-gradient-to-b from-emerald-500/5 via-teal-500/5 to-transparent">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {lang === 'pa'
                ? 'ਵਿਗਿਆਨ-ਅਧਾਰਿਤ ਪੰਜਾਬੀ ਅਤੇ ਭਾਰਤੀ ਫਿਟਨੈਸ'
                : lang === 'hi'
                ? 'साइंटिफिक इंडियन फिटनेस — बिना क्रैश डाइट'
                : 'Evidence-Based Indian & Punjabi Fitness — No Extreme Crash Diets'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            {lang === 'pa' ? (
              <>ਸਿਰਫ਼ ਦੋ ਕਦਮਾਂ ਵਿੱਚ ਆਪਣੇ ਫਿਟਨੈਸ ਟੀਚੇ ਨੂੰ ਹਾਸਲ ਕਰੋ</>
            ) : lang === 'hi' ? (
              <>केवल दो चरणों में अपनी संपूर्ण फिटनेस यात्रा शुरू करें</>
            ) : (
              <>
                Everything You Need For Sustainable Fitness In{' '}
                <span className="text-emerald-600 dark:text-emerald-400">Two Simple Steps</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'pa'
              ? 'ਕੋਈ ਉਲਝਣ ਵਾਲੀਆਂ ਵੈੱਬਸਾਈਟਾਂ ਨਹੀਂ। ਪਹਿਲਾਂ ਆਪਣਾ ਵਿਅਕਤੀਗਤ ਖੁਰਾਕ ਤੇ ਕਸਰਤ ਪਲੈਨ ਲਵੋ, ਫਿਰ ਰੋਜ਼ਾਨਾ ਪ੍ਰੋਗਰੈਸ ਟਰੈਕਰ ਵਿੱਚ AI ਨਾਲ ਆਪਣੀ ਤਰੱਕੀ ਰਿਕਾਰਡ ਕਰੋ।'
              : lang === 'hi'
              ? 'बिना किसी जटिलता के: पहले अपनी उम्र और वजन के अनुसार पर्सनलाइज़्ड प्लान लें, फिर रोज़ाना प्रोग्रेस ट्रैकर में AI से अपनी डाइट और एक्टिविटी ट्रैक करें।'
              : 'No complicated clutter. Step 1: Get your exact calorie target, high-protein Indian meal plan, and joint-safe workouts. Step 2: Track your daily weight, water, and meals with AI.'}
          </p>

          {/* Trust points */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Mifflin-St Jeor Clinical BMR/TDEE</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Real Indian Kitchens (Roti, Dal, Paneer, Soya)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Joint-Safe 45+ Exercise Guardrails</span>
            </span>
          </div>
        </div>
      </section>

      {/* THE TWO CORE PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* PILLAR 1: GET YOUR PERSONALIZED PLAN */}
          <div className="relative group rounded-3xl p-8 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border-2 border-emerald-500/40 hover:border-emerald-500 shadow-xl transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                  Step 1 • 2-Min Assessment
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {lang === 'pa'
                    ? '1. ਆਪਣਾ ਪਰਸਨਲਾਈਜ਼ਡ ਪਲੈਨ ਲਵੋ'
                    : lang === 'hi'
                    ? '1. अपना पर्सनलाइज़्ड प्लान प्राप्त करें'
                    : '1. Get Your Personalized Plan'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {lang === 'pa'
                    ? 'ਆਪਣੀ ਉਮਰ, ਲਿੰਗ, ਭਾਰ, ਟੀਚਾ, ਭੋਜਨ ਤਰਜੀਹ (ਸ਼ਾਕਾਹਾਰੀ/ਆਂਡਾ/ਮਾਸਾਹਾਰੀ) ਅਤੇ ਸਿਹਤ ਸਥਿਤੀ (ਥਾਈਰੋਇਡ, ਪੀਸੀਓਐਸ, ਸ਼ੂਗਰ, ਗੋਡਿਆਂ ਦਾ ਦਰਦ) ਦਰਜ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਆਪਣਾ ਵਿਗਿਆਨਕ ਬਲੂਪ੍ਰਿੰਟ ਪ੍ਰਾਪਤ ਕਰੋ।'
                    : lang === 'hi'
                    ? 'अपनी उम्र, वज़न, फिटनेस लक्ष्य, डाइट (वेज/एग/नॉनवेज) और हेल्थ कंडीशन (PCOS, थायराइड, घुटनों का दर्द) चुनें। सिस्टम तुरंत आपके लिए सटीक कैलोरी, मैक्रोज़ और मील प्लान तैयार करेगा।'
                    : 'Answer a few quick questions to generate your scientific blueprint: safe calorie deficit, mTOR protein target, full Indian meal plan with exact portion grams, and joint-safe workout splits.'}
                </p>
              </div>

              {/* Feature Chips */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">BMR & Calorie Target</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Custom Indian Diet</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Dumbbell className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Joint-Safe Workout</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <FileDown className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">1-Click PDF Export</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/profile"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <span>
                  {lang === 'pa'
                    ? 'ਆਪਣਾ ਪਲੈਨ ਤਿਆਰ ਕਰੋ (2 ਮਿੰਟ)'
                    : lang === 'hi'
                    ? 'अपना प्लान तैयार करें (2 मिनट)'
                    : 'Build Your Personalized Plan ➔'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* PILLAR 2: PROGRESS TRACKER */}
          <div className="relative group rounded-3xl p-8 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/20 border-2 border-sky-500/40 hover:border-sky-500 shadow-xl transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30">
                  <LineChart className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-black uppercase tracking-wider">
                  Step 2 • Daily Execution
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {lang === 'pa'
                    ? '2. ਰੋਜ਼ਾਨਾ ਪ੍ਰੋਗਰੈਸ ਟਰੈਕਰ'
                    : lang === 'hi'
                    ? '2. डेली प्रोग्रेस ट्रैकर'
                    : '2. Daily Progress Tracker'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {lang === 'pa'
                    ? 'ਰੋਜ਼ਾਨਾ ਆਪਣਾ ਭਾਰ ਅਤੇ ਪਾਣੀ ਲੌਗ ਕਰੋ। ਜੋ ਵੀ ਖਾਧਾ ਜਾਂ ਕਸਰਤ ਕੀਤੀ, ਉਸਨੂੰ ਆਮ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖੋ — Gemini AI ਆਪਣੇ-ਆਪ ਕੈਲੋਰੀਆਂ, ਪ੍ਰੋਟੀਨ ਅਤੇ ਬਰਨ ਹੋਈ ਊਰਜਾ ਦੀ ਗਣਨਾ ਕਰੇਗਾ।'
                    : lang === 'hi'
                    ? 'रोज़ाना अपना वज़न और पानी दर्ज करें। दिनभर में क्या खाया और कौन सी एक्सरसाइज़ की, साधारण शब्दों में लिखें — Gemini AI खुद कैलोरी और प्रोटीन कैलकुलेट करके प्रोग्रेस चार्ट अपडेट करेगा।'
                    : 'Stay consistent every day. Log your morning weight, water drank, and describe your meals & workouts in natural language. The Gemini AI engine automatically evaluates your macros, burned calories, and trajectory.'}
                </p>
              </div>

              {/* Feature Chips */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Weight & Water Log</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Gemini AI Food Logger</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Daily Streaks & History</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <LineChart className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Visual Trajectory Chart</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/progress"
                className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02]"
              >
                <span>
                  {lang === 'pa'
                    ? 'ਪ੍ਰੋਗਰੈਸ ਟਰੈਕਰ ਖੋਲ੍ਹੋ'
                    : lang === 'hi'
                    ? 'प्रोग्रेस ट्रैकर खोलें'
                    : 'Open Daily Progress Tracker ➔'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INTERACTIVE METRIC CHECKER & DAILY TIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {lang === 'pa'
                      ? 'ਤੁਰੰਤ ਸਰੀਰਕ ਸੂਚਕ (BMI ਜਾਂਚ)'
                      : lang === 'hi'
                      ? 'त्वरित बॉडी मीट्रिक (BMI कैलकुलेटर)'
                      : 'Quick Body Metric Check'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'pa'
                      ? 'ਆਪਣੇ ਭਾਰ ਅਤੇ ਕੱਦ ਅਨੁਸਾਰ ਆਪਣਾ ਬੇਸਿਕ ਸੂਚਕ ਦੇਖੋ'
                      : lang === 'hi'
                      ? 'अपने वज़न और लंबाई के अनुसार तुरंत जांचें'
                      : 'Check your baseline status before building your full plan'}
                  </p>
                </div>
              </div>
              <BMICalculator />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <DailyTipWidget />

            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white space-y-4 shadow-lg">
              <div className="flex items-center space-x-2 text-emerald-200 text-xs uppercase font-bold tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Zero Compromise Science</span>
              </div>
              <h4 className="text-xl font-black leading-tight">
                {lang === 'pa'
                  ? 'ਸਿਹਤਮੰਦ ਭੋਜਨ, ਬਿਨਾਂ ਭੁੱਖੇ ਰਹੇ'
                  : lang === 'hi'
                  ? 'स्वादिष्ट भारतीय भोजन, बिना भूखे रहे'
                  : 'Healthy Indian Food Without Starvation Diets'}
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {lang === 'pa'
                  ? 'ਸਾਡਾ ਅਲਗੋਰਿਦਮ ਰੋਟੀ, ਦਾਲ, ਪਨੀਰ ਅਤੇ ਸੋਇਆ ਨਾਲ ਪੂਰਾ ਪ੍ਰੋਟੀਨ ਟੀਚਾ ਬਣਾਉਂਦਾ ਹੈ ਤਾਂ ਜੋ ਤੁਹਾਡੀ ਮਾਸਪੇਸ਼ੀ ਸੁਰੱਖਿਅਤ ਰਹੇ।'
                  : lang === 'hi'
                  ? 'हमारा सिस्टम रोटी, दाल, पनीर और सोया जैसे घरेलू खाने के साथ सही प्रोटीन अनुपात सुनिश्चित करता है।'
                  : 'We tailor protein and calorie distributions to real Indian kitchens, balancing roti, lentils, paneer, and curd with joint-friendly resistance training.'}
              </p>
              <div className="pt-2">
                <Link
                  href="/profile"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-sm transition-all"
                >
                  <span>Build My Plan Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
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
