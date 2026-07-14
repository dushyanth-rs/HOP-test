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
    const user = await User.findById(session.user.id).populate('wishlist').lean();
    return NextResponse.json({ wishlist: user?.wishlist || [] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await request.json();
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { $addToSet: { wishlist: productId } });
    return NextResponse.json({ message: 'Added to wishlist' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { $pull: { wishlist: productId } });
    return NextResponse.json({ message: 'Removed from wishlist' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
