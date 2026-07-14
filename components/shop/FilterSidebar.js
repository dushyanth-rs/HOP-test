'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { value: 'shirts',      label: 'Shirts' },
  { value: 't-shirts',    label: 'T-Shirts' },
  { value: 'polos',       label: 'Polos' },
  { value: 'jackets',     label: 'Jackets' },
  { value: 'blazers',     label: 'Blazers' },
  { value: 'bottomwear',  label: 'Bottomwear' },
  { value: 'accessories', label: 'Accessories' },
];

const COLLECTIONS = [
  { value: 'executive',        label: 'Executive' },
  { value: 'heritage',         label: 'Heritage' },
  { value: 'limited-editions', label: 'Limited Editions' },
  { value: 'new-arrivals',     label: 'New Arrivals' },
  { value: 'best-sellers',     label: 'Best Sellers' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-obsidian-700 py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full group"
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream-300 group-hover:text-gold-400 transition-colors">
          {title}
        </span>
        <ChevronDown
          size={13}
          className={`text-obsidian-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({ filters, onFilterChange, onClose }) {
  const [localMin, setLocalMin] = useState(filters.minPrice || '');
  const [localMax, setLocalMax] = useState(filters.maxPrice || '');

  function toggleCategory(val) {
    onFilterChange({ category: filters.category === val ? '' : val });
  }

  function toggleCollection(val) {
    onFilterChange({ collection: filters.collection === val ? '' : val });
  }

  function toggleSize(val) {
    onFilterChange({ size: filters.size === val ? '' : val });
  }

  function applyPrice() {
    onFilterChange({ minPrice: localMin, maxPrice: localMax });
  }

  function clearAll() {
    setLocalMin('');
    setLocalMax('');
    onFilterChange({
      category:   '',
      collection: '',
      size:       '',
      minPrice:   '',
      maxPrice:   '',
    });
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-obsidian-700">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gold-400" />
          <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-cream-200">
            Filter
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearAll}
            className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold-400 hover:text-gold-300 transition-colors"
          >
            Clear All
          </button>
          {onClose && (
            <button onClick={onClose} className="text-obsidian-400 hover:text-cream-200 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Sections */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Category */}
        <FilterSection title="Category">
          <div className="space-y-2.5">
            {CATEGORIES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <span
                  onClick={() => toggleCategory(value)}
                  className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                    filters.category === value
                      ? 'border-gold-400 bg-gold-400'
                      : 'border-obsidian-500 group-hover:border-obsidian-300'
                  }`}
                >
                  {filters.category === value && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-obsidian-900">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span
                  onClick={() => toggleCategory(value)}
                  className={`font-sans text-xs tracking-wide transition-colors ${
                    filters.category === value ? 'text-gold-400' : 'text-obsidian-300 group-hover:text-cream-200'
                  }`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Collection */}
        <FilterSection title="Collection">
          <div className="space-y-2.5">
            {COLLECTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <span
                  onClick={() => toggleCollection(value)}
                  className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                    filters.collection === value
                      ? 'border-gold-400 bg-gold-400'
                      : 'border-obsidian-500 group-hover:border-obsidian-300'
                  }`}
                >
                  {filters.collection === value && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-obsidian-900">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span
                  onClick={() => toggleCollection(value)}
                  className={`font-sans text-xs tracking-wide transition-colors ${
                    filters.collection === value ? 'text-gold-400' : 'text-obsidian-300 group-hover:text-cream-200'
                  }`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Size */}
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`w-11 h-11 border font-sans text-xs tracking-wider transition-all duration-200 ${
                  filters.size === s
                    ? 'border-gold-400 bg-gold-400 text-obsidian-900 font-medium'
                    : 'border-obsidian-600 text-obsidian-300 hover:border-obsidian-400 hover:text-cream-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" defaultOpen={false}>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="font-sans text-[9px] tracking-[0.2em] uppercase text-obsidian-400 block mb-1.5">
                  Min (₹)
                </label>
                <input
                  type="number"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  placeholder="0"
                  className="input-field text-sm py-2 px-3"
                />
              </div>
              <div className="flex-1">
                <label className="font-sans text-[9px] tracking-[0.2em] uppercase text-obsidian-400 block mb-1.5">
                  Max (₹)
                </label>
                <input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  placeholder="99999"
                  className="input-field text-sm py-2 px-3"
                />
              </div>
            </div>
            <button
              onClick={applyPrice}
              className="w-full btn-outline-gold py-2.5 text-[10px]"
            >
              Apply
            </button>
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" defaultOpen={false}>
          <label className="flex items-center gap-3 cursor-pointer group">
            <span
              onClick={() => onFilterChange({ inStock: filters.inStock ? '' : 'true' })}
              className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                filters.inStock === 'true'
                  ? 'border-gold-400 bg-gold-400'
                  : 'border-obsidian-500 group-hover:border-obsidian-300'
              }`}
            >
              {filters.inStock === 'true' && (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-obsidian-900">
                  <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <span
              onClick={() => onFilterChange({ inStock: filters.inStock ? '' : 'true' })}
              className="font-sans text-xs tracking-wide text-obsidian-300 group-hover:text-cream-200 transition-colors"
            >
              In Stock Only
            </span>
          </label>
        </FilterSection>
      </div>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  isMobileOpen = false,
  onMobileClose,
  isMobileSheet = false,
}) {
  // Desktop: just render inline
  if (!isMobileSheet) {
    return (
      <div className="sticky top-24">
        <SidebarContent filters={filters} onFilterChange={onFilterChange} />
      </div>
    );
  }

  // Mobile bottom sheet (AnimatePresence)
  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-obsidian-900/80 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-obsidian-900 border-t border-obsidian-700 rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col lg:hidden"
          >
            {/* Pull bar */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-obsidian-600" />
            </div>
            <div className="flex-1 overflow-hidden px-5 pb-8">
              <SidebarContent
                filters={filters}
                onFilterChange={onFilterChange}
                onClose={onMobileClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
