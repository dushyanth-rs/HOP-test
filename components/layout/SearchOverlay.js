'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '../../lib/utils';
import { useTrack } from '../../hooks/useTrack';

export default function SearchOverlay({ open, onClose }) {
  const router = useRouter();
  const { track } = useTrack();
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState({ products: [], articles: [] });
  const [loading, setLoading] = useState(false);

  async function handleSearch(q) {
    setQuery(q);
    if (q.length < 2) { setResults({ products: [], articles: [] }); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      if (q.length >= 3) track('search', { query: q });
    } catch {}
    setLoading(false);
  }

  function handleClose() {
    setQuery('');
    setResults({ products: [], articles: [] });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-obsidian-900/98 flex flex-col"
        >
          <div className="flex items-center justify-between px-6 lg:px-12 h-16 border-b border-obsidian-700">
            <div className="flex items-center gap-3 flex-1 max-w-2xl mx-auto">
              <Search size={18} className="text-gold-400 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search products, articles..."
                className="flex-1 bg-transparent text-cream-100 text-lg placeholder-obsidian-500 focus:outline-none"
              />
            </div>
            <button onClick={handleClose} className="text-cream-400 hover:text-cream-100 ml-4">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 max-w-3xl mx-auto w-full">
            {loading && (
              <p className="text-obsidian-400 text-sm">Searching...</p>
            )}

            {!loading && results.products.length > 0 && (
              <div className="mb-8">
                <p className="text-gold-400 text-xs tracking-widest uppercase mb-4">Products</p>
                <div className="space-y-3">
                  {results.products.map(p => (
                    <Link
                      key={p._id}
                      href={`/shop/${p.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 p-3 bg-obsidian-800 hover:bg-obsidian-700 transition-colors"
                    >
                      {p.images?.[0]?.url && (
                        <div className="w-12 h-12 bg-obsidian-700 shrink-0 overflow-hidden">
                          <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-cream-100 text-sm font-medium truncate">{p.name}</p>
                        <p className="text-gold-400 text-xs">{formatCurrency(p.salePrice ?? p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && results.articles.length > 0 && (
              <div>
                <p className="text-gold-400 text-xs tracking-widest uppercase mb-4">Articles</p>
                <div className="space-y-2">
                  {results.articles.map(a => (
                    <Link
                      key={a._id}
                      href={`/journal/${a.slug}`}
                      onClick={handleClose}
                      className="block p-3 bg-obsidian-800 hover:bg-obsidian-700 transition-colors"
                    >
                      <p className="text-cream-100 text-sm font-medium">{a.title}</p>
                      <p className="text-obsidian-400 text-xs mt-1">{a.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && query.length >= 2 && results.products.length === 0 && results.articles.length === 0 && (
              <p className="text-obsidian-400 text-sm">No results for "{query}"</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
