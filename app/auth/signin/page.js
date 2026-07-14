'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader as Loader2 } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      {/* Card */}
      <div className="bg-obsidian-800 border border-obsidian-700 p-10 md:p-12">
        {/* Logo / Wordmark */}
        <div className="text-center mb-10">
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-400 mb-2">
            House of Politics
          </p>
          <h1 className="font-serif text-3xl text-cream-100 mb-1">Welcome Back</h1>
          <div className="gold-divider mx-auto mt-4" />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-800 text-red-300 font-sans text-xs px-4 py-3 mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoComplete="email"
              required
              className="input-field"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-gold-400 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Signing In&hellip;
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-obsidian-700" />
          <span className="font-sans text-[10px] tracking-widest uppercase text-obsidian-500">
            Or
          </span>
          <div className="flex-1 h-px bg-obsidian-700" />
        </div>

        {/* Sign Up Link */}
        <p className="font-sans text-xs text-obsidian-400 text-center">
          New to House of Politics?{' '}
          <Link
            href="/auth/signup"
            className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Guest Link */}
      <p className="text-center mt-6">
        <Link
          href="/"
          className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-500 hover:text-gold-400 transition-colors"
        >
          ← Continue as Guest
        </Link>
      </p>
    </motion.div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center px-4 py-20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-gold-400" />
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
