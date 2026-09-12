'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ProgressLog, DietAdherence } from '@/types';
import { calculateProgramTimeline, computePersonalizedTargets } from '@/lib/personalization';
import {
  LineChart,
  Calendar,
  Plus,
  Flame,
  Award,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Scale,
  Sparkles,
  ArrowRight,
  Utensils,
  Dumbbell,
  Droplets,
  Clock,
  Target,
  ShieldAlert,
  Info,
  ChevronRight,
  Settings,
  Zap,
  Activity,
  Loader2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { ActivityAnalysisResult } from '@/lib/gemini';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { parseFoodIntake, parsePhysicalActivity } from '@/lib/nutrition-parser';

export default function ProgressTrackerPage() {
  const { user, profile, t } = useApp();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Blueprint Fallback for immediate calculations
  const effectiveProfile =
    profile ||
    computePersonalizedTargets({
      name: 'Athlete',
      weightKg: 75,
      targetWeightKg: 70,
      goal: 'lose_fat',
    });

  // Dynamic Timeline & ZeroFIT AI Next-Step Guidance calculation
  const timeline = calculateProgramTimeline(effectiveProfile, logs);

  // Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState<string>(
    logs.length > 0
      ? String(logs[logs.length - 1].weightKg)
      : String(effectiveProfile.weightKg || 75)
  );
  const [waistCm, setWaistCm] = useState<string>('');
  const [chestCm, setChestCm] = useState<string>('');

  // Food & Nutrition State
  const [foodNotes, setFoodNotes] = useState<string>('');
  const [dietAdherence, setDietAdherence] = useState<DietAdherence>('on_track');
  const [caloriesConsumed, setCaloriesConsumed] = useState<string>('');
  const [proteinGramsConsumed, setProteinGramsConsumed] = useState<string>('');
  const [waterLiters, setWaterLiters] = useState<string>(String(effectiveProfile.waterIntakeLiters || 3.0));

  // Workout Status State
  const [workoutDone, setWorkoutDone] = useState<boolean>(true);
  const [workoutType, setWorkoutType] = useState<string>('Strength Training - Push / Pull Split');
  const [workoutMinutes, setWorkoutMinutes] = useState<string>('45');
  const [workoutIntensity, setWorkoutIntensity] = useState<'light' | 'moderate' | 'intense'>('moderate');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Gemini 3.6 Flash AI Activity & Nutrition Analyzer & Auto Check-in State
  const [aiFoodInput, setAiFoodInput] = useState<string>('');
  const [aiActivityInput, setAiActivityInput] = useState<string>('');
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ActivityAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string>('');
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);
  // Live reactive sports-science estimation as the user types
  const liveParsedFood = React.useMemo(() => {
    return parseFoodIntake(aiFoodInput);
  }, [aiFoodInput]);

  const liveParsedAct = React.useMemo(() => {
    const w = parseFloat(weightKg) || effectiveProfile?.weightKg || 75;
    return parsePhysicalActivity(aiActivityInput, w);
  }, [aiActivityInput, weightKg, effectiveProfile]);

  const hasLiveInputs = Boolean(aiFoodInput.trim() || aiActivityInput.trim());

  const handleAutoCalculateAndSaveCheckin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!weightKg || parseFloat(weightKg) <= 0) {
      setAiError('Please enter your Current Weight (kg) for today.');
      return;
    }

    if (!aiFoodInput.trim() && !aiActivityInput.trim()) {
      setAiError('Please enter what you ate or what activities you completed today.');
      return;
    }

    setAiAnalyzing(true);
    setAiError('');
    setAppliedNotice(false);

    try {
      // 1. Call Gemini AI activity & food analyzer
      const parsedWeight = parseFloat(weightKg);
      const res = await fetch('/api/ai/analyze-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodText: aiFoodInput,
          activityText: aiActivityInput,
          profile: {
            ...effectiveProfile,
            weightKg: parsedWeight,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Activity analysis failed');
      }

      const data = await res.json();
      if (!data.success || !data.analysis) {
        throw new Error(data.error || 'Could not parse analysis');
      }

      setAiAnalysisResult(data.analysis);

      // 2. Automatically record check-in log to database & state
      const consumedKcal = Math.round(data.analysis.caloriesConsumed || 0);
      const proteinG = Math.round(data.analysis.proteinGrams || 0);
      const hasWorkout = Boolean(aiActivityInput.trim());
      const mainWorkoutName =
        data.analysis.activityBreakdown?.[0]?.name || aiActivityInput.trim() || 'Daily Activity';

      let adherence: DietAdherence = 'on_track';
      if (effectiveProfile?.targetCalories) {
        const diff = consumedKcal - effectiveProfile.targetCalories;
        if (diff > 350) adherence = 'over_calories';
        else if (diff < -400) adherence = 'under_calories';
      }

      const saveRes = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          weightKg: parsedWeight,
          workoutCompleted: hasWorkout,
          waterLiters: waterLiters ? parseFloat(waterLiters) : 3.0,
          foodNotes: aiFoodInput.trim(),
          dietAdherence: adherence,
          caloriesConsumed: consumedKcal,
          proteinGramsConsumed: proteinG,
          workoutType: hasWorkout ? mainWorkoutName : 'Rest Day',
          workoutMinutes: hasWorkout ? 45 : 0,
          workoutIntensity: 'moderate',
        }),
      });

      if (saveRes.ok) {
        const savedData = await saveRes.json();
        setLogs((prev) => {
          const updated = [...prev.filter((l) => l.date !== date), savedData.log];
          updated.sort((a, b) => a.date.localeCompare(b.date));
          return updated;
        });
        setAppliedNotice(true);
        setSuccessMessage(`Check-in recorded for ${date}! Weight: ${parsedWeight} kg`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err: any) {
      setAiError(err.message || 'Unable to connect to Gemini AI. Please try again.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        const fetchedLogs = data.logs || [];
        setLogs(fetchedLogs);
        if (fetchedLogs.length > 0) {
          setWeightKg(String(fetchedLogs[fetchedLogs.length - 1].weightKg));
        }
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFillTargetCalories = () => {
    setCaloriesConsumed(String(effectiveProfile.targetCalories));
    setProteinGramsConsumed(String(effectiveProfile.proteinGrams));
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg) return;
    setSubmitting(true);
    setSuccessMessage('');

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          weightKg: parseFloat(weightKg),
          waistCm: waistCm ? parseFloat(waistCm) : undefined,
          chestCm: chestCm ? parseFloat(chestCm) : undefined,
          workoutCompleted: workoutDone,
          waterLiters: waterLiters ? parseFloat(waterLiters) : undefined,
          foodNotes: foodNotes.trim(),
          dietAdherence,
          caloriesConsumed: caloriesConsumed ? parseFloat(caloriesConsumed) : undefined,
          proteinGramsConsumed: proteinGramsConsumed ? parseFloat(proteinGramsConsumed) : undefined,
          workoutType: workoutDone ? workoutType : 'Rest Day',
          workoutMinutes: workoutDone && workoutMinutes ? parseInt(workoutMinutes) : 0,
          workoutIntensity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLogs((prev) => {
          const updated = [...prev.filter((l) => l.date !== date), data.log];
          updated.sort((a, b) => a.date.localeCompare(b.date));
          return updated;
        });
        setSuccessMessage('Daily check-in recorded! ZeroFIT AI has updated your program timeline.');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics calculations (Only authentic data)
  const hasLogs = logs.length > 0;
  const firstWeight = hasLogs ? logs[0].weightKg : (effectiveProfile?.weightKg || 0);
  const latestWeight = hasLogs ? logs[logs.length - 1].weightKg : (effectiveProfile?.weightKg || 0);
  const weightChange = hasLogs ? latestWeight - firstWeight : 0;
  const completedCount = logs.filter((l) => l.workoutCompleted).length;

  // SVG Line Chart generator
  const minW = hasLogs ? Math.min(...logs.map((l) => l.weightKg)) - 1 : 70;
  const maxW = hasLogs ? Math.max(...logs.map((l) => l.weightKg)) + 1 : 85;
  const chartHeight = 160;
  const chartWidth = 500;

  const points = logs
    .map((log, idx) => {
      const x = logs.length === 1 ? chartWidth / 2 : (idx / (logs.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - ((log.weightKg - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <LineChart className="w-3.5 h-3.5" />
          <span>Biometric & Consistency Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.progressTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.progressSubtitle}
        </p>
      </div>

      {!user && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Sign in or create your free account to save and sync your real workout and weight history across all devices.
            </span>
          </div>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold whitespace-nowrap"
          >
            {t.login} / {t.register}
          </Link>
        </div>
      )}

      {/* 1. LINKED ACTIVE PERSONAL BLUEPRINT CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>{t.activeBlueprint}</span>
              </span>
              <span className="text-xs text-slate-400">
                • {effectiveProfile.name || 'Athlete'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-2">
              <span>{effectiveProfile.weightKg} kg</span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="text-emerald-400">{effectiveProfile.targetWeightKg} kg Target</span>
              <span className="text-xs font-normal text-slate-400">
                ({Math.abs(effectiveProfile.weightKg - effectiveProfile.targetWeightKg).toFixed(1)} kg {effectiveProfile.targetWeightKg < effectiveProfile.weightKg ? 'Loss' : 'Gain'})
              </span>
            </h2>
          </div>

          <Link
            href="/profile"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.editBlueprint}</span>
          </Link>
        </div>

        {/* Blueprint Targets Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">Daily Calorie Target</span>
            <div className="text-xl font-black text-white mt-1">
              {effectiveProfile.targetCalories} <span className="text-xs text-slate-400 font-normal">kcal</span>
            </div>
            <span className="text-[10px] text-emerald-400">Deficit for Fat Loss</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">Target Protein</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {effectiveProfile.proteinGrams}g <span className="text-xs text-slate-400 font-normal">/ day</span>
            </div>
            <span className="text-[10px] text-slate-400 capitalize">{effectiveProfile.dietPreference} Diet</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">Daily Water Intake</span>
            <div className="text-xl font-black text-cyan-400 mt-1">
              {effectiveProfile.waterIntakeLiters} <span className="text-xs text-slate-400 font-normal">Liters</span>
            </div>
            <span className="text-[10px] text-slate-400">Cellular Hydration</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[11px] uppercase font-bold">Program Pace</span>
            <div className="text-xl font-black text-purple-400 mt-1">
              ~{timeline.weeklyRateKg} kg <span className="text-xs text-slate-400 font-normal">/ week</span>
            </div>
            <span className="text-[10px] text-slate-400">Safe Evidence-Based</span>
          </div>
        </div>
      </div>

      {/* 2. ZEROFIT AI COACH • WHAT TO FOLLOW NEXT & PROGRAM COUNTDOWN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t.aiGuidanceTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Real-time recalculation based on your active blueprint and logged meals/workouts.
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-right">
            <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 block tracking-wider">
              Program Timeline
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {timeline.totalDays}-Day Program
            </span>
          </div>
        </div>

        {/* Dynamic Countdown & Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>
                Day {timeline.currentDay} of {timeline.totalDays} Days •{' '}
                <strong className="text-emerald-600">{timeline.daysRemaining} {t.daysRemainingLabel}</strong> to reach {timeline.targetWeightKg} kg
              </span>
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">
              {timeline.percentComplete}% Completed
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, timeline.percentComplete)}%` }}
            />
          </div>
        </div>

        {/* AI Next Steps Guidance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Status & Direction */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider text-[11px]">
              <Target className="w-4 h-4" />
              <span>Current Position</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {timeline.aiGuidance.statusSummary}
            </p>
          </div>

          {/* Nutrition Guidance */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-[11px]">
              <Utensils className="w-4 h-4" />
              <span>Tomorrow's Nutrition</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {timeline.aiGuidance.nextStepNutrition}
            </p>
          </div>

          {/* Workout Guidance */}
          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-sky-800 dark:text-sky-300 font-bold uppercase tracking-wider text-[11px]">
              <Dumbbell className="w-4 h-4" />
              <span>Tomorrow's Workout</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {timeline.aiGuidance.nextStepWorkout}
            </p>
          </div>

          {/* Recovery & Micro-Habit */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-purple-800 dark:text-purple-300 font-bold uppercase tracking-wider text-[11px]">
              <Flame className="w-4 h-4" />
              <span>Action Task Today</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {timeline.aiGuidance.actionableTask}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-purple-200 dark:border-purple-800">
              {timeline.aiGuidance.nextStepRecovery}
            </p>
          </div>
        </div>
      </div>

      {/* 3. METRIC CARDS BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Weight
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {hasLogs ? `${latestWeight.toFixed(1)} kg` : effectiveProfile?.weightKg ? `${effectiveProfile.weightKg} kg` : '—'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {hasLogs ? 'From latest check-in' : 'Set in blueprint'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            Total Net Change
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center space-x-1">
            {hasLogs ? (
              <>
                {weightChange < 0 ? (
                  <TrendingDown className="w-5 h-5" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
                <span>
                  {weightChange > 0 ? `+${weightChange.toFixed(1)}` : weightChange.toFixed(1)} kg
                </span>
              </>
            ) : (
              <span>—</span>
            )}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            {hasLogs ? 'Since first logged date' : 'Awaiting check-in logs'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-center">
          <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
            Workouts Logged
          </span>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 mt-1 flex items-center justify-center space-x-1">
            <Flame className="w-5 h-5" />
            <span>{completedCount} Sessions</span>
          </div>
          <span className="text-[11px] text-orange-600/80 mt-1 block">
            {completedCount > 0 ? `${completedCount} sessions recorded` : 'Log your session today'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            Habit Consistency
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1 flex items-center justify-center space-x-1">
            <Award className="w-5 h-5" />
            <span>{logs.length > 0 ? `${logs.length} Check-ins` : 'Ready to Start'}</span>
          </div>
          <span className="text-[11px] text-purple-600/80 mt-1 block">
            {logs.length >= 7 ? '7+ Day Streak Active' : 'Build consistency day by day'}
          </span>
        </div>
      </div>

      {/* 2.5 GEMINI AI INSTANT ACTIVITY & NUTRITION ANALYZER */}
      <div className="bg-gradient-to-br from-emerald-900/10 via-white to-teal-900/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/30 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini 3.6 Flash Live AI Engine</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Instant Activity & Food Analyzer
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Describe whatever you ate and workouts or steps you did today in plain English, Hindi, or Punjabi.
              Gemini AI automatically calculates consumed macros, calories burned, and evaluates your pacing.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Live AI Nutritionist
            </span>
          </div>
        </div>

        {/* Inputs: Date, Weight, Food Eaten & Activities Done */}
        <div className="space-y-4">
          {/* Row 1: Date & Body Weight (Integrated Check-In) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Check-in Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Current Weight (kg) *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 100.0"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">kg</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Water Drank (Liters)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={waterLiters}
                  onChange={(e) => setWaterLiters(e.target.value)}
                  placeholder="e.g. 3.5"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">L</span>
              </div>
            </div>
          </div>

          {/* Row 2: Food Eaten & Activities Done */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Food Eaten Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                  <span>What did you eat today?</span>
                </span>
                <span className="text-[11px] text-slate-400 normal-case font-normal">Meals, snacks, drinks</span>
              </label>
              <textarea
                rows={3}
                value={aiFoodInput}
                onChange={(e) => setAiFoodInput(e.target.value)}
                placeholder="e.g. 2 parathas with curd for breakfast, 2 rotis with dal tadka and salad for lunch, 1 scoop whey protein shake, 150g paneer with sabzi for dinner"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
              />
              {/* Food Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  '2 Roti + Dal Tadka',
                  '1 Scoop Whey Protein',
                  '150g Paneer Bhurji',
                  '2 Aloo Parathas + Curd',
                  '200g Grilled Chicken',
                  'Greek Yogurt + Almonds',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setAiFoodInput((prev) => (prev ? `${prev}, ${chip}` : chip))
                    }
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities Done Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>What activities did you do today?</span>
                </span>
                <span className="text-[11px] text-slate-400 normal-case font-normal">Gym, running, walking</span>
              </label>
              <textarea
                rows={3}
                value={aiActivityInput}
                onChange={(e) => setAiActivityInput(e.target.value)}
                placeholder="e.g. 45 mins chest & triceps dumbbell workout at gym, 4 km evening run at 8.5 km/h, 9500 steps walked throughout the day"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
              />
              {/* Activity Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  '45m Push Workout (Gym)',
                  '5 km Zone 2 Aerobic Run',
                  '10,000 Steps Daily Walk',
                  '15m Post-Meal Walk',
                  '30m Bodyweight Home Workout',
                  '12m Joint Mobility Routine',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setAiActivityInput((prev) => (prev ? `${prev}, ${chip}` : chip))
                    }
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Instant Calculation Preview */}
        {hasLiveInputs && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Live Instant Sports-Science Estimate:</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                Live Calculation
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white shadow-sm">
                🍴 <span className="text-emerald-600">{liveParsedFood.totalCalories} kcal</span> ({liveParsedFood.items.length} food items) • P: {liveParsedFood.totalProtein}g • C: {liveParsedFood.totalCarbs}g • F: {liveParsedFood.totalFats}g
              </div>
              {liveParsedAct.totalBurn > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 font-bold text-orange-600 dark:text-orange-400 shadow-sm">
                  ⚡ ~{liveParsedAct.totalBurn} kcal workout burn ({liveParsedAct.items.length} activities)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Trigger Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            {aiError && (
              <span className="text-red-500 font-semibold">{aiError}</span>
            )}
            {!aiError && (
              <span>Calculates energy balance with sports science METs and records your daily check-in</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAutoCalculateAndSaveCheckin}
            disabled={aiAnalyzing}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {aiAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Computing & Recording Check-In...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Auto-Calculate & Record Daily Check-in</span>
              </>
            )}
          </button>
        </div>

        {/* Results Presentation (Conditional) */}
        {aiAnalysisResult && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn">
            {/* Top Stat Row: Consumed vs Burned vs Net */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Consumed Calories */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Calories Consumed</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">
                  {Math.round(aiAnalysisResult.caloriesConsumed)} <span className="text-xs font-medium text-slate-400">kcal</span>
                </span>
                <div className="mt-1 text-[10px] text-slate-500 flex justify-center gap-1">
                  <span>P: {Math.round(aiAnalysisResult.proteinGrams)}g</span> •
                  <span>C: {Math.round(aiAnalysisResult.carbGrams)}g</span> •
                  <span>F: {Math.round(aiAnalysisResult.fatGrams)}g</span>
                </div>
              </div>

              {/* Calories Burned */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-orange-500 block">Total Burned</span>
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-0.5 block">
                  {Math.round(aiAnalysisResult.caloriesBurned)} <span className="text-xs font-medium text-orange-400">kcal</span>
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Gym + Running + NEAT</span>
              </div>

              {/* Net Calories */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Energy Balance</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">
                  {Math.round(aiAnalysisResult.netCalories)} <span className="text-xs font-medium text-slate-400">kcal</span>
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Consumed minus Burned</span>
              </div>

              {/* Target Calories */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Daily Target</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                  {aiAnalysisResult.targetCalories || effectiveProfile.targetCalories} <span className="text-xs font-medium text-emerald-500">kcal</span>
                </span>
                <span className="text-[10px] text-emerald-600/75 mt-1 block">Target: {effectiveProfile.proteinGrams}g Protein</span>
              </div>
            </div>

            {/* Meal & Activity Breakdown Chips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Food Items */}
              {aiAnalysisResult.mealBreakdown && aiAnalysisResult.mealBreakdown.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Detected Meal Breakdown:
                  </span>
                  <div className="space-y-1.5">
                    {aiAnalysisResult.mealBreakdown.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{m.item}</span>
                          {m.portion && (
                            <span className="text-slate-400 text-[11px] ml-1.5">({m.portion})</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{m.calories} kcal</span>
                          <span className="text-[10px] text-emerald-600 block">{m.protein}g protein</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Items */}
              {aiAnalysisResult.activityBreakdown && aiAnalysisResult.activityBreakdown.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Detected Activity Breakdown:
                  </span>
                  <div className="space-y-1.5">
                    {aiAnalysisResult.activityBreakdown.map((a, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{a.name}</span>
                          {a.durationOrMetric && (
                            <span className="text-slate-400 text-[11px] ml-1.5">({a.durationOrMetric})</span>
                          )}
                        </div>
                        <div className="font-bold text-orange-600 dark:text-orange-400">
                          ~{a.caloriesBurned} kcal
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Pacing Recommendation Banner */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                aiAnalysisResult.pacingRecommendation === 'deploy_more_effort'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                  : aiAnalysisResult.pacingRecommendation === 'go_slow_recover'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-950 dark:text-blue-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {aiAnalysisResult.pacingRecommendation === 'deploy_more_effort' ? (
                    <Zap className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  ) : aiAnalysisResult.pacingRecommendation === 'go_slow_recover' ? (
                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  <h4 className="font-black text-base">
                    {aiAnalysisResult.pacingTitle || 'ZeroFIT Pace Evaluation'}
                  </h4>
                </div>

                <span
                  className={`text-xs uppercase tracking-wider font-black px-3 py-1 rounded-full text-center ${
                    aiAnalysisResult.pacingRecommendation === 'deploy_more_effort'
                      ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                      : aiAnalysisResult.pacingRecommendation === 'go_slow_recover'
                      ? 'bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                  }`}
                >
                  {aiAnalysisResult.pacingRecommendation === 'deploy_more_effort'
                    ? 'Deploy More Effort'
                    : aiAnalysisResult.pacingRecommendation === 'go_slow_recover'
                    ? 'Go Slow & Recover'
                    : 'Optimal Sweet Spot'}
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed">
                {aiAnalysisResult.pacingExplanation}
              </p>

              {aiAnalysisResult.nextStepAdvice && (
                <div className="pt-2 border-t border-black/10 dark:border-white/10 text-xs font-semibold">
                  💡 <strong>Tactical Instruction:</strong> {aiAnalysisResult.nextStepAdvice}
                </div>
              )}
            </div>

            {appliedNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold text-center animate-fadeIn flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  ✓ Official Daily Check-in Recorded for {date}! Weight: {weightKg} kg | Calories: {aiAnalysisResult ? Math.round(aiAnalysisResult.caloriesConsumed) : '—'} kcal. Weight trajectory chart and history have been updated automatically.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: SVG Interactive Weight Trend Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weight Trend Trajectory (kg)
              </h3>
              <p className="text-xs text-slate-500">
                Smooth moving trend line based on your recorded check-ins.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              {logs.length} Recorded Points
            </span>
          </div>

          {/* SVG Line Chart or Clean Empty State */}
          {hasLogs ? (
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 sm:h-64">
                {/* Background horizontal grid lines */}
                <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="#e2e8f0" strokeDasharray="4" className="dark:stroke-slate-800" />
                <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="#e2e8f0" strokeDasharray="4" className="dark:stroke-slate-800" />
                <line x1="0" y1="120" x2={chartWidth} y2="120" stroke="#e2e8f0" strokeDasharray="4" className="dark:stroke-slate-800" />

                {/* Trend Polyline */}
                {logs.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                )}

                {/* Data points dots */}
                {logs.map((log, idx) => {
                  const x = logs.length === 1 ? chartWidth / 2 : (idx / (logs.length - 1)) * (chartWidth - 40) + 20;
                  const y = chartHeight - ((log.weightKg - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;
                  return (
                    <g key={log.id || idx}>
                      <circle cx={x} cy={y} r="5" fill="#059669" className="hover:r-7 transition-all cursor-pointer" />
                      <text
                        x={x}
                        y={y - 10}
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="fill-slate-700 dark:fill-slate-300"
                      >
                        {log.weightKg}kg
                      </text>
                      <text
                        x={x}
                        y={chartHeight - 4}
                        fontSize="9"
                        textAnchor="middle"
                        className="fill-slate-400"
                      >
                        {log.date.slice(5)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="py-14 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <LineChart className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Check-In Logs Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Log your first check-in above. Your authentic trajectory line chart will map out here automatically.
              </p>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Why Daily Tracking Matters</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Tracking your daily meals and workout consistency prevents metabolic stalls. ZeroFIT AI uses each entry to adjust your days remaining and fine-tune your next day's calories.
            </p>
          </div>
        </div>

        {/* Right Col: FAT LOSS & MUSCLE PRESERVATION (BODY RECOMPOSITION) SCIENCE CARD */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Evidence-Based Sports Science
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Fat Loss & Muscle Building System
            </h3>
          </div>

          {/* Transformation Progress Status */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400">Current Position:</span>
              <span className="font-black text-slate-900 dark:text-white">
                {latestWeight.toFixed(1)} kg ➔ {effectiveProfile.targetWeightKg} kg Target
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400">Remaining to Goal:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {Math.max(0, latestWeight - (effectiveProfile.targetWeightKg || 0)).toFixed(1)} kg
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400">Estimated Timeline:</span>
              <span className="font-black text-slate-800 dark:text-slate-200">
                {timeline.daysRemaining} Days ({Math.ceil(timeline.daysRemaining / 7)} Weeks)
              </span>
            </div>
          </div>

          {/* Scientific Principles Explained */}
          <div className="space-y-3 text-xs">
            {/* 1. Fat Loss Deficit */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>1. Fat Loss Energy Deficit: {effectiveProfile.targetCalories} kcal</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                1 kg of body fat contains ~7,700 kcal. Eating at an evidence-based deficit (20–25% below expenditure) burns <strong>0.5 to 0.7 kg pure fat/week</strong> without slowing your thyroid or triggering muscle wasting.
              </p>
            </div>

            {/* 2. Muscle Preservation mTOR */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Muscle Building & Retention: {effectiveProfile.proteinGrams}g Protein</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Consuming ~1.8g/kg protein combined with resistance training activates mTOR muscle protein synthesis. Your body pulls 100% of fuel from adipose fat stores while preserving lean muscle (Body Recomposition).
              </p>
            </div>

            {/* 3. Dynamic Pacing Rules */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span>3. ZeroFIT Pacing Criteria</span>
              </div>
              <ul className="text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-emerald-600">Optimal Pace:</strong> In calorie deficit + hitting protein + training.</li>
                <li><strong className="text-amber-600">Deploy More Effort:</strong> Calorie surplus (eating above target) or sedentary.</li>
                <li><strong className="text-blue-600">Go Slow & Recover:</strong> Crash starvation (&lt;1,200 kcal) or extreme overtraining.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EXPANDED CHECK-IN HISTORY TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-0">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{t.history}</span>
          </div>
          <span className="text-xs font-normal text-slate-400">
            {logs.length} Total Check-ins Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          {hasLogs ? (
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Weight</th>
                  <th className="py-3.5 px-4">Food & Nutrition</th>
                  <th className="py-3.5 px-4">Adherence</th>
                  <th className="py-3.5 px-4">Workout Status</th>
                  <th className="py-3.5 px-4">Water</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...logs].reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 whitespace-nowrap">
                      {log.weightKg} kg
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {log.foodNotes ? (
                        <span title={log.foodNotes} className="text-slate-800 dark:text-slate-200">
                          {log.foodNotes}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No food note</span>
                      )}
                      {log.caloriesConsumed ? (
                        <span className="block text-[10px] text-slate-400">
                          {log.caloriesConsumed} kcal • {log.proteinGramsConsumed || 0}g P
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.dietAdherence === 'on_track'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : log.dietAdherence === 'cheat_day'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : log.dietAdherence === 'over_calories'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {log.dietAdherence ? log.dietAdherence.replace('_', ' ') : 'recorded'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.workoutCompleted ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done ({log.workoutMinutes || 45}m)</span>
                          </span>
                          {log.workoutType && (
                            <span className="block text-[10px] text-slate-400 truncate max-w-[150px]">
                              {log.workoutType}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Rest Day</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.waterLiters ? `${log.waterLiters}L` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-xs text-slate-500 space-y-2">
              <p className="font-bold text-slate-700 dark:text-slate-300">
                No check-in logs yet.
              </p>
              <p>
                Fill out the daily check-in form above to start your authentic transformation history!
              </p>
            </div>
          )}
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
