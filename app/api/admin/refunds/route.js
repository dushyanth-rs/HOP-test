import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function POST(request) {
  // TODO: Activate when Razorpay keys are configured
  /*
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { paymentId, amount, orderId } = await request.json();
  const razorpay = getRazorpay();
  if (!razorpay) return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 });

  await connectDB();
  const refund = await razorpay.payments.refund(paymentId, { amount: amount * 100 });

  await Order.findByIdAndUpdate(orderId, { status: 'refunded' });

  return NextResponse.json({ success: true, refundId: refund.id });
  */

  return NextResponse.json(
    { error: 'Refund gateway not yet configured. Add Razorpay credentials to activate.' },
    { status: 503 }
  );
}
