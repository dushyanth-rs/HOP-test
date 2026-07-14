'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  BookOpen,
  Tag,
  Menu,
  X,
  Crown,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/inventory', label: 'The Vault', Icon: Package },
  { href: '/admin/crm', label: 'Client Ledger', Icon: Users },
  { href: '/admin/journal', label: 'Journal', Icon: BookOpen },
  { href: '/admin/coupons', label: 'Coupons', Icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href, exact) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-obsidian-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold-400 flex items-center justify-center">
            <Crown className="w-4 h-4 text-obsidian-900" />
          </div>
          <div>
            <p className="font-serif text-sm text-cream-100 leading-none">House of Politics</p>
            <p className="text-xs tracking-widest uppercase text-obsidian-400 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
                ${active
                  ? 'bg-gold-400/10 text-gold-400 border-l-2 border-gold-400'
                  : 'text-obsidian-300 hover:text-cream-200 hover:bg-obsidian-700 border-l-2 border-transparent'
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-obsidian-700">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs tracking-widest uppercase text-obsidian-400 hover:text-gold-400 transition-colors px-4 py-2"
        >
          ← View Storefront
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 bg-obsidian-800 border-r border-obsidian-700 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-obsidian-800 border border-obsidian-700 flex items-center justify-center text-cream-200"
        aria-label="Open admin menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-obsidian-900/80 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 h-full w-64 bg-obsidian-800 border-r border-obsidian-700 z-50 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-obsidian-400 hover:text-cream-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
