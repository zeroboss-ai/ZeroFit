import { NextResponse } from 'next/server';
import { connectDB, memoryStore } from '@/lib/db';
import { User, Profile } from '@/lib/models';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await connectDB();

    let user: any = null;
    if (db) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = memoryStore.users.get(cleanEmail);
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const authPayload = {
      id: user._id ? user._id.toString() : user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    };

    const token = signToken(authPayload);

    let profile = null;
    if (db) {
      profile = await Profile.findOne({ userId: authPayload.id });
    } else {
      profile = memoryStore.profiles.get(authPayload.id);
    }

    const response = NextResponse.json({
      success: true,
      user: authPayload,
      profile,
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error during login' }, { status: 500 });
  }
}
