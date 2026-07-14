import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import NewsletterSubscriber from '../../../models/NewsletterSubscriber';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    await connectDB();
    await NewsletterSubscriber.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { active: true, subscribedAt: new Date() },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
