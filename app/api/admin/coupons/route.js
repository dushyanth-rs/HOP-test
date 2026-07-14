import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Coupon from '../../../../models/Coupon';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await connectDB();
    const data = await request.json();
    const coupon = await Coupon.create(data);
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id, active } = await request.json();
    await connectDB();
    const coupon = await Coupon.findByIdAndUpdate(id, { active }, { new: true });
    return NextResponse.json({ coupon });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}
