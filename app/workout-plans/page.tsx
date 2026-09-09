'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  generateWorkoutPlan,
  generateComprehensiveMovementPlan,
  computePersonalizedTargets,
} from '@/lib/personalization';
import { WorkoutPlan, ComprehensiveMovementPlan } from '@/types';
import {
  Dumbbell,
  Home,
  Flame,
  Calendar,
  Layers,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Activity,
  Footprints,
  HeartPulse,
  Timer,
  ShieldCheck,
} from 'lucide-react';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function WorkoutPlansPage() {
  const { profile, t } = useApp();

  const isSenior = (profile?.age || 28) >= 45;

  const [activeMovementTab, setActiveMovementTab] = useState<'gym' | 'running' | 'walking' | 'mobility'>('gym');
  const [environment, setEnvironment] = useState<'gym' | 'home'>('gym');
  const [days, setDays] = useState<number>(isSenior ? 3 : 4);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(
    isSenior ? 'beginner' : 'intermediate'
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Active workout timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const activeProfile = profile || computePersonalizedTargets({});
  const comprehensivePlan: ComprehensiveMovementPlan = generateComprehensiveMovementPlan(
    activeProfile,
    environment,
    days
  );
  const plan: WorkoutPlan = comprehensivePlan.gym || generateWorkoutPlan(activeProfile, {
    environment,
    daysPerWeek: days,
    difficulty,
  });

  const activeScheduleDay = plan.schedule[selectedDayIndex] || plan.schedule[0];

  const startRestTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  React.useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-bold">
          <Flame className="w-3.5 h-3.5" />
          <span>Scientific Resistance Programming</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.workoutTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.workoutSubtitle}
        </p>
      </div>

      {/* Multi-Modal Movement Protocol Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveMovementTab('gym')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeMovementTab === 'gym'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Split 1</span>
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-sm sm:text-base">Gym / Resistance</div>
            <div className="text-xs opacity-75">{environment === 'gym' ? 'Hypertrophy & Tone' : 'Bodyweight Form'}</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMovementTab('running')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeMovementTab === 'running'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Split 2</span>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-sm sm:text-base">Running & Cardio</div>
            <div className="text-xs opacity-75">Zone 2 Aerobic Base</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMovementTab('walking')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeMovementTab === 'walking'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Split 3</span>
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-sm sm:text-base">Daily Walking & NEAT</div>
            <div className="text-xs opacity-75">{comprehensivePlan.walking.dailyStepTarget.toLocaleString()} Steps Target</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMovementTab('mobility')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeMovementTab === 'mobility'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Split 4</span>
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-sm sm:text-base">Joint & Spine Care</div>
            <div className="text-xs opacity-75">Synovial Decompression</div>
          </div>
        </button>
      </div>

      {/* TAB 1: GYM RESISTANCE */}
      {activeMovementTab === 'gym' && (
        <div className="space-y-8">
          {/* Control Panel: Gym/Home, Days, Level */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Environment */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Training Location
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => setEnvironment('gym')}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                      environment === 'gym'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>Gym Workout</span>
                  </button>
                  <button
                    onClick={() => setEnvironment('home')}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                      environment === 'home'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home (Bodyweight)</span>
                  </button>
                </div>
              </div>

              {/* Days Per Week */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Frequency ({days} Days / Week)
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {[3, 4, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDays(d);
                        setSelectedDayIndex(0);
                      }}
                      className={`py-2.5 rounded-xl border transition-all ${
                        days === d
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {d} Days {d === 3 ? '(Full Body)' : d === 4 ? '(Upper/Lower)' : '(PPL)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`py-2.5 rounded-xl border capitalize transition-all ${
                        difficulty === diff
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Age 45+ or Joint Issues Notice */}
            {isSenior && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Longevity & Joint Protection Activated:</strong> We
                  have automatically adapted this routine to minimize spinal compression and knee
                  shearing forces. Lower reps are replaced with controlled hypertrophy tempos.
                </div>
              </div>
            )}
          </div>

          {/* Floating Rest Timer HUD */}
          {timerActive && (
            <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center space-x-4 animate-bounce">
              <Clock className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Rest Timer</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {Math.floor(timerSeconds / 60)}:
                  {(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={() => setTimerActive(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Day Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {plan.schedule.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  selectedDayIndex === idx
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Day {day.dayNumber}: {day.focus}</span>
              </button>
            ))}
          </div>

          {/* Selected Day Workout Breakdown */}
          {activeScheduleDay && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {activeScheduleDay.dayName}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    Focus: {activeScheduleDay.focus}
                  </p>
                </div>
                <div className="text-xs text-slate-500 flex items-center space-x-1">
                  <span>Warm-up: 5–8 mins dynamic mobility before starting</span>
                </div>
              </div>

              {/* Exercises Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeScheduleDay.exercises.map((exercise, eIdx) => (
                  <div
                    key={eIdx}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                            Exercise {eIdx + 1} • {exercise.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {exercise.name}
                          </h4>
                        </div>

                        <button
                          onClick={() => startRestTimer(exercise.restSeconds)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                          title="Start Rest Timer"
                        >
                          <Clock className="w-3 h-3" />
                          <span>{exercise.restSeconds}s Rest</span>
                        </button>
                      </div>

                      {/* Target Muscles */}
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles.map((muscle, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>

                      {/* Sets and Reps */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Working Sets</span>
                          <span className="text-slate-900 dark:text-white text-sm font-black">
                            {exercise.sets} Sets
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Rep Target</span>
                          <span className="text-slate-900 dark:text-white text-sm font-black">
                            {exercise.reps}
                          </span>
                        </div>
                      </div>

                      {/* Form Cues / Execution */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        💡 <strong className="text-slate-800 dark:text-slate-200">Execution Cue:</strong> {exercise.notes}
                      </p>

                      {/* Joint-Friendly Alternative if any */}
                      {exercise.jointFriendlyAlternative && (
                        <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 text-xs text-teal-900 dark:text-teal-200">
                          <strong className="font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            <span>Joint-Safe Alternative:</span>
                          </strong>
                          <span className="mt-0.5 block">{exercise.jointFriendlyAlternative}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="capitalize">Level: {exercise.difficulty}</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        Form over heavy weight
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooldown Notes */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">
                  Day {activeScheduleDay.dayNumber} Cooldown & Flexibility
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeScheduleDay.cooldownNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RUNNING & CARDIO PACING */}
      {activeMovementTab === 'running' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Aerobic Capacity & Metabolic Engine
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {comprehensivePlan.running.pacingStyle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Heart Rate Target: <strong className="text-slate-800 dark:text-slate-200">{comprehensivePlan.running.heartRateZone}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Frequency</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                    {comprehensivePlan.running.frequencyPerWeek} Days / Wk
                  </span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-4 py-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">Session Target</span>
                  <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                    {comprehensivePlan.running.targetDistanceKm} km
                  </span>
                </div>
              </div>
            </div>

            {/* Scientific Guidance Quote */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-bold text-slate-900 dark:text-white">Physiological Mechanism: </strong>
                {comprehensivePlan.running.guidance}
              </div>
            </div>

            {/* Intervals Table */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Pacing & Interval Structure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comprehensivePlan.running.intervals.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        Step {sIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                        <Timer className="w-3 h-3" />
                        <span>{step.duration}</span>
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {step.phase}
                      </h5>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        {step.speedOrPace}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAILY WALKING & NEAT */}
      {activeMovementTab === 'walking' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Non-Exercise Activity Thermogenesis (NEAT)
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Daily Walking & Blood Glucose Partitioning
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Low-intensity movement preserves insulin sensitivity and burns fat without fatigue.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Daily Target</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                    {comprehensivePlan.walking.dailyStepTarget.toLocaleString()} Steps
                  </span>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 px-4 py-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block">Est. Daily Burn</span>
                  <span className="text-lg font-black text-orange-700 dark:text-orange-300">
                    ~{comprehensivePlan.walking.estimatedCalorieBurn} kcal
                  </span>
                </div>
              </div>
            </div>

            {/* Post-Meal Glucose Clearance Routine */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center space-x-2">
                <Footprints className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  15-Minute Post-Meal Walk Protocol (GLUT-4 Activation)
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {comprehensivePlan.walking.glucoseClearanceTip}
              </p>
            </div>

            {/* Weekly Target Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-400 text-xs uppercase font-bold block">Weekly Step Goal</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  {comprehensivePlan.walking.weeklyStepsGoal.toLocaleString()} Steps
                </span>
                <span className="text-[11px] text-slate-500">Consistent daily accumulation</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-400 text-xs uppercase font-bold block">Post-Meal Timing</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  Within 20–30 Mins
                </span>
                <span className="text-[11px] text-slate-500">Blunts postprandial glucose spike</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-400 text-xs uppercase font-bold block">Pacing Style</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  Brisk & Steady
                </span>
                <span className="text-[11px] text-slate-500">4.5–5.5 km/h comfortable walk</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JOINT MOBILITY & SPINE CARE */}
      {activeMovementTab === 'mobility' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Longevity, Fascia & Synovial Fluid Hydration
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {comprehensivePlan.mobility.routineName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Daily routine to decompress intervertebral discs and lubricate hip, knee, and shoulder capsules.
                </p>
              </div>

              <div className="bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-2.5 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 block">Daily Duration</span>
                <span className="text-lg font-black text-teal-700 dark:text-teal-300">
                  {comprehensivePlan.mobility.durationMinutes} Minutes
                </span>
              </div>
            </div>

            {/* Target Joint Focus Badges */}
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block mb-2">
                Target Joints & Articular Tissues:
              </span>
              <div className="flex flex-wrap gap-2">
                {comprehensivePlan.mobility.jointFocus.map((joint, jIdx) => (
                  <span
                    key={jIdx}
                    className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>{joint}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Exercises List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comprehensivePlan.mobility.exercises.map((mob, mIdx) => (
                <div
                  key={mIdx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Mobility Drill {mIdx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold">
                      {mob.repsOrHold}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {mob.name}
                  </h5>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    Target: {mob.focusJoint}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mob.instruction}
                  </p>
                </div>
              ))}
            </div>

            {/* Joint Safety Note */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300">
              <strong className="font-bold">Clinical Longevity Note: </strong>
              {comprehensivePlan.mobility.jointSafetyNote}
            </div>
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
