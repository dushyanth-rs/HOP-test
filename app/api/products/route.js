import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category   = searchParams.get('category');
    const collection = searchParams.get('collection');
    const size       = searchParams.get('size');
    const minPrice   = searchParams.get('minPrice');
    const maxPrice   = searchParams.get('maxPrice');
    const sort       = searchParams.get('sort') || 'createdAt_desc';
    const search     = searchParams.get('search');
    const page       = parseInt(searchParams.get('page') || '1', 10);
    const limit      = parseInt(searchParams.get('limit') || '12', 10);
    const status     = searchParams.get('status') || 'published';

    const query = {};
    if (status !== 'all') query.status = status;
    if (category)   query.category = category;
    if (collection) query.collection = collection;
    if (size)       query['sizes.label'] = size;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortMap = {
      'createdAt_desc': { createdAt: -1 },
      'price_asc':      { price: 1 },
      'price_desc':     { price: -1 },
      'views_desc':     { views: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Products GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('../../../lib/auth');
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const data = await request.json();
    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('Product POST error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
