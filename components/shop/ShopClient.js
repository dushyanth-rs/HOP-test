'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';

const SORT_OPTIONS = [
  { value: 'newest',       label: 'New Arrivals' },
  { value: 'price-asc',    label: 'Price: Low → High' },
  { value: 'price-desc',   label: 'Price: High → Low' },
  { value: 'most-viewed',  label: 'Most Viewed' },
];

const FILTER_LABELS = {
  category:   'Category',
  collection: 'Collection',
  size:       'Size',
  minPrice:   'Min Price',
  maxPrice:   'Max Price',
};

export default function ShopClient({ initialProducts, initialTotal, initialFilters }) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [products,       setProducts]       = useState(initialProducts);
  const [total,          setTotal]          = useState(initialTotal);
  const [loading,        setLoading]        = useState(false);
  const [filters,        setFilters]        = useState(initialFilters);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [sortOpen,       setSortOpen]       = useState(false);

  // Build URL search params string from filter object
  const buildParams = useCallback((f) => {
    const p = new URLSearchParams();
    if (f.category)   p.set('category',   f.category);
    if (f.collection) p.set('collection', f.collection);
    if (f.sort && f.sort !== 'newest') p.set('sort', f.sort);
    if (f.page > 1)   p.set('page',       String(f.page));
    if (f.minPrice)   p.set('minPrice',   f.minPrice);
    if (f.maxPrice)   p.set('maxPrice',   f.maxPrice);
    if (f.size)       p.set('size',       f.size);
    return p.toString();
  }, []);

  // Fetch products client-side when filters change
  const fetchProducts = useCallback(async (f) => {
    setLoading(true);
    try {
      const qs  = buildParams(f);
      const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // Apply a filter change: update state, update URL, refetch
  const applyFilters = useCallback((newFilters) => {
    const merged = { ...filters, ...newFilters, page: 1 };
    setFilters(merged);
    const qs = buildParams(merged);
    router.push(`/shop${qs ? `?${qs}` : ''}`, { scroll: false });
    fetchProducts(merged);
  }, [filters, buildParams, router, fetchProducts]);

  // Remove a single filter pill
  function removeFilter(key) {
    applyFilters({ [key]: '' });
  }

  // Clear all filters
  function clearAll() {
    const cleared = { category: '', collection: '', sort: 'newest', page: 1, minPrice: '', maxPrice: '', size: '' };
    setFilters(cleared);
    router.push('/shop', { scroll: false });
    fetchProducts(cleared);
  }

  // Page navigation
  function goToPage(p) {
    const updated = { ...filters, page: p };
    setFilters(updated);
    const qs = buildParams(updated);
    router.push(`/shop${qs ? `?${qs}` : ''}`, { scroll: false });
    fetchProducts(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Active filter pills
  const activePills = Object.entries(filters).filter(([key, val]) => {
    if (!val) return false;
    if (key === 'sort' && val === 'newest') return false;
    if (key === 'page') return false;
    return true;
  });

  const totalPages = Math.ceil(total / 12);
  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sort) || SORT_OPTIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase text-obsidian-400 mb-8">
        <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
        <span className="text-obsidian-600">/</span>
        <span className="text-cream-300">Shop</span>
      </nav>

      {/* ── Toolbar: Pills + Count + Sort ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Left: active pills + count */}
        <div className="flex flex-wrap items-center gap-2">
          {activePills.length > 0 && (
            <button
              onClick={clearAll}
              className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 border border-gold-400/40 px-3 py-1.5 hover:bg-gold-400/10 transition-colors"
            >
              Clear All
            </button>
          )}
          {activePills.map(([key, val]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 bg-obsidian-800 border border-obsidian-600 text-cream-300 font-sans text-[10px] tracking-wider uppercase px-3 py-1.5"
            >
              <span className="text-obsidian-400">{FILTER_LABELS[key] ?? key}:</span>
              {val}
              <button
                onClick={() => removeFilter(key)}
                className="ml-1 text-obsidian-400 hover:text-gold-400 transition-colors"
                aria-label={`Remove ${key} filter`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <span className="font-sans text-[11px] text-obsidian-400 tracking-wider ml-1">
            {loading ? 'Loading…' : `${total} Result${total !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Right: Filter toggle + Sort */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-obsidian-600 text-cream-300 font-sans text-[10px] tracking-[0.25em] uppercase px-4 py-2.5 hover:border-gold-400 hover:text-gold-400 transition-colors"
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 border border-obsidian-600 text-cream-300 font-sans text-[10px] tracking-[0.25em] uppercase px-4 py-2.5 hover:border-gold-400 hover:text-gold-400 transition-colors min-w-[180px] justify-between"
            >
              <span>{currentSort.label}</span>
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-obsidian-800 border border-obsidian-600 z-30 shadow-2xl">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      applyFilters({ sort: opt.value });
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-sans text-[11px] tracking-wider hover:bg-obsidian-700 hover:text-gold-400 transition-colors ${
                      filters.sort === opt.value ? 'text-gold-400 bg-obsidian-700/50' : 'text-cream-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout: Sidebar + Grid ── */}
      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onFilterChange={applyFilters} />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-obsidian-800 h-96 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-px bg-gold-400/40 mb-8" />
              <p className="font-serif text-2xl text-cream-300 mb-3">No pieces found</p>
              <p className="font-sans text-sm text-obsidian-400 mb-8 max-w-xs">
                Try adjusting your filters or browse the full collection.
              </p>
              <button onClick={clearAll} className="btn-outline-gold">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                  <button
                    onClick={() => goToPage(filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="font-sans text-[10px] tracking-[0.25em] uppercase border border-obsidian-600 text-cream-300 px-4 py-2.5 hover:border-gold-400 hover:text-gold-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`font-sans text-[11px] w-10 h-10 border transition-colors ${
                        p === filters.page
                          ? 'border-gold-400 bg-gold-400 text-obsidian-900'
                          : 'border-obsidian-600 text-cream-300 hover:border-gold-400 hover:text-gold-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(filters.page + 1)}
                    disabled={filters.page >= totalPages}
                    className="font-sans text-[10px] tracking-[0.25em] uppercase border border-obsidian-600 text-cream-300 px-4 py-2.5 hover:border-gold-400 hover:text-gold-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Bottom Sheet ── */}
      <FilterSidebar
        filters={filters}
        onFilterChange={(f) => { applyFilters(f); setSidebarOpen(false); }}
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        isMobileSheet
      />

      {/* Click-outside close sort */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setSortOpen(false)}
        />
      )}
    </div>
  );
}
