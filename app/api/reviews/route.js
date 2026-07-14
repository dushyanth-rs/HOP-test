import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectDB } from '../../../lib/mongodb';
import Review from '../../../models/Review';
import Order from '../../../models/Order';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    await connectDB();
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, rating, headline, body } = await request.json();
    if (!productId || !rating || !body) {
      return NextResponse.json({ error: 'productId, rating and body required' }, { status: 400 });
    }

    await connectDB();

    const verifiedOrder = await Order.findOne({
      user: session.user.id,
      'items.productId': productId,
      status: { $in: ['confirmed', 'shipped', 'delivered'] },
    });

    const review = await Review.create({
      user: session.user.id,
      product: productId,
      rating,
      headline,
      body,
      verifiedPurchase: !!verifiedOrder,
    });

    await review.populate('user', 'name');
    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
