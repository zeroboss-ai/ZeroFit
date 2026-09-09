'use client';

import React, { useState } from 'react';
import { calculateBMR, calculateTDEE } from '@/lib/personalization';
import { ActivityLevel } from '@/types';
import { Flame, Zap, Scale, Heart } from 'lucide-react';
import MedicalDisclaimer from '../MedicalDisclaimer';

export default function BMRCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weight, setWeight] = useState<number>(72);
  const [height, setHeight] = useState<number>(175);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activity);

  // Targets
  const fatLossTarget = Math.max(bmr, tdee - 450);
  const muscleGainTarget = tdee + 350;

  const activityDescriptions: Record<ActivityLevel, { name: string; desc: string }> = {
    sedentary: { name: 'Sedentary', desc: 'Desk job, little or no formal exercise' },
    light: { name: 'Lightly Active', desc: 'Light exercise / sports 1–3 days/week' },
    moderate: { name: 'Moderately Active', desc: 'Moderate exercise / gym 3–5 days/week' },
    very_active: { name: 'Very Active', desc: 'Hard training / sports 6–7 days/week' },
    extra_active: { name: 'Extremely Active', desc: 'Physical labor job or 2x daily training' },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            BMR & TDEE (Mifflin-St Jeor)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clinical Gold Standard for Daily Calorie Burn
          </p>
        </div>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Gender
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                gender === 'male' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-600'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                gender === 'female' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-600'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Age (Years)
          </label>
          <input
            type="number"
            value={age}
            min={12}
            max={100}
            onChange={(e) => setAge(parseInt(e.target.value) || 20)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            min={35}
            max={200}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 50)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            min={100}
            max={230}
            onChange={(e) => setHeight(parseInt(e.target.value) || 160)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Activity level picker */}
      <div className="mb-6">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
          Activity Level
        </label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
        >
          {Object.entries(activityDescriptions).map(([key, item]) => (
            <option key={key} value={key}>
              {item.name} — {item.desc}
            </option>
          ))}
        </select>
      </div>

      {/* Key Outputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
            Basal Metabolic (BMR)
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {bmr} <span className="text-xs font-normal text-slate-400">kcal/day</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Burned if you stayed in bed 24h</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-300">
            Daily Burn (TDEE)
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {tdee} <span className="text-xs font-normal text-emerald-500">kcal/day</span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 mt-1">
            Calories to maintain weight
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
          <span className="text-[11px] uppercase tracking-wider font-bold text-amber-700 dark:text-amber-300">
            Fat Loss Target
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {fatLossTarget} <span className="text-xs font-normal text-amber-500">kcal/day</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300/80 mt-1">
            Safe ~0.5kg/week fat deficit
          </p>
        </div>

        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-center">
          <span className="text-[11px] uppercase tracking-wider font-bold text-orange-700 dark:text-orange-300">
            Muscle Gain Target
          </span>
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">
            {muscleGainTarget} <span className="text-xs font-normal text-orange-500">kcal/day</span>
          </div>
          <p className="text-[11px] text-orange-700 dark:text-orange-300/80 mt-1">
            Lean hypertrophy surplus
          </p>
        </div>
      </div>

      <div className="mt-4">
        <MedicalDisclaimer compact />
      </div>
    </div>
  );
}
