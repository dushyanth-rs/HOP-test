'use client';

import { motion } from 'framer-motion';

export default function ProductStory({ story, name }) {
  if (!story) return null;

  return (
    <section className="border-t border-obsidian-800 py-16 md:py-24 bg-obsidian-800/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-4">
            The Story
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream-100 mb-6">{name}</h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="prose prose-invert max-w-none"
        >
          {story.split('\n\n').map((para, i) => (
            <p
              key={i}
              className="font-sans text-sm md:text-base text-obsidian-300 leading-loose mb-5 last:mb-0"
            >
              {para}
            </p>
          ))}
        </motion.div>

        {/* Decorative quote mark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex justify-center mt-12"
          aria-hidden
        >
          <span className="font-serif text-8xl text-gold-400/10 leading-none select-none">"</span>
        </motion.div>
      </div>
    </section>
  );
}
