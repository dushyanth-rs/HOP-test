import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Product from '../../../../models/Product';
import JournalArticle from '../../../../models/JournalArticle';
import Coupon from '../../../../models/Coupon';
import bcrypt from 'bcryptjs';

const PRODUCTS = [
  {
    name: 'Executive Wool Blazer',
    slug: 'executive-wool-blazer',
    shortStory: 'Command every room you enter.',
    story: 'The Executive Wool Blazer is engineered for those who make decisions. Tailored from 100% premium Italian wool with a structured shoulder and clean lapel, it carries the weight of authority without the burden of effort. Wear it to the boardroom, the ballot, or wherever power is made.',
    fabricDetails: '100% Italian Merino Wool. Viscose lining. Horn buttons sourced from Rajasthan.',
    careInstructions: 'Dry clean only. Store on a wide-shoulder wooden hanger. Steam to refresh between wears.',
    price: 18500,
    salePrice: null,
    category: 'blazers',
    collection: 'executive',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg', angle: 'Front', order: 0 },
      { url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', angle: 'Side', order: 1 },
    ],
    sizes: [
      { label: 'S', stock: 8 },
      { label: 'M', stock: 12 },
      { label: 'L', stock: 10 },
      { label: 'XL', stock: 6 },
    ],
    tags: ['blazer', 'wool', 'executive', 'formal'],
  },
  {
    name: 'Heritage Cotton Polo',
    slug: 'heritage-cotton-polo',
    shortStory: 'Effortless power, from polo fields to parlours.',
    story: 'The Heritage Cotton Polo was born from a simple belief: that real authority never shouts. Crafted from 2-ply premium Supima cotton, its piqué weave breathes through long days without compromise. The three-button placket and structured collar carry the lineage of a garment worn by leaders across generations.',
    fabricDetails: '100% Supima Cotton Piqué. Reinforced collar interlining. Contrast tipping detail.',
    careInstructions: 'Machine wash cold on gentle cycle. Lay flat to dry. Do not bleach.',
    price: 4200,
    salePrice: 3500,
    category: 'polos',
    collection: 'heritage',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', angle: 'Front', order: 0 },
      { url: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg', angle: 'Back', order: 1 },
    ],
    sizes: [
      { label: 'S', stock: 15 },
      { label: 'M', stock: 20 },
      { label: 'L', stock: 18 },
      { label: 'XL', stock: 12 },
      { label: 'XXL', stock: 5 },
    ],
    tags: ['polo', 'cotton', 'heritage', 'casual'],
  },
  {
    name: 'Legislative Slim Trouser',
    slug: 'legislative-slim-trouser',
    shortStory: 'Cut for the corridors of power.',
    story: 'Tailored with a precise 17cm leg opening and a mid-rise seat that sits perfectly under a blazer or stands alone with confidence, the Legislative Slim Trouser is the foundation of a powerful wardrobe. Crafted from a wool-polyester-lycra blend that holds its shape across 18-hour days.',
    fabricDetails: '62% Wool, 35% Polyester, 3% Lycra. Satin waistband lining. Horn button clasp.',
    careInstructions: 'Dry clean recommended. Machine wash cold with garments inside out. Press with steam.',
    price: 6800,
    salePrice: null,
    category: 'bottomwear',
    collection: 'executive',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: '28', stock: 10 },
      { label: '30', stock: 14 },
      { label: '32', stock: 16 },
      { label: '34', stock: 12 },
      { label: '36', stock: 7 },
    ],
    tags: ['trousers', 'slim', 'wool', 'executive'],
  },
  {
    name: 'Statesman Linen Shirt',
    slug: 'statesman-linen-shirt',
    shortStory: 'Authority that breathes.',
    story: 'The Statesman Linen Shirt was designed for the leader who understands that composure is the ultimate statement. Belgian linen construction keeps you cool through negotiations, press conferences, and long afternoons. Mother-of-pearl buttons and a clean spread collar signal refinement without effort.',
    fabricDetails: '100% Belgian Linen. Mother-of-pearl buttons. Split back yoke construction.',
    careInstructions: 'Machine wash cold. Iron while slightly damp at high heat. The natural rumple of linen is a feature, not a flaw.',
    price: 5500,
    salePrice: null,
    category: 'shirts',
    collection: 'heritage',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', angle: 'Front', order: 0 },
      { url: 'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg', angle: 'Detail', order: 1 },
    ],
    sizes: [
      { label: 'S', stock: 10 },
      { label: 'M', stock: 16 },
      { label: 'L', stock: 14 },
      { label: 'XL', stock: 8 },
    ],
    tags: ['shirt', 'linen', 'heritage', 'formal'],
  },
  {
    name: 'Mandate Overshirt',
    slug: 'mandate-overshirt',
    shortStory: 'When a jacket is too much and a shirt is not enough.',
    story: 'The Mandate Overshirt lives in the space between casual and commanding. A brushed cotton twill construction gives it the weight to layer over a t-shirt or under a coat. Chest patch pockets and a military-influenced placket mark its lineage without announcing it.',
    fabricDetails: '100% Brushed Cotton Twill. Genuine horn buttons. Single-needle stitched seams.',
    careInstructions: 'Machine wash warm. Tumble dry low. Expect gentle softening with each wash.',
    price: 6200,
    salePrice: 5400,
    category: 'shirts',
    collection: 'new-arrivals',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: 'S', stock: 6 },
      { label: 'M', stock: 11 },
      { label: 'L', stock: 9 },
      { label: 'XL', stock: 5 },
    ],
    tags: ['overshirt', 'cotton', 'casual', 'layering'],
  },
  {
    name: 'Congress Graphic Tee',
    slug: 'congress-graphic-tee',
    shortStory: 'The manifesto, on fabric.',
    story: 'The Congress Graphic Tee carries the HOP manifesto in a single wearable statement. The hand-screen printed design — "Power. Purpose. Presence." — is printed on 240gsm ringspun cotton that sits heavy and structured rather than soft and shapeless. This is not a t-shirt. It is a position.',
    fabricDetails: '100% Ringspun Cotton, 240gsm. Hand screen print with water-based inks. Pre-shrunk construction.',
    careInstructions: 'Machine wash cold, inside out. Tumble dry low or hang to dry. Do not bleach or dry clean.',
    price: 2800,
    salePrice: null,
    category: 't-shirts',
    collection: 'best-sellers',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: 'S', stock: 25 },
      { label: 'M', stock: 30 },
      { label: 'L', stock: 28 },
      { label: 'XL', stock: 20 },
      { label: 'XXL', stock: 12 },
    ],
    tags: ['t-shirt', 'graphic', 'statement', 'cotton'],
  },
  {
    name: 'Senate Oxford Shirt',
    slug: 'senate-oxford-shirt',
    shortStory: 'The shirt that built every great wardrobe.',
    story: 'Oxford cloth has been the fabric of power dressing since men of consequence began wearing it. The Senate Oxford Shirt reinvents the classic with a tapered silhouette, barrel cuffs, and a button-down collar that lies perfectly flat without collar stays. Available in White and Pale Blue — the colours of considered authority.',
    fabricDetails: '100% Oxford Weave Cotton. Button-down collar with removable collar stays. Gauntlet cuff with dual-button adjustment.',
    careInstructions: 'Machine wash warm. Iron at medium heat. Button all buttons before washing to preserve collar shape.',
    price: 4800,
    salePrice: null,
    category: 'shirts',
    collection: 'best-sellers',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: 'S', stock: 18 },
      { label: 'M', stock: 24 },
      { label: 'L', stock: 20 },
      { label: 'XL', stock: 14 },
    ],
    tags: ['shirt', 'oxford', 'classic', 'formal'],
  },
  {
    name: 'Power Pocket Square Set',
    slug: 'power-pocket-square-set',
    shortStory: 'The detail that separates a suit from a statement.',
    story: 'The pocket square is the smallest thing on your body with the largest impression. The HOP Power Pocket Square Set includes three hand-rolled silk squares in Obsidian Black, Presidential Navy, and Gold — the three colours of authority. Each square measures 44x44cm and is hand-rolled and stitched along all four edges.',
    fabricDetails: '100% Silk, 12 momme. Hand-rolled edges. Hand-stitched hem. Made in India.',
    careInstructions: 'Dry clean only. Store flat or rolled, never folded at corners.',
    price: 3200,
    salePrice: 2800,
    category: 'accessories',
    collection: 'executive',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', angle: 'Flat lay', order: 0 },
    ],
    sizes: [
      { label: 'One Size', stock: 40 },
    ],
    tags: ['accessory', 'silk', 'pocket square', 'gift'],
  },
  {
    name: 'Prestige Chino',
    slug: 'prestige-chino',
    shortStory: 'The casual pant that holds its shape under pressure.',
    story: 'The Prestige Chino is the proof that casual and commanding are not opposites. Cut in a clean straight leg from garment-dyed cotton twill, it moves between weekends and weekdays without alteration. The metal hardware, reinforced belt loops, and flat-front cut mark its origins in quality rather than trend.',
    fabricDetails: '98% Cotton, 2% Elastane Twill. Garment-dyed finish. Engraved metal hardware.',
    careInstructions: 'Machine wash cold, inside out to preserve colour. Tumble dry low. Iron inside out.',
    price: 5800,
    salePrice: null,
    category: 'bottomwear',
    collection: 'best-sellers',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: '28', stock: 12 },
      { label: '30', stock: 18 },
      { label: '32', stock: 20 },
      { label: '34', stock: 15 },
      { label: '36', stock: 8 },
    ],
    tags: ['chino', 'casual', 'cotton', 'versatile'],
  },
  {
    name: 'Authority Bomber Jacket',
    slug: 'authority-bomber-jacket',
    shortStory: 'The jacket that arrives before you do.',
    story: 'The Authority Bomber is HOP\'s answer to the question of what comes after the blazer. Built from a heavyweight nylon-wool blend with a satin lining, its silhouette is structured but unforced. Ribbed cuffs and hem, a full YKK brass zip, and a discreet HOP monogram at the left chest mark it as something made with intention.',
    fabricDetails: '70% Nylon, 30% Wool. Satin viscose lining. YKK brass zip. Ribbed cuffs, collar and hem.',
    careInstructions: 'Dry clean only. Do not machine wash. Store unzipped on a wide-shoulder hanger.',
    price: 14500,
    salePrice: null,
    category: 'jackets',
    collection: 'limited-editions',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: 'S', stock: 4 },
      { label: 'M', stock: 6 },
      { label: 'L', stock: 5 },
      { label: 'XL', stock: 3 },
    ],
    tags: ['jacket', 'bomber', 'limited', 'outerwear'],
  },
  {
    name: 'Coalition Terry Polo',
    slug: 'coalition-terry-polo',
    shortStory: 'The weekend, made powerful.',
    story: 'The Coalition Terry Polo challenges the assumption that luxury must be stiff. Loopback cotton terry — the same fabric as the finest hotel robes — gives this polo a relaxed weight and exceptional texture. The ribbed collar and placket keep it structured while the construction keeps it comfortable across long weekends.',
    fabricDetails: '100% Loopback Cotton Terry. Ribbed collar and cuffs. Contrast tipping at collar and sleeve.',
    careInstructions: 'Machine wash warm. Tumble dry medium. Terry texture improves with each wash.',
    price: 3900,
    salePrice: null,
    category: 'polos',
    collection: 'new-arrivals',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: 'S', stock: 14 },
      { label: 'M', stock: 18 },
      { label: 'L', stock: 16 },
      { label: 'XL', stock: 10 },
    ],
    tags: ['polo', 'terry', 'casual', 'weekend'],
  },
  {
    name: 'Diplomat Merino Turtleneck',
    slug: 'diplomat-merino-turtleneck',
    shortStory: 'Power, in its quietest form.',
    story: 'The turtleneck has always been the choice of those with nothing to prove. The Diplomat Merino Turtleneck is crafted from extrafine 17.5-micron Merino wool that drapes softly against the neck without bulk. A versatile garment for the leader who knows that the most powerful statement is often the most restrained.',
    fabricDetails: 'Extrafine 17.5 micron Merino Wool. Ribbed turtleneck, cuffs and hem. 12-gauge knit construction.',
    careInstructions: 'Hand wash cold or machine wash on wool cycle. Dry flat away from direct heat. Never hang.',
    price: 8900,
    salePrice: 7500,
    category: 't-shirts',
    collection: 'limited-editions',
    status: 'published',
    images: [
      { url: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg', angle: 'Front', order: 0 },
    ],
    sizes: [
      { label: 'S', stock: 5 },
      { label: 'M', stock: 8 },
      { label: 'L', stock: 7 },
      { label: 'XL', stock: 4 },
    ],
    tags: ['turtleneck', 'merino', 'limited', 'winter'],
  },
];

