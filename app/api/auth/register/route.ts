import { NextResponse } from 'next/server';
import { connectDB, memoryStore } from '@/lib/db';
import { User, Profile } from '@/lib/models';
import { hashPassword, signToken } from '@/lib/auth';
import { computePersonalizedTargets } from '@/lib/personalization';

export async function POST(req: Request) {
  try {
    const { name, email, password, age, gender, heightCm, weightKg, goal, dietPreference } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await connectDB();

    let existingUser = null;
    if (db) {
      existingUser = await User.findOne({ email: cleanEmail });
    } else {
      existingUser = memoryStore.users.get(cleanEmail);
    }

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const userId = 'usr_' + Date.now();

    const userData = {
      id: userId,
      name,
      email: cleanEmail,
      passwordHash,
      role: 'user',
      createdAt: new Date(),
    };

    // Calculate baseline profile targets
    const computed = computePersonalizedTargets({
      name,
      email: cleanEmail,
      age: Number(age) || 28,
      gender: gender || 'male',
      heightCm: Number(heightCm) || 172,
      weightKg: Number(weightKg) || 70,
      targetWeightKg: Number(weightKg) || 70,
      goal: goal || 'general_health',
      dietPreference: dietPreference || 'veg',
      cuisinePreference: 'north_indian',
    });

    if (db) {
      const newUser = await User.create({
        name,
        email: cleanEmail,
        passwordHash,
      });
      await Profile.create({
        userId: newUser._id.toString(),
        ...computed,
      });
    } else {
      memoryStore.users.set(cleanEmail, userData);
      memoryStore.profiles.set(userId, { userId, ...computed });
    }

    const token = signToken({
      id: userId,
      name,
      email: cleanEmail,
      role: 'user',
    });

    const response = NextResponse.json({
      success: true,
      user: { id: userId, name, email: cleanEmail },
      profile: computed,
    });

    response.cookies.set('zero_fit_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error during registration' }, { status: 500 });
  }
}
