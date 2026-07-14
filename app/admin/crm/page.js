'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Download, X, ShoppingCart, Eye, Package, UserPlus, Loader as Loader2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import toast from 'react-hot-toast';

const EVENT_ICONS = {
  add_to_cart: ShoppingCart,
  product_view: Eye,
  order_placed: Package,
  signup: UserPlus,
};

const EVENT_LABELS = {
  add_to_cart: 'Added to Cart',
  product_view: 'Viewed Product',
  order_placed: 'Order Placed',
  signup: 'Account Created',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CRMPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  async function openCustomer(customer) {
    setSelectedCustomer(customer);
    setDetailLoading(true);
    setCustomerDetail(null);
    try {
      const res = await fetch(`/api/admin/customers/${customer._id}`);
      const data = await res.json();
      setCustomerDetail(data);
    } catch {
      toast.error('Failed to load customer details');
    } finally {
      setDetailLoading(false);
    }
  }

  function closePanel() {
    setSelectedCustomer(null);
    setCustomerDetail(null);
  }

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s)
    );
  });

  function exportCSV() {
    const headers = ['Name', 'Email', 'Joined', 'Orders', 'Lifetime Spend', 'Last Order'];
    const rows = filtered.map((c) => [
      `"${c.name || ''}"`,
      `"${c.email || ''}"`,
      `"${formatDate(c.createdAt)}"`,
      c.orderCount ?? 0,
      c.lifetimeSpend ?? 0,
      `"${formatDate(c.lastOrderDate)}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hop-customers-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} customers`);
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">CRM</p>
          <h1 className="font-serif text-3xl text-cream-100">Client Ledger</h1>
        </div>
        <button
          onClick={exportCSV}
          disabled={customers.length === 0}
          className="btn-outline-gold flex items-center gap-2 self-start sm:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="input-field pl-9"
        />
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
                  {['Customer', 'Joined', 'Orders', 'Lifetime Spend', 'Last Order'].map((h) => (
                    <th key={h} className="text-left text-xs tracking-widest uppercase text-obsidian-400 px-5 py-3 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-obsidian-400">
                      {search ? 'No customers match your search.' : 'No customers yet.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((customer) => (
                    <tr
                      key={customer._id}
                      onClick={() => openCustomer(customer)}
                      className="hover:bg-obsidian-700/50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <p className="text-cream-200 font-medium">{customer.name || '—'}</p>
                        <p className="text-xs text-obsidian-400 mt-0.5">{customer.email}</p>
                      </td>
                      <td className="px-5 py-4 text-obsidian-300 whitespace-nowrap">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-cream-200 tabular-nums">
                        {customer.orderCount ?? 0}
                      </td>
                      <td className="px-5 py-4 text-gold-400 tabular-nums font-medium whitespace-nowrap">
                        {formatCurrency(customer.lifetimeSpend ?? 0)}
                      </td>
                      <td className="px-5 py-4 text-obsidian-300 whitespace-nowrap">
                        {formatDate(customer.lastOrderDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Detail Sidebar */}
      {selectedCustomer && (
        <>
          <div
            className="fixed inset-0 bg-obsidian-900/60 z-30"
            onClick={closePanel}
          />
          <aside className="fixed top-0 right-0 h-full w-full sm:w-96 bg-obsidian-800 border-l border-obsidian-700 z-40 flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="px-6 py-4 border-b border-obsidian-700 flex items-start justify-between gap-4 flex-shrink-0">
              <div>
                <p className="font-serif text-lg text-cream-100">
                  {selectedCustomer.name || 'Unknown Customer'}
                </p>
                <p className="text-xs text-obsidian-400 mt-0.5">{selectedCustomer.email}</p>
              </div>
              <button onClick={closePanel} className="text-obsidian-400 hover:text-cream-200 transition-colors flex-shrink-0 mt-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Orders', value: selectedCustomer.orderCount ?? 0 },
                  { label: 'Lifetime Spend', value: formatCurrency(selectedCustomer.lifetimeSpend ?? 0) },
                  { label: 'Member Since', value: formatDate(selectedCustomer.createdAt) },
                  { label: 'Last Order', value: formatDate(selectedCustomer.lastOrderDate) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-obsidian-700 p-3">
                    <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">{label}</p>
                    <p className="text-sm text-cream-200 font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {/* Event Timeline */}
              {detailLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-gold-400 animate-spin" />
                </div>
              ) : (
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-4">Activity Timeline</p>
                  {(customerDetail?.events || []).length === 0 ? (
                    <p className="text-sm text-obsidian-400 text-center py-4">No activity recorded yet.</p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-obsidian-600" />
                      <div className="space-y-4">
                        {customerDetail.events.map((event, i) => {
                          const Icon = EVENT_ICONS[event.type] || ShoppingCart;
                          return (
                            <div key={i} className="relative flex gap-4 pl-10">
                              <div className="absolute left-0 w-8 h-8 rounded-full bg-obsidian-700 border border-obsidian-600 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-gold-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-cream-200">
                                  {EVENT_LABELS[event.type] || event.type}
                                </p>
                                {event.meta && (
                                  <p className="text-xs text-obsidian-400 mt-0.5 truncate">
                                    {typeof event.meta === 'string'
                                      ? event.meta
                                      : event.meta.productName || event.meta.orderId || JSON.stringify(event.meta)}
                                  </p>
                                )}
                                <p className="text-xs text-obsidian-500 mt-1">
                                  {formatDateTime(event.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
