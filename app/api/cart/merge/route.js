import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Cart from '../../../../models/Cart';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) return NextResponse.json({ message: 'No guest cart to merge' });

    await connectDB();

    const [guestCart, userCart] = await Promise.all([
      Cart.findOne({ sessionId }),
      Cart.findOne({ user: session.user.id }),
    ]);

    if (!guestCart || guestCart.items.length === 0) {
      return NextResponse.json({ message: 'Nothing to merge' });
    }

    if (!userCart) {
      guestCart.user = session.user.id;
      guestCart.sessionId = null;
      await guestCart.save();
      return NextResponse.json({ message: 'Cart claimed' });
    }

    for (const guestItem of guestCart.items) {
      const existing = userCart.items.find(
        i => i.product.toString() === guestItem.product.toString() && i.size === guestItem.size
      );
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await Promise.all([userCart.save(), Cart.deleteOne({ sessionId })]);
    return NextResponse.json({ message: 'Carts merged' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to merge carts' }, { status: 500 });
  }
}
