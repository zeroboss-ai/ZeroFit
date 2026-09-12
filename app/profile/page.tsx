'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  computePersonalizedTargets,
  calculateProgramTimeline,
  generateMealPlan,
  generateWorkoutPlan,
} from '@/lib/personalization';
import {
  UserProfile,
  ActivityLevel,
  FitnessGoal,
  DietaryPreference,
  CuisinePreference,
  DailyMealPlan,
  WorkoutPlan,
} from '@/types';
import {
  User,
  Activity,
  Heart,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Save,
  Flame,
  Scale,
  Droplet,
  Calendar,
  ArrowRight,
  LineChart,
  Printer,
  Utensils,
  Dumbbell,
  Clock,
  Layers,
  FileDown,
} from 'lucide-react';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function ProfilePage() {
  const { user, profile, setProfile, lang } = useApp();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: profile?.name || user?.name || 'Athlete',
    age: profile?.age || 28,
    gender: profile?.gender || 'male',
    heightCm: profile?.heightCm || 175,
    weightKg: profile?.weightKg || 72,
    targetWeightKg: profile?.targetWeightKg || 70,
    activityLevel: profile?.activityLevel || 'moderate',
    goal: profile?.goal || 'lose_fat',
    dietPreference: profile?.dietPreference || 'veg',
    cuisinePreference: profile?.cuisinePreference || 'north_indian',
    healthFlags: profile?.healthFlags || {
      diabetes: false,
      thyroid: false,
      pcos: false,
      hypertension: false,
      jointIssues: false,
      heartCondition: false,
    },
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<'blueprint' | 'meal_plan' | 'workout_plan' | 'safety'>('blueprint');

  // Synchronously compute live personalized targets as inputs change
  const computedTargets = computePersonalizedTargets(formData);
  const programTimeline = calculateProgramTimeline(computedTargets, []);
  const mealPlan: DailyMealPlan = generateMealPlan(computedTargets);
  const workoutPlan: WorkoutPlan = generateWorkoutPlan(computedTargets, {
    environment: 'gym',
    daysPerWeek: computedTargets.ageGroup === 'seniors' ? 3 : 4,
    difficulty: 'beginner',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        // Update local state even if visitor
        setProfile(computedTargets);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch {
      setProfile(computedTargets);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 no-print">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'pa'
                ? 'ਕਦਮ 1 • ਵਿਗਿਆਨਕ ਅਸੈਸਮੈਂਟ'
                : lang === 'hi'
                ? 'चरण 1 • साइंटिफिक असेसमेंट'
                : 'Step 1 • Scientific Assessment'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'pa'
              ? 'ਆਪਣਾ ਪਰਸਨਲਾਈਜ਼ਡ ਪਲੈਨ ਪ੍ਰਾਪਤ ਕਰੋ'
              : lang === 'hi'
              ? 'अपना पर्सनलाइज़्ड फिटनेस और डाइट प्लान प्राप्त करें'
              : 'Get Your Personalized Plan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'pa'
              ? 'ਆਪਣੀ ਉਮਰ, ਭਾਰ, ਭੋਜਨ ਅਤੇ ਸਿਹਤ ਸਥਿਤੀ ਚੁਣੋ। ਸਾਡਾ ਸਿਸਟਮ ਤੁਰੰਤ ਕੈਲੋਰੀ ਟੀਚਾ, ਭਾਰਤੀ ਮੀਲ ਪਲੈਨ ਅਤੇ ਕਸਰਤ ਤਿਆਰ ਕਰੇਗਾ।'
              : lang === 'hi'
              ? 'अपनी उम्र, वज़न और खान-पान चुनें। हमारा सिस्टम तुरंत आपके लिए सही कैलोरी, मैक्रोज़, मील प्लान और सेफ वर्कआउट तैयार करेगा।'
              : 'Update your biometrics below. Zero FIT dynamically recalculates safe calories, customized Indian meal plans, and joint-friendly training in real-time.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-2 transition-all border border-slate-300 dark:border-slate-700 shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Print / Export PDF</span>
          </button>

          <Link
            href="/progress"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all"
          >
            <LineChart className="w-4 h-4" />
            <span>Open Daily Tracker ➔</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Biometric Input Wizard Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. Basic Biometrics</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Age: <span className="text-emerald-600 font-bold">{formData.age} yrs</span>
                </label>
                <input
                  type="number"
                  min={13}
                  max={95}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Height: <span className="text-emerald-600 font-bold">{formData.heightCm} cm</span>
                </label>
                <input
                  type="number"
                  min={120}
                  max={230}
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || 170 })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Current Weight: <span className="text-emerald-600 font-bold">{formData.weightKg} kg</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={35}
                  max={180}
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Target Weight: <span className="text-emerald-600 font-bold">{formData.targetWeightKg} kg</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={35}
                  max={180}
                  value={formData.targetWeightKg}
                  onChange={(e) => setFormData({ ...formData, targetWeightKg: parseFloat(e.target.value) || 70 })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Activity & Goals */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>2. Goals & Activity Level</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Primary Fitness Objective
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value as FitnessGoal })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="lose_fat">Lose Body Fat (Calorie Deficit)</option>
                  <option value="gain_muscle">Build Muscle (Lean Hypertrophy)</option>
                  <option value="maintain">Body Recomposition / Maintain</option>
                  <option value="general_health">Longevity & Heart Health</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Daily Physical Activity
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="sedentary">Sedentary (Desk Job, minimal exercise)</option>
                  <option value="light">Lightly Active (1–3 workout days)</option>
                  <option value="moderate">Moderately Active (3–5 workout days)</option>
                  <option value="very_active">Very Active (6–7 workout days)</option>
                  <option value="extra_active">Extremely Active (Athletic labor / 2x daily)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Dietary Pattern
                </label>
                <select
                  value={formData.dietPreference}
                  onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value as DietaryPreference })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="veg">Vegetarian (Lacto-Veg)</option>
                  <option value="non_veg">Non-Vegetarian (Chicken/Fish)</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="vegan">Vegan (100% Plant-Based)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Cuisine Tradition
                </label>
                <select
                  value={formData.cuisinePreference}
                  onChange={(e) => setFormData({ ...formData, cuisinePreference: e.target.value as CuisinePreference })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="north_indian">North Indian / Punjabi (Roti, Dal, Paneer)</option>
                  <option value="south_indian">South Indian (Idli, Dosa, Sambar, Rice)</option>
                  <option value="continental">Continental / Global Bowls</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Flags */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Heart className="w-4 h-4 text-red-500" />
              <span>3. Health Flags (Educational Tuning)</span>
            </h3>

            <p className="text-xs text-slate-500">
              Check all that apply. Our engine automatically adjusts carbohydrate pacing, joint loading, and safety guardrails.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: 'diabetes', label: 'Diabetes / Insulin Resistance' },
                { key: 'thyroid', label: 'Thyroid Condition' },
                { key: 'pcos', label: 'PCOS / PCOD' },
                { key: 'hypertension', label: 'High BP (Hypertension)' },
                { key: 'jointIssues', label: 'Knee / Back Joint Issues' },
                { key: 'heartCondition', label: 'Heart / Cardiovascular' },
              ].map((flag) => (
                <label
                  key={flag.key}
                  className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={Boolean((formData.healthFlags as any)?.[flag.key])}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        healthFlags: {
                          ...(formData.healthFlags as any),
                          [flag.key]: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {flag.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating Blueprint...' : 'Save Profile & Recalculate'}</span>
            </button>

            <Link
              href="/progress"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 font-bold text-sm flex items-center space-x-2 border border-slate-700 dark:border-emerald-700 transition-all"
            >
              <LineChart className="w-4 h-4 text-emerald-400" />
              <span>Go to Progress Tracker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1 animate-fadeIn w-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>Blueprint targets saved! Syncing live with Progress & Measurement Tracker.</span>
              </span>
            )}
          </div>
        </form>

        {/* Right Col: Live Computed Personalized Plan (Targets, Meals, Workout, Safety) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Plan Section Tabs */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 gap-1 text-xs font-bold no-print">
            <button
              type="button"
              onClick={() => setActivePlanTab('blueprint')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
                activePlanTab === 'blueprint'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Targets</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlanTab('meal_plan')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
                activePlanTab === 'meal_plan'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Meal Plan</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlanTab('workout_plan')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
                activePlanTab === 'workout_plan'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Workouts</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlanTab('safety')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
                activePlanTab === 'safety'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety</span>
            </button>
          </div>

          {/* TAB 1: BLUEPRINT TARGETS */}
          {activePlanTab === 'blueprint' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent p-6 rounded-2xl border border-emerald-500/30 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
                    Dynamic Biological Calibration
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white capitalize">
                    {computedTargets.ageGroup.replace('_', ' ')}
                  </span>
                </div>

                {/* Calories Banner */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-xs uppercase font-bold text-slate-400">Target Daily Calories</span>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {computedTargets.targetCalories}{' '}
                    <span className="text-xs font-normal text-slate-400">kcal</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    BMR: {computedTargets.bmr} kcal • TDEE: {computedTargets.tdee} kcal
                  </p>
                </div>

                {/* Macros Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-emerald-600">Protein</span>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {computedTargets.proteinGrams}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-sky-600">Carbs</span>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {computedTargets.carbGrams}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-600">Fats</span>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {computedTargets.fatGrams}g
                    </div>
                  </div>
                </div>

                {/* Water & BMI */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-cyan-500" />
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Water Intake</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {computedTargets.waterIntakeLiters} Liters/day
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">BMI Status</span>
                      <span className="font-bold text-slate-900 dark:text-white capitalize">
                        {computedTargets.bmi} ({computedTargets.bmiCategory})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Timeline */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-300 dark:border-emerald-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded-lg bg-emerald-600 text-white">
                      <Calendar className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Program Timeline
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                    {programTimeline.totalDays} Days Journey
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-500">Target Shift:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {computedTargets.weightKg} kg ➔ {computedTargets.targetWeightKg} kg ({Math.abs(computedTargets.weightKg - computedTargets.targetWeightKg).toFixed(1)} kg {computedTargets.targetWeightKg < computedTargets.weightKg ? 'Loss' : 'Gain'})
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-500">Safe Evidence Pace:</span>
                    <span className="font-bold text-emerald-600">~{programTimeline.weeklyRateKg} kg / week</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONALIZED MEAL PLAN */}
          {activePlanTab === 'meal_plan' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {mealPlan.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Target: {computedTargets.targetCalories} kcal • {computedTargets.proteinGrams}g Protein
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold capitalize">
                    {computedTargets.dietPreference}
                  </span>
                </div>

                {/* 4 Main Meals */}
                <div className="space-y-2.5 text-xs">
                  {/* Breakfast */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                        🌅 Breakfast
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {mealPlan.meals.breakfast.calories} kcal • {mealPlan.meals.breakfast.protein}g protein
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      {mealPlan.meals.breakfast.name}
                    </p>
                    <p className="text-[11px] text-slate-500">Portion: {mealPlan.meals.breakfast.portion}</p>
                  </div>

                  {/* Lunch */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[10px]">
                        ☀️ Lunch (Midday Main Meal)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {mealPlan.meals.lunch.calories} kcal • {mealPlan.meals.lunch.protein}g protein
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      {mealPlan.meals.lunch.name}
                    </p>
                    <p className="text-[11px] text-slate-500">Portion: {mealPlan.meals.lunch.portion}</p>
                  </div>

                  {/* Evening Snack */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-sky-700 dark:text-sky-400 uppercase tracking-wider text-[10px]">
                        ☕ Evening Recovery Snack
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {mealPlan.meals.eveningSnack.calories} kcal • {mealPlan.meals.eveningSnack.protein}g protein
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      {mealPlan.meals.eveningSnack.name}
                    </p>
                    <p className="text-[11px] text-slate-500">Portion: {mealPlan.meals.eveningSnack.portion}</p>
                  </div>

                  {/* Dinner */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-purple-700 dark:text-purple-400 uppercase tracking-wider text-[10px]">
                        🌙 Dinner (Night Restorative Meal)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {mealPlan.meals.dinner.calories} kcal • {mealPlan.meals.dinner.protein}g protein
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      {mealPlan.meals.dinner.name}
                    </p>
                    <p className="text-[11px] text-slate-500">Portion: {mealPlan.meals.dinner.portion}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200">
                  <span className="font-bold block mb-0.5">Hydration Guideline:</span>
                  <span>{mealPlan.hydrationTips}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JOINT-SAFE WORKOUT PLAN */}
          {activePlanTab === 'workout_plan' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {workoutPlan.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {workoutPlan.daysPerWeek} Days/Week • {computedTargets.ageGroup === 'seniors' ? 'Joint-Safe 45+ Protocol' : 'Strength & Metabolic Protocol'}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    {workoutPlan.environment.toUpperCase()}
                  </span>
                </div>

                {/* Workout Days List */}
                <div className="space-y-3 text-xs">
                  {(workoutPlan.schedule || []).map((day) => (
                    <div key={day.dayNumber} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                          {day.dayName}: {day.focus}
                        </span>
                        <span className="text-[10px] text-slate-400">Day {day.dayNumber}</span>
                      </div>
                      <div className="space-y-1.5">
                        {day.exercises.slice(0, 3).map((ex, exIdx) => (
                          <div key={exIdx} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{ex.name}</span>
                            <span className="font-bold text-emerald-600">{ex.sets} sets × {ex.reps}</span>
                          </div>
                        ))}
                      </div>
                      {day.cooldownNotes && (
                        <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                          Cooldown: {day.cooldownNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY & CLINICAL GUARDRAILS */}
          {activePlanTab === 'safety' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Clinical Safety & Nutrition Boundaries</span>
                </h4>

                <ul className="space-y-2.5">
                  {computedTargets.safetyAdvice.map((advice, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                  <span className="font-bold block">Notice on Medical Conditions:</span>
                  <p className="text-[11px] leading-relaxed">
                    Always consult your physician or primary care physician before beginning a caloric deficit or resistance protocol if managing diabetes, hypertension, or heart disease.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Quick Action Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg no-print">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Done customizing your plan?</span>
              <span className="text-emerald-400 font-bold">Step 1 Complete</span>
            </div>
            <Link
              href="/progress"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <span>Proceed to Daily Progress Tracker ➔</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
