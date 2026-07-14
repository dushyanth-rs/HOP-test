import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import User from '../../../../models/User';
import Product from '../../../../models/Product';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalRevenueResult,
      totalOrders,
      newCustomers,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments(),
      User.countDocuments({ createdAt: { $gte: monthStart }, role: 'CUSTOMER' }),
      Product.find({ 'sizes.stock': { $lt: 5 }, status: 'published' }).select('name sizes').lean(),
      Order.find().sort({ createdAt: -1 }).limit(10)
        .populate('user', 'name email').lean(),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenueResult[0]?.total || 0,
      totalOrders,
      newCustomers,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
