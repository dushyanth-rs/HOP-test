'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HARDCODED_COLLECTIONS = [
  {
    id: 'executive',
    name: 'The Executive',
    description:
      'Precision-cut blazers and trousers for the man who commands the room without raising his voice.',
    href: '/shop?collection=executive',
    image:
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
    badge: 'Signature Collection',
  },
  {
    id: 'heritage',
    name: 'Heritage Line',
    description:
      'Classic British tailoring reimagined with contemporary silhouettes and premium fabrics.',
    href: '/shop?collection=heritage',
    image:
      'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg',
    badge: 'New Season',
  },
  {
    id: 'limited',
    name: 'Limited Editions',
    description:
      'Rare, numbered pieces for those who refuse to be worn by anyone else.',
    href: '/shop?collection=limited-editions',
    image:
      'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg',
    badge: 'Exclusive',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export default function FeaturedCollections({ collections = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  const displayCollections =
    collections && collections.length >= 3
      ? collections.slice(0, 3)
      : HARDCODED_COLLECTIONS;

  return (
    <section
      ref={ref}
      className="bg-obsidian-900 py-24 px-6"
      aria-label="Featured Collections"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.span
            variants={titleVariants}
            className="font-sans text-xs tracking-[0.35em] uppercase text-gold-400 block mb-4"
          >
            Curated For You
          </motion.span>
          <motion.h2
            variants={titleVariants}
            className="section-title text-cream-100 mb-4"
          >
            Featured Collections
          </motion.h2>
          <motion.div variants={titleVariants} className="gold-divider mx-auto" />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {displayCollections.map((col, idx) => (
            <CollectionCard key={col.id ?? idx} collection={col} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CollectionCard({ collection }) {
  return (
    <motion.div variants={cardVariants} className="group relative">
      <Link href={collection.href ?? '/shop'} className="block">
        {/* Card wrapper */}
        <div className="card-product relative overflow-hidden h-[540px] lg:h-[640px]">
          {/* Image */}
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            quality={85}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/95 via-obsidian-900/30 to-transparent transition-opacity duration-500 group-hover:from-obsidian-900/90" />

          {/* Badge */}
          {collection.badge && (
            <div className="absolute top-5 left-5">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase bg-gold-400 text-obsidian-900 px-3 py-1.5">
                {collection.badge}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <h3 className="font-serif text-2xl font-bold text-gold-400 mb-2 tracking-wide">
              {collection.name}
            </h3>
            <p className="font-sans text-obsidian-200 text-sm leading-relaxed mb-5 line-clamp-2">
              {collection.description}
            </p>
            <span className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.25em] uppercase text-cream-100 group/link">
              <span className="border-b border-gold-400/60 pb-px group-hover/link:border-gold-400 transition-colors duration-300">
                Explore
              </span>
              <ArrowRight
                size={13}
                className="text-gold-400 transition-transform duration-300 group-hover/link:translate-x-1"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
