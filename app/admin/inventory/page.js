'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import Image from 'next/image';
import { Plus, Search, CreditCard as Edit2, Archive, ToggleLeft, ToggleRight, X, ChevronDown, Tag, Loader as Loader2 } from 'lucide-react';
import { formatCurrency, slugify } from '../../../lib/utils';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['all', 'published', 'draft', 'archived'];
const STATUS_BADGES = {
  published: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  draft: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  archived: 'text-obsidian-400 bg-obsidian-700 border-obsidian-600',
};

const EMPTY_PRODUCT = {
  name: '',
  slug: '',
  category: '',
  collection: '',
  price: '',
  salePrice: '',
  status: 'draft',
  shortStory: '',
  story: '',
  fabricDetails: '',
  careInstructions: '',
  sizes: [{ label: 'S', stock: 0 }, { label: 'M', stock: 0 }, { label: 'L', stock: 0 }, { label: 'XL', stock: 0 }],
  images: [{ url: '', angle: 'front' }],
  tags: [],
};

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.collection?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openCreate() {
    setEditingProduct(null);
    setFormData({ ...EMPTY_PRODUCT });
    setTagInput('');
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || '',
      collection: product.collection || '',
      price: product.price?.toString() || '',
      salePrice: product.salePrice?.toString() || '',
      status: product.status || 'draft',
      shortStory: product.shortStory || '',
      story: product.story || '',
      fabricDetails: product.fabricDetails || '',
      careInstructions: product.careInstructions || '',
      sizes: product.sizes?.length ? product.sizes : EMPTY_PRODUCT.sizes,
      images: product.images?.length ? product.images : [{ url: '', angle: 'front' }],
      tags: product.tags || [],
    });
    setTagInput('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setFormData({ ...EMPTY_PRODUCT });
  }

  function updateForm(field, value) {
    setFormData((f) => ({ ...f, [field]: value }));
  }

  function handleNameChange(value) {
    setFormData((f) => ({
      ...f,
      name: value,
      slug: editingProduct ? f.slug : slugify(value),
    }));
  }

  // Sizes
  function addSize() {
    setFormData((f) => ({ ...f, sizes: [...f.sizes, { label: '', stock: 0 }] }));
  }
  function removeSize(i) {
    setFormData((f) => ({ ...f, sizes: f.sizes.filter((_, idx) => idx !== i) }));
  }
  function updateSize(i, field, value) {
    setFormData((f) => ({
      ...f,
      sizes: f.sizes.map((s, idx) =>
        idx === i ? { ...s, [field]: field === 'stock' ? Number(value) : value } : s
      ),
    }));
  }

  // Images
  function addImage() {
    setFormData((f) => ({ ...f, images: [...f.images, { url: '', angle: 'front' }] }));
  }
  function removeImage(i) {
    setFormData((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  }
  function updateImage(i, field, value) {
    setFormData((f) => ({
      ...f,
      images: f.images.map((img, idx) => (idx === i ? { ...img, [field]: value } : img)),
    }));
  }

  // Tags
  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((f) => ({ ...f, tags: [...f.tags, tag] }));
    setTagInput('');
  }
  function removeTag(tag) {
    setFormData((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  async function handleSave() {
    if (!formData.name.trim()) { toast.error('Product name is required'); return; }
    if (!formData.price || isNaN(Number(formData.price))) { toast.error('Valid price is required'); return; }

    setSaving(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      images: formData.images.filter((img) => img.url.trim()),
    };

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Save failed');
      }
      toast.success(editingProduct ? 'Product updated' : 'Product created');
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(product) {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, status: newStatus } : p))
      );
      toast.success(`Product ${newStatus}`);
    } catch {
      toast.error('Status update failed');
    }
  }

  async function handleArchive(product) {
    if (!confirm(`Archive "${product.name}"? It will be hidden from the storefront.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      if (!res.ok) throw new Error('Archive failed');
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, status: 'archived' } : p))
      );
      toast.success('Product archived');
    } catch {
      toast.error('Archive failed');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">Inventory</p>
          <h1 className="font-serif text-3xl text-cream-100">The Vault</h1>
        </div>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field appearance-none pr-8 cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-obsidian-400 pointer-events-none" />
        </div>
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
                  {['Product', 'Category', 'Price', 'Sizes & Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs tracking-widest uppercase text-obsidian-400 px-5 py-3 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-obsidian-400 text-sm">
                      {search || statusFilter !== 'all' ? 'No products match your filters.' : 'No products yet. Add your first product.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    const image = product.images?.[0]?.url;
                    const statusStyle = STATUS_BADGES[product.status] || STATUS_BADGES.draft;
                    return (
                      <tr key={product._id} className="hover:bg-obsidian-700/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-14 bg-obsidian-700 flex-shrink-0 overflow-hidden">
                              {image ? (
                                <Image src={image} alt={product.name} fill className="object-cover" sizes="40px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-obsidian-500 text-xs">No img</div>
                              )}
                            </div>
                            <div>
                              <p className="text-cream-200 font-medium truncate max-w-[160px]">{product.name}</p>
                              <p className="text-xs text-obsidian-400 mt-0.5">{product.collection}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-obsidian-300">{product.category}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-gold-400 font-medium tabular-nums">
                            {formatCurrency(product.salePrice || product.price)}
                          </p>
                          {product.salePrice && product.salePrice < product.price && (
                            <p className="text-xs text-obsidian-400 line-through tabular-nums">
                              {formatCurrency(product.price)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(product.sizes || []).map((s) => (
                              <span
                                key={s.label}
                                className={`text-xs px-1.5 py-0.5 border ${
                                  s.stock <= 3
                                    ? 'text-red-400 border-red-400/30 bg-red-400/10'
                                    : 'text-obsidian-300 border-obsidian-600'
                                }`}
                              >
                                {s.label}:{s.stock}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs border tracking-wide ${statusStyle}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(product)}
                              className="text-obsidian-400 hover:text-gold-400 transition-colors p-1"
                              title={product.status === 'published' ? 'Set to Draft' : 'Publish'}
                            >
                              {product.status === 'published' ? (
                                <ToggleRight className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openEdit(product)}
                              className="text-obsidian-400 hover:text-gold-400 transition-colors p-1"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleArchive(product)}
                              className="text-obsidian-400 hover:text-red-400 transition-colors p-1"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* ── Product Form Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          <div className="absolute inset-0 bg-obsidian-900/90" onClick={closeModal} />
          <div className="relative z-10 bg-obsidian-800 border border-obsidian-700 w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-obsidian-800 border-b border-obsidian-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-serif text-xl text-cream-100">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-obsidian-400 hover:text-cream-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Product Name *</label>
                <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="input-field" placeholder="The Sovereign Suit" />
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => updateForm('slug', e.target.value)} className="input-field font-mono text-xs" placeholder="the-sovereign-suit" />
              </div>

              {/* Category & Collection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => updateForm('category', e.target.value)} className="input-field" placeholder="Suits" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Collection</label>
                  <input type="text" value={formData.collection} onChange={(e) => updateForm('collection', e.target.value)} className="input-field" placeholder="Executive AW25" />
                </div>
              </div>

              {/* Price & Sale Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Price (₹) *</label>
                  <input type="number" value={formData.price} onChange={(e) => updateForm('price', e.target.value)} className="input-field" placeholder="12999" min="0" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Sale Price (₹)</label>
                  <input type="number" value={formData.salePrice} onChange={(e) => updateForm('salePrice', e.target.value)} className="input-field" placeholder="Optional" min="0" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Status</label>
                <select value={formData.status} onChange={(e) => updateForm('status', e.target.value)} className="input-field appearance-none cursor-pointer">
                  {['draft', 'published', 'archived'].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Short Story */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Short Story</label>
                <textarea value={formData.shortStory} onChange={(e) => updateForm('shortStory', e.target.value)} rows={2} className="input-field resize-none" placeholder="One-liner for product card" />
              </div>

              {/* Story */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Full Story</label>
                <textarea value={formData.story} onChange={(e) => updateForm('story', e.target.value)} rows={4} className="input-field resize-none" placeholder="Product description / editorial copy" />
              </div>

              {/* Fabric & Care */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Fabric Details</label>
                  <textarea value={formData.fabricDetails} onChange={(e) => updateForm('fabricDetails', e.target.value)} rows={2} className="input-field resize-none" placeholder="100% Super 120s Wool..." />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Care Instructions</label>
                  <textarea value={formData.careInstructions} onChange={(e) => updateForm('careInstructions', e.target.value)} rows={2} className="input-field resize-none" placeholder="Dry clean only..." />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs tracking-widest uppercase text-obsidian-400">Sizes &amp; Stock</label>
                  <button type="button" onClick={addSize} className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Size
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.sizes.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" value={s.label} onChange={(e) => updateSize(i, 'label', e.target.value)} placeholder="Size" className="input-field w-20 text-center text-xs" />
                      <input type="number" value={s.stock} onChange={(e) => updateSize(i, 'stock', e.target.value)} placeholder="Stock" className="input-field flex-1 text-xs" min="0" />
                      <button type="button" onClick={() => removeSize(i)} className="text-obsidian-400 hover:text-red-400 transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs tracking-widest uppercase text-obsidian-400">Images</label>
                  <button type="button" onClick={addImage} className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Image
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" value={img.url} onChange={(e) => updateImage(i, 'url', e.target.value)} placeholder="Image URL" className="input-field flex-1 text-xs" />
                      <input type="text" value={img.angle} onChange={(e) => updateImage(i, 'angle', e.target.value)} placeholder="Angle" className="input-field w-24 text-xs" />
                      <button type="button" onClick={() => removeImage(i)} className="text-obsidian-400 hover:text-red-400 transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="Add tag and press Enter"
                    className="input-field flex-1 text-xs"
                  />
                  <button type="button" onClick={addTag} className="btn-outline-gold px-3 py-2 text-xs">
                    <Tag className="w-3.5 h-3.5" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-obsidian-700 text-cream-300 border border-obsidian-600">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-obsidian-400 hover:text-red-400 transition-colors">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-obsidian-800 border-t border-obsidian-700 px-6 py-4 flex gap-3 justify-end">
              <button onClick={closeModal} disabled={saving} className="btn-outline-gold disabled:opacity-40">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-40">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
