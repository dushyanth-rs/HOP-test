'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

function StarRating({ value, onChange, size = 20, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readOnly ? 'button' : 'button'}
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          aria-label={readOnly ? undefined : `Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={
              star <= display
                ? 'fill-gold-400 text-gold-400'
                : 'text-obsidian-500'
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ productId, onClose, onSuccess }) {
  const [rating,    setRating]    = useState(0);
  const [headline,  setHeadline]  = useState('');
  const [body,      setBody]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    if (!body.trim()) { setError('Please write a review.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productId, rating, headline, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-obsidian-900/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-obsidian-800 border border-obsidian-600 w-full max-w-lg p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-2xl text-cream-100">Write a Review</h3>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold-400 mt-1">
              Share your experience
            </p>
          </div>
          <button onClick={onClose} className="text-obsidian-400 hover:text-cream-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-obsidian-400 block mb-2">
              Your Rating *
            </label>
            <StarRating value={rating} onChange={setRating} size={28} />
          </div>

          {/* Headline */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-obsidian-400 block mb-2">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Summarise your experience…"
              maxLength={120}
              className="input-field"
            />
          </div>

          {/* Body */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-obsidian-400 block mb-2">
              Review *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell us about the fit, quality, and style…"
              rows={5}
              maxLength={1000}
              className="input-field resize-none"
              required
            />
            <p className="font-sans text-[10px] text-obsidian-500 mt-1 text-right">
              {body.length}/1000
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 font-sans text-xs">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ReviewSection({ reviews = [], productId }) {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  const count  = localReviews.length;
  const avg    = count
    ? localReviews.reduce((s, r) => s + r.rating, 0) / count
    : 0;
  const avgStr = avg.toFixed(1);

  // Distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: localReviews.filter((r) => r.rating === star).length,
    pct:   count ? Math.round((localReviews.filter((r) => r.rating === star).length / count) * 100) : 0,
  }));

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <>
      <section id="reviews" className="border-t border-obsidian-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-3">
                Customer Reviews
              </p>
              <h2 className="section-title mb-0">
                {count > 0 ? `${count} Review${count !== 1 ? 's' : ''}` : 'Be the First to Review'}
              </h2>
            </div>
            {session ? (
              <button
                onClick={() => setModalOpen(true)}
                className="btn-outline-gold flex-shrink-0"
              >
                Write a Review
              </button>
            ) : (
              <a
                href="/auth/signin"
                className="btn-outline-gold flex-shrink-0 inline-flex items-center justify-center"
              >
                Sign In to Review
              </a>
            )}
          </div>

          {count > 0 && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 pb-14 border-b border-obsidian-800">
                {/* Overall score */}
                <div className="flex flex-col items-center justify-center bg-obsidian-800/50 border border-obsidian-700 p-8">
                  <span className="font-serif text-6xl text-cream-100 leading-none mb-3">{avgStr}</span>
                  <StarRating value={Math.round(avg)} readOnly size={18} />
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-obsidian-400 mt-3">
                    {count} Review{count !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Distribution bars */}
                <div className="md:col-span-2 flex flex-col justify-center gap-2.5">
                  {dist.map(({ star, count: c, pct }) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={10}
                            className={s <= star ? 'fill-gold-400 text-gold-400' : 'text-obsidian-600'}
                          />
                        ))}
                      </div>
                      <div className="flex-1 bg-obsidian-700 h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                          className="h-full bg-gold-400"
                        />
                      </div>
                      <span className="font-sans text-[10px] text-obsidian-400 w-8 text-right">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localReviews.map((review) => (
                  <motion.article
                    key={review._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-obsidian-800/40 border border-obsidian-700 p-6"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans text-sm text-cream-200 font-medium">
                            {review.user?.name || 'Anonymous'}
                          </span>
                          {review.verifiedPurchase && (
                            <span className="flex items-center gap-1 font-sans text-[9px] tracking-[0.15em] uppercase text-green-400">
                              <CheckCircle size={10} />
                              Verified
                            </span>
                          )}
                        </div>
                        <StarRating value={review.rating} readOnly size={13} />
                      </div>
                      <time className="font-sans text-[10px] text-obsidian-500 flex-shrink-0">
                        {formatDate(review.createdAt)}
                      </time>
                    </div>

                    {review.headline && (
                      <p className="font-serif text-base text-cream-200 mb-2">{review.headline}</p>
                    )}
                    <p className="font-sans text-sm text-obsidian-300 leading-relaxed line-clamp-4">
                      {review.body}
                    </p>
                  </motion.article>
                ))}
              </div>
            </>
          )}

          {count === 0 && (
            <div className="text-center py-16 border border-obsidian-800">
              <div className="w-12 h-px bg-gold-400/40 mx-auto mb-6" />
              <p className="font-sans text-sm text-obsidian-400 mb-2">No reviews yet.</p>
              <p className="font-sans text-xs text-obsidian-500">
                Be the first to share your thoughts on this piece.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && (
          <ReviewModal
            productId={productId}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              // Optimistically prompt a page refresh for new review
              window.location.reload();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
