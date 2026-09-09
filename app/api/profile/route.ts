import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectDB, memoryStore } from '@/lib/db';
import { Profile } from '@/lib/models';
import { computePersonalizedTargets } from '@/lib/personalization';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await connectDB();
  let profile = null;

  if (db) {
    profile = await Profile.findOne({ userId: user.id });
  } else {
    profile = memoryStore.profiles.get(user.id);
  }

  if (!profile) {
    // Generate default profile
    const defaultProfile = computePersonalizedTargets({
      name: user.name,
      email: user.email,
    });
    return NextResponse.json({ profile: defaultProfile });
  }

  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updatedMetrics = computePersonalizedTargets({
      ...body,
      name: user.name,
      email: user.email,
      age: Number(body.age),
      heightCm: Number(body.heightCm),
      weightKg: Number(body.weightKg),
      targetWeightKg: Number(body.targetWeightKg || body.weightKg),
    });

    const db = await connectDB();
    if (db) {
      await Profile.findOneAndUpdate(
        { userId: user.id },
        { $set: { userId: user.id, ...updatedMetrics } },
        { upsert: true, new: true }
      );
    } else {
      memoryStore.profiles.set(user.id, { userId: user.id, ...updatedMetrics });
    }

    return NextResponse.json({ success: true, profile: updatedMetrics });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
