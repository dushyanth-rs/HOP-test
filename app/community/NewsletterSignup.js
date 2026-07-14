'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
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
      if (!res.ok) throw new Error(data.error || 'Subscription failed');
      setSubmitted(true);
      toast.success('Welcome to the inner circle.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-6">
        <div className="w-12 h-12 rounded-full border border-gold-400 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-serif text-lg text-cream-100 mb-2">You're in.</p>
        <p className="text-sm text-obsidian-400">
          Expect silence — and when we do reach you, it'll be worth it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={loading}
        className="input-field flex-1 text-sm disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="btn-gold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? (
          <span className="w-4 h-4 border border-obsidian-900 border-t-transparent rounded-full animate-spin" />
        ) : null}
        {loading ? 'Joining...' : 'Join Now'}
      </button>
    </form>
  );
}
