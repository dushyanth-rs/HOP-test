'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';

export default function CartDrawer({ open, onClose }) {
  const { items, itemCount, subtotal, updateQty, removeItem } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-obsidian-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-md bg-obsidian-900 border-l border-obsidian-700 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-obsidian-700">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-gold-400" />
                <h2 className="font-sans font-medium text-cream-100 tracking-wide text-sm uppercase">
                  Your Cart ({itemCount})
                </h2>
              </div>
              <button onClick={onClose} className="text-cream-400 hover:text-cream-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={40} className="text-obsidian-600" />
                  <p className="text-obsidian-400 text-sm">Your cart is empty</p>
                  <button onClick={onClose} className="btn-gold text-xs py-3 px-6">
                    Shop Now
                  </button>
                </div>
              ) : (
                items.map((item, idx) => {
                  const product = item.product;
                  const price = product?.salePrice ?? product?.price ?? 0;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-24 bg-obsidian-800 shrink-0 overflow-hidden">
                        {product?.images?.[0]?.url && (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream-100 text-sm font-medium truncate">{product?.name}</p>
                        <p className="text-obsidian-400 text-xs mt-0.5">{item.size}</p>
                        <p className="text-gold-400 text-sm mt-1">{formatCurrency(price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-obsidian-600">
                            <button
                              onClick={() => updateQty(product._id, item.size, item.quantity - 1)}
                              className="px-2 py-1 text-cream-400 hover:text-cream-100 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-sm text-cream-100">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(product._id, item.size, item.quantity + 1)}
                              className="px-2 py-1 text-cream-400 hover:text-cream-100 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(product._id, item.size)}
                            className="text-obsidian-500 hover:text-red-400 transition-colors ml-auto"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-obsidian-700 px-6 py-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-obsidian-400 text-sm">Subtotal</span>
                  <span className="text-cream-100 font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <p className="text-obsidian-500 text-xs">
                  {subtotal >= 2000 ? 'Free shipping applied' : `Add ${formatCurrency(2000 - subtotal)} more for free shipping`}
                </p>
                <Link href="/cart" onClick={onClose} className="btn-outline-cream w-full text-center block">
                  View Cart
                </Link>
                <Link href="/checkout" onClick={onClose} className="btn-gold w-full text-center block">
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
