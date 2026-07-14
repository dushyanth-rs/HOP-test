'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TIMELINE = [
  {
    year: '2023',
    title: 'Founded in India',
    description:
      'House of Politics is established in New Delhi by a collective of designers and strategists with a singular mission — to dress men of consequence.',
  },
  {
    year: '2024',
    title: 'First Collection Launched',
    description:
      'The inaugural "Authority" collection drops — 12 pieces, sold out in 72 hours. The industry takes note. The internet follows.',
  },
  {
    year: '2024',
    title: 'Craftsmanship Partnerships',
    description:
      'Exclusive sourcing agreements signed with master weavers in Varanasi and Surat. Fabrics you can only find at H.O.P.',
  },
  {
    year: '2025',
    title: 'Executive Collection',
    description:
      'The premium "Executive" line launches — suiting, outerwear, and accessories designed for C-suite dressing. Global aspirations, Indian roots.',
  },
  {
    year: '2025',
    title: 'Online Flagship',
    description:
      'The House of Politics digital flagship opens, bringing the full collection to every corner of India — and beyond.',
  },
];

export default function BrandTimeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-obsidian-700" />

      <div className="space-y-12">
        {TIMELINE.map((item, i) => (
          <TimelineEntry key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineEntry({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-start md:items-center">
      {/* Desktop: alternating layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-8 w-full items-center">
        {/* Left content */}
        <div className={`${isLeft ? 'text-right pr-8' : 'order-3 text-left pl-8'}`}>
          {isLeft && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="font-serif text-4xl text-gold-400/40 block mb-1">{item.year}</span>
              <h3 className="font-serif text-xl text-cream-100 mb-2">{item.title}</h3>
              <p className="text-sm text-obsidian-300 leading-relaxed">{item.description}</p>
            </motion.div>
          )}
        </div>

        {/* Center dot */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center order-2">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="w-4 h-4 rounded-full bg-obsidian-900 border-2 border-gold-400 z-10"
          />
        </div>

        {/* Right content */}
        <div className={`${!isLeft ? 'text-left pl-8' : 'order-3'}`}>
          {!isLeft && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="font-serif text-4xl text-gold-400/40 block mb-1">{item.year}</span>
              <h3 className="font-serif text-xl text-cream-100 mb-2">{item.title}</h3>
              <p className="text-sm text-obsidian-300 leading-relaxed">{item.description}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile: left-aligned layout */}
      <div className="md:hidden flex gap-6">
        <div className="flex flex-col items-center flex-shrink-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="w-4 h-4 rounded-full bg-obsidian-900 border-2 border-gold-400 mt-1 z-10 relative"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pb-4"
        >
          <span className="font-serif text-3xl text-gold-400/40 block mb-1">{item.year}</span>
          <h3 className="font-serif text-xl text-cream-100 mb-2">{item.title}</h3>
          <p className="text-sm text-obsidian-300 leading-relaxed">{item.description}</p>
        </motion.div>
      </div>
    </div>
  );
}
