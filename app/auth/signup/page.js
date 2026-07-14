'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader as Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function SignUpForm() {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      toast.success('Account created! Signing you in…');

      const signInResult = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      setLoading(false);

      if (signInResult?.error) {
        setError('Account created but sign-in failed. Please sign in manually.');
        router.push('/auth/signin');
      } else {
        router.push('/account');
      }
    } catch {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-obsidian-800 border border-obsidian-700 p-10 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-400 mb-2">
            House of Politics
          </p>
          <h1 className="font-serif text-3xl text-cream-100 mb-1">Create Account</h1>
          <div className="gold-divider mx-auto mt-4" />
          <p className="font-sans text-xs text-obsidian-400 mt-4">
            Join the House. Dress like power.
          </p>
        </div>

        {/* Error */}
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
          {/* Name */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              required
              className="input-field"
            />
          </div>

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
                placeholder="Min. 8 characters"
                autoComplete="new-password"
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
            {/* Strength indicator */}
            {form.password.length > 0 && (
              <p
                className={`font-sans text-xs mt-1.5 ${
                  form.password.length >= 8 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {form.password.length >= 8
                  ? '✓ Password strength: Good'
                  : '✗ Password too short'}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-gold-400 transition-colors"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Match indicator */}
            {form.confirm.length > 0 && (
              <p
                className={`font-sans text-xs mt-1.5 ${
                  form.password === form.confirm ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating Account&hellip;
              </>
            ) : (
              'Create Account'
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

        {/* Sign In Link */}
        <p className="font-sans text-xs text-obsidian-400 text-center">
          Already a member?{' '}
          <Link
            href="/auth/signin"
            className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors"
          >
            Sign in to your account
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

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center px-4 py-20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-gold-400" />
          </div>
        }
      >
        <SignUpForm />
      </Suspense>
    </div>
  );
}
