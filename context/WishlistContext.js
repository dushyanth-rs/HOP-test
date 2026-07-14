'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      setWishlist(data.wishlist || []);
    } catch {}
  }, [session?.user?.id]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  async function toggle(product) {
    if (!session?.user?.id) {
      toast.error('Please sign in to save items to your wishlist');
      return;
    }

    const isIn = wishlist.some(p => p._id === product._id);

    if (isIn) {
      try {
        await fetch(`/api/wishlist?productId=${product._id}`, { method: 'DELETE' });
        setWishlist(prev => prev.filter(p => p._id !== product._id));
        toast.success('Removed from wishlist');
      } catch { toast.error('Failed to update wishlist'); }
    } else {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        });
        setWishlist(prev => [...prev, product]);
        toast.success('Saved to wishlist');
      } catch { toast.error('Failed to update wishlist'); }
    }
  }

  function isWishlisted(productId) {
    return wishlist.some(p => p._id === productId || p._id?.toString() === productId);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, count: wishlist.length, toggle, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
