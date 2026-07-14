import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const order = await Order.findById(params.id).lean();

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const isOwner = order.user?.toString() === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
