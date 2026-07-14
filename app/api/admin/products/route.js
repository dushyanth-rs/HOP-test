import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page   = parseInt(searchParams.get('page') || '1', 10);
    const limit  = 20;

    const query = {};
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
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
    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id, ...data } = await request.json();
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await connectDB();
    await Product.findByIdAndUpdate(id, { status: 'archived' });
    return NextResponse.json({ message: 'Archived' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
