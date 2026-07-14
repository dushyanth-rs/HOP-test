import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectDB } from '../../../lib/mongodb';
import Cart from '../../../models/Cart';
import Product from '../../../models/Product';

async function getIdentifier(session, request) {
  if (session?.user?.id) return { user: session.user.id };
  const sessionId = request.headers.get('x-session-id');
  if (sessionId) return { sessionId };
  return null;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const id = await getIdentifier(session, request);
    if (!id) return NextResponse.json({ cart: null });

    await connectDB();
    const cart = await Cart.findOne(id).populate('items.product').lean();
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const id = await getIdentifier(session, request);
    if (!id) return NextResponse.json({ error: 'No session' }, { status: 400 });

    const { productId, size, quantity = 1 } = await request.json();
    if (!productId || !size) {
      return NextResponse.json({ error: 'productId and size required' }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const sizeVariant = product.sizes.find(s => s.label === size);
    if (!sizeVariant || sizeVariant.stock < 1) {
      return NextResponse.json({ error: 'Size unavailable' }, { status: 400 });
    }

    let cart = await Cart.findOne(id);
    if (!cart) {
      cart = new Cart(id);
    }

    const existing = cart.items.find(
      item => item.product.toString() === productId && item.size === size
    );

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, sizeVariant.stock);
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    const id = await getIdentifier(session, request);
    if (!id) return NextResponse.json({ error: 'No session' }, { status: 400 });

    const { productId, size, quantity } = await request.json();

    await connectDB();
    const cart = await Cart.findOne(id);
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    if (quantity < 1) {
      cart.items = cart.items.filter(
        item => !(item.product.toString() === productId && item.size === size)
      );
    } else {
      const item = cart.items.find(
        item => item.product.toString() === productId && item.size === size
      );
      if (item) item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    const id = await getIdentifier(session, request);
    if (!id) return NextResponse.json({ error: 'No session' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const size      = searchParams.get('size');

    await connectDB();
    const cart = await Cart.findOne(id);
    if (cart) {
      cart.items = cart.items.filter(
        item => !(item.product.toString() === productId && item.size === size)
      );
      await cart.save();
    }

    return NextResponse.json({ message: 'Item removed' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
