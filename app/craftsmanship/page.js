import Link from 'next/link';

export const metadata = {
  title: 'Craftsmanship',
  description:
    'House of Politics is built on the mastery of India\'s finest craftsmen. Every seam is a statement. Every thread, a commitment.',
};

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Material Selection',
    description:
      'Our buyers travel to mills in Surat, Varanasi, and Ludhiana to hand-select fabrics. Only those that pass our touch test — weight, drape, resilience — make the cut. We source English wool blends, Japanese cotton, and Indian Dupioni silk from generational weavers.',
  },
  {
    number: '02',
    title: 'Pattern & Cut',
    description:
      "Each pattern is hand-drafted by our senior pattern masters — not software. The cut follows the human form, not a standardised block. Chest, shoulder, waist — every dimension is calibrated for the intended silhouette. We call it 'architecture by hand'.",
  },
  {
    number: '03',
    title: 'Construction',
    description:
      "The garment is assembled over multiple sessions by a single master tailor — never passed through an assembly line. Lapels are hand-padded. Chest canvas is floating, not fused. Buttonholes are worked by hand. This process takes 18–22 hours per garment.",
  },
  {
    number: '04',
    title: 'Inspection & Finishing',
    description:
      "Before any garment earns the H.O.P. label, it undergoes a 47-point quality inspection. Seam strength, button placement, lining tension, press quality — nothing ships until it's perfect. We reject approximately 12% of production at this stage.",
  },
];

const QUALITY_PILLARS = [
  {
    title: 'Premium Fabrics',
    spec: '100% natural or blended fine fibres',
    description:
      'We work exclusively with fabrics rated above 120s for suiting wool. Our cotton shirts use 100-count Egyptian or Giza cotton. No synthetics enter our mainline.',
    badge: 'Origin Verified',
  },
  {
    title: 'Master Tailors',
    spec: 'Minimum 15 years of experience',
    description:
      'Every H.O.P. piece is made by a craftsperson with over 15 years of formal training. Our head tailor, Munna Khan, has been cutting suits for 32 years. His hands have dressed ministers and managing directors.',
    badge: 'Hand Finished',
  },
  {
    title: 'Final Inspection',
    spec: '47-point quality audit',
    description:
      'Our QC protocol covers construction integrity, aesthetic consistency, labelling accuracy, and wearability testing. Anything below our standard is remade, not discounted.',
    badge: 'No Compromises',
  },
];

const SWATCHES = [
  { name: 'Midnight Charcoal', color: '#1a1a2e', description: 'English Wool Blend' },
  { name: 'Obsidian Black', color: '#0a0a0a', description: 'Super 120s Wool' },
  { name: 'Navy Command', color: '#1B2A4A', description: 'Worsted Wool' },
  { name: 'Champagne', color: '#e8d5a3', description: 'Italian Linen Blend' },
  { name: 'Sovereign Grey', color: '#4a4a5a', description: 'Cashmere Blend' },
  { name: 'Ivory', color: '#f5f0e0', description: 'Egyptian Cotton' },
];

