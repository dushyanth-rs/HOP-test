import Image from 'next/image';
import Link from 'next/link';
import { Crown, Zap, Shield } from 'lucide-react';
import BrandTimeline from './BrandTimeline';

export const metadata = {
  title: 'About',
  description:
    'House of Politics was born from a belief that power deserves a uniform. Learn about our origins, philosophy, and vision.',
};

export default function AboutPage() {
  return (
    <div className="bg-obsidian-900">

      {/* ── Cinematic Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        />
        <div className="absolute inset-0 bg-obsidian-900/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-xs tracking-ultra uppercase text-gold-400 mb-6 animate-fade-in">
            Est. 2023 &nbsp;·&nbsp; New Delhi, India
          </p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-cream-100 leading-none mb-8 animate-slide-up">
            House of
            <br />
            <span className="text-gold-gradient italic">Politics</span>
          </h1>
          <div className="gold-divider mx-auto mb-6 animate-draw-line" />
          <p className="text-cream-300 text-lg md:text-xl font-serif italic leading-relaxed animate-fade-in">
            "We didn't create fashion. We created a language for those who rule."
          </p>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold-400" />
        </div>
      </section>

      {/* ── Why We Were Created ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Our Genesis</p>
            <h2 className="section-title">Why We Were Created</h2>
            <div className="gold-divider" />
            <div className="space-y-5 text-obsidian-300 leading-relaxed text-[15px]">
              <p>
                In a world saturated with fashion, we saw a void. Not a lack of clothing — but a
                lack of conviction. The men who shape economies, lead nations, and build legacies
                were dressing like everyone else. We couldn't allow that.
              </p>
              <p>
                House of Politics was founded in 2023 by a group of designers, strategists, and
                visionaries who believed that the clothes on a man's back are the opening argument
                in every room he enters. First impressions in boardrooms, parliaments, and
                negotiations are not accidents — they are strategies.
              </p>
              <p>
                We set out to create menswear that communicates power before a word is spoken.
                Garments rooted in India's extraordinary textile heritage, tailored with global
                precision, and designed for men who understand that dressing well is not vanity —
                it is discipline.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="House of Politics — editorial"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/60 to-transparent" />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold-400/20 -z-10" />
          </div>
        </div>
      </section>

      {/* ── What's In a Name ── */}
      <section className="py-24 px-4 bg-obsidian-800 border-y border-obsidian-700">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-10">Etymology</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream-200 mb-12">
            What's In a Name?
          </h2>

          <div className="grid grid-cols-3 gap-8 mb-12">
            {/* H */}
            <div className="text-center">
              <div className="font-serif text-8xl md:text-9xl text-gold-gradient leading-none mb-4">H</div>
              <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-2">House</p>
              <p className="text-sm text-obsidian-300 leading-relaxed">
                A lineage. A legacy. An institution that outlasts trends and endures through generations.
              </p>
            </div>
            {/* O */}
            <div className="text-center">
              <div className="font-serif text-8xl md:text-9xl text-gold-gradient leading-none mb-4">O</div>
              <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-2">of</p>
              <p className="text-sm text-obsidian-300 leading-relaxed">
                The connector. The declaration of belonging — to something greater, something earned.
              </p>
            </div>
            {/* P */}
            <div className="text-center">
              <div className="font-serif text-8xl md:text-9xl text-gold-gradient leading-none mb-4">P</div>
              <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-2">Politics</p>
              <p className="text-sm text-obsidian-300 leading-relaxed">
                Not parties. Not elections. The art of navigating power — in every room, at every table.
              </p>
            </div>
          </div>

          <div className="gold-divider mx-auto mb-8" />
          <p className="font-serif italic text-xl text-cream-200 leading-relaxed max-w-2xl mx-auto">
            "H.O.P. is not just initials. It's an instruction — a reminder that every step forward
            is political, intentional, and dressed accordingly."
          </p>
        </div>
      </section>

      {/* ── Our Philosophy ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Our Pillars</p>
          <h2 className="section-title">Our Philosophy</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              Icon: Crown,
              title: 'Sovereignty',
              body: 'A man who dresses with intent commands respect before he speaks. Our cuts are designed to make you the most powerful presence in any room. Fit is non-negotiable — it is the foundation of authority.',
            },
            {
              Icon: Zap,
              title: 'Precision',
              body: "Every seam, every button, every fold is a decision. We don't do excess. We don't do accident. House of Politics garments are engineered like arguments — tight, purposeful, and impossible to refute.",
            },
            {
              Icon: Shield,
              title: 'Integrity',
              body: "Sourced from India's finest mills, stitched by master craftsmen with decades of experience. We believe in clothing that holds its character wash after wash, year after year. This is not fast fashion. This is a standard.",
            },
          ].map(({ Icon, title, body }) => (
            <div
              key={title}
              className="bg-obsidian-800 border border-obsidian-700 p-8 hover:border-gold-400/40 transition-colors group"
            >
              <div className="w-12 h-12 border border-gold-400/40 flex items-center justify-center mb-6 group-hover:border-gold-400 transition-colors">
                <Icon className="w-5 h-5 text-gold-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-cream-100 mb-4">{title}</h3>
              <p className="text-obsidian-300 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Vision ── */}
      <section className="py-32 px-4 text-center bg-obsidian-800 border-y border-obsidian-700">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-8">Our Vision</p>
          <p className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream-100 leading-tight">
            To become the uniform of{' '}
            <span className="text-gold-gradient italic">India's next generation</span>{' '}
            of leaders — in business, governance, and culture.
          </p>
          <div className="gold-divider mx-auto mt-12" />
        </div>
      </section>

      {/* ── Brand Timeline (Client Component) ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">The Journey</p>
          <h2 className="section-title">Our Story So Far</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <BrandTimeline />
      </section>

      {/* ── Dual CTA ── */}
      <section className="py-24 px-4 bg-obsidian-800 border-t border-obsidian-700">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-obsidian-700">
          <div className="bg-obsidian-800 p-12 text-center hover:bg-obsidian-700 transition-colors group">
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-4">The Collection</p>
            <h3 className="font-serif text-3xl text-cream-100 mb-6">Wear the Philosophy</h3>
            <Link href="/shop" className="btn-gold inline-block group-hover:bg-gold-300 transition-colors">
              Shop Now
            </Link>
          </div>
          <div className="bg-obsidian-800 p-12 text-center hover:bg-obsidian-700 transition-colors group">
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-4">Our Craft</p>
            <h3 className="font-serif text-3xl text-cream-100 mb-6">How We Build</h3>
            <Link href="/craftsmanship" className="btn-outline-gold inline-block">
              Explore Craft
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
