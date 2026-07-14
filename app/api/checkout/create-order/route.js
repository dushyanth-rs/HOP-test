import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Cart from '../../../../models/Cart';
import Coupon from '../../../../models/Coupon';
import Order from '../../../../models/Order';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { shippingAddress, couponCode } = await request.json();
    await connectDB();

    const cart = await Cart.findOne({ user: session.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product || product.status !== 'published') {
        return NextResponse.json({ error: `Product "${product?.name || 'unknown'}" is no longer available` }, { status: 400 });
      }
      const sizeVariant = product.sizes.find(s => s.label === item.size);
      if (!sizeVariant || sizeVariant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name} (${item.size})` }, { status: 400 });
      }

      const unitPrice = product.salePrice ?? product.price;
      subtotal += unitPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        name:      product.name,
        image:     product.images?.[0]?.url || '',
        size:      item.size,
        quantity:  item.quantity,
        unitPrice,
      });
    }

    let discountAmount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      validatedCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (validatedCoupon && validatedCoupon.expiryDate > new Date()) {
        if (subtotal >= validatedCoupon.minOrderValue) {
          discountAmount = validatedCoupon.discountType === 'percentage'
            ? Math.round((subtotal * validatedCoupon.discountValue) / 100)
            : validatedCoupon.discountValue;
        }
      }
    }

    const shippingCharge = subtotal >= 2000 ? 0 : 149;
    const total = subtotal - discountAmount + shippingCharge;

    // TODO: Activate Razorpay — uncomment when keys are configured
    // const razorpay = getRazorpay();
    // if (!razorpay) return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 });
    // const rzpOrder = await razorpay.orders.create({ amount: total * 100, currency: 'INR', receipt: `hop_${Date.now()}` });

    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      discountAmount,
      couponCode: validatedCoupon ? couponCode.toUpperCase() : null,
      shippingCharge,
      total,
      status: 'pending_payment',
      // razorpayOrderId: rzpOrder.id,
    });

    return NextResponse.json({
      orderId: order._id,
      total,
      subtotal,
      discountAmount,
      shippingCharge,
      // razorpayOrderId: rzpOrder.id,
      // razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      paymentPending: true,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
