'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ChevronLeft, Loader as Loader2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

const STATUS_COLORS = {
  pending_payment: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
  refunded: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
};

const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const PAGE_SIZE = 8;

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/orders');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    setError('');
    fetch(`/api/orders?page=${page}&limit=${PAGE_SIZE}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      });
  }, [status, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-obsidian-900 py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/account"
            className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-400 hover:text-gold-400 transition-colors flex items-center gap-1 mb-6"
          >
            <ChevronLeft size={12} />
            My Account
          </Link>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-400 mb-2">
            My Account
          </p>
          <h1 className="font-serif text-4xl text-cream-100 mb-2">Order History</h1>
          <div className="gold-divider" />
          {total > 0 && (
            <p className="font-sans text-xs text-obsidian-400 mt-4">
              {total} order{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-gold-400" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="font-sans text-sm text-red-400 mb-6">{error}</p>
            <button onClick={() => setPage(1)} className="btn-outline-gold">
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-obsidian-800 border border-obsidian-700">
            <Package size={40} className="text-obsidian-600 mx-auto mb-5" />
            <p className="font-serif text-2xl text-obsidian-400 mb-2">No orders yet</p>
            <p className="font-sans text-sm text-obsidian-500 mb-8">
              When you place an order, it will appear here.
            </p>
            <Link href="/shop" className="btn-gold inline-block">
              Explore the Collection
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-5 gap-4 px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-sans text-obsidian-500 border-b border-obsidian-800 mb-2">
              <span>Order</span>
              <span>Date</span>
              <span>Status</span>
              <span>Items</span>
              <span className="text-right">Total</span>
            </div>

            <div className="space-y-2">
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link href={`/account/orders/${order._id}`}>
                    <div className="bg-obsidian-800 border border-obsidian-700 hover:border-gold-400/40 transition-all duration-200 group">
                      {/* Mobile Layout */}
                      <div className="md:hidden p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-sans text-[10px] text-obsidian-400 mb-0.5">Order ID</p>
                            <p className="font-serif text-base text-cream-100">
                              #{order._id?.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-obsidian-500 group-hover:text-gold-400 transition-colors mt-1"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase border font-sans ${
                              STATUS_COLORS[order.status] || 'text-obsidian-400 bg-obsidian-700 border-obsidian-600'
                            }`}
                          >
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                          <span className="font-sans text-sm text-gold-400 font-medium">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                        <div className="flex gap-3 font-sans text-xs text-obsidian-400">
                          <span>{formatDate(order.createdAt)}</span>
                          <span>·</span>
                          <span>
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-5 gap-4 items-center px-5 py-4">
                        <p className="font-serif text-sm text-cream-100">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                        <p className="font-sans text-xs text-obsidian-300">
                          {formatDate(order.createdAt)}
                        </p>
                        <div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase border font-sans ${
                              STATUS_COLORS[order.status] || 'text-obsidian-400 bg-obsidian-700 border-obsidian-600'
                            }`}
                          >
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-obsidian-300">
                          {order.items?.length || 0} item
                          {order.items?.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-sans text-sm text-gold-400 font-medium">
                            {formatCurrency(order.total)}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-obsidian-500 group-hover:text-gold-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-obsidian-800">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-outline-gold disabled:opacity-30 flex items-center gap-2"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <span className="font-sans text-xs text-obsidian-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-outline-gold disabled:opacity-30 flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
