'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, CreditCard as Edit2, ToggleLeft, ToggleRight, Star, X, Loader as Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_BADGES = {
  published: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  draft: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
};

const CATEGORIES = ['Style', 'Culture', 'Power', 'Politics', 'Craftsmanship', 'Opinion'];

const EMPTY_ARTICLE = {
  title: '',
  slug: '',
  category: '',
  body: '',
  excerpt: '',
  coverImage: '',
  readTime: '',
  featured: false,
  status: 'draft',
};

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function estimateReadTime(body) {
  const words = body?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function JournalPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState(EMPTY_ARTICLE);
  const [saving, setSaving] = useState(false);

  const fetchArticles = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/journal')
      .then((r) => r.json())
      .then((d) => setArticles(d.articles || []))
      .catch(() => toast.error('Failed to load articles'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  function openCreate() {
    setEditingArticle(null);
    setFormData({ ...EMPTY_ARTICLE });
    setModalOpen(true);
  }

  function openEdit(article) {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      category: article.category || '',
      body: article.body || '',
      excerpt: article.excerpt || '',
      coverImage: article.coverImage || '',
      readTime: article.readTime?.toString() || '',
      featured: article.featured ?? false,
      status: article.status || 'draft',
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingArticle(null);
    setFormData({ ...EMPTY_ARTICLE });
  }

  function updateForm(field, value) {
    setFormData((f) => ({ ...f, [field]: value }));
  }

  function handleTitleChange(value) {
    setFormData((f) => ({
      ...f,
      title: value,
      slug: editingArticle ? f.slug : slugify(value),
    }));
  }

  function handleBodyChange(value) {
    setFormData((f) => ({
      ...f,
      body: value,
      readTime: estimateReadTime(value).toString(),
    }));
  }

  async function handleSave() {
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    if (!formData.slug.trim()) { toast.error('Slug is required'); return; }

    setSaving(true);
    const payload = {
      ...formData,
      readTime: Number(formData.readTime) || estimateReadTime(formData.body),
    };

    try {
      const url = editingArticle ? `/api/admin/journal/${editingArticle._id}` : '/api/admin/journal';
      const method = editingArticle ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Save failed');
      }
      toast.success(editingArticle ? 'Article updated' : 'Article created');
      closeModal();
      fetchArticles();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(article) {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/journal/${article._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      setArticles((prev) =>
        prev.map((a) => (a._id === article._id ? { ...a, status: newStatus } : a))
      );
      toast.success(`Article ${newStatus}`);
    } catch {
      toast.error('Status update failed');
    }
  }

  async function handleToggleFeatured(article) {
    try {
      const res = await fetch(`/api/admin/journal/${article._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !article.featured }),
      });
      if (!res.ok) throw new Error('Update failed');
      setArticles((prev) =>
        prev.map((a) => (a._id === article._id ? { ...a, featured: !a.featured } : a))
      );
    } catch {
      toast.error('Featured update failed');
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-obsidian-400 mb-1">Editorial</p>
          <h1 className="font-serif text-3xl text-cream-100">Journal</h1>
        </div>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          New Article
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
                  {['Title', 'Category', 'Status', 'Date', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs tracking-widest uppercase text-obsidian-400 px-5 py-3 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-700">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-obsidian-400">
                      No articles yet. Create your first piece.
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => {
                    const statusStyle = STATUS_BADGES[article.status] || STATUS_BADGES.draft;
                    return (
                      <tr key={article._id} className="hover:bg-obsidian-700/40 transition-colors">
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-cream-200 font-medium truncate">{article.title}</p>
                          {article.excerpt && (
                            <p className="text-xs text-obsidian-400 truncate mt-0.5">{article.excerpt}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-obsidian-300 whitespace-nowrap">
                          {article.category || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs border tracking-wide ${statusStyle}`}>
                            {article.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-obsidian-300 whitespace-nowrap">
                          {formatDate(article.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleFeatured(article)}
                            className={`transition-colors ${article.featured ? 'text-gold-400' : 'text-obsidian-500 hover:text-gold-400'}`}
                            title={article.featured ? 'Remove from featured' : 'Mark as featured'}
                          >
                            <Star className="w-4 h-4" fill={article.featured ? 'currentColor' : 'none'} />
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(article)}
                              className="text-obsidian-400 hover:text-gold-400 transition-colors p-1"
                              title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                            >
                              {article.status === 'published' ? (
                                <ToggleRight className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openEdit(article)}
                              className="text-obsidian-400 hover:text-gold-400 transition-colors p-1"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
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

      {/* Article Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          <div className="absolute inset-0 bg-obsidian-900/90" onClick={closeModal} />
          <div className="relative z-10 bg-obsidian-800 border border-obsidian-700 w-full max-w-2xl mx-4 my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-obsidian-700 flex items-center justify-between flex-shrink-0">
              <h2 className="font-serif text-xl text-cream-100">
                {editingArticle ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={closeModal} className="text-obsidian-400 hover:text-cream-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} className="input-field" placeholder="The Art of the Power Suit" />
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => updateForm('slug', e.target.value)} className="input-field font-mono text-xs" placeholder="the-art-of-the-power-suit" />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => updateForm('category', e.target.value)} className="input-field appearance-none cursor-pointer">
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    )
                    }
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => updateForm('status', e.target.value)} className="input-field appearance-none cursor-pointer">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Excerpt</label>
                <textarea value={formData.excerpt} onChange={(e) => updateForm('excerpt', e.target.value)} rows={2} className="input-field resize-none" placeholder="A short summary for the article card" />
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Cover Image URL</label>
                <input type="text" value={formData.coverImage} onChange={(e) => updateForm('coverImage', e.target.value)} className="input-field" placeholder="https://..." />
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs tracking-widest uppercase text-obsidian-400">Body *</label>
                  <span className="text-xs text-obsidian-500">
                    ~{estimateReadTime(formData.body)} min read
                  </span>
                </div>
                <textarea
                  value={formData.body}
                  onChange={(e) => handleBodyChange(e.target.value)}
                  rows={10}
                  className="input-field resize-y text-sm leading-relaxed"
                  placeholder="Write your article here..."
                />
              </div>

              {/* Read Time override */}
              <div>
                <label className="text-xs tracking-widest uppercase text-obsidian-400 block mb-2">Read Time (minutes)</label>
                <input type="number" value={formData.readTime} onChange={(e) => updateForm('readTime', e.target.value)} className="input-field w-28" placeholder="5" min="1" />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateForm('featured', !formData.featured)}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors
                    ${formData.featured ? 'bg-gold-400 border-gold-400' : 'border-obsidian-500 bg-transparent'}`}
                  role="checkbox"
                  aria-checked={formData.featured}
                >
                  {formData.featured && (
                    <svg className="w-2.5 h-2.5 text-obsidian-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-obsidian-300">Feature this article on the journal homepage</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-obsidian-700 flex gap-3 justify-end flex-shrink-0">
              <button onClick={closeModal} disabled={saving} className="btn-outline-gold disabled:opacity-40">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-40">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {saving ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
