'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin, Package, Tag, X, CircleAlert as AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 149;

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);

  // Shipping form
  const [shippingForm, setShippingForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [submittingShipping, setSubmittingShipping] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Order placement
  const [placingOrder, setPlacingOrder] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Redirect if cart empty
  useEffect(() => {
    if (status === 'authenticated' && items.length === 0) {
      router.push('/cart');
    }
  }, [items, status, router]);

  // Pre-fill from profile
  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoadingProfile(true);
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        const u = data.user || {};
        const addr = u.address || {};
        setShippingForm({
          name: u.name || session?.user?.name || '',
          phone: u.phone || '',
          addressLine1: addr.line1 || '',
          addressLine2: addr.line2 || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
        });
      })
      .catch(() => {
        setShippingForm((f) => ({
          ...f,
          name: session?.user?.name || '',
        }));
      })
      .finally(() => setLoadingProfile(false));
  }, [status, session]);

  // Derived pricing
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = discountedSubtotal + shipping;

  function updateField(field, value) {
    setShippingForm((f) => ({ ...f, [field]: value }));
  }

  function validateShipping() {
    const { name, phone, addressLine1, city, state, pincode } = shippingForm;
    if (!name.trim()) return 'Full name is required';
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) return 'Enter a valid 10-digit phone number';
    if (!addressLine1.trim()) return 'Address Line 1 is required';
    if (!city.trim()) return 'City is required';
    if (!state) return 'State is required';
    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) return 'Enter a valid 6-digit pincode';
    return null;
  }

  async function handleContinue() {
    const err = validateShipping();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmittingShipping(true);
    try {
      if (saveAddress) {
        await fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: {
              line1: shippingForm.addressLine1,
              line2: shippingForm.addressLine2,
              city: shippingForm.city,
              state: shippingForm.state,
              pincode: shippingForm.pincode,
            },
            phone: shippingForm.phone,
          }),
        });
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmittingShipping(false);
    }
  }

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), orderValue: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');
      setAppliedCoupon({ ...data.coupon, code: couponCode.trim().toUpperCase() });
      const saved =
        data.coupon.type === 'percentage'
          ? Math.round((subtotal * data.coupon.value) / 100)
          : data.coupon.value;
      toast.success(`Coupon applied — ${formatCurrency(saved)} off`);
    } catch (err) {
      toast.error(err.message);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }

  async function handlePlaceOrder() {
    setPlacingOrder(true);
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            name: shippingForm.name,
            phone: shippingForm.phone,
            line1: shippingForm.addressLine1,
            line2: shippingForm.addressLine2,
            city: shippingForm.city,
            state: shippingForm.state,
            pincode: shippingForm.pincode,
          },
          couponCode: appliedCoupon?.code || null,
          subtotal,
          discount,
          shipping,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      toast('Payment gateway coming soon. Order saved as pending.', {
        icon: '🕐',
        duration: 5000,
      });
      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacingOrder(false);
    }
  }

  if (status === 'loading' || loadingProfile) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs tracking-widest uppercase text-obsidian-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 pt-16 pb-24">
      {/* Header */}
      <div className="border-b border-obsidian-700 pb-8 mb-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-3">Secure Checkout</p>
        <h1 className="font-serif text-4xl md:text-5xl text-cream-100">Checkout</h1>
        <div className="gold-divider mt-4 mb-0" />

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${step >= 1 ? 'bg-gold-400 text-obsidian-900' : 'bg-obsidian-700 text-obsidian-400'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`text-xs tracking-widest uppercase ${step >= 1 ? 'text-cream-200' : 'text-obsidian-500'}`}>
              Shipping
            </span>
          </div>
          <ChevronRight className="w-3 h-3 text-obsidian-600" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${step >= 2 ? 'bg-gold-400 text-obsidian-900' : 'bg-obsidian-700 text-obsidian-400'}`}>
              2
            </div>
            <span className={`text-xs tracking-widest uppercase ${step >= 2 ? 'text-cream-200' : 'text-obsidian-500'}`}>
              Review &amp; Pay
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* STEP 1: Shipping */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <h2 className="font-serif text-2xl text-cream-100">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                      Full Name <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingForm.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="As on shipping label"
                      className="input-field"
                    />
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                      Phone Number <span className="text-gold-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center border border-obsidian-600 px-3 bg-obsidian-800 text-cream-300 text-sm flex-shrink-0">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="input-field flex-1"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                      Address Line 1 <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingForm.addressLine1}
                      onChange={(e) => updateField('addressLine1', e.target.value)}
                      placeholder="House no., Street, Area"
                      className="input-field"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                      Address Line 2 <span className="text-obsidian-500 normal-case text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={shippingForm.addressLine2}
                      onChange={(e) => updateField('addressLine2', e.target.value)}
                      placeholder="Landmark, Apartment, Suite"
                      className="input-field"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                      City <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingForm.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Mumbai"
                      className="input-field"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                      PIN Code <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingForm.pincode}
                      onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="400001"
                      className="input-field"
                      maxLength={6}
                    />
                  </div>

                  {/* State */}
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">
                      State <span className="text-gold-400">*</span>
                    </label>
                    <select
                      value={shippingForm.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save Address Checkbox */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setSaveAddress((v) => !v)}
                    className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors
                      ${saveAddress ? 'bg-gold-400 border-gold-400' : 'border-obsidian-500 bg-transparent'}`}
                    aria-checked={saveAddress}
                    role="checkbox"
                  >
                    {saveAddress && (
                      <svg className="w-2.5 h-2.5 text-obsidian-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-obsidian-300">Save this address to my profile</span>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={submittingShipping}
                  className="btn-gold mt-8 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {submittingShipping ? (
                    <span className="w-4 h-4 border border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  Continue to Review
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Package className="w-4 h-4 text-gold-400" />
                  <h2 className="font-serif text-2xl text-cream-100">Review Your Order</h2>
                </div>

                {/* Items */}
                <div className="mb-8">
                  <h3 className="text-xs tracking-widest uppercase text-obsidian-400 mb-4">Items</h3>
                  <div className="divide-y divide-obsidian-700 border-t border-b border-obsidian-700">
                    {items.map((item) => {
                      const product = item.product;
                      if (!product) return null;
                      const price = product.salePrice ?? product.price ?? 0;
                      const image = product.images?.[0]?.url || 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200';

                      return (
                        <div key={`${product._id}-${item.size}`} className="flex items-center gap-4 py-4">
                          <div className="relative w-14 h-18 flex-shrink-0 bg-obsidian-700 overflow-hidden" style={{ height: '4.5rem' }}>
                            <Image src={image} alt={product.name} fill className="object-cover object-top" sizes="56px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-base text-cream-100 truncate">{product.name}</p>
                            <p className="text-xs text-obsidian-400 mt-0.5">
                              Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm text-gold-400 tabular-nums flex-shrink-0">
                            {formatCurrency(price * item.quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-obsidian-800 border border-obsidian-700 p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs tracking-widest uppercase text-obsidian-400">Delivering To</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-gold-400 hover:text-gold-300 transition-colors tracking-wide uppercase"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-cream-100 font-medium">{shippingForm.name}</p>
                  <p className="text-sm text-obsidian-300 mt-1">+91 {shippingForm.phone}</p>
                  <p className="text-sm text-obsidian-300 mt-1">
                    {shippingForm.addressLine1}
                    {shippingForm.addressLine2 && `, ${shippingForm.addressLine2}`}
                  </p>
                  <p className="text-sm text-obsidian-300">
                    {shippingForm.city}, {shippingForm.state} – {shippingForm.pincode}
                  </p>
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  <h3 className="text-xs tracking-widest uppercase text-obsidian-400 mb-3">Coupon Code</h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-obsidian-800 border border-gold-800 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-gold-400" />
                        <span className="text-xs tracking-widest uppercase text-gold-400 font-medium">{appliedCoupon.code}</span>
                        <span className="text-xs text-obsidian-300">
                          {appliedCoupon.type === 'percentage' ? `(${appliedCoupon.value}% off)` : `(${formatCurrency(appliedCoupon.value)} off)`}
                        </span>
                      </div>
                      <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-obsidian-400 hover:text-cream-200">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="ENTER COUPON CODE"
                        className="input-field flex-1 text-xs tracking-widest"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="btn-outline-gold px-4 py-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {couponLoading ? (
                          <span className="inline-block w-3 h-3 border border-gold-400 border-t-transparent rounded-full animate-spin" />
                        ) : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Notice */}
                <div className="bg-obsidian-800 border border-obsidian-600 p-4 mb-6 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-obsidian-300 leading-relaxed">
                    Payment integration coming soon — your order will be saved with status{' '}
                    <span className="text-gold-400 font-medium">'Pending Payment'</span>. Our team will
                    confirm your order manually.
                  </p>
                </div>

                {/* Place Order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {placingOrder ? (
                    <span className="w-4 h-4 border border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Price Summary ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8 bg-obsidian-800 border border-obsidian-700 p-6">
              <h3 className="font-serif text-lg text-cream-100 mb-5">Price Details</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-300">
                    Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-cream-200 tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Coupon Discount</span>
                    <span className="text-emerald-400 tabular-nums">− {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-300">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-gold-400 text-xs tracking-widest uppercase font-medium">Free</span>
                  ) : (
                    <span className="text-cream-200 tabular-nums">{formatCurrency(shipping)}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-obsidian-700 mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-serif text-lg text-cream-100">Total</span>
                <span className="font-serif text-2xl text-gold-400 tabular-nums">{formatCurrency(total)}</span>
              </div>

              {discount > 0 && (
                <p className="text-xs text-emerald-400 mt-3 text-right">
                  You save {formatCurrency(discount)} on this order
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
