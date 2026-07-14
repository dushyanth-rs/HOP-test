import Hero from '../components/home/Hero';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BestSellers from '../components/home/BestSellers';
import BrandPhilosophy from '../components/home/BrandPhilosophy';
import StoryPreview from '../components/home/StoryPreview';
import JournalPreview from '../components/home/JournalPreview';
import InstagramGrid from '../components/home/InstagramGrid';
import NewsletterSection from '../components/home/NewsletterSection';
import { connectDB } from '../lib/mongodb';
import Product from '../models/Product';
import JournalArticle from '../models/JournalArticle';

export const metadata = {
  title: 'House of Politics — Dress Like Power',
  description:
    'House of Politics is a luxury menswear brand for men who lead. Discover editorial collections built for the boardroom and beyond.',
  openGraph: {
    title: 'House of Politics — Dress Like Power',
    description:
      'Luxury menswear for men who lead. Discover the HOP collection.',
    images: [
      {
        url: 'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg',
        width: 1200,
        height: 630,
        alt: 'House of Politics Hero',
      },
    ],
  },
};

async function fetchBestSellers() {
  try {
    await connectDB();
    const products = await Product.find({
      status: 'published',
      collection: 'best-sellers',
    })
      .sort({ views: -1 })
      .limit(4)
      .lean();

    return products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString() ?? null,
      updatedAt: p.updatedAt?.toISOString() ?? null,
    }));
  } catch {
    return [];
  }
}

async function fetchJournalArticles() {
  try {
    await connectDB();
    const articles = await JournalArticle.find({ status: 'published' })
      .sort({ publishedDate: -1 })
      .limit(3)
      .lean();

    return articles.map((a) => ({
      ...a,
      _id: a._id.toString(),
      publishedDate: a.publishedDate?.toISOString() ?? null,
      createdAt: a.createdAt?.toISOString() ?? null,
      updatedAt: a.updatedAt?.toISOString() ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [bestSellers, journalArticles] = await Promise.all([
    fetchBestSellers(),
    fetchJournalArticles(),
  ]);

  return (
    <main className="bg-obsidian-900 text-cream-200">
      <Hero />
      <FeaturedCollections collections={[]} />
      <BestSellers products={bestSellers} />
      <BrandPhilosophy />
      <StoryPreview />
      <JournalPreview articles={journalArticles} />
      <InstagramGrid />
      <NewsletterSection />
    </main>
  );
}
