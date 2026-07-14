'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Crown, Zap, Shield, ArrowRight } from 'lucide-react';

const PILLARS = [
  {
    icon: Crown,
    title: 'Commanding Presence',
    text: 'Every silhouette is engineered to project authority. We cut for leaders, not followers.',
  },
  {
    icon: Zap,
    title: 'Uncompromising Craft',
    text: 'Each piece passes through 47 quality checks before it earns the HOP label. Good enough is never enough.',
  },
  {
    icon: Shield,
    title: 'Enduring Investment',
    text: 'We build garments for decades, not seasons. Real power compounds over time.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const quoteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut', delay: 0.1 } },
};

export default function BrandPhilosophy() {
  const ref = useRef(null);
  const lineRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px 0px' });
  const lineInView = useInView(lineRef, { once: true, margin: '-60px 0px' });

  return (
    <section
      ref={ref}
      className="relative bg-[#050505] py-28 px-6 overflow-hidden"
      aria-label="Brand Philosophy"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-400 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Label */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-gold-400">
            Our Philosophy
          </span>
        </motion.div>

        {/* Animated gold line */}
        <div ref={lineRef} className="flex justify-center mb-10">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"
            initial={{ width: 0 }}
            animate={lineInView ? { width: '280px' } : { width: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>

        {/* Pull Quote */}
        <motion.blockquote
          variants={quoteVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-20"
        >
          <p
            className="font-serif italic text-cream-100 leading-tight mx-auto"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)', maxWidth: '780px' }}
          >
            &ldquo;Power is not given.
            <br />
            <span className="text-gold-400 not-italic font-bold">It is dressed.</span>&rdquo;
          </p>
        </motion.blockquote>

        {/* Pillars Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={itemVariants}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon container */}
                <div className="w-14 h-14 flex items-center justify-center border border-gold-400/30 mb-6 group-hover:border-gold-400 transition-colors duration-400 relative">
                  <Icon size={24} className="text-gold-400" strokeWidth={1.5} />
                  {/* Corner accents */}
                  <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-400 -translate-x-0.5 -translate-y-0.5" />
                  <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-400 translate-x-0.5 -translate-y-0.5" />
                  <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-400 -translate-x-0.5 translate-y-0.5" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-400 translate-x-0.5 translate-y-0.5" />
                </div>

                <h3 className="font-serif text-cream-100 text-lg font-semibold mb-3 tracking-wide">
                  {pillar.title}
                </h3>
                <p className="font-sans text-obsidian-300 text-sm leading-relaxed">
                  {pillar.text}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-gold-400 border-b border-gold-400/40 pb-1 hover:border-gold-400 transition-all duration-300 group"
          >
            Read Our Manifesto
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
