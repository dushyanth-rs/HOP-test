'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import { Send, CircleCheck as CheckCircle } from 'lucide-react';

const BENEFITS = [
  'Exclusive early access to new collections',
  'Members-only editorial content',
  'Private sale invitations',
];

export default function NewsletterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setSubscribed(true);
      setEmail('');
      toast.success('Welcome to the movement. Check your inbox!', {
        duration: 5000,
        style: {
          background: '#0A0A0A',
          color: '#F5F0E8',
          border: '1px solid #D4AF37',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          letterSpacing: '0.025em',
        },
        iconTheme: { primary: '#D4AF37', secondary: '#0A0A0A' },
      });
    } catch (err) {
      const msg = err.message || 'Failed to subscribe. Please try again.';
      setError(msg);
      toast.error(msg, {
        style: {
          background: '#141414',
          color: '#F5F0E8',
          border: '1px solid #505050',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      ref={ref}
      className="relative bg-obsidian-900 py-24 px-6 overflow-hidden"
      aria-label="Newsletter Signup"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(212,175,55,0.06),transparent)] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Top gold divider */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="gold-divider w-24" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-gold-400 block mb-5">
            Stay in Power
          </span>

          <h2 className="font-serif text-cream-100 leading-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Join the Movement
          </h2>

          <p className="font-sans text-obsidian-200 text-sm leading-relaxed max-w-lg mx-auto mb-8">
            Enter the inner circle. Be the first to know about new collections, 
            private events, and editorial drops crafted for men who lead.
          </p>

          {/* Benefits list */}
          <ul className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 font-sans text-[11px] tracking-wide text-obsidian-300"
              >
                <span className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Form / Success State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
        >
          {subscribed ? (
            <SuccessMessage />
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              aria-label="Newsletter subscription form"
            >
              <div className="flex-1 relative">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Your email address"
                  required
                  disabled={loading}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  className={`input-field w-full pr-4 ${
                    error ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                {error && (
                  <p
                    id="newsletter-error"
                    role="alert"
                    className="absolute -bottom-5 left-0 font-sans text-[11px] text-red-400 tracking-wide"
                  >
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-gold flex items-center justify-center gap-2 px-8 py-3.5 text-sm tracking-widest whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px]"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Subscribing…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Privacy note */}
        {!subscribed && (
          <motion.p
            className="text-center font-sans text-[10px] text-obsidian-500 mt-8 tracking-wide"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            No spam, ever. Unsubscribe with one click. We respect your privacy.
          </motion.p>
        )}

        {/* Bottom gold divider */}
        <motion.div
          className="flex justify-center mt-14"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="gold-divider w-24" />
        </motion.div>
      </div>
    </section>
  );
}

function SuccessMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4 py-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-14 h-14 flex items-center justify-center border border-gold-400/40 rounded-full">
        <CheckCircle size={28} className="text-gold-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-cream-100 text-xl">
        Welcome to the Movement
      </h3>
      <p className="font-sans text-obsidian-300 text-sm text-center max-w-sm leading-relaxed">
        You&rsquo;re now part of the inner circle. Expect exclusivity, power, 
        and impeccable style delivered to your inbox.
      </p>
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-obsidian-900"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
