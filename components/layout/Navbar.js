'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Heart, Search, User, Menu, X, ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import CartDrawer from '../cart/CartDrawer';
import SearchOverlay from './SearchOverlay';

const collections = [
  { label: 'New Arrivals',     href: '/shop?collection=new-arrivals' },
  { label: 'Best Sellers',     href: '/shop?collection=best-sellers' },
  { label: 'Executive',        href: '/shop?collection=executive' },
  { label: 'Heritage',         href: '/shop?collection=heritage' },
  { label: 'Limited Editions', href: '/shop?collection=limited-editions' },
];

const categories = [
  { label: 'Shirts',      href: '/shop?category=shirts' },
  { label: 'T-Shirts',    href: '/shop?category=t-shirts' },
  { label: 'Polos',       href: '/shop?category=polos' },
  { label: 'Jackets',     href: '/shop?category=jackets' },
  { label: 'Blazers',     href: '/shop?category=blazers' },
  { label: 'Bottom Wear', href: '/shop?category=bottomwear' },
  { label: 'Accessories', href: '/shop?category=accessories' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [shopMegaOpen, setShopMegaOpen] = useState(false);

  const isHero = ['/', '/about', '/craftsmanship', '/lookbook', '/community'].includes(pathname);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navBg = scrolled || !isHero
    ? 'bg-obsidian-900/95 backdrop-blur-sm border-b border-obsidian-700'
    : 'bg-transparent';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <nav className="max-w-screen-2xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-xl tracking-ultra text-gold-400 uppercase shrink-0">
            HOP
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Shop Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setShopMegaOpen(true)}
              onMouseLeave={() => setShopMegaOpen(false)}
            >
              <button className="nav-link flex items-center gap-1">
                Shop <ChevronDown size={12} className={`transition-transform ${shopMegaOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {shopMegaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[480px]"
                  >
                    <div className="bg-obsidian-800 border border-obsidian-600 p-8 grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-gold-400 text-xs tracking-widest uppercase font-sans mb-4">Collections</p>
                        <ul className="space-y-2">
                          {collections.map(c => (
                            <li key={c.href}>
                              <Link href={c.href} className="text-sm text-cream-300 hover:text-gold-400 transition-colors">
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-gold-400 text-xs tracking-widest uppercase font-sans mb-4">Categories</p>
                        <ul className="space-y-2">
                          {categories.map(c => (
                            <li key={c.href}>
                              <Link href={c.href} className="text-sm text-cream-300 hover:text-gold-400 transition-colors">
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/journal"       className="nav-link">Journal</Link>
            <Link href="/lookbook"      className="nav-link">Lookbook</Link>
            <Link href="/craftsmanship" className="nav-link">Craftsmanship</Link>
            <Link href="/about"         className="nav-link">About</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen(true)} className="text-cream-300 hover:text-gold-400 transition-colors" aria-label="Search">
              <Search size={18} />
            </button>

            <Link href={session ? '/account/wishlist' : '/auth/signin'} className="relative text-cream-300 hover:text-gold-400 transition-colors" aria-label="Wishlist">
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-400 text-obsidian-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href={session ? '/account' : '/auth/signin'} className="text-cream-300 hover:text-gold-400 transition-colors" aria-label="Account">
              <User size={18} />
            </Link>

            <button onClick={() => setCartOpen(true)} className="relative text-cream-300 hover:text-gold-400 transition-colors" aria-label="Cart">
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-400 text-obsidian-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden text-cream-300 hover:text-gold-400 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-obsidian-900 border-t border-obsidian-700 overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                <p className="text-gold-400 text-xs tracking-widest uppercase mb-2">Shop</p>
                {collections.map(c => (
                  <Link key={c.href} href={c.href} className="block text-sm text-cream-300">{c.label}</Link>
                ))}
                <div className="border-t border-obsidian-700 pt-4 space-y-3">
                  <Link href="/journal"       className="block nav-link py-1">Journal</Link>
                  <Link href="/lookbook"      className="block nav-link py-1">Lookbook</Link>
                  <Link href="/craftsmanship" className="block nav-link py-1">Craftsmanship</Link>
                  <Link href="/about"         className="block nav-link py-1">About</Link>
                  <Link href={session ? '/account' : '/auth/signin'} className="block nav-link py-1">
                    {session ? 'My Account' : 'Sign In'}
                  </Link>
                  {session?.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block text-gold-400 text-xs tracking-widest uppercase py-1">Admin</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
