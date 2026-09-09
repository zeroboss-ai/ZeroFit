import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectDB, memoryStore } from '@/lib/db';
import { Profile } from '@/lib/models';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null, profile: null });
    }

    const db = await connectDB();
    let profile = null;
    if (db) {
      profile = await Profile.findOne({ userId: user.id });
    } else {
      profile = memoryStore.profiles.get(user.id);
    }

    return NextResponse.json({ user, profile });
  } catch (error) {
    return NextResponse.json({ user: null, profile: null });
  }
}
