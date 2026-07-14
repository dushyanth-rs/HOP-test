import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import JournalArticle from '../../../../models/JournalArticle';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await connectDB();
    const articles = await JournalArticle.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ articles });
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
    const article = await JournalArticle.create(data);
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id, ...data } = await request.json();
    await connectDB();
    const article = await JournalArticle.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ article });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}
