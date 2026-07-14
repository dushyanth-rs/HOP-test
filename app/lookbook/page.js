import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Lookbook',
  description:
    'The House of Politics Lookbook — Executive Autumn 2025. Visual stories told through fabric, light, and intention.',
};

const EDITORIAL_SPREADS = [
  {
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption: 'The Boardroom Arrival',
    season: 'Autumn / Winter 2025',
    description: 'Authority enters before the handshake. The Sovereign Suit in Midnight Charcoal.',
    align: 'right',
  },
  {
    image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption: 'The Quiet Power',
    season: 'Autumn / Winter 2025',
    description: "When you don't need to raise your voice. The Classic Blazer in Obsidian Wool.",
    align: 'left',
  },
  {
    image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption: 'The Final Verdict',
    season: 'Autumn / Winter 2025',
    description: 'Closing arguments in structured Dupioni. The Executive Three-Piece.',
    align: 'right',
  },
];

const GRID_IMAGES = [
  {
    url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Detail I',
  },
  {
    url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Detail II',
  },
  {
    url: 'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Detail III',
  },
  {
    url: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Detail IV',
  },
  {
    url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Detail V',
  },
  {
    url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Detail VI',
  },
];

export default function LookbookPage() {
  return (
    <div className="bg-obsidian-900">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/60 to-transparent" />

        <div className="relative z-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full">
          <p className="text-xs tracking-ultra uppercase text-gold-400 mb-4">
            House of Politics
          </p>
          <h1 className="font-serif text-7xl md:text-9xl text-cream-100 leading-none mb-4">
            THE
            <br />
            <span className="text-gold-gradient">LOOKBOOK</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-serif italic text-xl text-cream-300">
            Executive Autumn / Winter 2025
          </p>
        </div>
      </section>

      {/* ── Intro Text ── */}
      <section className="py-20 px-4 text-center max-w-3xl mx-auto">
        <p className="font-serif text-2xl md:text-3xl text-cream-200 leading-relaxed italic">
          "Every photograph is a manifesto. Every garment, a declaration of intention."
        </p>
        <div className="gold-divider mx-auto mt-8" />
        <p className="text-obsidian-300 text-sm tracking-wide mt-6 leading-relaxed">
          The AW25 Lookbook explores the architecture of authority — shot on location across
          India's most storied boardrooms and corridors. These are not models. These are archetypes.
        </p>
      </section>

      {/* ── Alternating Editorial Spreads ── */}
      {EDITORIAL_SPREADS.map((spread, i) => (
        <section
          key={i}
          className="relative min-h-screen flex items-center overflow-hidden border-t border-obsidian-800"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={spread.image}
              alt={spread.caption}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-${spread.align === 'right' ? 'l' : 'r'} from-obsidian-900/95 via-obsidian-900/70 to-transparent`}
            />
          </div>

          {/* Caption */}
          <div
            className={`relative z-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full
              ${spread.align === 'right' ? 'text-left' : 'text-right ml-auto'}`}
          >
            <div className={`max-w-lg ${spread.align === 'right' ? '' : 'ml-auto'}`}>
              <p className="text-xs tracking-widest uppercase text-gold-400 mb-3">{spread.season}</p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-100 mb-6 leading-tight">
                {spread.caption}
              </h2>
              <div className={`gold-divider ${spread.align !== 'right' ? 'ml-auto' : ''} mb-6`} />
              <p className="text-obsidian-300 text-sm leading-relaxed mb-8">
                {spread.description}
              </p>
              <Link href="/shop" className="btn-outline-gold inline-block">
                Shop the Look
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* ── Editorial Grid ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-4">The Details</p>
          <h2 className="section-title">Frame by Frame</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GRID_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden group ${i === 0 || i === 5 ? 'row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 || i === 5 ? '3/4' : '1/1' }}
            >
              <Image
                src={img.url}
                alt={img.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-obsidian-900/0 group-hover:bg-obsidian-900/40 transition-colors duration-300 flex items-end p-4">
                <p className="text-xs tracking-widest uppercase text-cream-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop" className="btn-gold inline-block">
            Shop the Full Collection
          </Link>
        </div>
      </section>

      {/* ── Full-width CTA ── */}
      <section className="relative py-32 overflow-hidden border-t border-obsidian-700">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=1400)',
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-xs tracking-ultra uppercase text-gold-400 mb-6">Next Chapter</p>
          <h2 className="font-serif text-5xl md:text-6xl text-cream-100 mb-6 leading-tight">
            The Collection{' '}
            <span className="text-gold-gradient italic">Awaits</span>
          </h2>
          <div className="gold-divider mx-auto mb-8" />
          <p className="text-obsidian-300 mb-10 text-sm leading-relaxed">
            Every piece from the AW25 season is available now. Limited quantities. No restocks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-gold inline-block">Shop AW25</Link>
            <Link href="/craftsmanship" className="btn-outline-cream inline-block">Our Craft</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
