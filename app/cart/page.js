'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';

const SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 149;

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = discountedSubtotal + shipping;

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), orderValue: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');
      setAppliedCoupon({ ...data.coupon, code: couponCode.trim().toUpperCase() });
      const savedAmount =
        data.coupon.type === 'percentage'
          ? Math.round((subtotal * data.coupon.value) / 100)
          : data.coupon.value;
      toast.success(`Coupon applied! You save ${formatCurrency(savedAmount)}`);
    } catch (err) {
      toast.error(err.message);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    toast('Coupon removed', { icon: '✕' });
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex flex-col items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-obsidian-600 mx-auto mb-6" />
          <h1 className="font-serif text-4xl text-cream-100 mb-4">Your Cart is Empty</h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-obsidian-300 text-sm tracking-wide mb-10 leading-relaxed">
            You haven't added anything yet. Explore the collection and dress like power.
          </p>
          <Link href="/shop" className="btn-gold inline-block">
            Explore the Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 pt-16 pb-24">
      {/* Page Header */}
      <div className="border-b border-obsidian-700 pb-8 mb-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-3">Your Selection</p>
        <h1 className="font-serif text-4xl md:text-5xl text-cream-100">Shopping Cart</h1>
        <div className="gold-divider mt-4 mb-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Left: Cart Items ── */}
          <div className="flex-1 min-w-0">
            <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-6">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </p>

            <div className="divide-y divide-obsidian-700">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                const price = product.salePrice ?? product.price ?? 0;
                const image = product.images?.[0]?.url || 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400';

                return (
                  <div
                    key={`${product._id}-${item.size}`}
                    className="flex gap-5 py-7"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-32 md:w-28 md:h-36 flex-shrink-0 bg-obsidian-800 overflow-hidden">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 96px, 112px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/shop/${product.slug}`}
                            className="font-serif text-lg text-cream-100 hover:text-gold-400 transition-colors leading-tight block"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs tracking-widest uppercase text-obsidian-400 mt-1.5">
                            Size: <span className="text-cream-300">{item.size}</span>
                          </p>
                          {product.salePrice && product.salePrice < product.price && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-obsidian-400 line-through">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-xs text-gold-400 tracking-widest uppercase font-medium">
                                Sale
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(product._id, item.size)}
                          className="text-obsidian-500 hover:text-cream-200 transition-colors p-1 flex-shrink-0"
                          aria-label={`Remove ${product.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-obsidian-600">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQty(product._id, item.size, item.quantity - 1);
                              } else {
                                removeItem(product._id, item.size);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center text-cream-300 hover:text-gold-400 hover:bg-obsidian-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-sm text-cream-200 font-medium tabular-nums select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(product._id, item.size, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-cream-300 hover:text-gold-400 hover:bg-obsidian-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Price */}
                        <p className="font-serif text-lg text-gold-400 tabular-nums">
                          {formatCurrency(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8 pt-6 border-t border-obsidian-700">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-obsidian-400 hover:text-gold-400 transition-colors"
              >
                <ArrowRight className="w-3 h-3 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-8 bg-obsidian-800 border border-obsidian-700 p-6">
              <h2 className="font-serif text-xl text-cream-100 mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                  Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-obsidian-700 px-4 py-3 border border-gold-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                      <span className="text-xs tracking-widest uppercase text-gold-400 font-medium">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-xs text-obsidian-300">
                        {appliedCoupon.type === 'percentage'
                          ? `(${appliedCoupon.value}% off)`
                          : `(${formatCurrency(appliedCoupon.value)} off)`}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-obsidian-400 hover:text-cream-200 transition-colors ml-2"
                      aria-label="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="ENTER CODE"
                      className="input-field flex-1 text-xs tracking-widest"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="btn-outline-gold px-4 py-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {couponLoading ? (
                        <span className="inline-block w-3 h-3 border border-gold-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 border-t border-obsidian-700 pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-300">Subtotal</span>
                  <span className="text-cream-200 tabular-nums">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Discount</span>
                    <span className="text-emerald-400 tabular-nums">− {formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-300">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-gold-400 tracking-widest uppercase text-xs font-medium">Free</span>
                  ) : (
                    <span className="text-cream-200 tabular-nums">{formatCurrency(shipping)}</span>
                  )}
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-obsidian-400 leading-relaxed">
                    Add{' '}
                    <span className="text-cream-300">{formatCurrency(SHIPPING_THRESHOLD - discountedSubtotal)}</span>{' '}
                    more to unlock free shipping.
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-obsidian-700 mt-5 pt-5 flex justify-between items-baseline mb-8">
                <span className="font-serif text-lg text-cream-100">Total</span>
                <span className="font-serif text-2xl text-gold-400 tabular-nums">
                  {formatCurrency(total)}
                </span>
              </div>

              <Link href="/checkout" className="btn-gold w-full text-center block">
                Proceed to Checkout
              </Link>

              <p className="text-xs text-obsidian-500 text-center mt-4 tracking-wide">
                Taxes &amp; duties calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
