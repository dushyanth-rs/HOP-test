import { notFound } from 'next/navigation';
import { connectDB } from '../../../lib/mongodb';
import JournalArticle from '../../../models/JournalArticle';
import Image from 'next/image';
import Link from 'next/link';

const PLACEHOLDER = 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({ params }) {
  await connectDB();
  const article = await JournalArticle.findOne({
    slug: params.slug,
    status: 'published',
  }).lean();
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.coverImage
        ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }]
        : [],
    },
  };
}

function renderBody(body) {
  if (!body) return null;
  const lines = body.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('> ')) {
      const quoteText = line.replace(/^> /, '');
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="my-10 pl-6 border-l-2 border-gold-400 italic font-serif text-xl md:text-2xl text-gold-400 leading-relaxed"
        >
          &ldquo;{quoteText}&rdquo;
        </blockquote>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="font-serif text-2xl md:text-3xl text-cream-100 mt-12 mb-4"
        >
          {line.replace(/^## /, '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-serif text-xl text-cream-100 mt-8 mb-3">
          {line.replace(/^### /, '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(<li key={`li-${i}`}>{lines[i].replace(/^- /, '')}</li>);
        )
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className="list-disc list-outside ml-6 my-4 space-y-2 text-cream-300 font-sans text-base leading-relaxed"
        >
          {listItems}
        </ul>
      );
      continue;
    } else if (line.trim() === '') {
      elements.push(<div key={`gap-${i}`} className="h-4" />);
    } else {
      elements.push(
        <p
          key={`p-${i}`}
          className="font-sans text-base md:text-lg text-cream-300 leading-relaxed"
        >
          {line}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default async function ArticlePage({ params }) {
  await connectDB();

  const article = await JournalArticle.findOne({
    slug: params.slug,
    status: 'published',
  }).lean();

  if (!article) notFound();

  const serialised = {
    ...article,
    _id: article._id.toString(),
    publishedDate: article.publishedDate ? article.publishedDate.toISOString() : null,
    createdAt: article.createdAt?.toISOString() ?? null,
    updatedAt: article.updatedAt?.toISOString() ?? null,
  };

  // Related articles: same category, exclude current
  const related = await JournalArticle.find({
    status: 'published',
    category: article.category,
    slug: { $ne: article.slug },
  })
    .sort({ publishedDate: -1 })
    .limit(3)
    .lean();

  const relatedSerialised = related.map((a) => ({
    ...a,
    _id: a._id.toString(),
    publishedDate: a.publishedDate ? a.publishedDate.toISOString() : null,
    createdAt: a.createdAt?.toISOString() ?? null,
    updatedAt: a.updatedAt?.toISOString() ?? null,
  }));

  return (
    <div className="min-h-screen bg-obsidian-900">
      {/* ── Hero Image ── */}
      <div className="relative w-full bg-obsidian-800" style={{ aspectRatio: '16/9', maxHeight: '80vh' }}>
        <Image
          src={serialised.coverImage || PLACEHOLDER}
          alt={serialised.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/30 to-transparent" />
      </div>

      {/* ── Article Body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10 pb-20">
        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase bg-gold-400/10 border border-gold-400 text-gold-400 px-3 py-1">
            {serialised.category}
          </span>
          <span className="font-sans text-xs text-obsidian-400">{serialised.authorName}</span>
          <span className="text-obsidian-600">·</span>
          <span className="font-sans text-xs text-obsidian-400">
            {formatDate(serialised.publishedDate)}
          </span>
          <span className="text-obsidian-600">·</span>
          <span className="font-sans text-xs text-obsidian-400">
            {serialised.readTime} min read
          </span>
        </div>

        {/* Article Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream-100 leading-tight mb-8">
          {serialised.title}
        </h1>

        {/* Gold Divider */}
        <div className="gold-divider mb-10" />

        {/* Excerpt / Lead */}
        {serialised.excerpt && (
          <p className="font-serif text-xl md:text-2xl text-cream-300/80 italic leading-relaxed mb-10 border-l-2 border-obsidian-700 pl-6">
            {serialised.excerpt}
          </p>
        )}

        {/* Body Content */}
        <div className="space-y-5">{renderBody(serialised.body)}</div>

        {/* Back Link */}
        <div className="mt-16 pt-10 border-t border-obsidian-800">
          <Link
            href="/journal"
            className="font-sans text-xs tracking-[0.25em] uppercase text-obsidian-400 hover:text-gold-400 transition-colors duration-200 flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to The Journal</span>
          </Link>
        </div>
      </div>

      {/* ── Related Articles ── */}
      {relatedSerialised.length > 0 && (
        <section className="border-t border-obsidian-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-400 mb-3">
              Continue Reading
            </p>
            <h2 className="font-serif text-3xl text-cream-100 mb-3">Related Articles</h2>
            <div className="gold-divider mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedSerialised.map((rel) => (
                <article key={rel._id} className="group">
                  <Link href={`/journal/${rel.slug}`} className="block">
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden aspect-[3/2] mb-4 bg-obsidian-800">
                      <Image
                        src={rel.coverImage || PLACEHOLDER}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-400 block mb-2">
                      {rel.category}
                    </span>
                    <h3 className="font-serif text-lg text-cream-100 group-hover:text-gold-400 transition-colors duration-200 line-clamp-2 mb-2">
                      {rel.title}
                    </h3>
                    <p className="font-sans text-xs text-obsidian-400">
                      {rel.readTime} min read &nbsp;·&nbsp; {formatDate(rel.publishedDate)}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
