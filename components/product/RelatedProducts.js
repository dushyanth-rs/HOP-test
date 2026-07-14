'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../shop/ProductCard';

export default function RelatedProducts({ products = [] }) {
  const scrollRef = useRef(null);

  if (!products.length) return null;

  return (
    <section className="border-t border-obsidian-800 py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-3">
            Continue Curating
          </p>
          <h2 className="section-title mb-4">You Might Also Like</h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-shrink-0 w-64 sm:w-72"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
