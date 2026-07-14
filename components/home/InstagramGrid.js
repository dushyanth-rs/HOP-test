'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Instagram } from 'lucide-react';

const INSTAGRAM_IMAGES = [
  {
    id: 'ig-1',
    src: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    alt: 'House of Politics editorial — man in tailored blazer',
    caption: '#DressLikePower',
  },
  {
    id: 'ig-2',
    src: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
    alt: 'House of Politics editorial — executive look',
    caption: '#HouseOfPolitics',
  },
  {
    id: 'ig-3',
    src: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg',
    alt: 'House of Politics editorial — power dressing',
    caption: '#HOPStyle',
  },
  {
    id: 'ig-4',
    src: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg',
    alt: 'House of Politics editorial — luxury menswear',
    caption: '#LuxuryMenswear',
  },
  {
    id: 'ig-5',
    src: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    alt: 'House of Politics editorial — tailored perfection',
    caption: '#TailoredPerfection',
  },
  {
    id: 'ig-6',
    src: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    alt: 'House of Politics editorial — commanding presence',
    caption: '#CommandingPresence',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function InstagramGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <section
      ref={ref}
      className="bg-obsidian-800 py-24 px-6"
      aria-label="Instagram Feed"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <a
            href="https://instagram.com/houseofpolitics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-serif text-2xl sm:text-3xl text-gold-400 hover:text-gold-300 transition-colors duration-300 mb-3 group"
            aria-label="Follow @houseofpolitics on Instagram"
          >
            <Instagram
              size={24}
              className="text-gold-400 group-hover:text-gold-300 transition-colors duration-300"
              strokeWidth={1.5}
            />
            @houseofpolitics
          </a>
          <p className="font-sans text-obsidian-300 text-sm tracking-wide">
            Follow us for daily power dressing inspiration
          </p>
        </motion.div>

        {/* 3×2 Image Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {INSTAGRAM_IMAGES.map((img) => (
            <InstagramTile key={img.id} image={img} />
          ))}
        </motion.div>

        {/* Follow CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a
            href="https://instagram.com/houseofpolitics"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold inline-flex items-center gap-3 px-10 py-4 text-sm tracking-widest"
          >
            <Instagram size={15} />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function InstagramTile({ image }) {
  return (
    <motion.a
      href="https://instagram.com/houseofpolitics"
      target="_blank"
      rel="noopener noreferrer"
      variants={imageVariants}
      className="group relative aspect-square overflow-hidden block cursor-pointer"
      aria-label={image.alt}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={80}
        className="object-cover object-center transition-transform duration-600 ease-out group-hover:scale-110"
        sizes="(max-width: 640px) 50vw, 33vw"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-obsidian-900/0 group-hover:bg-obsidian-900/65 transition-colors duration-400 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <Instagram
            size={28}
            className="text-cream-100"
            strokeWidth={1.5}
          />
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream-200">
            {image.caption}
          </span>
        </div>
      </div>
    </motion.a>
  );
}
