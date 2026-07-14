import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import Product from '../../../../models/Product';
import Coupon from '../../../../models/Coupon';
import Cart from '../../../../models/Cart';

export async function POST(request) {
  // TODO: Activate when Razorpay keys are configured
  // This route performs HMAC-SHA256 signature validation before confirming the order

  /*
  const crypto = require('crypto');

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json();

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findByIdAndUpdate(orderId, {
    status: 'confirmed',
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  }, { new: true });

  // Deduct stock
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.productId, 'sizes.label': item.size },
      { $inc: { 'sizes.$.stock': -item.quantity } }
    );
  }

  // Increment coupon usage
  if (order.couponCode) {
    await Coupon.findOneAndUpdate({ code: order.couponCode }, { $inc: { timesUsed: 1 } });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

  return NextResponse.json({ success: true, orderId: order._id });
  */

  return NextResponse.json(
    { error: 'Payment gateway not yet configured. Add Razorpay credentials to activate.' },
    { status: 503 }
  );
}
