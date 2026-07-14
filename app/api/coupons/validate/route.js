import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Coupon from '../../../../models/Coupon';

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

    await connectDB();
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });

    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });

    if (coupon.expiryDate < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        error: `Minimum order value of ₹${coupon.minOrderValue} required`,
      }, { status: 400 });
    }

    let discountAmount;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      discountAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
