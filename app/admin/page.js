'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { IndianRupee, ShoppingBag, Users, TriangleAlert as AlertTriangle, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';

const ORDER_STATUSES = [
  'Pending Payment',
  'Processing',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded',
];

const STATUS_COLORS = {
  'Pending Payment': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Processing: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Confirmed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  Delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
  Cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
  Refunded: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
};

function CountUp({ to, prefix = '', duration = 1.5 }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v).toLocaleString('en-IN'));
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const controls = animate(motionVal, to, { duration, ease: 'easeOut' });
    const unsubscribe = rounded.onChange((v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [to]);

  return (
    <span>
      {prefix}
      {display}
    </span>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingOrder(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      setData((prev) => ({
        ...prev,
        recentOrders: prev.recentOrders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        ),
      }));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order');
    } finally {
      setUpdatingOrder(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Revenue',
      value: data?.totalRevenue ?? 0,
      prefix: '₹',
      Icon: IndianRupee,
      color: 'text-gold-400',
      bg: 'bg-gold-400/10 border-gold-400/20',
    },
    {
      label: 'Total Orders',
      value: data?.totalOrders ?? 0,
      prefix: '',
      Icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20',
    },
    {
      label: 'New Customers (Month)',
      value: data?.newCustomersMonth ?? 0,
      prefix: '',
      Icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    {
      label: 'Low Stock Alerts',
      value: data?.lowStockCount ?? 0,
      prefix: '',
      Icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">Overview</p>
        <h1 className="font-serif text-3xl text-cream-100">Dashboard</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, prefix, Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-obsidian-800 border ${bg} p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs tracking-widest uppercase text-obsidian-400">{label}</p>
              <div className={`w-8 h-8 flex items-center justify-center ${bg} rounded`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <div className={`font-serif text-3xl ${color} tabular-nums`}>
              <CountUp to={value} prefix={prefix} duration={1.4 + i * 0.1} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-obsidian-800 border border-obsidian-700">
        <div className="px-6 py-4 border-b border-obsidian-700 flex items-center justify-between">
          <h2 className="font-serif text-lg text-cream-100">Recent Orders</h2>
          <span className="text-xs tracking-widest uppercase text-obsidian-400">
            {data?.recentOrders?.length ?? 0} orders
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-obsidian-700">
                {['Order ID', 'Customer', 'Date', 'Status', 'Total', 'Update Status'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs tracking-widest uppercase text-obsidian-400 px-6 py-3 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-700">
              {(data?.recentOrders || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-obsidian-400 text-sm">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                (data?.recentOrders || []).map((order) => {
                  const shortId = (order._id || '').toString().slice(-8).toUpperCase();
                  const dateStr = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—';
                  const statusStyle = STATUS_COLORS[order.status] || 'text-obsidian-300 bg-obsidian-700 border-obsidian-600';

                  return (
                    <tr key={order._id} className="hover:bg-obsidian-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-cream-200 text-xs tracking-widest">
                          #{shortId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-cream-200 truncate max-w-[160px]">
                          {order.userName || order.userEmail?.split('@')[0] || 'Guest'}
                        </p>
                        <p className="text-xs text-obsidian-400 truncate max-w-[160px]">
                          {order.userEmail}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-obsidian-300 whitespace-nowrap">{dateStr}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs border tracking-wide ${statusStyle}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gold-400 tabular-nums whitespace-nowrap font-medium">
                        {formatCurrency(order.total ?? 0)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingOrder === order._id}
                            className="bg-obsidian-700 border border-obsidian-600 text-cream-200 text-xs px-3 py-2 pr-7 appearance-none cursor-pointer disabled:opacity-50 focus:outline-none focus:border-gold-400 transition-colors"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-obsidian-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          {updatingOrder === order._id && (
                            <span className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 border border-gold-400 border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock */}
      {(data?.lowStockProducts || []).length > 0 && (
        <div className="bg-obsidian-800 border border-red-400/20">
          <div className="px-6 py-4 border-b border-obsidian-700 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="font-serif text-lg text-cream-100">Low Stock Alerts</h2>
          </div>
          <div className="divide-y divide-obsidian-700">
            {data.lowStockProducts.map((product) => (
              <div key={product._id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-cream-200 text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-obsidian-400 mt-0.5">
                    {product.category} &nbsp;·&nbsp; {product.collection}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {(product.sizes || [])
                    .filter((s) => s.stock <= 3)
                    .map((s) => (
                      <span
                        key={s.label}
                        className="text-xs px-2 py-1 bg-red-400/10 text-red-400 border border-red-400/30"
                      >
                        {s.label}: {s.stock} left
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
