export type Language = 'en' | 'hi' | 'pa';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';

export type FitnessGoal = 'lose_fat' | 'gain_muscle' | 'maintain' | 'general_health';

export type DietaryPreference = 'veg' | 'non_veg' | 'eggetarian' | 'vegan';

export type CuisinePreference = 'north_indian' | 'south_indian' | 'continental';

export type AgeGroup = 'teens' | 'young_adults' | 'mid_age' | 'seniors';

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface HealthFlags {
  diabetes: boolean;
  thyroid: boolean;
  pcos: boolean;
  hypertension: boolean;
  jointIssues: boolean;
  heartCondition: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  dietPreference: DietaryPreference;
  cuisinePreference: CuisinePreference;
  healthFlags: HealthFlags;
  // Computed recommendations
  bmi: number;
  bmiCategory: BMICategory;
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  waterIntakeLiters: number;
  ageGroup: AgeGroup;
  safetyAdvice: string[];
  lastUpdated?: string;
}

export interface MealItem {
  name: string;
  nameHi?: string;
  namePa?: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  alternatives?: string[];
  notes?: string;
}

export interface DailyMealPlan {
  title: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: {
    earlyMorning?: MealItem;
    breakfast: MealItem;
    midMorningSnack?: MealItem;
    lunch: MealItem;
    eveningSnack: MealItem;
    dinner: MealItem;
    bedtime?: MealItem;
  };
  hydrationTips: string;
  cookingTips: string[];
}

export interface WorkoutExercise {
  name: string;
  category: 'strength' | 'cardio' | 'mobility' | 'core';
  targetMuscles: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
  jointFriendlyAlternative?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  exercises: WorkoutExercise[];
  cooldownNotes: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  environment: 'home' | 'gym';
  daysPerWeek: number;
  splitType: 'full_body' | 'push_pull_legs' | 'upper_lower' | 'bro_split';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageGroupSafety: string[];
  schedule: WorkoutDay[];
}

export interface RunningProtocol {
  frequencyPerWeek: number;
  targetDistanceKm: number;
  pacingStyle: string;
  heartRateZone: string;
  intervals: Array<{
    phase: string;
    duration: string;
    speedOrPace: string;
    notes: string;
  }>;
  guidance: string;
}

export interface WalkingProtocol {
  dailyStepTarget: number;
  estimatedCalorieBurn: number;
  postMealWalkMinutes: number;
  glucoseClearanceTip: string;
  weeklyStepsGoal: number;
}

export interface MobilityProtocol {
  routineName: string;
  durationMinutes: number;
  jointFocus: string[];
  exercises: Array<{
    name: string;
    focusJoint: string;
    repsOrHold: string;
    instruction: string;
  }>;
  jointSafetyNote: string;
}

export interface ComprehensiveMovementPlan {
  gym: WorkoutPlan;
  running: RunningProtocol;
  walking: WalkingProtocol;
  mobility: MobilityProtocol;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  titleHi?: string;
  titlePa?: string;
  summary: string;
  content: string;
  category: 'nutrition' | 'fat_loss' | 'muscle_gain' | 'hydration_sleep' | 'conditions' | 'punjabi_indian' | 'supplements' | 'mobility' | 'womens_fitness';
  ageGroups: AgeGroup[];
  goals: FitnessGoal[];
  readTimeMinutes: number;
  author: string;
  tags: string[];
  keyTakeaways: string[];
  citations?: string[];
  createdAt: string;
}

export type DietAdherence = 'on_track' | 'under_calories' | 'over_calories' | 'cheat_day';

export interface ProgressLog {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  workoutCompleted?: boolean;
  waterLiters?: number;
  notes?: string;
  // Daily Nutrition Tracking
  foodNotes?: string;
  dietAdherence?: DietAdherence;
  caloriesConsumed?: number;
  proteinGramsConsumed?: number;
  // Daily Workout Status Tracking
  workoutType?: string;
  workoutMinutes?: number;
  workoutIntensity?: 'light' | 'moderate' | 'intense';
}

export interface ProgramTimeline {
  totalDays: number;
  currentDay: number;
  daysRemaining: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  totalChangeKg: number;
  remainingChangeKg: number;
  percentComplete: number;
  weeklyRateKg: number;
  aiGuidance: {
    statusSummary: string;
    nextStepNutrition: string;
    nextStepWorkout: string;
    nextStepRecovery: string;
    actionableTask: string;
  };
}

export interface DailyTip {
  id: string;
  category: 'nutrition' | 'training' | 'recovery' | 'mindset';
  tipEn: string;
  tipHi: string;
  tipPa: string;
  actionableStep: string;
}

export interface RunningInterval {
  phase: string;
  duration: string;
  speedOrPace: string;
  notes: string;
}

export interface RunningProtocol {
  frequencyPerWeek: number;
  targetDistanceKm: number;
  pacingStyle: string;
  heartRateZone: string;
  intervals: RunningInterval[];
  guidance: string;
}

export interface WalkingProtocol {
  dailyStepTarget: number;
  estimatedCalorieBurn: number;
  postMealWalkMinutes: number;
  glucoseClearanceTip: string;
  weeklyStepsGoal: number;
}

export interface MobilityExercise {
  name: string;
  focusJoint: string;
  repsOrHold: string;
  instruction: string;
}

export interface MobilityProtocol {
  routineName: string;
  durationMinutes: number;
  jointFocus: string[];
  exercises: MobilityExercise[];
  jointSafetyNote: string;
}

export interface ComprehensiveMovementPlan {
  gym: WorkoutPlan;
  running: RunningProtocol;
  walking: WalkingProtocol;
  mobility: MobilityProtocol;
}
