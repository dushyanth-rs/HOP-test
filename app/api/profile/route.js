import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectDB } from '../../../lib/mongodb';
import User from '../../../models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id).select('-password').lean();
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, phone, addresses, preferences } = await request.json();
    await connectDB();

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { ...(name && { name }), ...(phone !== undefined && { phone }), ...(addresses && { addresses }), ...(preferences && { preferences }) },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
