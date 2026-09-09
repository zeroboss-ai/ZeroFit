'use client';

import React, { useState } from 'react';
import { FitnessGoal } from '@/types';
import { PieChart, Sparkles } from 'lucide-react';

export default function MacroCalculator() {
  const [totalCalories, setTotalCalories] = useState<number>(2000);
  const [goal, setGoal] = useState<FitnessGoal>('lose_fat');

  // Ratios
  const presets: Record<
    FitnessGoal,
    { proteinPct: number; carbsPct: number; fatPct: number; label: string; desc: string }
  > = {
    lose_fat: {
      proteinPct: 35,
      carbsPct: 35,
      fatPct: 30,
      label: 'High-Protein Fat Loss',
      desc: 'Maximizes satiety, preserves lean muscle mass in a caloric deficit.',
    },
    gain_muscle: {
      proteinPct: 30,
      carbsPct: 45,
      fatPct: 25,
      label: 'Hypertrophy & Fuel',
      desc: 'High complex carbs to sustain heavy gym glycogen output and recovery.',
    },
    maintain: {
      proteinPct: 25,
      carbsPct: 45,
      fatPct: 30,
      label: 'Balanced Equilibrium',
      desc: 'Sustainable day-to-day balance for steady energy and vitality.',
    },
    general_health: {
      proteinPct: 25,
      carbsPct: 50,
      fatPct: 25,
      label: 'Cardiometabolic Health',
      desc: 'Higher fiber-rich complex grains and healthy monounsaturated fats.',
    },
  };

  const current = presets[goal];

  const proteinCals = totalCalories * (current.proteinPct / 100);
  const carbsCals = totalCalories * (current.carbsPct / 100);
  const fatCals = totalCalories * (current.fatPct / 100);

  const proteinGrams = Math.round(proteinCals / 4);
  const carbsGrams = Math.round(carbsCals / 4);
  const fatGrams = Math.round(fatCals / 9);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
          <PieChart className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Target Macro Split Calculator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Convert daily calories into exact grams of Protein, Carbs, and Fats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Target Calories: <span className="text-purple-600 font-black">{totalCalories} kcal</span>
          </label>
          <input
            type="range"
            min={1200}
            max={4000}
            step={50}
            value={totalCalories}
            onChange={(e) => setTotalCalories(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Fitness Objective
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as FitnessGoal)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
          >
            <option value="lose_fat">Fat Loss (High Protein 35%)</option>
            <option value="gain_muscle">Muscle Gain (High Carb 45%)</option>
            <option value="maintain">Maintenance & Recomp</option>
            <option value="general_health">General Health & Longevity</option>
          </select>
        </div>
      </div>

      {/* Visual Macro Bar */}
      <div className="space-y-2 mb-6">
        <div className="h-4 rounded-full flex overflow-hidden">
          <div style={{ width: `${current.proteinPct}%` }} className="bg-emerald-500" title="Protein" />
          <div style={{ width: `${current.carbsPct}%` }} className="bg-sky-500" title="Carbohydrates" />
          <div style={{ width: `${current.fatPct}%` }} className="bg-amber-500" title="Fats" />
        </div>
        <div className="flex justify-between text-xs font-bold">
          <span className="text-emerald-600 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Protein ({current.proteinPct}%)</span>
          </span>
          <span className="text-sky-600 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>Carbs ({current.carbsPct}%)</span>
          </span>
          <span className="text-amber-600 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Fats ({current.fatPct}%)</span>
          </span>
        </div>
      </div>

      {/* Grams Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">
            Protein
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {proteinGrams}g
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300/80 font-medium">
            {Math.round(proteinCals)} kcal
          </span>
        </div>

        <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-center">
          <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase">Carbs</span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
            {carbsGrams}g
          </div>
          <span className="text-[11px] text-sky-700 dark:text-sky-300/80 font-medium">
            {Math.round(carbsCals)} kcal
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">Fats</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {fatGrams}g
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300/80 font-medium">
            {Math.round(fatCals)} kcal
          </span>
        </div>
      </div>
    </div>
  );
}
