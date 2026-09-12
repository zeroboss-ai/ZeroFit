import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

export interface IProfile extends Document {
  userId: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: string;
  goal: string;
  dietPreference: string;
  cuisinePreference: string;
  healthFlags: {
    diabetes: boolean;
    thyroid: boolean;
    pcos: boolean;
    hypertension: boolean;
    jointIssues: boolean;
    heartCondition: boolean;
  };
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  waterIntakeLiters: number;
  ageGroup: string;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    targetWeightKg: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    goal: { type: String, required: true },
    dietPreference: { type: String, required: true },
    cuisinePreference: { type: String, required: true },
    healthFlags: {
      diabetes: { type: Boolean, default: false },
      thyroid: { type: Boolean, default: false },
      pcos: { type: Boolean, default: false },
      hypertension: { type: Boolean, default: false },
      jointIssues: { type: Boolean, default: false },
      heartCondition: { type: Boolean, default: false },
    },
    bmi: Number,
    bmiCategory: String,
    bmr: Number,
    tdee: Number,
    targetCalories: Number,
    proteinGrams: Number,
    carbGrams: Number,
    fatGrams: Number,
    waterIntakeLiters: Number,
    ageGroup: String,
  },
  { timestamps: true }
);

export interface IProgressLog extends Document {
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
  foodNotes?: string;
  dietAdherence?: string;
  caloriesConsumed?: number;
  proteinGramsConsumed?: number;
  caloriesBurned?: number;
  netDeficit?: number;
  workoutType?: string;
  workoutMinutes?: number;
  workoutIntensity?: string;
}

const ProgressLogSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    weightKg: { type: Number, required: true },
    chestCm: Number,
    waistCm: Number,
    hipsCm: Number,
    armsCm: Number,
    thighsCm: Number,
    workoutCompleted: { type: Boolean, default: false },
    waterLiters: Number,
    notes: String,
    foodNotes: String,
    dietAdherence: String,
    caloriesConsumed: Number,
    proteinGramsConsumed: Number,
    caloriesBurned: Number,
    netDeficit: Number,
    workoutType: String,
    workoutMinutes: Number,
    workoutIntensity: String,
  },
  { timestamps: true }
);

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
}

const NewsletterSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent re-compilation in development HMR
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
export const ProgressLog = mongoose.models.ProgressLog || mongoose.model<IProgressLog>('ProgressLog', ProgressLogSchema);
export const Newsletter = mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
