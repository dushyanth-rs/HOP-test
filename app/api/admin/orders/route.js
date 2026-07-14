import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

async function adminCheck(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return null;
  return session;
}

export async function GET(request) {
  try {
    const session = await adminCheck(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page   = parseInt(searchParams.get('page') || '1', 10);
    const limit  = parseInt(searchParams.get('limit') || '20', 10);
    const skip   = (page - 1) * limit;

    const query = status ? { status } : {};
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await adminCheck(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { orderId, status } = await request.json();
    await connectDB();

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate('user', 'name email');
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
