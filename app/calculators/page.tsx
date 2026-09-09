'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import BMICalculator from '../../components/calculators/BMICalculator';
import BMRCalculator from '../../components/calculators/BMRCalculator';
import WaterCalculator from '../../components/calculators/WaterCalculator';
import MacroCalculator from '../../components/calculators/MacroCalculator';
import BodyFatCalculator from '../../components/calculators/BodyFatCalculator';
import { Calculator, Scale, Flame, Droplet, PieChart, Percent, HeartPulse } from 'lucide-react';
import MedicalDisclaimer from '../../components/MedicalDisclaimer';

export default function CalculatorsPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'bmi' | 'bmr' | 'water' | 'macro' | 'body_fat'>('bmi');

  const tabs = [
    { key: 'bmi', label: 'BMI Assessment', icon: Scale },
    { key: 'bmr', label: 'BMR & TDEE (Mifflin)', icon: Flame },
    { key: 'water', label: 'Water & Hydration', icon: Droplet },
    { key: 'macro', label: 'Target Macro Split', icon: PieChart },
    { key: 'body_fat', label: 'Body Fat % (US Navy)', icon: Percent },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <Calculator className="w-3.5 h-3.5" />
          <span>Clinical Sports Mathematics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.calcTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.calcSubtitle}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Calculator Component */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'bmi' && <BMICalculator />}
        {activeTab === 'bmr' && <BMRCalculator />}
        {activeTab === 'water' && <WaterCalculator />}
        {activeTab === 'macro' && <MacroCalculator />}
        {activeTab === 'body_fat' && <BodyFatCalculator />}
      </div>

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
