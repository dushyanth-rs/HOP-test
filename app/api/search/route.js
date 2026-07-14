import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';
import JournalArticle from '../../../models/JournalArticle';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    if (!q || q.length < 2) return NextResponse.json({ products: [], articles: [] });

    await connectDB();
    const [products, articles] = await Promise.all([
      Product.find({ $text: { $search: q }, status: 'published' }).limit(8).lean(),
      JournalArticle.find({ $text: { $search: q }, status: 'published' }).limit(4).lean(),
    ]);

    return NextResponse.json({ products, articles });
  } catch (err) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
