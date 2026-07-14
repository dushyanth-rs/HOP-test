import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';

export const metadata = {
  title: 'Community',
  description:
    'The House of Politics community — men who lead, create, and command. Join the movement.',
};

const VALUES = [
  {
    word: 'Power',
    subtitle: 'Controlled. Intentional. Absolute.',
    description:
      "Power isn't loud. It doesn't beg for attention — it commands it. Our community is built on men who understand that true power is quiet, confident, and impeccably dressed. It shows in the decisions you make before 9 AM and the room you walk into at noon.",
  },
  {
    word: 'Purpose',
    subtitle: 'Every move, deliberate.',
    description:
      "Purpose is what separates leaders from passengers. Our community members don't drift through careers — they architect them. Purpose-driven men choose everything with intention: their words, their companies, and yes — their clothing. Because the outfit is the brief before the meeting begins.",
  },
  {
    word: 'Presence',
    subtitle: 'Felt before seen.',
    description:
      "Presence is the art of occupying a room before you speak. It's posture, eye contact, calm. And it's reinforced by the garment you chose that morning. Our community understands that the way you dress is the opening argument in every conversation you'll have today.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I wore the Executive Three-Piece to a board pitch last quarter. Closed a ₹4 crore deal. The suit didn't close it — but it opened every door in that room.",
    name: 'Arjun Mehta',
    title: 'Founder & CEO, Mehta Capital Group',
    location: 'Mumbai',
  },
  {
    quote:
      "I've worn Brioni and Canali. House of Politics competes at that level — but it knows India. The fit, the weight, the way it wears in September heat. It's built for this country.",
    name: 'Vikram Nair',
    title: 'Managing Director, NairVentures',
    location: 'Bengaluru',
  },
  {
    quote:
      "The Sovereign Suit was the first thing I bought. Then the shirts. Then the outerwear. I keep coming back because this brand understands what I'm trying to project — and it helps me project it better.",
    name: 'Rahul Khanna',
    title: 'Senior Partner, Khanna & Associates',
    location: 'New Delhi',
  },
];

export default function CommunityPage() {
  return (
    <div className="bg-obsidian-900">

      {/* ── Hero ── */}
      <section className="relative py-40 px-4 text-center overflow-hidden border-b border-obsidian-700">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-xs tracking-ultra uppercase text-gold-400 mb-6">You Belong Here</p>
          <h1 className="font-serif text-7xl md:text-9xl text-cream-100 leading-none mb-6">
            THE
            <br />
            <span className="text-gold-gradient">COMMUNITY</span>
          </h1>
          <div className="gold-divider mx-auto mb-8" />
          <p className="text-obsidian-300 text-lg font-serif italic leading-relaxed max-w-2xl mx-auto">
            Not a mailing list. Not a discount club. A standard — held by men who refuse to settle
            for ordinary, in business or in dress.
          </p>
        </div>
      </section>

      {/* ── Brand Values ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">What We Stand For</p>
          <h2 className="section-title">The Three Pillars</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-obsidian-700 divide-y md:divide-y-0 md:divide-x divide-obsidian-700">
          {VALUES.map(({ word, subtitle, description }) => (
            <div
              key={word}
              className="p-10 bg-obsidian-800 hover:bg-obsidian-700 transition-colors group"
            >
              <div className="font-serif text-7xl text-gold-gradient leading-none mb-6">
                {word}
              </div>
              <p className="text-xs tracking-widest uppercase text-gold-400 mb-4">{subtitle}</p>
              <div className="gold-divider mb-5" />
              <p className="text-obsidian-300 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Manifesto Pull-Quote ── */}
      <section className="py-32 bg-obsidian-800 border-y border-obsidian-700 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-ultra uppercase text-gold-400 mb-10">The Manifesto</p>
          <blockquote>
            <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight mb-10">
              "We didn't start a brand. We started a{' '}
              <span className="text-gold-gradient italic">standard</span>. A line in the sand that
              says — if you wear this, you understand something about yourself. You understand that
              the game is already on before you sit down, and that the man who controls his
              appearance{' '}
              <span className="italic">controls the narrative</span>."
            </p>
          </blockquote>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-xs tracking-widest uppercase text-obsidian-400">
            The Founders &nbsp;—&nbsp; House of Politics
          </p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">From the Community</p>
          <h2 className="section-title">Who Wears H.O.P.</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, title, location }) => (
            <div
              key={name}
              className="bg-obsidian-800 border border-obsidian-700 p-8 hover:border-gold-400/30 transition-colors"
            >
              <div className="font-serif text-5xl text-gold-400/30 leading-none mb-4">"</div>
              <p className="font-serif text-base text-cream-200 leading-relaxed mb-8 italic">
                {quote}
              </p>
              <div className="gold-divider mb-4" />
              <p className="text-cream-100 text-sm font-medium">{name}</p>
              <p className="text-xs text-obsidian-400 mt-1">{title}</p>
              <p className="text-xs text-gold-400/60 mt-0.5">{location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Join the Movement ── */}
      <section className="py-24 bg-obsidian-800 border-t border-obsidian-700 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Join the Movement</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-100 mb-4 leading-tight">
            The Inner Circle
          </h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-obsidian-300 text-sm leading-relaxed mb-10">
            First access to new collections. Private sales. Editorial content and styling intelligence
            for men who refuse to be ordinary. No spam — only signal.
          </p>

          {/* Client signup component */}
          <NewsletterSignup />
        </div>
      </section>

      {/* ── Social Links ── */}
      <section className="py-16 border-t border-obsidian-700 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-8">
            Follow the Movement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {[
              { label: 'Instagram', handle: '@houseofpolitics_', href: 'https://instagram.com' },
              { label: 'LinkedIn', handle: 'House of Politics', href: 'https://linkedin.com' },
              { label: 'Twitter / X', handle: '@HOPmenswear', href: 'https://x.com' },
            ].map(({ label, handle, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group"
              >
                <span className="text-xs tracking-widest uppercase text-obsidian-400 group-hover:text-gold-400 transition-colors">
                  {label}
                </span>
                <span className="text-sm text-cream-300 group-hover:text-gold-400 transition-colors">
                  {handle}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
