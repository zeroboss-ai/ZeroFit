'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert } from 'lucide-react';

export default function MedicalDisclaimer({ compact = false }: { compact?: boolean }) {
  const { t } = useApp();

  if (compact) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong className="font-semibold">{t.disclaimerTitle}:</strong> {t.disclaimerText}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-l-4 border-amber-500 p-4 rounded-r-xl my-6">
      <div className="flex items-start space-x-3">
        <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
            {t.disclaimerTitle}
          </h4>
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-1 leading-relaxed">
            {t.disclaimerText}
          </p>
        </div>
      </div>
    </div>
  );
}
