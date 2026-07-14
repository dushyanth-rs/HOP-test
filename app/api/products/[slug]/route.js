import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findOneAndUpdate(
      { slug: params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('../../../../lib/auth');
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const data = await request.json();
    const product = await Product.findOneAndUpdate({ slug: params.slug }, data, { new: true });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('../../../../lib/auth');
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    await Product.findOneAndUpdate({ slug: params.slug }, { status: 'archived' });
    return NextResponse.json({ message: 'Product archived' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