const ARTICLES = [
  {
    title: 'Dress Like Power: The Psychology of Authority Dressing',
    slug: 'dress-like-power-psychology-authority-dressing',
    excerpt: 'Research shows that what you wear changes not just how others perceive you, but how you perceive yourself. Enclothed cognition is not vanity — it is strategy.',
    body: `There is a reason every great leader has had a signature style. Steve Jobs wore the same black turtleneck every day. Obama chose the same grey or blue suits. Margaret Thatcher's power suits were as deliberate as any policy document.

This was not accident. This was strategy.

## The Science Behind the Suit

Research published in the Journal of Experimental Social Psychology introduced the concept of "enclothed cognition" — the systematic influence that clothes have on the wearer's psychological processes. When you dress with intention, you don't just signal authority to others. You signal it to yourself.

In one study, participants who wore a doctor's white coat performed significantly better on attention-related tasks than those who wore the same coat described as a painter's coat. The garment was identical. The performance was not.

> Power is not given. It is dressed.

## The HOP Philosophy

At House of Politics, we build garments that understand this principle. Every cut, every fabric, every construction decision is made with a single question: does this make the person wearing it feel like the most capable version of themselves?

The answer to that question is the difference between clothing and a wardrobe.

## How to Build an Authority Wardrobe

Start with three investments:

**1. One exceptional blazer.** The blazer is the single most powerful garment in the masculine wardrobe. It elevates everything beneath it. Buy the best one you can afford, in a neutral that works across contexts.

**2. A white and a pale blue shirt.** These two shirts, in proper Oxford or poplin cloth, work in every situation from boardroom to dinner. They form the backbone of every great wardrobe.

**3. One pair of perfectly-fitted trousers.** Not chinos. Trousers. The difference matters.

These three pieces, worn with confidence, are the foundation of a political wardrobe.`,
    category: 'Personal Branding',
    authorName: 'The HOP Editorial Team',
    coverImage: 'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg',
    readTime: 6,
    featured: true,
    status: 'published',
    publishedDate: new Date('2025-01-15'),
  },
  {
    title: 'The Heritage of the Polo: From Polo Fields to Parliament',
    slug: 'heritage-of-the-polo',
    excerpt: 'The polo shirt has travelled further than any other garment in the masculine wardrobe. Its journey from the fields of Manipur to the corridors of power is a story worth wearing.',
    body: `The polo shirt was born in India. Most people do not know this.

The British soldiers stationed in Manipur in the mid-1800s watched the local game of sagol kangjei and immediately understood its brilliance. They adopted the game, and the practical, open-collar shirts the players wore with it, and exported both to England.

## A Garment That Evolved With Power

René Lacoste codified the polo in 1926, giving it the ribbed collar that defined its form. Ralph Lauren transformed it into a symbol of aspirational American leisure in the 1970s. Fred Perry made it the garment of a certain kind of British cool.

But the polo's origins were always more serious than leisure. It was a working garment for people engaged in difficult, competitive activity that demanded both performance and presentation.

> The clothes you wear are the arguments you make before you speak.

## Why the Polo Belongs in the HOP Wardrobe

The Heritage Cotton Polo from our collection was designed with this lineage in mind. A two-ply Supima cotton construction gives it the weight of a serious garment. The piqué weave references the original polo shirt's structure. The contrast tipping acknowledges its sporting heritage without being captured by it.

This is a garment that knows where it came from, and knows exactly where it's going.`,
    category: 'History',
    authorName: 'The HOP Editorial Team',
    coverImage: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg',
    readTime: 5,
    featured: false,
    status: 'published',
    publishedDate: new Date('2025-02-01'),
  },
  {
    title: 'Leadership Wardrobe Essentials for 2025',
    slug: 'leadership-wardrobe-essentials-2025',
    excerpt: 'The wardrobe of a leader is not built in a day. It is built with intention, across years, one exceptional piece at a time. Here is where to start.',
    body: `The leaders we admire most share a quality that is rarely discussed in profiles and biographies: they dress with conviction. Not expensively — though quality matters. With conviction. There is a difference.

## The Five Essentials

### 1. The Structuring Blazer
The blazer is the only garment that consistently elevates everything around it. A well-constructed single-breasted blazer in charcoal, navy, or camel will work across every professional context for a decade.

### 2. The White Shirt
There is no substitute. The white shirt is the garment that says everything through restraint. Buy one in proper Oxford weave, have it tailored if necessary, and replace it when the collar frays. Nothing else.

### 3. The Neutral Trouser
Slim, clean, pressing a crease. In mid-grey or navy. Two pairs minimum.

### 4. The Polo
A well-constructed polo in a neutral colour bridges formal and casual with a confidence that jeans and a shirt never quite manages. This is your Saturday meeting garment.

### 5. The Accessory That Speaks
A pocket square, a quality watch, a subtle tie. One well-chosen accessory tells the room that you have thought about the details — which signals that you think about all the details.

> Dress for the meeting you are going to, not the one you attended.

These five pieces, built with quality, worn with intention, form the foundation of a wardrobe that does serious work.`,
    category: 'Style',
    authorName: 'The HOP Editorial Team',
    coverImage: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg',
    readTime: 4,
    featured: false,
    status: 'published',
    publishedDate: new Date('2025-02-20'),
  },
  {
    title: 'The Politics of Personal Branding',
    slug: 'politics-of-personal-branding',
    excerpt: 'In a world where everyone has a platform, the way you present yourself has become a form of policy. Your personal brand is not vanity — it is communication.',
    body: `A politician without a brand is a message without a messenger. A business leader without a visual identity is a strategy without execution.

Personal branding is not about ego. It is about clarity.

## What Your Appearance Communicates

When you walk into a room, information is transmitted before you speak. Your posture, your grooming, your garments — these are all signals that are decoded by everyone in that room in less than seven seconds.

The question is not whether you are communicating. You always are. The question is whether you are communicating what you intend.

## Building Visual Consistency

The most powerful personal brands are consistent. This does not mean wearing the same thing every day (though that works too). It means having a coherent point of view that is expressed consistently across contexts.

> The clothes you wear are the arguments you make before you speak.

For most people, this means choosing a palette, a silhouette, and a level of formality — and sticking to it with confidence.

## The HOP Approach

Every garment in the HOP collection is designed to contribute to a coherent identity rather than compete with it. The fabrics, the colours, the cuts — all of them speak the same language of considered authority.

This is not fashion. This is a statement of intent.`,
    category: 'Leadership',
    authorName: 'The HOP Editorial Team',
    coverImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    readTime: 5,
    featured: false,
    status: 'published',
    publishedDate: new Date('2025-03-05'),
  },
  {
    title: 'Our Founding: Why India Needed a Political Wardrobe',
    slug: 'our-founding-why-india-needed-political-wardrobe',
    excerpt: 'India has always had political power. It has never had a brand that dressed it with the authority it deserves. House of Politics was built to fill that space.',
    body: `We started HOP because we were tired of dressing down.

Not in the literal sense. In the sense that every premium menswear option available to the Indian professional either looked to the West for validation, or retreated into a formal Indian aesthetic that couldn't cross the threshold of a global boardroom.

## The Gap We Saw

The Indian man of consequence — the founder, the politician, the executive, the entrepreneur — had no wardrobe brand that understood him specifically. That understood the 18-hour day, the transition from office to event to dinner without a wardrobe change, the need to look authoritative in Delhi and in Dubai.

He was being dressed by brands that were built for someone else.

## What We Built

House of Politics is built on a single insight: power deserves to be dressed.

Not performed. Not costumed. Dressed.

The difference is in the construction of every garment: fabrics sourced from the best mills in the world, crafted in India by master tailors, cut for the specific proportions and demands of the South Asian man of consequence.

> We are not a fashion brand. We are a declaration.

## Where We Are Going

We launched with twelve pieces. We will grow with intention, not ambition. Every product that enters the HOP collection will earn its place the same way every great leader earns theirs: by doing its job exceptionally well, without compromise, for as long as it is needed.

This is not a brand story. This is a manifesto.`,
    category: 'Culture',
    authorName: 'The HOP Editorial Team',
    coverImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
    readTime: 7,
    featured: false,
    status: 'published',
    publishedDate: new Date('2025-03-20'),
  },
  {
    title: 'Crafting a Suit That Speaks Before You Do',
    slug: 'crafting-a-suit-that-speaks',
    excerpt: 'The difference between a suit that fits and a suit that commands lies in details invisible to the untrained eye. This is what we look for in every garment.',
    body: `A perfectly fitting suit does three things: it elongates the torso, it creates a clean line from shoulder to hip, and it allows full arm movement without distorting the shoulder. All three simultaneously, in a single garment, is harder to achieve than most people realise.

## The Shoulder: Where Everything Begins

The shoulder is the most important part of the jacket. Get it wrong, and no amount of tailoring elsewhere will save you. The shoulder seam should sit exactly at the edge of your shoulder — not a centimetre over, not a centimetre under.

A proper shoulder has no visible divots, bunching, or "roping" at the sleeve head. This requires both the right pattern and exceptional construction.

## The Chest: Structure and Drape

The chest should lie flat against your body without pulling across the buttons or gaping below the lapels. This is a function of chest circumference, dart placement, and front rise — three variables that must be tuned in concert.

> The suit that fits you is the suit that disappears. You do not notice it. Everyone else does.

## The Trouser: The Most Underestimated Element

Most men think about the jacket and neglect the trouser. The trouser is where a suit lives or dies in daily wear. The break at the front should be clean — a single, gentle crease at the top of the shoe, no more.

The seat should be full enough to sit without straining and structured enough to hang cleanly when standing. This requires a seat seam with the right amount of ease and the right curve.

## What We Build For

Every HOP garment is engineered to these standards. Not approximated to them. Engineered to them. Because the man who wears a House of Politics garment deserves nothing less than exactness.`,
    category: 'Fashion',
    authorName: 'The HOP Editorial Team',
    coverImage: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    readTime: 6,
    featured: false,
    status: 'published',
    publishedDate: new Date('2025-04-01'),
  },
];

