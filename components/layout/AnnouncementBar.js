'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const messages = [
  'Free shipping on orders above ₹2,000',
  'New arrivals — The Executive Collection',
  'Express delivery available in major cities',
  'Use code POWER10 for 10% off your first order',
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gold-500 h-8 flex items-center justify-center">
      <button onClick={() => setIdx(i => (i - 1 + messages.length) % messages.length)} className="absolute left-4 text-obsidian-900 hover:text-obsidian-700">
        <ChevronLeft size={14} />
      </button>
      <p className="text-obsidian-900 text-xs tracking-widest uppercase font-sans font-medium">
        {messages[idx]}
      </p>
      <button onClick={() => setIdx(i => (i + 1) % messages.length)} className="absolute right-4 text-obsidian-900 hover:text-obsidian-700">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