export default function CraftsmanshipPage() {
  return (
    <div className="bg-obsidian-900">

      {/* ── Hero ── */}
      <section className="relative py-40 px-4 text-center overflow-hidden border-b border-obsidian-700">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-xs tracking-ultra uppercase text-gold-400 mb-6">
            The Making of Power
          </p>
          <h1 className="font-serif text-7xl md:text-9xl text-cream-100 leading-none mb-6">
            CRAFTS
            <br />
            <span className="text-gold-gradient">MANSHIP</span>
          </h1>
          <div className="gold-divider mx-auto mb-8" />
          <p className="text-obsidian-300 text-lg md:text-xl font-serif italic leading-relaxed max-w-2xl mx-auto">
            "We don't manufacture clothing. We build a second skin for people who intend to be remembered."
          </p>
        </div>
      </section>

      {/* ── Material Sourcing ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Sourcing</p>
            <h2 className="section-title">India's Finest, for India's Leaders</h2>
            <div className="gold-divider" />
            <div className="space-y-5 text-obsidian-300 text-sm leading-relaxed">
              <p>
                India is the world's second-largest textile producer — a fact most luxury brands ignore
                while importing inferior substitutes from Europe. We don't. We believe that the finest
                fabrics for India's climate and context are woven right here, by weavers whose
                families have been perfecting their craft for four generations.
              </p>
              <p>
                Our suiting fabrics come from Bhiwandi and Ludhiana. Our silks from Kanchipuram and
                Varanasi. Our shirting cotton from mills in Coimbatore that have been supplying
                international luxury houses for decades — we simply decided to keep that excellence in India.
              </p>
              <p>
                When we do import — and we do, selectively — it is for English Super 120s wool and
                Italian linen for seasonal pieces that demand specific hand and weight. Every material
                decision is deliberate. Nothing enters our workroom by accident.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '14+', label: 'Fabric Mills', sub: 'Directly partnered' },
              { value: '47', label: 'Quality Checks', sub: 'Per garment' },
              { value: '18–22', label: 'Hours of Work', sub: 'Per piece' },
              { value: '100%', label: 'Natural Fibres', sub: 'Mainline guarantee' },
            ].map(({ value, label, sub }) => (
              <div
                key={label}
                className="bg-obsidian-800 border border-obsidian-700 p-6 text-center"
              >
                <div className="font-serif text-4xl text-gold-400 mb-1">{value}</div>
                <p className="text-cream-200 text-sm font-medium mb-1">{label}</p>
                <p className="text-xs text-obsidian-400 tracking-wide">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Construction Process ── */}
      <section className="py-24 bg-obsidian-800 border-y border-obsidian-700 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">The Method</p>
            <h2 className="section-title">How a H.O.P. Garment is Born</h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`flex gap-8 py-10 ${i < PROCESS_STEPS.length - 1 ? 'border-b border-obsidian-700' : ''}`}
              >
                {/* Gold Number Circle */}
                <div className="flex-shrink-0 flex flex-col items-center gap-0">
                  <div className="w-14 h-14 rounded-full border-2 border-gold-400 flex items-center justify-center">
                    <span className="font-serif text-lg text-gold-400">{step.number}</span>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="w-px flex-1 min-h-8 bg-obsidian-600 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="font-serif text-2xl text-cream-100 mb-4">{step.title}</h3>
                  <p className="text-obsidian-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality Standards ── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Our Standards</p>
          <h2 className="section-title">The H.O.P. Promise</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {QUALITY_PILLARS.map(({ title, spec, description, badge }) => (
            <div
              key={title}
              className="bg-obsidian-800 border border-obsidian-700 p-8 hover:border-gold-400/40 transition-colors"
            >
              <span className="inline-block text-xs tracking-widest uppercase text-gold-400 border border-gold-400/40 px-3 py-1 mb-6">
                {badge}
              </span>
              <h3 className="font-serif text-2xl text-cream-100 mb-1">{title}</h3>
              <p className="text-xs tracking-wide text-gold-400/70 mb-4 uppercase">{spec}</p>
              <p className="text-obsidian-300 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fabric Swatches ── */}
      <section className="py-24 bg-obsidian-800 border-t border-obsidian-700 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Palette</p>
            <h2 className="section-title">The Fabric Story</h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SWATCHES.map((swatch) => (
              <div key={swatch.name} className="group cursor-pointer">
                <div
                  className="w-full aspect-square mb-3 border border-obsidian-600 group-hover:border-gold-400 transition-colors"
                  style={{ backgroundColor: swatch.color }}
                />
                <p className="text-xs text-cream-200 font-medium">{swatch.name}</p>
                <p className="text-xs text-obsidian-400 mt-0.5">{swatch.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 text-center border-t border-obsidian-700">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Wear the Work</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-100 mb-6 leading-tight">
            Every Piece Tells the Story
          </h2>
          <div className="gold-divider mx-auto mb-8" />
          <p className="text-obsidian-300 text-sm leading-relaxed mb-10">
            Now that you know what goes into making a House of Politics garment, you'll understand
            why it wears differently. This is not fashion. This is craft with purpose.
          </p>
          <Link href="/shop" className="btn-gold inline-block">
            Shop the Collection
          </Link>
        </div>
      </section>

    </div>
  );
}
