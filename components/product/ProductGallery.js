'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PLACEHOLDER = 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg';

export default function ProductGallery({ images = [], productName = '' }) {
  const [selectedIdx,  setSelectedIdx]  = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const list   = images.length > 0 ? images : [{ url: PLACEHOLDER, angle: 'Front', order: 0 }];
  const active = list[selectedIdx] || list[0];

  const prev = useCallback(() => {
    setSelectedIdx((i) => (i - 1 + list.length) % list.length);
  }, [list.length]);

  const next = useCallback(() => {
    setSelectedIdx((i) => (i + 1) % list.length);
  }, [list.length]);

  // Keyboard handler for lightbox
  function handleKeyDown(e) {
    if (e.key === 'Escape')     setLightboxOpen(false);
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* ── Main Image ── */}
        <div className="relative bg-obsidian-800 overflow-hidden group" style={{ aspectRatio: '3/4' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={active.url || PLACEHOLDER}
                alt={`${productName} — ${active.angle || 'view'}`}
                fill
                priority
                quality={90}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-obsidian-900/70 text-cream-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-obsidian-900"
            aria-label="Zoom image"
          >
            <ZoomIn size={15} />
          </button>

          {/* Prev/Next arrows (only if multiple images) */}
          {list.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-obsidian-900/70 text-cream-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-obsidian-900"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-obsidian-900/70 text-cream-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-obsidian-900"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Image counter */}
          {list.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-obsidian-900/70 px-2 py-1 font-sans text-[10px] tracking-wider text-cream-300">
              {selectedIdx + 1} / {list.length}
            </div>
          )}
        </div>

        {/* ── Angle label ── */}
        {active.angle && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-px bg-gold-400/60" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-obsidian-400">
              {active.angle} View
            </span>
          </div>
        )}

        {/* ── Thumbnail Strip ── */}
        {list.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {list.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`relative flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-all duration-200 ${
                  i === selectedIdx
                    ? 'border-gold-400'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-obsidian-500'
                }`}
                aria-label={`View ${img.angle || `image ${i + 1}`}`}
              >
                <Image
                  src={img.url || PLACEHOLDER}
                  alt={img.angle || `Image ${i + 1}`}
                  fill
                  quality={70}
                  className="object-cover object-center"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 text-cream-200 hover:text-gold-400 transition-colors z-10"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>

            {/* Prev */}
            {list.length > 1 && (
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 text-cream-200 hover:text-gold-400 transition-colors z-10 w-10 h-10 flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-3xl w-full mx-10 cursor-default"
                style={{ aspectRatio: '3/4' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={active.url || PLACEHOLDER}
                  alt={`${productName} — ${active.angle || 'view'}`}
                  fill
                  quality={95}
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, 800px"
                />
              </motion.div>
            </AnimatePresence>

            {/* Next */}
            {list.length > 1 && (
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 text-cream-200 hover:text-gold-400 transition-colors z-10 w-10 h-10 flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Thumbnail strip */}
            {list.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto scrollbar-hide max-w-sm px-4">
                {list.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedIdx(i); }}
                    className={`relative flex-shrink-0 w-12 h-16 border-2 transition-all ${
                      i === selectedIdx ? 'border-gold-400' : 'border-obsidian-600 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={img.url || PLACEHOLDER}
                      alt=""
                      fill
                      quality={50}
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
