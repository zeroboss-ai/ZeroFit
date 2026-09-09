'use client';

import React, { useState } from 'react';
import { Percent, ShieldAlert } from 'lucide-react';
import MedicalDisclaimer from '../MedicalDisclaimer';

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [waistCm, setWaistCm] = useState<number>(84);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [hipCm, setHipCm] = useState<number>(98); // for females

  // US Navy Formula
  let bodyFat = 15;
  if (gender === 'male') {
    if (waistCm > neckCm && heightCm > 0) {
      bodyFat = Math.round(
        495 /
          (1.0324 -
            0.19077 * Math.log10(waistCm - neckCm) +
            0.15456 * Math.log10(heightCm)) -
          450
      );
    }
  } else {
    if (waistCm + hipCm > neckCm && heightCm > 0) {
      bodyFat = Math.round(
        495 /
          (1.29579 -
            0.35004 * Math.log10(waistCm + hipCm - neckCm) +
            0.221 * Math.log10(heightCm)) -
          450
      );
    }
  }

  const clampedBF = Math.max(5, Math.min(50, isNaN(bodyFat) ? 18 : bodyFat));

  let category = 'Fitness / Athletic';
  if (gender === 'male') {
    if (clampedBF < 6) category = 'Essential Fat';
    else if (clampedBF <= 13) category = 'Athletes';
    else if (clampedBF <= 17) category = 'Fitness';
    else if (clampedBF <= 24) category = 'Average';
    else category = 'High Body Fat';
  } else {
    if (clampedBF < 14) category = 'Essential Fat';
    else if (clampedBF <= 20) category = 'Athletes';
    else if (clampedBF <= 24) category = 'Fitness';
    else if (clampedBF <= 31) category = 'Average';
    else category = 'High Body Fat';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Body Fat Percentage (US Navy Method)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scientifically validated circumference measurement estimate.
          </p>
        </div>
      </div>

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
                gender === 'male'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                gender === 'female'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(parseInt(e.target.value) || 170)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Waist at Navel (cm)
          </label>
          <input
            type="number"
            value={waistCm}
            onChange={(e) => setWaistCm(parseInt(e.target.value) || 80)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Neck Circumference (cm)
          </label>
          <input
            type="number"
            value={neckCm}
            onChange={(e) => setNeckCm(parseInt(e.target.value) || 38)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
          />
        </div>

        {gender === 'female' && (
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Hips at Widest Point (cm)
            </label>
            <input
              type="number"
              value={hipCm}
              onChange={(e) => setHipCm(parseInt(e.target.value) || 95)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
            />
          </div>
        )}
      </div>

      <div className="p-5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-teal-800 dark:text-teal-300">
            Estimated Body Fat
          </span>
          <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1">
            {clampedBF}%
          </div>
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
            Category: {category}
          </span>
        </div>

        <div className="text-right text-xs text-slate-500 max-w-xs">
          Tip: Measure circumferences in the morning before food or water for maximum consistency.
        </div>
      </div>

      <div className="mt-4">
        <MedicalDisclaimer compact />
      </div>
    </div>
  );
}
