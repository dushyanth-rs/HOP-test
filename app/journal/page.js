import { connectDB } from '../../lib/mongodb';
import JournalArticle from '../../models/JournalArticle';
import JournalClientSection from './JournalClientSection';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'The Journal',
  description:
    'Insights on leadership, style, and the intersection of politics and power dressing — from the House of Politics editorial team.',
};

const PLACEHOLDER = 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function JournalPage({ searchParams }) {
  await connectDB();

  const category = searchParams?.category || 'All';
  const query = { status: 'published' };
  if (category !== 'All') query.category = category;

  const articles = await JournalArticle.find(query).sort({ publishedDate: -1 }).lean();

  const serialised = articles.map((a) => ({
    ...a,
    _id: a._id.toString(),
    publishedDate: a.publishedDate ? a.publishedDate.toISOString() : null,
    createdAt: a.createdAt?.toISOString() ?? null,
    updatedAt: a.updatedAt?.toISOString() ?? null,
  }));

  const featured = serialised.find((a) => a.featured) || serialised[0] || null;
  const gridArticles = featured
    ? serialised.filter((a) => a._id !== featured._id)
    : serialised;

  return (
    <div className="min-h-screen bg-obsidian-900">
      {/* ── Page Header ── */}
      <section className="pt-24 pb-16 text-center border-b border-obsidian-800">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-400 mb-4">
            House of Politics
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-cream-100 mb-6">The Journal</h1>
          <div className="gold-divider mx-auto" />
          <p className="font-sans text-sm text-obsidian-300 leading-relaxed max-w-xl mx-auto mt-6">
            Editorial dispatches on leadership, style, politics &amp; culture — for the man who
            dresses like power.
          </p>
        </div>
      </section>

      {/* ── Featured Article Hero ── */}
      {featured && (
        <section className="relative min-h-[70vh] flex items-end overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={featured.coverImage || PLACEHOLDER}
              alt={featured.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/70 to-obsidian-900/20" />
          </div>

          {/* Featured Badge */}
          <div className="absolute top-8 left-8 z-10">
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase bg-gold-400 text-obsidian-900 px-3 py-1.5">
              Featured
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <div className="max-w-2xl">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-400 block mb-4">
                {featured.category}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-100 leading-tight mb-4">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="font-sans text-base text-cream-200/80 leading-relaxed mb-6 line-clamp-3">
                  {featured.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-obsidian-300 font-sans text-xs mb-8">
                <span>{featured.authorName}</span>
                <span className="text-obsidian-600">·</span>
                <span>{formatDate(featured.publishedDate)}</span>
                <span className="text-obsidian-600">·</span>
                <span>{featured.readTime} min read</span>
              </div>
              <Link href={`/journal/${featured.slug}`} className="btn-gold inline-block">
                Read Article
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Articles Grid + Category Filters ── */}
      <JournalClientSection articles={gridArticles} activeCategory={category} />
    </div>
  );
}
