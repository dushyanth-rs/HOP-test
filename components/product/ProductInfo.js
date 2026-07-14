'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Share2, Star, ChevronDown, X, Ruler } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../lib/utils';

const SIZE_GUIDE = [
  { size: 'S',   chest: '36–38"', waist: '30–32"', shoulder: '17"' },
  { size: 'M',   chest: '38–40"', waist: '32–34"', shoulder: '18"' },
  { size: 'L',   chest: '40–42"', waist: '34–36"', shoulder: '19"' },
  { size: 'XL',  chest: '42–44"', waist: '36–38"', shoulder: '20"' },
  { size: 'XXL', chest: '44–46"', waist: '38–40"', shoulder: '21"' },
];

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-obsidian-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-cream-300 group-hover:text-gold-400 transition-colors">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-obsidian-400 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
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
            <div className="pb-5 font-sans text-sm text-obsidian-300 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SizeGuideModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-obsidian-900/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-obsidian-800 border border-obsidian-600 w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl text-cream-100">Size Guide</h3>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold-400 mt-1">
              House of Politics Sizing
            </p>
          </div>
          <button onClick={onClose} className="text-obsidian-400 hover:text-cream-200 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs">
            <thead>
              <tr className="border-b border-obsidian-600">
                {['Size', 'Chest', 'Waist', 'Shoulder'].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 text-[10px] tracking-[0.2em] uppercase text-obsidian-400 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row, i) => (
                <tr key={row.size} className={`border-b border-obsidian-700/50 ${i % 2 === 0 ? '' : 'bg-obsidian-700/20'}`}>
                  <td className="py-3 pr-4 text-gold-400 font-medium tracking-wider">{row.size}</td>
                  <td className="py-3 pr-4 text-cream-300">{row.chest}</td>
                  <td className="py-3 pr-4 text-cream-300">{row.waist}</td>
                  <td className="py-3 text-cream-300">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-sans text-[10px] text-obsidian-400 mt-5 leading-relaxed">
          All measurements are approximate. For a relaxed fit, size up.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function ProductInfo({ product, productId, avgRating, reviewCount }) {
  const { addItem, loading: cartLoading } = useCart();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();

  const [selectedSize,    setSelectedSize]    = useState('');
  const [quantity,        setQuantity]        = useState(1);
  const [sizeGuideOpen,   setSizeGuideOpen]   = useState(false);
  const [addedFeedback,   setAddedFeedback]   = useState(false);

  const {
    name        = '',
    collection  = '',
    price       = 0,
    salePrice   = null,
    shortStory  = '',
    sizes       = [],
    fabricDetails    = '',
    careInstructions = '',
    status      = '',
  } = product;

  const isOnSale    = salePrice && salePrice < price;
  const wishlisted  = isWishlisted(productId);
  const discountPct = isOnSale ? Math.round(((price - salePrice) / price) * 100) : null;

  const selectedSizeData  = sizes.find((s) => s.label === selectedSize);
  const maxStock          = selectedSizeData?.stock ?? 0;

  async function handleAddToBag() {
    if (!selectedSize) {
      // Flash size selector
      const el = document.getElementById('size-selector');
      el?.classList.add('ring-1', 'ring-gold-400');
      setTimeout(() => el?.classList.remove('ring-1', 'ring-gold-400'), 1500);
      return;
    }
    await addItem(productId, selectedSize, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:sticky lg:top-24">
        {/* ── Collection Badge ── */}
        {collection && (
          <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold-400">
            {collection.replace(/-/g, ' ')}
          </span>
        )}

        {/* ── Name ── */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-cream-100 leading-tight mb-2">
            {name}
          </h1>
          {/* Rating row */}
          {avgRating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    className={star <= Math.round(Number(avgRating)) ? 'fill-gold-400 text-gold-400' : 'text-obsidian-500'}
                  />
                ))}
              </div>
              <a href="#reviews" className="font-sans text-xs text-obsidian-400 hover:text-gold-400 transition-colors">
                {avgRating} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </a>
            </div>
          )}
        </div>

        {/* ── Price ── */}
        <div className="flex items-baseline gap-3">
          {isOnSale ? (
            <>
              <span className="font-sans text-2xl text-gold-400 font-semibold">
                {formatCurrency(salePrice)}
              </span>
              <span className="font-sans text-base text-obsidian-400 line-through">
                {formatCurrency(price)}
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase bg-gold-400/10 text-gold-400 border border-gold-400/30 px-2 py-0.5">
                -{discountPct}%
              </span>
            </>
          ) : (
            <span className="font-sans text-2xl text-gold-400 font-semibold">
              {formatCurrency(price)}
            </span>
          )}
        </div>

        {/* ── Short Story ── */}
        {shortStory && (
          <p className="font-sans text-sm text-obsidian-300 leading-relaxed border-l-2 border-gold-400/40 pl-4">
            {shortStory}
          </p>
        )}

        <div className="w-12 h-px bg-gold-400/40" />

        {/* ── Size Selector ── */}
        <div id="size-selector" className="transition-all duration-300 rounded-sm p-0.5 -m-0.5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream-300">
              {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
            </span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="flex items-center gap-1 font-sans text-[10px] tracking-wider text-obsidian-400 hover:text-gold-400 transition-colors"
            >
              <Ruler size={11} />
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.length === 0 && (
              <span className="font-sans text-xs text-obsidian-400">No sizes available</span>
            )}
            {sizes.map((s) => {
              const outOfStock = s.stock === 0;
              const selected   = selectedSize === s.label;
              return (
                <button
                  key={s.label}
                  onClick={() => {
                    if (!outOfStock) {
                      setSelectedSize(s.label);
                      setQuantity(1);
                    }
                  }}
                  disabled={outOfStock}
                  title={outOfStock ? 'Out of stock' : `${s.stock} in stock`}
                  className={`relative w-12 h-12 border font-sans text-xs tracking-wider transition-all duration-200 ${
                    outOfStock
                      ? 'border-obsidian-700 text-obsidian-600 cursor-not-allowed'
                      : selected
                        ? 'border-gold-400 bg-gold-400 text-obsidian-900 font-medium'
                        : 'border-obsidian-600 text-cream-300 hover:border-obsidian-400'
                  }`}
                >
                  {s.label}
                  {outOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="absolute w-full h-px bg-obsidian-600 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Quantity Stepper ── */}
        <div className="flex items-center gap-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream-300">Qty</span>
          <div className="flex items-center border border-obsidian-600">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-obsidian-300 hover:text-cream-200 hover:bg-obsidian-700 transition-colors font-sans text-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 text-center font-sans text-sm text-cream-200">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxStock || 10, q + 1))}
              className="w-10 h-10 flex items-center justify-center text-obsidian-300 hover:text-cream-200 hover:bg-obsidian-700 transition-colors font-sans text-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {selectedSizeData && (
            <span className="font-sans text-[10px] text-obsidian-400 tracking-wider">
              {maxStock} in stock
            </span>
          )}
        </div>

        {/* ── Add to Bag + Wishlist ── */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToBag}
            disabled={cartLoading || status !== 'published'}
            className={`btn-gold flex-1 flex items-center justify-center gap-2 ${
              addedFeedback ? 'bg-green-600 hover:bg-green-600' : ''
            }`}
          >
            <ShoppingBag size={14} />
            {cartLoading ? 'Adding…' : addedFeedback ? 'Added!' : 'Add to Bag'}
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`w-14 h-14 border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              wishlisted
                ? 'border-gold-400 bg-gold-400/10 text-gold-400'
                : 'border-obsidian-600 text-obsidian-400 hover:border-gold-400 hover:text-gold-400'
            }`}
          >
            <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
          </button>

          <button
            onClick={handleShare}
            aria-label="Share product"
            className="w-14 h-14 border border-obsidian-600 text-obsidian-400 flex items-center justify-center hover:border-obsidian-400 hover:text-cream-200 transition-all duration-200 flex-shrink-0"
          >
            <Share2 size={15} />
          </button>
        </div>

        {/* ── Accordions ── */}
        <div className="mt-2">
          {fabricDetails && (
            <AccordionItem title="Fabric & Construction">
              <div className="whitespace-pre-line">{fabricDetails}</div>
            </AccordionItem>
          )}
          {careInstructions && (
            <AccordionItem title="Care Instructions">
              <div className="whitespace-pre-line">{careInstructions}</div>
            </AccordionItem>
          )}
          <AccordionItem title="Delivery & Returns">
            <ul className="space-y-1.5 list-none">
              {[
                'Free shipping on orders above ₹5,000',
                'Express delivery available at checkout',
                'Easy returns within 14 days of delivery',
                'All pieces ship in signature HOP packaging',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold-400/60 mt-2 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </AccordionItem>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
