'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '../shop/ProductCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function SkeletonCard() {
  return (
    <div className="card-product overflow-hidden animate-pulse">
      <div className="bg-obsidian-800 h-80 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-obsidian-700 rounded w-3/4" />
        <div className="h-4 bg-obsidian-700 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function BestSellers({ products = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <section
      ref={ref}
      className="bg-obsidian-800 py-24 px-6"
      aria-label="Best Sellers"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="font-sans text-xs tracking-[0.35em] uppercase text-gold-400 block mb-4">
            Most Wanted
          </span>
          <h2 className="section-title text-cream-100 mb-4">Best Sellers</h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {products.length > 0
            ? products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <SkeletonCard />
                </motion.div>
              ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link href="/shop" className="btn-outline-gold px-12 py-4 text-sm tracking-widest">
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
