'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const PLACEHOLDER_IMAGE =
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg';

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product }) {
  const { addItem, loading: cartLoading } = useCart();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const [hoveredSize, setHoveredSize] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const {
    _id,
    name = 'Unnamed Product',
    slug = '',
    price = 0,
    salePrice = null,
    images = [],
    sizes = [],
    category = '',
  } = product;

  const primaryImage = images[0]?.url ?? PLACEHOLDER_IMAGE;
  const secondaryImage = images[1]?.url ?? primaryImage;
  const wishlisted = isWishlisted(_id);
  const availableSizes = sizes.filter((s) => s.stock > 0);
  const discountPct =
    salePrice && salePrice < price
      ? Math.round(((price - salePrice) / price) * 100)
      : null;

  function handleAddToCart(size) {
    if (!size) return;
    addItem(_id, size, 1);
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  return (
    <article
      className="card-product group relative bg-obsidian-800 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredSize(null);
      }}
      aria-label={name}
    >
      {/* ── Image Container ── */}
      <Link href={`/shop/${slug}`} className="block relative overflow-hidden h-80 sm:h-96">
        {/* Primary image */}
        <Image
          src={primaryImage}
          alt={name}
          fill
          quality={85}
          className={`object-cover object-center transition-all duration-700 ease-out ${
            isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Secondary / hover image */}
        <Image
          src={secondaryImage}
          alt={`${name} alternate view`}
          fill
          quality={85}
          className={`object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discountPct && (
            <span className="bg-gold-400 text-obsidian-900 font-sans text-[10px] font-bold tracking-widest px-2 py-1 uppercase">
              -{discountPct}%
            </span>
          )}
          {availableSizes.length === 0 && (
            <span className="bg-obsidian-600 text-cream-200 font-sans text-[10px] tracking-widest px-2 py-1 uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
            wishlisted
              ? 'bg-gold-400 text-obsidian-900'
              : 'bg-obsidian-900/70 text-cream-200 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            size={15}
            className={wishlisted ? 'fill-current' : ''}
          />
        </button>

        {/* Quick View link */}
        <Link
          href={`/shop/${slug}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-obsidian-900/70 text-cream-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Quick view"
        >
          <Eye size={15} />
        </Link>

        {/* Quick-Add Overlay */}
        {availableSizes.length > 0 && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-obsidian-900/92 px-3 py-3 transition-all duration-400 ease-out z-20 ${
              isHovered
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            }`}
          >
            <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-obsidian-300 mb-2 text-center">
              Select Size
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center mb-2.5">
              {availableSizes.map((s) => (
                <button
                  key={s.label}
                  onMouseEnter={() => setHoveredSize(s.label)}
                  onMouseLeave={() => setHoveredSize(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(s.label);
                  }}
                  disabled={cartLoading}
                  className={`font-sans text-[10px] tracking-wider px-2.5 py-1 border transition-all duration-200 disabled:opacity-50 ${
                    hoveredSize === s.label
                      ? 'border-gold-400 bg-gold-400 text-obsidian-900'
                      : 'border-obsidian-500 text-cream-200 hover:border-gold-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (availableSizes.length === 1) {
                  handleAddToCart(availableSizes[0].label);
                } else if (hoveredSize) {
                  handleAddToCart(hoveredSize);
                }
              }}
              disabled={cartLoading}
              className="w-full flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-obsidian-900 font-sans text-[10px] tracking-[0.25em] uppercase py-2 transition-colors duration-200 disabled:opacity-60"
            >
              <ShoppingBag size={11} />
              {cartLoading ? 'Adding…' : 'Add to Bag'}
            </button>
          </div>
        )}
      </Link>

      {/* ── Product Info ── */}
      <div className="p-4">
        {category && (
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-500 block mb-1">
            {category}
          </span>
        )}
        <Link href={`/shop/${slug}`} className="block">
          <h3 className="font-serif text-cream-100 text-base font-medium leading-snug mb-2 hover:text-gold-400 transition-colors duration-200 line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {salePrice && salePrice < price ? (
            <>
              <span className="font-sans text-gold-400 font-semibold text-sm">
                {formatPrice(salePrice)}
              </span>
              <span className="font-sans text-obsidian-400 text-xs line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="font-sans text-gold-400 font-semibold text-sm">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
