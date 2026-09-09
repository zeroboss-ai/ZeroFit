'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generateMealPlan, computePersonalizedTargets } from '@/lib/personalization';
import { DietaryPreference, CuisinePreference, DailyMealPlan } from '@/types';
import {
  Utensils,
  Printer,
  Sparkles,
  Flame,
  CheckCircle2,
  RefreshCw,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function DietPlansPage() {
  const { profile, t, lang } = useApp();

  const [dietPref, setDietPref] = useState<DietaryPreference>(profile?.dietPreference || 'veg');
  const [cuisinePref, setCuisinePref] = useState<CuisinePreference>(
    profile?.cuisinePreference || 'north_indian'
  );
  const [customCalories, setCustomCalories] = useState<number>(profile?.targetCalories || 2100);

  // Generate customized meal plan
  const activeProfile = profile
    ? { ...profile, dietPreference: dietPref, cuisinePreference: cuisinePref, targetCalories: customCalories }
    : computePersonalizedTargets({
        dietPreference: dietPref,
        cuisinePreference: cuisinePref,
        targetCalories: customCalories,
      });

  const mealPlan: DailyMealPlan = generateMealPlan(activeProfile);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <Utensils className="w-3.5 h-3.5" />
          <span>Evidence-Based Indian Meal Planner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.dietTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.dietSubtitle}
        </p>
      </div>

      {/* Control Bar: Dietary Style, Regional Cuisine & Calories */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Dietary Preference */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Dietary Preference
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setDietPref('veg')}
                className={`py-2 px-3 rounded-xl border transition-all text-center ${
                  dietPref === 'veg'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                🌱 Vegetarian
              </button>
              <button
                onClick={() => setDietPref('non_veg')}
                className={`py-2 px-3 rounded-xl border transition-all text-center ${
                  dietPref === 'non_veg'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                🍗 Non-Veg
              </button>
              <button
                onClick={() => setDietPref('eggetarian')}
                className={`py-2 px-3 rounded-xl border transition-all text-center ${
                  dietPref === 'eggetarian'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                🍳 Eggetarian
              </button>
              <button
                onClick={() => setDietPref('vegan')}
                className={`py-2 px-3 rounded-xl border transition-all text-center ${
                  dietPref === 'vegan'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                🌿 Vegan
              </button>
            </div>
          </div>

          {/* Regional Cuisine Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Regional Cuisine Style
            </label>
            <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
              <button
                onClick={() => setCuisinePref('north_indian')}
                className={`py-2.5 px-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                  cuisinePref === 'north_indian'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>North Indian / Punjabi (Roti, Dal, Paneer)</span>
                {cuisinePref === 'north_indian' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => setCuisinePref('south_indian')}
                className={`py-2.5 px-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                  cuisinePref === 'south_indian'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>South Indian (Idli, Sambar, Dosa, Millets)</span>
                {cuisinePref === 'south_indian' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => setCuisinePref('continental')}
                className={`py-2.5 px-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                  cuisinePref === 'continental'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Continental / Global Oats & Bowls</span>
                {cuisinePref === 'continental' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* Calorie Adjuster & Print */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Daily Calorie Target: <span className="text-emerald-600 text-sm font-black">{customCalories} kcal</span>
              </label>
              <input
                type="range"
                min={1300}
                max={3500}
                step={50}
                value={customCalories}
                onChange={(e) => setCustomCalories(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1300 kcal (Deficit)</span>
                <span>3500 kcal (Surplus)</span>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Export / Print PDF Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Macros Snapshot Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print-card">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Energy</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {mealPlan.totalCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            Target Protein
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {mealPlan.totalProtein}g
          </div>
          <span className="text-[11px] text-emerald-600/80 font-semibold">
            {Math.round(mealPlan.totalProtein * 4)} kcal
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-center">
          <span className="text-xs font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
            Complex Carbs
          </span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
            {mealPlan.totalCarbs}g
          </div>
          <span className="text-[11px] text-sky-600/80 font-semibold">
            {Math.round(mealPlan.totalCarbs * 4)} kcal
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
            Essential Fats
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {mealPlan.totalFats}g
          </div>
          <span className="text-[11px] text-amber-600/80 font-semibold">
            {Math.round(mealPlan.totalFats * 9)} kcal
          </span>
        </div>
      </div>

      {/* Meals Timeline */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>{t.mealBreakdown}</span>
          <span className="text-xs font-normal text-slate-500">— {mealPlan.title}</span>
        </h3>

        {/* Meal Cards */}
        {Object.entries(mealPlan.meals).map(([slotKey, item]) => {
          if (!item) return null;

          const slotIcons: Record<string, any> = {
            earlyMorning: Sun,
            breakfast: Coffee,
            midMorningSnack: Sun,
            lunch: Sun,
            eveningSnack: Sunset,
            dinner: Moon,
            bedtime: Moon,
          };
          const SlotIcon = slotIcons[slotKey] || Coffee;

          const slotTitles: Record<string, string> = {
            earlyMorning: 'Early Morning (Waking)',
            breakfast: 'Breakfast (8:00 AM - 9:00 AM)',
            midMorningSnack: 'Mid-Morning Boost (11:30 AM)',
            lunch: 'Lunch (1:30 PM - 2:30 PM)',
            eveningSnack: 'Evening Pre-Workout / Snack (5:30 PM)',
            dinner: 'Dinner (8:00 PM - 9:00 PM)',
            bedtime: 'Night Recovery (Bedtime)',
          };

          const displayName =
            lang === 'pa' && item.namePa
              ? item.namePa
              : lang === 'hi' && item.nameHi
              ? item.nameHi
              : item.name;

          return (
            <div
              key={slotKey}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm print-card space-y-4 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    <SlotIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {slotTitles[slotKey] || slotKey}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Portion: {item.portion}
                    </span>
                  </div>
                </div>

                {/* Macro pill summary for this meal */}
                <div className="flex items-center space-x-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.calories} kcal
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    P: {item.protein}g
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    C: {item.carbs}g
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    F: {item.fats}g
                  </span>
                </div>
              </div>

              {/* Meal Item Content */}
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {displayName}
                </p>
                {item.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    💡 <strong className="text-slate-700 dark:text-slate-300">Why this works:</strong> {item.notes}
                  </p>
                )}
              </div>

              {/* Swappable Alternatives */}
              {item.alternatives && item.alternatives.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Swappable Food Alternatives:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.alternatives.map((alt, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-medium"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cooking & Hydration Tips Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-card">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Hydration Protocol
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {mealPlan.hydrationTips}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Punjabi & Indian Cooking Optimization
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {mealPlan.cookingTips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
