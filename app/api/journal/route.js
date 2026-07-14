import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import JournalArticle from '../../../models/JournalArticle';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit    = parseInt(searchParams.get('limit') || '12', 10);
    const page     = parseInt(searchParams.get('page') || '1', 10);
    const featured = searchParams.get('featured');

    const query = { status: 'published' };
    if (category) query.category = category;
    if (featured) query.featured = true;

    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      JournalArticle.find(query).sort({ publishedDate: -1 }).skip(skip).limit(limit).lean(),
      JournalArticle.countDocuments(query),
    ]);

    return NextResponse.json({ articles, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
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
    const article = await JournalArticle.create(data);
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
