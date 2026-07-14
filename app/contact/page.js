'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = [
  { value: '', label: 'Select a subject' },
  { value: 'general', label: 'General Enquiry' },
  { value: 'order', label: 'Order Issue' },
  { value: 'press', label: 'Press & Media' },
  { value: 'partnership', label: 'Partnership Proposal' },
  { value: 'feedback', label: 'Feedback' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.subject) return 'Please select a subject.';
    if (!form.message.trim() || form.message.trim().length < 10) return 'Please enter a message (at least 10 characters).';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSending(true);
    // Simulate send delay
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    toast.success("We've received your message. Our team will respond within 24 hours.");
  }

  return (
    <div className="bg-obsidian-900">

      {/* ── Hero ── */}
      <section className="py-32 px-4 text-center border-b border-obsidian-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(135deg, #D4AF37 25%, transparent 25%, transparent 50%, #D4AF37 50%, #D4AF37 75%, transparent 75%, transparent)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs tracking-ultra uppercase text-gold-400 mb-6">Get in Touch</p>
          <h1 className="font-serif text-6xl md:text-8xl text-cream-100 leading-none mb-6">
            Contact <span className="text-gold-gradient italic">Us</span>
          </h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-obsidian-300 leading-relaxed">
            We are a small team of devoted craftspeople and storytellers. Every message is read. Most are answered within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Contact Form ── */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Send a Message</p>
            <h2 className="font-serif text-3xl text-cream-100 mb-2">Let's Talk</h2>
            <div className="gold-divider mb-8" />

            {sent ? (
              <div className="bg-obsidian-800 border border-gold-400/30 p-10 text-center">
                <div className="w-16 h-16 rounded-full border border-gold-400 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-cream-100 mb-3">Message Received</h3>
                <p className="text-obsidian-300 text-sm leading-relaxed">
                  We've received your message. Our team will respond within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-outline-gold mt-8 inline-block"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                    Full Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Your name"
                    disabled={sending}
                    className="input-field disabled:opacity-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                    Email Address <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your@email.com"
                    disabled={sending}
                    className="input-field disabled:opacity-50"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                    Subject <span className="text-gold-400">*</span>
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    disabled={sending}
                    className="input-field appearance-none cursor-pointer disabled:opacity-50"
                  >
                    {SUBJECTS.map(({ value, label }) => (
                      <option key={value} value={value} disabled={value === ''}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                    Message <span className="text-gold-400">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    disabled={sending}
                    className="input-field resize-none disabled:opacity-50"
                  />
                  <p className="text-xs text-obsidian-500 mt-1 text-right">
                    {form.message.length} characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-gold flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <span className="w-4 h-4 border border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* ── Contact Details ── */}
          <div className="space-y-10">
            <div>
              <p className="text-xs tracking-widest uppercase text-gold-400 mb-6">Our Details</p>
              <h2 className="font-serif text-3xl text-cream-100 mb-2">Reach Us</h2>
              <div className="gold-divider mb-8" />

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-obsidian-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">Email</p>
                    <a
                      href="mailto:houseofpolitics@gmail.com"
                      className="text-cream-200 hover:text-gold-400 transition-colors text-sm"
                    >
                      houseofpolitics@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-obsidian-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">Phone</p>
                    <a
                      href="tel:+919876543210"
                      className="text-cream-200 hover:text-gold-400 transition-colors text-sm"
                    >
                      +91 98765 43210
                    </a>
                    <p className="text-xs text-obsidian-400 mt-0.5">Mon–Sat, 10 AM – 7 PM IST</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-obsidian-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">Address</p>
                    <p className="text-cream-200 text-sm leading-relaxed">
                      House of Politics HQ
                      <br />
                      Connaught Place, New Delhi
                      <br />
                      India — 110001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="bg-obsidian-800 border border-obsidian-700 p-6">
              <h3 className="font-serif text-lg text-cream-100 mb-3">Response Times</h3>
              <div className="space-y-2">
                {[
                  { type: 'General Enquiry', time: '< 24 hours' },
                  { type: 'Order Issues', time: '< 12 hours' },
                  { type: 'Press & Media', time: '< 48 hours' },
                  { type: 'Partnerships', time: '2–5 business days' },
                ].map(({ type, time }) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="text-obsidian-300">{type}</span>
                    <span className="text-gold-400 text-xs tracking-wide">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Press / Media Section */}
            <div className="bg-obsidian-800 border border-obsidian-700 p-6">
              <p className="text-xs tracking-widest uppercase text-gold-400 mb-3">Press &amp; Media</p>
              <h3 className="font-serif text-lg text-cream-100 mb-3">For Journalists &amp; Editors</h3>
              <p className="text-obsidian-300 text-sm leading-relaxed mb-5">
                Our press kit includes high-resolution imagery, brand guidelines, founder bios,
                and collection notes. Available to verified media outlets only.
              </p>
              <button
                disabled
                className="btn-outline-gold flex items-center gap-2 opacity-50 cursor-not-allowed"
                title="Media kit coming soon"
              >
                <Download className="w-3.5 h-3.5" />
                Download Media Kit
                <span className="text-xs text-obsidian-400 normal-case font-normal tracking-normal ml-1">
                  (Coming Soon)
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
