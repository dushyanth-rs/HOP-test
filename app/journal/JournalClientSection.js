'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'All',
  'Leadership',
  'Style',
  'Politics',
  'Culture',
  'Entrepreneurship',
  'History',
  'Personal Branding',
  'Fashion',
];

const PLACEHOLDER = 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function JournalClientSection({ articles, activeCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCategory(cat) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/journal?${params.toString()}`);
  }

  return (
    <section className="py-20 bg-obsidian-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-14 border-b border-obsidian-700 pb-6">
          {CATEGORIES.map((cat) => {
            const isActive =
              !activeCategory || activeCategory === 'All'
                ? cat === 'All'
                : cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`font-sans text-[10px] tracking-[0.25em] uppercase px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-400 text-obsidian-900'
                    : 'border border-obsidian-600 text-obsidian-300 hover:border-gold-400 hover:text-gold-400'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-obsidian-400 mb-6">No articles found.</p>
            <button onClick={() => handleCategory('All')} className="btn-outline-gold">
              View All Articles
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {articles.map((article) => (
              <motion.article key={article._id} variants={cardVariants} className="group">
                <Link href={`/journal/${article.slug}`} className="block">
                  {/* Cover Image */}
                  <div className="relative overflow-hidden aspect-[3/2] mb-5 bg-obsidian-800">
                    <Image
                      src={article.coverImage || PLACEHOLDER}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-obsidian-900/20 group-hover:bg-obsidian-900/10 transition-colors duration-300" />
                  </div>

                  {/* Category */}
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-400 block mb-2">
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-xl text-cream-100 leading-snug mb-3 group-hover:text-gold-400 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="font-sans text-sm text-obsidian-300 leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-obsidian-400 font-sans text-xs tracking-wide">
                    <span>{article.authorName}</span>
                    <span className="text-obsidian-600">·</span>
                    <span>{formatDate(article.publishedDate)}</span>
                    <span className="text-obsidian-600">·</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
