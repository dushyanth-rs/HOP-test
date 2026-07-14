import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Order from '../../../../models/Order';
import CustomerEvent from '../../../../models/CustomerEvent';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (customerId) {
      const [user, orders, events] = await Promise.all([
        User.findById(customerId).select('-password').lean(),
        Order.find({ user: customerId }).sort({ createdAt: -1 }).lean(),
        CustomerEvent.find({ user: customerId }).sort({ timestamp: -1 }).limit(100).lean(),
      ]);
      return NextResponse.json({ user, orders, events });
    }

    const customers = await User.aggregate([
      { $match: { role: 'CUSTOMER' } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders',
        },
      },
      {
        $addFields: {
          orderCount:    { $size: '$orders' },
          lifetimeSpend: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$orders',
                    as: 'o',
                    cond: { $in: ['$$o.status', ['confirmed', 'shipped', 'delivered']] },
                  },
                },
                as: 'o',
                in: '$$o.total',
              },
            },
          },
          lastOrderDate: { $max: '$orders.createdAt' },
        },
      },
      { $project: { password: 0, orders: 0 } },
      { $sort: { lifetimeSpend: -1 } },
    ]);

    return NextResponse.json({ customers });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
