import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import JournalArticle from '../../../../models/JournalArticle';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const article = await JournalArticle.findOne({ slug: params.slug, status: 'published' }).lean();
    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json({ article });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
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
    const article = await JournalArticle.findOneAndUpdate({ slug: params.slug }, data, { new: true });
    return NextResponse.json({ article });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}
