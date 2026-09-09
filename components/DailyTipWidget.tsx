'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, RefreshCw, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const DAILY_TIPS = [
  {
    category: 'Nutrition',
    tipEn: 'Pair your vegetarian meals with Vitamin C (like freshly squeezed lemon over dal or rajma) to triple non-heme iron absorption!',
    tipHi: 'अपने Vegetarian Meals (जैसे Dal या Rajma) में Vitamin C (नींबू) add करें ताकि Iron Absorption 3x बढ़ जाए!',
    tipPa: 'ਆਪਣੇ Vegetarian Meals (ਜਿਵੇਂ Dal ਜਾਂ Rajma) ਵਿੱਚ Vitamin C (ਨਿੰਬੂ) add ਕਰੋ ਤਾਂ ਜੋ Iron Absorption 3x ਵੱਧ ਜਾਵੇ!',
    action: 'Squeeze half a lemon over lunch today.',
  },
  {
    category: 'Fat Loss',
    tipEn: 'Take a 10-minute leisurely walk right after lunch and dinner. It activates GLUT-4 transporters to clear blood glucose without insulin spikes.',
    tipHi: 'Lunch और Dinner के तुरंत बाद 10-Minute Post-Meal Walk करें। यह Blood Glucose को बिना Insulin Spikes के Clear करता है।',
    tipPa: 'Lunch ਅਤੇ Dinner ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ 10-Minute Post-Meal Walk ਕਰੋ। ਇਹ Blood Glucose ਨੂੰ ਬਿਨਾਂ Insulin Spikes ਦੇ Clear ਕਰਦਾ ਹੈ।',
    action: 'Walk 1,000 steps after your next meal.',
  },
  {
    category: 'Muscle Building',
    tipEn: 'Hit at least 25g–35g of protein per meal. This crosses the "leucine trigger" threshold required to kickstart muscle protein synthesis.',
    tipHi: 'हर Meal में कम से कम 25g–35g Protein ज़रूर लें ताकि Muscle Recovery और Growth Fast हो सके।',
    tipPa: 'ਹਰ Meal ਵਿੱਚ ਘੱਟੋ-ਘੱਟ 25g–35g Protein ਜ਼ਰੂਰ ਲਓ ਤਾਂ ਜੋ Muscle Recovery ਅਤੇ Growth Fast ਹੋ ਸਕੇ।',
    action: 'Add paneer, soya, or boiled eggs to your breakfast.',
  },
  {
    category: 'Recovery',
    tipEn: 'Sleeping under 7 hours drops daytime fat oxidation by 55% while elevating the hunger hormone ghrelin. Sleep is your most potent natural fat burner.',
    tipHi: '7 Hours से कम Sleep लेने से Daytime Fat Loss 55% Slow हो जाता है और Hunger Cravings बढ़ जाती हैं।',
    tipPa: '7 Hours ਤੋਂ ਘੱਟ Sleep ਲੈਣ ਨਾਲ Daytime Fat Loss 55% Slow ਹੋ ਜਾਂਦਾ ਹੈ ਅਤੇ Hunger Cravings ਵੱਧ ਜਾਂਦੀਆਂ ਹਨ।',
    action: 'Turn off phone screens 45 minutes before sleep.',
  },
  {
    category: 'Joint Health',
    tipEn: 'If your knees ache during squats, push your hips back like sitting into a low chair, keeping your shins more vertical, or use goblet box squats.',
    tipHi: 'अगर Squats लगाते समय Knee Pain हो, तो Hips को पीछे Push करें जैसे Chair पर बैठते हैं, या Box Squats Try करें।',
    tipPa: 'ਜੇਕਰ Squats ਲਗਾਉਂਦੇ ਸਮੇਂ Knee Pain ਹੋਵੇ, ਤਾਂ Hips ਨੂੰ ਪਿੱਛੇ Push ਕਰੋ ਜਿਵੇਂ Chair ਉੱਤੇ ਬੈਠਦੇ ਹੋ, ਜਾਂ Box Squats Try ਕਰੋ।',
    action: 'Test box squats with a chair today.',
  },
];

export default function DailyTipWidget() {
  const { lang } = useApp();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pick day of year as deterministic index
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    setIndex(dayOfYear % DAILY_TIPS.length);
  }, []);

  const nextTip = () => {
    setIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  const current = DAILY_TIPS[index];
  const tipText = lang === 'pa' ? current.tipPa : lang === 'hi' ? current.tipHi : current.tipEn;

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-sm">
            <Lightbulb className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Daily Evidence-Based Tip • {current.category}
          </span>
        </div>
        <button
          onClick={nextTip}
          className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-500 hover:text-emerald-700 transition-colors text-xs flex items-center space-x-1"
          title="Next Tip"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-semibold">Next Tip</span>
        </button>
      </div>

      <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
        "{tipText}"
      </p>

      <div className="mt-4 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Action: {current.action}</span>
        </span>
        <Link
          href="/knowledge"
          className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-medium inline-flex items-center space-x-1 group"
        >
          <span>Learn the science in Hub</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
