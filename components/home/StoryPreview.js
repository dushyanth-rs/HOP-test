'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STORY_IMAGE =
  'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg';

export default function StoryPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <section
      ref={ref}
      className="bg-obsidian-900 overflow-hidden"
      aria-label="Brand Story"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* ── Left: Image Panel ── */}
        <motion.div
          className="relative min-h-[460px] lg:min-h-0 overflow-hidden"
          initial={{ x: '-8%', opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={STORY_IMAGE}
            alt="House of Politics brand story"
            fill
            quality={90}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Subtle right-edge gradient that bleeds into the text panel */}
          <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-obsidian-900/40" />
          {/* Bottom gradient for mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian-900/60 lg:hidden" />
        </motion.div>

        {/* ── Right: Content Panel ── */}
        <motion.div
          className="flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-20 bg-obsidian-900"
          initial={{ x: '8%', opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* HOP Monogram */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          >
            <span
              className="font-serif font-black text-gold-400 leading-none select-none"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', letterSpacing: '-0.02em' }}
              aria-label="HOP Monogram"
            >
              HOP
            </span>
          </motion.div>

          {/* Label */}
          <motion.span
            className="font-sans text-xs tracking-[0.35em] uppercase text-gold-500 block mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Our Origin
          </motion.span>

          {/* Gold divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-gold-400 to-transparent mb-7"
            initial={{ width: 0 }}
            animate={inView ? { width: '80px' } : {}}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />

          {/* Heading */}
          <motion.h2
            className="font-serif text-cream-100 leading-tight mb-6"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          >
            Born From a Belief That{' '}
            <em className="text-gold-400 not-italic">Power Deserves</em> to Be Seen.
          </motion.h2>

          {/* Body copy */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
          >
            <p className="font-sans text-obsidian-200 text-sm leading-relaxed">
              House of Politics was founded on a single conviction: the men who shape the world 
              deserve clothes that match their ambition. We aren&rsquo;t just a menswear brand — 
              we are a statement.
            </p>
            <p className="font-sans text-obsidian-200 text-sm leading-relaxed">
              Every piece in our collection is meticulously designed to command attention, 
              project confidence, and outlast trends. We believe your wardrobe should be 
              as powerful as your vision.
            </p>
            <p className="font-sans text-obsidian-300 text-sm leading-relaxed">
              From the boardroom to the ballot box, from the stage to the streets — 
              House of Politics dresses the men who move the world.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.75, duration: 0.6 }}
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-gold-400 border-b border-gold-400/40 pb-1 hover:border-gold-400 transition-all duration-300 group"
            >
              Discover Our Story
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
