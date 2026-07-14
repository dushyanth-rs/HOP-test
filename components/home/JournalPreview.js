'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

const PLACEHOLDER_ARTICLES = [
  {
    _id: 'ph-1',
    title: 'The Anatomy of a Power Suit: Why Your Blazer Says More Than You Do',
    excerpt:
      'In every negotiation, interview, and first impression, your clothing enters the room before you do. We break down the science of a well-cut blazer.',
    category: 'Style',
    readTime: 6,
    slug: 'anatomy-of-a-power-suit',
    coverImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
    publishedDate: null,
  },
  {
    _id: 'ph-2',
    title: 'Dressing for the Room You Want, Not the Room You\'re In',
    excerpt:
      'Leadership starts long before you open your mouth. Here\'s how to dress with intention and signal authority from your very first step.',
    category: 'Leadership',
    readTime: 5,
    slug: 'dress-for-the-room-you-want',
    coverImage: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg',
    publishedDate: null,
  },
  {
    _id: 'ph-3',
    title: 'The Legacy of British Tailoring and What It Means for Modern Men',
    excerpt:
      'Savile Row didn\'t just create suits — it created a language. And that language is still being spoken by the most powerful men in the world.',
    category: 'Culture',
    readTime: 7,
    slug: 'legacy-of-british-tailoring',
    coverImage: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg',
    publishedDate: null,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return null;
  }
}

function trimExcerpt(text = '', maxLen = 100) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

export default function JournalPreview({ articles = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  const displayArticles =
    articles && articles.length >= 1 ? articles.slice(0, 3) : PLACEHOLDER_ARTICLES;

  return (
    <section
      ref={ref}
      className="bg-obsidian-900 py-24 px-6"
      aria-label="The House Journal"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="font-sans text-xs tracking-[0.35em] uppercase text-gold-400 block mb-4">
            Insights &amp; Perspectives
          </span>
          <h2 className="section-title text-cream-100 mb-4">The House Journal</h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {displayArticles.map((article) => (
            <JournalCard key={article._id} article={article} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <Link
            href="/journal"
            className="btn-outline-gold px-12 py-4 text-sm tracking-widest"
          >
            Read All Articles
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function JournalCard({ article }) {
  const {
    title,
    excerpt,
    category,
    readTime,
    slug,
    coverImage,
    publishedDate,
  } = article;

  const displayImage =
    coverImage || 'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg';
  const formattedDate = formatDate(publishedDate);
  const trimmedExcerpt = trimExcerpt(excerpt ?? '', 100);

  return (
    <motion.article variants={cardVariants} className="group flex flex-col">
      {/* Image */}
      <Link href={`/journal/${slug}`} className="block relative overflow-hidden h-56 mb-5">
        <Image
          src={displayImage}
          alt={title}
          fill
          quality={80}
          className="object-cover object-center transition-transform duration-600 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-obsidian-900/20 group-hover:bg-obsidian-900/10 transition-colors duration-400" />

        {/* Category badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase bg-gold-400 text-obsidian-900 px-2.5 py-1 font-semibold">
              {category}
            </span>
          </div>
        )}
      </Link>

      {/* Meta: date + read time */}
      <div className="flex items-center gap-3 mb-3">
        {formattedDate && (
          <span className="font-sans text-[10px] text-obsidian-400 tracking-wide">
            {formattedDate}
          </span>
        )}
        {formattedDate && readTime && (
          <span className="text-obsidian-600 text-[10px]">·</span>
        )}
        {readTime && (
          <span className="font-sans text-[10px] text-obsidian-400 tracking-wide flex items-center gap-1">
            <Clock size={10} />
            {readTime} min read
          </span>
        )}
      </div>

      {/* Title */}
      <Link href={`/journal/${slug}`} className="block mb-3 flex-1">
        <h3 className="font-serif text-cream-100 text-lg font-semibold leading-snug hover:text-gold-400 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
      </Link>

      {/* Excerpt */}
      {trimmedExcerpt && (
        <p className="font-sans text-obsidian-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {trimmedExcerpt}
        </p>
      )}

      {/* Read more link */}
      <Link
        href={`/journal/${slug}`}
        className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 hover:text-gold-300 transition-colors duration-200 group/link mt-auto"
      >
        Read Article
        <ArrowRight
          size={11}
          className="transition-transform duration-300 group-hover/link:translate-x-1"
        />
      </Link>
    </motion.article>
  );
}
