'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft, Loader as Loader2 } from 'lucide-react';
import ProductCard from '../../../components/shop/ProductCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/wishlist');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/wishlist')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load wishlist.');
        setLoading(false);
      });
  }, [status]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
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
          <h1 className="font-serif text-4xl text-cream-100 mb-2">My Wishlist</h1>
          <div className="gold-divider" />
          {!loading && products.length > 0 && (
            <p className="font-sans text-xs text-obsidian-400 mt-4">
              {products.length} saved {products.length === 1 ? 'piece' : 'pieces'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-gold-400" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="font-sans text-sm text-red-400 mb-4">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24"
          >
            {/* Empty State Illustration */}
            <div className="w-24 h-24 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center mx-auto mb-8">
              <Heart size={36} className="text-obsidian-600" />
            </div>
            <h2 className="font-serif text-3xl text-obsidian-300 mb-3">
              Your wishlist is empty
            </h2>
            <p className="font-sans text-sm text-obsidian-500 mb-10 max-w-sm mx-auto leading-relaxed">
              Save your favourite pieces and return to them whenever you&apos;re ready to dress
              like power.
            </p>
            <Link href="/shop" className="btn-gold inline-block">
              Explore the Collection
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Shopping CTA */}
            <div className="mt-16 pt-10 border-t border-obsidian-800 text-center">
              <p className="font-sans text-xs text-obsidian-400 mb-4">
                Discover more from the House
              </p>
              <Link href="/shop" className="btn-outline-gold inline-block">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
