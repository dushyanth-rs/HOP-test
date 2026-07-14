export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSessionId() {
  return 'guest_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function estimateReadTime(body) {
  const words = body?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
