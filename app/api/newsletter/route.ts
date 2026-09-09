import { NextResponse } from 'next/server';
import { connectDB, memoryStore } from '@/lib/db';
import { Newsletter } from '@/lib/models';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await connectDB();

    if (db) {
      await Newsletter.findOneAndUpdate(
        { email: cleanEmail },
        { email: cleanEmail, subscribedAt: new Date() },
        { upsert: true }
      );
    } else {
      memoryStore.subscribers.add(cleanEmail);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to Zero FIT VIP evidence-based tips!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
