'use client';

import React, { useState } from 'react';
import { calculateBMI } from '@/lib/personalization';
import { BMICategory } from '@/types';
import { ShieldCheck, Info } from 'lucide-react';
import MedicalDisclaimer from '../MedicalDisclaimer';

export default function BMICalculator() {
  const [weight, setWeight] = useState<number>(72);
  const [height, setHeight] = useState<number>(175);

  const { bmi, category } = calculateBMI(weight, height);

  const categoryDetails: Record<
    BMICategory,
    { label: string; color: string; bgColor: string; advice: string }
  > = {
    underweight: {
      label: 'Underweight (BMI < 18.5)',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500',
      advice:
        'Focus on nutrient-dense calorie surplus (+300 to +400 kcal) with quality whole grains, healthy nuts/seeds, dairy/soy, and progressive resistance training to build muscle density.',
    },
    normal: {
      label: 'Normal / Healthy Range (BMI 18.5 - 24.9)',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500',
      advice:
        'Great job! Maintain your current energy equilibrium or focus on body recomposition (building lean muscle mass while trimming subcutaneous fat) with balanced macronutrients.',
    },
    overweight: {
      label: 'Overweight (BMI 25 - 29.9)',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500',
      advice:
        'A modest, sustainable deficit of 350–500 kcal paired with 8,000–10,000 daily steps and strength training will steadily strip body fat while safeguarding your muscle tissue.',
    },
    obese: {
      label: 'Obese (BMI >= 30)',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500',
      advice:
        'Protect your joint health by choosing low-impact cardio (brisk walking, stationary cycling, swimming) and eliminating sugary drinks and liquid calories. Consistency is key.',
    },
  };

  const current = categoryDetails[category];

  // Gauge needle position (approx 15 to 35 range)
  const minBMI = 15;
  const maxBMI = 35;
  const percentage = Math.min(Math.max(((bmi - minBMI) / (maxBMI - minBMI)) * 100, 0), 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
        <span>BMI (Body Mass Index) Assessment</span>
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        WHO clinical classification of weight-to-height ratio.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Weight: <span className="text-emerald-600 text-sm">{weight} kg</span>
          </label>
          <input
            type="range"
            min={35}
            max={160}
            step={0.5}
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>35 kg</span>
            <span>160 kg</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Height: <span className="text-emerald-600 text-sm">{height} cm</span> (
            {(height / 30.48).toFixed(1)} ft)
          </label>
          <input
            type="range"
            min={120}
            max={220}
            step={1}
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>120 cm</span>
            <span>220 cm</span>
          </div>
        </div>
      </div>

      {/* Visual Gauge */}
      <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 font-medium">Your BMI</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {bmi} <span className="text-sm font-normal text-slate-500">kg/m²</span>
          </span>
        </div>

        {/* Color bar */}
        <div className="relative h-4 rounded-full bg-gradient-to-r from-amber-400 via-emerald-500 via-orange-400 to-red-500 overflow-hidden">
          {/* Needle indicator */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-slate-950 border border-white shadow-md rounded-full -translate-x-1/2 transition-all duration-300"
            style={{ left: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
          <span>&lt; 18.5 Under</span>
          <span>18.5 - 24.9 Normal</span>
          <span>25 - 29.9 Over</span>
          <span>30+ Obese</span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${current.bgColor}`} />
            <span className={`text-sm font-bold ${current.color}`}>{current.label}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            {current.advice}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <MedicalDisclaimer compact />
      </div>
    </div>
  );
}
