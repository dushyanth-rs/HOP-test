import { notFound } from 'next/navigation';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';
import Review from '../../../models/Review';
import ProductGallery from '../../../components/product/ProductGallery';
import ProductInfo from '../../../components/product/ProductInfo';
import ProductStory from '../../../components/product/ProductStory';
import ReviewSection from '../../../components/product/ReviewSection';
import RelatedProducts from '../../../components/product/RelatedProducts';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug: params.slug, status: 'published' }).lean();
    if (!product) return { title: 'Product Not Found | House of Politics' };

    const price    = product.salePrice ?? product.price;
    const imageUrl = product.images?.[0]?.url ?? '';

    return {
      title:       `${product.name} | House of Politics`,
      description: product.shortStory || `Shop ${product.name} — luxury menswear crafted for power. House of Politics.`,
      openGraph: {
        title:       product.name,
        description: product.shortStory,
        images:      imageUrl ? [{ url: imageUrl, width: 800, height: 1000, alt: product.name }] : [],
      },
      other: {
        'script:ld+json': JSON.stringify({
          '@context': 'https://schema.org/',
          '@type':    'Product',
          name:        product.name,
          description: product.shortStory,
          image:       product.images?.map((i) => i.url) ?? [],
          sku:         product.slug,
          brand:       { '@type': 'Brand', name: 'House of Politics' },
          offers: {
            '@type':        'Offer',
            priceCurrency:  'INR',
            price:           price,
            availability:    product.sizes?.some((s) => s.stock > 0)
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: `https://houseofpolitics.in/shop/${product.slug}`,
          },
        }),
      },
    };
  } catch {
    return { title: 'House of Politics' };
  }
}

async function getPageData(slug) {
  await connectDB();

  const product = await Product.findOne({ slug, status: 'published' }).lean();
  if (!product) return null;

  // Increment views (fire-and-forget, no await)
  Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } }).catch(() => {});

  const [reviews, related] = await Promise.all([
    Review.find({ product: product._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean(),
    Product.find({
      category: product.category,
      _id:      { $ne: product._id },
      status:   'published',
    })
      .limit(4)
      .lean(),
  ]);

  return {
    product: JSON.parse(JSON.stringify(product)),
    reviews: JSON.parse(JSON.stringify(reviews)),
    related: JSON.parse(JSON.stringify(related)),
  };
}

export default async function ProductPage({ params }) {
  let data;
  try {
    data = await getPageData(params.slug);
  } catch (err) {
    console.error('[ProductPage] data fetch error:', err);
    notFound();
  }

  if (!data) notFound();

  const { product, reviews, related } = data;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-obsidian-900">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-[11px] font-sans tracking-wider text-obsidian-400 flex-wrap">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold-400 transition-colors">Shop</Link>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-gold-400 transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-cream-300 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Product Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          <ProductGallery images={product.images || []} productName={product.name} />
          <ProductInfo
            product={product}
            productId={product._id}
            avgRating={avgRating}
            reviewCount={reviews.length}
          />
        </div>
      </section>

      {/* ── Product Story ── */}
      {product.story && (
        <ProductStory story={product.story} name={product.name} />
      )}

      {/* ── Reviews ── */}
      <ReviewSection reviews={reviews} productId={product._id} />

      {/* ── Related Products ── */}
      <RelatedProducts products={related} />
    </div>
  );
}
