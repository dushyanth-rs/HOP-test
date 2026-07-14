'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { generateSessionId } from '../lib/utils';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(false);

  function getSessionId() {
    if (typeof window === 'undefined') return null;
    let id = localStorage.getItem('hop_session_id');
    if (!id) {
      id = generateSessionId();
      localStorage.setItem('hop_session_id', id);
    }
    return id;
  }

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-session-id': getSessionId(),
  }), []);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { headers: headers() });
      const data = await res.json();
      setItems(data.cart?.items || []);
    } catch {}
  }, [headers]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (session?.user?.id) {
      const sessionId = getSessionId();
      fetch('/api/cart/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      }).then(() => fetchCart()).catch(() => {});
    }
  }, [session?.user?.id, fetchCart]);

  async function addItem(productId, size, quantity = 1) {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ productId, size, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.cart?.items || []);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(productId, size, quantity) {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ productId, size, quantity }),
      });
      const data = await res.json();
      setItems(data.cart?.items || []);
    } catch {}
  }

  async function removeItem(productId, size) {
    try {
      const res = await fetch(`/api/cart?productId=${productId}&size=${encodeURIComponent(size)}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => !(i.product?._id === productId && i.size === size)));
      }
    } catch {}
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = items.reduce((sum, i) => {
    const price = i.product?.salePrice ?? i.product?.price ?? 0;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, loading, addItem, updateQty, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
