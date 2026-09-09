import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectDB, memoryStore } from '@/lib/db';
import { ProgressLog } from '@/lib/models';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await connectDB();
  let logs: any[] = [];

  if (db) {
    logs = await ProgressLog.find({ userId: user.id }).sort({ date: 1 });
  } else {
    logs = memoryStore.progress.get(user.id) || [];
  }

  return NextResponse.json({ logs });
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const entry = {
      id: 'log_' + Date.now(),
      userId: user.id,
      date: body.date || new Date().toISOString().split('T')[0],
      weightKg: Number(body.weightKg),
      chestCm: body.chestCm ? Number(body.chestCm) : undefined,
      waistCm: body.waistCm ? Number(body.waistCm) : undefined,
      hipsCm: body.hipsCm ? Number(body.hipsCm) : undefined,
      armsCm: body.armsCm ? Number(body.armsCm) : undefined,
      thighsCm: body.thighsCm ? Number(body.thighsCm) : undefined,
      workoutCompleted: Boolean(body.workoutCompleted),
      waterLiters: body.waterLiters ? Number(body.waterLiters) : undefined,
      notes: body.notes || '',
      foodNotes: body.foodNotes || '',
      dietAdherence: body.dietAdherence || 'on_track',
      caloriesConsumed: body.caloriesConsumed ? Number(body.caloriesConsumed) : undefined,
      proteinGramsConsumed: body.proteinGramsConsumed ? Number(body.proteinGramsConsumed) : undefined,
      workoutType: body.workoutType || '',
      workoutMinutes: body.workoutMinutes ? Number(body.workoutMinutes) : undefined,
      workoutIntensity: body.workoutIntensity || 'moderate',
    };

    const db = await connectDB();
    if (db) {
      const created = await ProgressLog.create(entry);
      return NextResponse.json({ success: true, log: created });
    } else {
      const current = memoryStore.progress.get(user.id) || [];
      // If entry for date exists, update it, otherwise push
      const existingIdx = current.findIndex((l) => l.date === entry.date);
      if (existingIdx >= 0) {
        current[existingIdx] = { ...current[existingIdx], ...entry };
      } else {
        current.push(entry);
      }
      current.sort((a, b) => a.date.localeCompare(b.date));
      memoryStore.progress.set(user.id, current);
      return NextResponse.json({ success: true, log: entry });
    }
  } catch (error: any) {
    console.error('Progress log error:', error);
    return NextResponse.json({ error: 'Failed to record progress log' }, { status: 500 });
  }
}
