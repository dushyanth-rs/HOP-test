'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HERO_IMAGE =
  'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.6 },
  },
};

export default function Hero() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="House of Politics editorial fashion"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Multi-stop gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/85 via-obsidian-900/60 to-obsidian-900/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-900/50 via-transparent to-obsidian-900/40" />
      </div>

      {/* Floating gold accent lines */}
      <motion.div
        className="absolute top-1/3 left-0 h-px bg-gold-400/30 w-24 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1.4, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute top-1/3 right-0 h-px bg-gold-400/30 w-24 origin-right"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1.4, ease: 'easeOut' }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Pre-label */}
          <motion.span
            variants={itemVariants}
            className="font-sans text-xs tracking-[0.35em] uppercase text-gold-400 mb-2"
          >
            Est. 2024 · Luxury Menswear
          </motion.span>

          {/* Gold divider line above headline */}
          <motion.div
            variants={lineVariants}
            className="h-px w-16 bg-gold-400 mb-1"
          />

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif font-black uppercase tracking-ultra text-cream-100 leading-none"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
          >
            House of
            <br />
            <span className="text-gold-400">Politics</span>
          </motion.h1>

          {/* Italic serif subline */}
          <motion.p
            variants={itemVariants}
            className="font-serif italic text-cream-200 tracking-wide"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}
          >
            Dress Like Power.
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-obsidian-200 text-sm sm:text-base max-w-md leading-relaxed tracking-wide"
          >
            Luxury menswear engineered for men who lead — where every garment
            is a statement before you speak.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link href="/shop" className="btn-gold px-10 py-4 text-sm tracking-widest">
              Shop The Collection
            </Link>
            <Link href="/about" className="btn-outline-cream px-10 py-4 text-sm tracking-widest">
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-obsidian-300">
          Scroll
        </span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-gold-400 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  );
}
