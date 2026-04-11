/**
 * Normalizes URLs to https:// to avoid mixed-content warnings on HTTPS pages.
 * Safe for Supabase, images, canonicals, and user-supplied blog URLs.
 */
export function ensureHttps(url) {
  if (url == null || typeof url !== 'string') return url;
  const t = url.trim();
  if (!t) return t;
  // Local dev: do not rewrite — upgrading to https would break Vite / local Supabase
  if (/\blocalhost\b|127\.0\.0\.1/i.test(t)) return t;
  if (t.startsWith('//')) return `https:${t}`;
  return t.replace(/^http:\/\//i, 'https://');
}
