'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Heart, MapPin, ChevronRight, User, Loader as Loader2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

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

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/orders?limit=2')
      .then((r) => r.json())
      .then((data) => {
        setRecentOrders(data.orders || []);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  }, [status]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gold-400" />
      </div>
    );
  }

  const user = session?.user;

  // Profile completeness
  const profileFields = [user?.name, user?.email, user?.phone, user?.image];
  const filled = profileFields.filter(Boolean).length;
  const completeness = Math.round((filled / profileFields.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-obsidian-900 py-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-12">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-400 mb-2">
            My Account
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream-100 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Sir'}.
          </h1>
          <div className="gold-divider" />
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Package,
              label: 'Orders',
              value: recentOrders.length > 0 ? `${recentOrders.length}+` : '0',
              href: '/account/orders',
              description: 'View order history',
            },
            {
              icon: Heart,
              label: 'Wishlist',
              value: '—',
              href: '/account/wishlist',
              description: 'Saved pieces',
            },
            {
              icon: MapPin,
              label: 'Addresses',
              value: '—',
              href: '/account/settings',
              description: 'Saved addresses',
            },
          ].map(({ icon: Icon, label, value, href, description }) => (
            <Link key={label} href={href}>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-obsidian-800 border border-obsidian-700 p-6 hover:border-gold-400/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={20} className="text-gold-400" />
                  <ChevronRight
                    size={16}
                    className="text-obsidian-500 group-hover:text-gold-400 transition-colors"
                  />
                </div>
                <p className="font-serif text-3xl text-cream-100 mb-1">{value}</p>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold-400 mb-1">
                  {label}
                </p>
                <p className="font-sans text-xs text-obsidian-400">{description}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Recent Orders ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-cream-100">Recent Orders</h2>
              <Link
                href="/account/orders"
                className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 hover:text-gold-300 transition-colors"
              >
                View All →
              </Link>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-16 bg-obsidian-800 border border-obsidian-700">
                <Loader2 size={20} className="animate-spin text-gold-400" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="bg-obsidian-800 border border-obsidian-700 p-10 text-center">
                <Package size={32} className="text-obsidian-600 mx-auto mb-4" />
                <p className="font-serif text-lg text-obsidian-400 mb-2">No orders yet</p>
                <p className="font-sans text-xs text-obsidian-500 mb-6">
                  Your order history will appear here once you place an order.
                </p>
                <Link href="/shop" className="btn-outline-gold inline-block">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order._id} href={`/account/orders/${order._id}`}>
                    <div className="bg-obsidian-800 border border-obsidian-700 p-5 hover:border-gold-400/40 transition-all duration-200 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-sans text-xs text-obsidian-400 mb-0.5">Order ID</p>
                          <p className="font-serif text-sm text-cream-100">
                            #{order._id?.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase border font-sans ${
                            STATUS_COLORS[order.status] || 'text-obsidian-400 bg-obsidian-700 border-obsidian-600'
                          }`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-obsidian-700">
                        <div className="flex gap-4">
                          <span className="font-sans text-xs text-obsidian-400">
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="font-sans text-xs text-obsidian-400">
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <span className="font-sans text-sm text-gold-400 font-medium">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-obsidian-800 border border-obsidian-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <User size={16} className="text-gold-400" />
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-obsidian-300">
                  Profile
                </h3>
              </div>
              <p className="font-serif text-cream-100 text-lg mb-0.5">{user?.name}</p>
              <p className="font-sans text-xs text-obsidian-400 mb-5">{user?.email}</p>

              {/* Profile Completeness Bar */}
              <div className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <span className="font-sans text-[10px] tracking-wide uppercase text-obsidian-400">
                    Profile Completeness
                  </span>
                  <span className="font-sans text-[10px] text-gold-400">{completeness}%</span>
                </div>
                <div className="h-1 bg-obsidian-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                    className="h-full bg-gold-400"
                  />
                </div>
              </div>

              <Link
                href="/account/settings"
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold-400 hover:text-gold-300 transition-colors"
              >
                Edit Profile →
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-obsidian-800 border border-obsidian-700 p-6">
              <h3 className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 mb-4">
                Quick Links
              </h3>
              <nav className="space-y-3">
                {[
                  { href: '/account/orders', label: 'Order History' },
                  { href: '/account/wishlist', label: 'My Wishlist' },
                  { href: '/account/settings', label: 'Account Settings' },
                  { href: '/shop', label: 'Shop Collection' },
                  { href: '/journal', label: 'The Journal' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between font-sans text-sm text-obsidian-300 hover:text-gold-400 transition-colors group"
                  >
                    <span>{label}</span>
                    <ChevronRight
                      size={14}
                      className="text-obsidian-600 group-hover:text-gold-400 transition-colors"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
