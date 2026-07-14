'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ToggleLeft, ToggleRight, X, Loader as Loader2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import toast from 'react-hot-toast';

const EMPTY_COUPON = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderValue: '',
  expiryDate: '',
  usageLimit: '',
  active: true,
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isExpired(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_COUPON);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCoupons = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/coupons')
      .then((r) => r.json())
      .then((d) => setCoupons(d.coupons || []))
      .catch(() => toast.error('Failed to load coupons'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  function openCreate() {
    setFormData({ ...EMPTY_COUPON });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormData({ ...EMPTY_COUPON });
  }

  function updateForm(field, value) {
    setFormData((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    if (!formData.code.trim()) return 'Coupon code is required';
    if (!formData.discountValue || isNaN(Number(formData.discountValue)) || Number(formData.discountValue) <= 0) {
      return 'Valid discount value is required';
    }
    if (formData.discountType === 'percentage' && Number(formData.discountValue) > 100) {
      return 'Percentage discount cannot exceed 100%';
    }
    return null;
  }

  async function handleCreate() {
    const err = validate();
    if (err) { toast.error(err); return; }

    setSaving(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
        expiryDate: formData.expiryDate || null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        active: formData.active,
      };
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create coupon');
      }
      toast.success('Coupon created');
      closeModal();
      fetchCoupons();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(coupon) {
    setTogglingId(coupon._id);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (!res.ok) throw new Error('Update failed');
      setCoupons((prev) =>
        prev.map((c) => (c._id === coupon._id ? { ...c, active: !c.active } : c))
      );
      toast.success(coupon.active ? 'Coupon deactivated' : 'Coupon activated');
    } catch {
      toast.error('Update failed');
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">Promotions</p>
          <h1 className="font-serif text-3xl text-cream-100">Coupons</h1>
        </div>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          Create Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-obsidian-800 border border-obsidian-700 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obsidian-700">
                  {['Code', 'Type', 'Value', 'Min Order', 'Expiry', 'Usage', 'Status', 'Toggle'].map((h) => (
                    <th key={h} className="text-left text-xs tracking-widest uppercase text-obsidian-400 px-5 py-3 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-700">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-obsidian-400">
                      No coupons yet. Create your first one.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const expired = isExpired(coupon.expiryDate);
                    const statusLabel = !coupon.active ? 'Inactive' : expired ? 'Expired' : 'Active';
                    const statusStyle = coupon.active && !expired
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
                      : 'text-obsidian-400 bg-obsidian-700 border-obsidian-600';

                    return (
                      <tr key={coupon._id} className="hover:bg-obsidian-700/40 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-gold-400 text-xs tracking-widest font-medium">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-obsidian-300 capitalize">
                          {coupon.discountType === 'percentage' ? 'Percentage' : 'Flat Amount'}
                        </td>
                        <td className="px-5 py-4 text-cream-200 font-medium tabular-nums whitespace-nowrap">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : formatCurrency(coupon.discountValue)}
                        </td>
                        <td className="px-5 py-4 text-obsidian-300 tabular-nums whitespace-nowrap">
                          {coupon.minOrderValue > 0 ? formatCurrency(coupon.minOrderValue) : '—'}
                        </td>
                        <td className={`px-5 py-4 whitespace-nowrap ${expired ? 'text-red-400' : 'text-obsidian-300'}`}>
                          {formatDate(coupon.expiryDate)}
                        </td>
                        <td className="px-5 py-4 text-obsidian-300 tabular-nums whitespace-nowrap">
                          {coupon.usageCount ?? 0}
                          {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' / ∞'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs border tracking-wide ${statusStyle}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            disabled={togglingId === coupon._id}
                            className="text-obsidian-400 hover:text-gold-400 transition-colors disabled:opacity-40"
                            title={coupon.active ? 'Deactivate' : 'Activate'}
                          >
                            {togglingId === coupon._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : coupon.active ? (
                              <ToggleRight className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          <div className="absolute inset-0 bg-obsidian-900/90" onClick={closeModal} />
          <div className="relative z-10 bg-obsidian-800 border border-obsidian-700 w-full max-w-lg mx-4 my-16">
            {/* Header */}
            <div className="px-6 py-4 border-b border-obsidian-700 flex items-center justify-between">
              <h2 className="font-serif text-xl text-cream-100">Create Coupon</h2>
              <button onClick={closeModal} className="text-obsidian-400 hover:text-cream-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => updateForm('code', e.target.value.toUpperCase())}
                  placeholder="POWER25"
                  className="input-field font-mono tracking-widest uppercase text-sm"
                  maxLength={20}
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                  Discount Type *
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'flat', label: 'Flat Amount (₹)' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateForm('discountType', value)}
                      className={`flex-1 py-3 text-xs tracking-widest uppercase border transition-colors
                        ${formData.discountType === value
                          ? 'border-gold-400 text-gold-400 bg-gold-400/5'
                          : 'border-obsidian-600 text-obsidian-400 hover:border-obsidian-500'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Value */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                  Discount Value *{' '}
                  {formData.discountType === 'percentage' ? '(1–100)' : '(₹)'}
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => updateForm('discountValue', e.target.value)}
                  placeholder={formData.discountType === 'percentage' ? '25' : '500'}
                  className="input-field"
                  min="1"
                  max={formData.discountType === 'percentage' ? 100 : undefined}
                />
              </div>

              {/* Min Order */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) => updateForm('minOrderValue', e.target.value)}
                  placeholder="1000 (optional)"
                  className="input-field"
                  min="0"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => updateForm('expiryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => updateForm('usageLimit', e.target.value)}
                  placeholder="Unlimited if empty"
                  className="input-field"
                  min="1"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateForm('active', !formData.active)}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors
                    ${formData.active ? 'bg-gold-400 border-gold-400' : 'border-obsidian-500 bg-transparent'}`}
                  role="checkbox"
                  aria-checked={formData.active}
                >
                  {formData.active && (
                    <svg className="w-2.5 h-2.5 text-obsidian-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-obsidian-300">Activate coupon immediately</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-obsidian-700 flex gap-3 justify-end">
              <button onClick={closeModal} disabled={saving} className="btn-outline-gold disabled:opacity-40">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-40">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
