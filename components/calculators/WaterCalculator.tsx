'use client';

import React, { useState } from 'react';
import { Droplet, Sun, Dumbbell, GlassWater } from 'lucide-react';

export default function WaterCalculator() {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [workoutMins, setWorkoutMins] = useState<number>(45);
  const [isHotWeather, setIsHotWeather] = useState<boolean>(true);

  // Baseline: 35ml per kg bodyweight
  const baseWater = (weightKg * 35) / 1000;
  // Exercise addition: ~350ml per 30 mins workout
  const exerciseWater = (workoutMins / 30) * 0.35;
  // Weather addition: 0.5L for warm/humid climates
  const weatherWater = isHotWeather ? 0.5 : 0.0;

  const totalLiters = parseFloat((baseWater + exerciseWater + weatherWater).toFixed(1));
  const glasses250ml = Math.round((totalLiters * 1000) / 250);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
          <Droplet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Daily Water & Hydration Calculator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Prevent 15% drops in physical strength caused by mild cellular dehydration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Body Weight: <span className="text-cyan-600">{weightKg} kg</span>
          </label>
          <input
            type="range"
            min={40}
            max={140}
            value={weightKg}
            onChange={(e) => setWeightKg(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Daily Workout Time: <span className="text-cyan-600">{workoutMins} mins</span>
          </label>
          <input
            type="range"
            min={0}
            max={120}
            step={15}
            value={workoutMins}
            onChange={(e) => setWorkoutMins(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-center pt-3 sm:pt-0">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isHotWeather}
              onChange={(e) => setIsHotWeather(e.target.checked)}
              className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
            />
            <span className="flex items-center space-x-1">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Hot / Humid Climate</span>
            </span>
          </label>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-5 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-600/30">
            {totalLiters}L
          </div>
          <div>
            <div className="text-sm font-bold text-cyan-950 dark:text-cyan-200">
              Recommended Daily Fluid Intake
            </div>
            <div className="text-xs text-cyan-800 dark:text-cyan-300 flex items-center space-x-1 mt-0.5">
              <GlassWater className="w-3.5 h-3.5 inline" />
              <span>Approximately {glasses250ml} standard glasses (250ml each)</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 max-w-xs text-center sm:text-right">
          💡 Drink 1 glass of water immediately upon waking to kickstart organ perfusion and replenish nighttime respiratory fluid loss.
        </div>
      </div>
    </div>
  );
}
