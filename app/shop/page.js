import { connectDB } from '../../lib/mongodb';
import Product from '../../models/Product';
import ShopClient from '../../components/shop/ShopClient';

export const metadata = {
  title: 'Shop — House of Politics',
  description:
    'Browse our full collection of luxury menswear. Filter by category, collection, size, and price to find your perfect piece.',
};

async function fetchProducts(searchParams) {
  try {
    await connectDB();

    const {
      category,
      collection,
      sort = 'newest',
      page = '1',
      minPrice,
      maxPrice,
      size,
    } = searchParams;

    const query = { status: 'published' };
    if (category)   query.category   = category;
    if (collection) query.collection = collection;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) {
      query['sizes'] = { $elemMatch: { label: size, stock: { $gt: 0 } } };
    }

    const sortMap = {
      newest:       { createdAt: -1 },
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'most-viewed': { views: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const limit = 12;
    const skip  = (Number(page) - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
    };
  } catch (err) {
    console.error('[Shop] fetchProducts error:', err);
    return { products: [], total: 0 };
  }
}

export default async function ShopPage({ searchParams }) {
  const { products, total } = await fetchProducts(searchParams);

  const initialFilters = {
    category:   searchParams.category   || '',
    collection: searchParams.collection || '',
    sort:       searchParams.sort       || 'newest',
    page:       Number(searchParams.page || '1'),
    minPrice:   searchParams.minPrice   || '',
    maxPrice:   searchParams.maxPrice   || '',
    size:       searchParams.size       || '',
  };

  return (
    <div className="min-h-screen bg-obsidian-900">
      {/* ── Shop Hero ── */}
      <section className="relative bg-obsidian-800 border-b border-obsidian-700 py-16 md:py-24 overflow-hidden">
        {/* Decorative lines */}
        <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-gold-400/20 to-transparent" />
        <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-gold-400/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold-400 mb-5">
            House of Politics
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream-100 mb-6 leading-tight">
            The Collection
          </h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="font-sans text-sm text-obsidian-300 max-w-md mx-auto leading-relaxed tracking-wide">
            Every piece is a statement. Curated for those who command rooms and rewrite rules.
          </p>
        </div>
      </section>

      {/* ── Shop Grid + Filters ── */}
      <ShopClient
        initialProducts={products}
        initialTotal={total}
        initialFilters={initialFilters}
      />
    </div>
  );
}
