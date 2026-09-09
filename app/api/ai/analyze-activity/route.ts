import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectDB, memoryStore } from '@/lib/db';
import { Profile } from '@/lib/models';
import { analyzeDailyActivityAndNutrition } from '@/lib/gemini';
import { computePersonalizedTargets } from '@/lib/personalization';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { foodText, activityText, profile: clientProfile } = body;

    if (!foodText && !activityText) {
      return NextResponse.json(
        { error: 'Please enter what you ate or what activities you did today' },
        { status: 400 }
      );
    }

    // Try to get active profile from session or fallback to client/default
    const user = await getSessionUser();
    let userProfile = clientProfile || {};

    if (user) {
      const db = await connectDB();
      let found: any = null;
      if (db) {
        found = await Profile.findOne({ userId: user.id });
      } else {
        found = memoryStore.profiles.get(user.id);
      }
      if (found) {
        // Merge so clientProfile takes precedence for currently edited parameters
        userProfile = { ...(found.toObject ? found.toObject() : found), ...clientProfile };
      }
    }

    // Recompute personalized targets so target calories, deficit, and goal are strictly aligned
    userProfile = computePersonalizedTargets(userProfile);

    const analysis = await analyzeDailyActivityAndNutrition(
      foodText || '',
      activityText || '',
      userProfile
    );

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Activity Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete activity and nutrition analysis' },
      { status: 500 }
    );
  }
}
