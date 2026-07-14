import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-obsidian-900 border-t border-obsidian-700 pt-16 pb-8">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-serif text-2xl tracking-ultra text-gold-400 uppercase mb-4">HOP</p>
            <p className="text-obsidian-400 text-sm leading-relaxed mb-6 max-w-xs">
              House of Politics is not a clothing brand. It is a declaration. Dress like power. Live with intention.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'LinkedIn'].map(s => (
                <span key={s} className="text-xs text-obsidian-500 hover:text-gold-400 cursor-pointer transition-colors uppercase tracking-wide">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-gold-400 text-xs tracking-widest uppercase mb-5">Shop</p>
            <ul className="space-y-2.5">
              {[
                ['New Arrivals',     '/shop?collection=new-arrivals'],
                ['Best Sellers',     '/shop?collection=best-sellers'],
                ['Executive',        '/shop?collection=executive'],
                ['Heritage',         '/shop?collection=heritage'],
                ['Limited Editions', '/shop?collection=limited-editions'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-obsidian-400 hover:text-cream-200 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The House */}
          <div>
            <p className="text-gold-400 text-xs tracking-widest uppercase mb-5">The House</p>
            <ul className="space-y-2.5">
              {[
                ['About Us',      '/about'],
                ['Craftsmanship', '/craftsmanship'],
                ['Lookbook',      '/lookbook'],
                ['Community',     '/community'],
                ['The Journal',   '/journal'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-obsidian-400 hover:text-cream-200 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-gold-400 text-xs tracking-widest uppercase mb-5">Support</p>
            <ul className="space-y-2.5">
              {[
                ['Contact', '/contact'],
                ['Track Order', '/account/orders'],
                ['Returns', '/contact'],
                ['Size Guide', '/shop'],
                ['FAQ', '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-obsidian-400 hover:text-cream-200 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-obsidian-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-obsidian-500">
            &copy; {new Date().getFullYear()} House of Politics. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <span key={l} className="text-xs text-obsidian-500 hover:text-obsidian-300 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
