import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectDB } from '../../../lib/mongodb';
import CustomerEvent from '../../../models/CustomerEvent';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { eventType, metadata, sessionId } = await request.json();

    if (!eventType) return NextResponse.json({ ok: true });

    connectDB().then(() => {
      CustomerEvent.create({
        user: session?.user?.id || null,
        sessionId: session?.user?.id ? null : sessionId,
        eventType,
        metadata: metadata || {},
      }).catch(() => {});
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
