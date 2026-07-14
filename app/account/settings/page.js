'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Loader as Loader2, Plus, Pencil, Trash2, X, Check, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_ADDRESS = {
  label: 'Home',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pin: '',
  phone: '',
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Personal Info
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/settings');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        const user = data.user || data;
        setProfile({ name: user.name || '', phone: user.phone || '' });
        setAddresses(user.addresses || []);
        setProfileLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load profile.');
        setProfileLoading(false);
      });
  }, [status]);

  async function saveProfile(e) {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name.trim(), phone: profile.phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile.');
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile.');
    } finally {
      setProfileSaving(false);
    }
  }

  function openAddAddress() {
    setEditingIndex(null);
    setAddressForm({ ...EMPTY_ADDRESS });
    setShowAddressModal(true);
  }

  function openEditAddress(idx) {
    setEditingIndex(idx);
    setAddressForm({ ...addresses[idx] });
    setShowAddressModal(true);
  }

  async function saveAddress(e) {
    e.preventDefault();
    setAddressSaving(true);

    const newAddresses =
      editingIndex !== null
        ? addresses.map((a, i) => (i === editingIndex ? { ...addressForm } : a))
        : [...addresses, { ...addressForm }];

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: newAddresses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save address.');
      const user = data.user || data;
      setAddresses(user.addresses || newAddresses);
      setShowAddressModal(false);
      toast.success(editingIndex !== null ? 'Address updated.' : 'Address added.');
    } catch (err) {
      toast.error(err.message || 'Failed to save address.');
    } finally {
      setAddressSaving(false);
    }
  }

  async function deleteAddress(idx) {
    const newAddresses = addresses.filter((_, i) => i !== idx);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: newAddresses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove address.');
      const user = data.user || data;
      setAddresses(user.addresses || newAddresses);
      toast.success('Address removed.');
    } catch (err) {
      toast.error(err.message || 'Failed to remove address.');
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-obsidian-900 py-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/account"
            className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-400 hover:text-gold-400 transition-colors flex items-center gap-1 mb-6"
          >
            <ChevronLeft size={12} />
            My Account
          </Link>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-400 mb-2">
            My Account
          </p>
          <h1 className="font-serif text-4xl text-cream-100 mb-2">Account Settings</h1>
          <div className="gold-divider" />
        </div>

        {profileLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-gold-400" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* ── Section 1: Personal Information ── */}
            <section className="bg-obsidian-800 border border-obsidian-700 p-6 md:p-8">
              <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-obsidian-400 mb-6">
                Personal Information
              </h2>
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Your full name"
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 98765 43210"
                      className="input-field"
                    />
                  </div>
                </div>
                {/* Email (read-only) */}
                <div>
                  <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="input-field opacity-40 cursor-not-allowed"
                  />
                  <p className="font-sans text-[10px] text-obsidian-500 mt-1.5">
                    Email address cannot be changed.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="btn-gold flex items-center gap-2"
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving&hellip;
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* ── Section 2: Saved Addresses ── */}
            <section className="bg-obsidian-800 border border-obsidian-700 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-obsidian-400">
                  Saved Addresses
                </h2>
                <button
                  onClick={openAddAddress}
                  className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.2em] uppercase text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <Plus size={12} />
                  Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-obsidian-700">
                  <p className="font-sans text-sm text-obsidian-500 mb-4">
                    No saved addresses yet.
                  </p>
                  <button onClick={openAddAddress} className="btn-outline-gold">
                    Add an Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr, i) => (
                    <div
                      key={i}
                      className="border border-obsidian-700 p-4 relative group hover:border-obsidian-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold-400 bg-gold-400/10 border border-gold-400/20 px-2 py-0.5">
                          {addr.label || 'Address'}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditAddress(i)}
                            aria-label="Edit address"
                            className="text-obsidian-400 hover:text-gold-400 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteAddress(i)}
                            aria-label="Delete address"
                            className="text-obsidian-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="font-sans text-sm text-cream-200 space-y-0.5">
                        {addr.phone && (
                          <p className="text-xs text-obsidian-400">{addr.phone}</p>
                        )}
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        }
                        <p>
                          {addr.city}, {addr.state} {addr.pin}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Section 3: Change Password (Coming Soon) ── */}
            <section className="bg-obsidian-800 border border-obsidian-700 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-obsidian-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock size={16} className="text-obsidian-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-obsidian-400 mb-2">
                    Change Password
                  </h2>
                  <p className="font-sans text-sm text-obsidian-400 leading-relaxed mb-4">
                    Password management is coming soon. Please contact our support team if you
                    need to reset your password.
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.2em] uppercase text-obsidian-500 border border-obsidian-700 px-3 py-1.5">
                    <Lock size={10} />
                    Coming Soon
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ── Address Modal ── */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/85 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddressModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-obsidian-800 border border-obsidian-700 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-cream-100">
                  {editingIndex !== null ? 'Edit Address' : 'Add Address'}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-obsidian-400 hover:text-cream-200 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={saveAddress} className="space-y-4">
                {/* Label */}
                <div>
                  <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                    Label
                  </label>
                  <select
                    value={addressForm.label}
                    onChange={(e) =>
                      setAddressForm((f) => ({ ...f, label: e.target.value }))
                    }
                    className="input-field bg-obsidian-700"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Line 1 */}
                <div>
                  <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={addressForm.line1}
                    onChange={(e) =>
                      setAddressForm((f) => ({ ...f, line1: e.target.value }))
                    }
                    placeholder="Street, building, floor"
                    required
                    className="input-field"
                  />
                </div>

                {/* Line 2 */}
                <div>
                  <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={addressForm.line2}
                    onChange={(e) =>
                      setAddressForm((f) => ({ ...f, line2: e.target.value }))
                    }
                    placeholder="Apartment, suite, etc. (optional)"
                    className="input-field"
                  />
                </div>

                {/* City + State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm((f) => ({ ...f, city: e.target.value }))
                      }
                      placeholder="Mumbai"
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm((f) => ({ ...f, state: e.target.value }))
                      }
                      placeholder="Maharashtra"
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                {/* PIN + Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={addressForm.pin}
                      onChange={(e) =>
                        setAddressForm((f) => ({ ...f, pin: e.target.value }))
                      }
                      placeholder="400001"
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-obsidian-300 block mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="+91 98765 43210"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="btn-gold flex items-center gap-2 flex-1 justify-center"
                  >
                    {addressSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving&hellip;
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        {editingIndex !== null ? 'Update Address' : 'Save Address'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="btn-outline-gold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
