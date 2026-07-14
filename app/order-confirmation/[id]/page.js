'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Order not found');
        return r.json();
      })
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs tracking-widest uppercase text-obsidian-400">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-obsidian-400 mb-6">{error || 'Order details unavailable.'}</p>
          <Link href="/shop" className="btn-gold inline-block">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const subtotal = order.subtotal ?? order.total ?? 0;
  const discount = order.discount ?? 0;
  const shipping = order.shipping ?? 0;
  const total = order.total ?? 0;
  const shortId = (order._id || order.id || '').toString().slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-obsidian-900 pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8">

        {/* Animated Checkmark */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.6 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 18 }}
                className="w-24 h-24 rounded-full border-2 border-gold-400 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <CheckCircle className="w-12 h-12 text-gold-400" strokeWidth={1.5} />
                </motion.div>
              </motion.div>
              {/* Pulse rings */}
              <motion.div
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-gold-400"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-3">Confirmed</p>
            <h1 className="font-serif text-4xl md:text-5xl text-cream-100 mb-4">Order Placed</h1>
            <div className="gold-divider mx-auto mb-4" />
            <p className="text-obsidian-300 text-sm tracking-wide">
              Thank you, {order.shippingAddress?.name?.split(' ')[0] || 'Valued Customer'}.
            </p>
          </motion.div>
        </div>

        {/* Order ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-obsidian-800 border border-obsidian-700 p-5 mb-6 text-center"
        >
          <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-2">Order ID</p>
          <p className="font-mono text-gold-400 text-lg font-medium tracking-widest">#{shortId}</p>
          <p className="text-xs text-obsidian-400 mt-2">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : ''}
          </p>
        </motion.div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-obsidian-800 border border-gold-900 p-4 mb-8 flex gap-3"
        >
          <span className="text-gold-400 text-lg flex-shrink-0">ℹ</span>
          <p className="text-sm text-obsidian-300 leading-relaxed">
            We'll notify you at{' '}
            <span className="text-cream-200">{order.userEmail || 'your email'}</span>{' '}
            when your order is confirmed after payment verification.
          </p>
        </motion.div>

        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="bg-obsidian-800 border border-obsidian-700 p-5 mb-6"
        >
          <h2 className="text-xs tracking-widest uppercase text-obsidian-400 mb-4">Items Ordered</h2>
          <div className="divide-y divide-obsidian-700">
            {(order.items || []).map((item, i) => {
              const product = item.product || item;
              const price = item.price ?? product?.salePrice ?? product?.price ?? 0;
              const image = product?.images?.[0]?.url || 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200';
              return (
                <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative w-14 flex-shrink-0 bg-obsidian-700 overflow-hidden" style={{ height: '4.5rem' }}>
                    <Image src={image} alt={product?.name || 'Product'} fill className="object-cover object-top" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base text-cream-100 truncate">
                      {product?.name || item.name}
                    </p>
                    <p className="text-xs text-obsidian-400 mt-0.5">
                      Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-gold-400 tabular-nums flex-shrink-0">
                    {formatCurrency(price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Totals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="bg-obsidian-800 border border-obsidian-700 p-5 mb-8"
        >
          <h2 className="text-xs tracking-widest uppercase text-obsidian-400 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-obsidian-300">Subtotal</span>
              <span className="text-cream-200 tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400">Discount</span>
                <span className="text-emerald-400 tabular-nums">− {formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-obsidian-300">Shipping</span>
              {shipping === 0 ? (
                <span className="text-gold-400 text-xs tracking-widest uppercase font-medium">Free</span>
              ) : (
                <span className="text-cream-200 tabular-nums">{formatCurrency(shipping)}</span>
              )}
            </div>
          </div>
          <div className="border-t border-obsidian-700 mt-3 pt-3 flex justify-between items-baseline">
            <span className="font-serif text-lg text-cream-100">Total Paid</span>
            <span className="font-serif text-2xl text-gold-400 tabular-nums">{formatCurrency(total)}</span>
          </div>
        </motion.div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="bg-obsidian-800 border border-obsidian-700 p-5 mb-10"
          >
            <h2 className="text-xs tracking-widest uppercase text-obsidian-400 mb-3">Shipping To</h2>
            <p className="text-cream-100 font-medium">{order.shippingAddress.name}</p>
            <p className="text-sm text-obsidian-300 mt-1">{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
            <p className="text-sm text-obsidian-300">{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/shop" className="btn-outline-gold inline-flex items-center justify-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            Continue Shopping
          </Link>
          <Link href="/account/orders" className="btn-gold inline-flex items-center justify-center gap-2">
            <Package className="w-3.5 h-3.5" />
            My Orders
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