const COUPONS = [
  {
    code: 'POWER10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 0,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 500,
    timesUsed: 0,
    active: true,
  },
  {
    code: 'HOPWELCOME',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 3000,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 1000,
    timesUsed: 0,
    active: true,
  },
];

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Upsert admin user
    const hashedPassword = await bcrypt.hash('HOP@Admin2025', 12);
    await User.findOneAndUpdate(
      { email: 'dushyanth1998001@gmail.com' },
      {
        name: 'Dushyanth',
        email: 'dushyanth1998001@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      { upsert: true, new: true }
    );

    // Seed products
    let productsCreated = 0;
    for (const p of PRODUCTS) {
      const exists = await Product.findOne({ slug: p.slug });
      if (!exists) {
        await Product.create(p);
        productsCreated++;
      }
    }

    // Seed articles
    let articlesCreated = 0;
    for (const a of ARTICLES) {
      const exists = await JournalArticle.findOne({ slug: a.slug });
      if (!exists) {
        await JournalArticle.create(a);
        articlesCreated++;
      }
    }

    // Seed coupons
    let couponsCreated = 0;
    for (const c of COUPONS) {
      const exists = await Coupon.findOne({ code: c.code });
      if (!exists) {
        await Coupon.create(c);
        couponsCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        adminEmail: 'dushyanth1998001@gmail.com',
        adminPassword: 'HOP@Admin2025',
        productsCreated,
        articlesCreated,
        couponsCreated,
      },
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
