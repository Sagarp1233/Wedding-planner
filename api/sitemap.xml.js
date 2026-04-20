/**
 * Dynamic sitemap generator — served by Vercel serverless function.
 * Vercel rewrites /sitemap.xml → /api/sitemap.xml (see vercel.json).
 *
 * Includes:
 *   - All public static pages with appropriate priorities
 *   - All published blog posts fetched from Supabase at request time
 */

const STATIC_PAGES = [
  { path: '/',                   changefreq: 'weekly',  priority: '1.0'  },
  { path: '/blog',               changefreq: 'daily',   priority: '0.9'  },
  { path: '/create-invitation',  changefreq: 'monthly', priority: '0.9'  },
  { path: '/wedding-budget-calculator', changefreq: 'monthly', priority: '0.9' },
  { path: '/wedding-checklist',  changefreq: 'monthly', priority: '0.9' },
  { path: '/login',              changefreq: 'monthly', priority: '0.5'  },
  { path: '/signup',             changefreq: 'monthly', priority: '0.5'  },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function forceHttps(url) {
  if (!url || typeof url !== 'string') return url;
  const t = url.trim();
  if (/\blocalhost\b|127\.0\.0\.1/i.test(t)) return t;
  if (t.startsWith('//')) return `https:${t}`;
  return t.replace(/^http:\/\//i, 'https://');
}

function getBaseUrl(req) {
  const envUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (envUrl) {
    const normalized = envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
    return forceHttps(normalized).replace(/\/$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const safeProto = proto === 'http' ? 'https' : proto;
  const host = req.headers.host;
  return forceHttps(`${safeProto}://${host}`).replace(/\/$/, '');
}

async function fetchPublishedPosts() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) return [];

  const apiBase = forceHttps(supabaseUrl.trim().replace(/\/$/, ''));
  const url = `${apiBase}/rest/v1/blogs?select=slug,updated_at,created_at,published_at,status&status=eq.published&order=updated_at.desc.nullslast`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnon,
      Authorization: `Bearer ${supabaseAnon}`
    }
  });

  if (!response.ok) return [];
  return response.json();
}

function buildUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(req, res) {
  try {
    const baseUrl = getBaseUrl(req);
    const posts = await fetchPublishedPosts();
    const now = new Date().toISOString();

    const entries = [];

    // Static pages
    for (const page of STATIC_PAGES) {
      entries.push(buildUrlEntry(`${baseUrl}${page.path}`, now, page.changefreq, page.priority));
    }

    // Dynamic blog post pages
    for (const post of posts) {
      const slug = (post.slug || '').trim();
      if (!slug) continue;
      const lastmod = post.updated_at || post.published_at || post.created_at || now;
      entries.push(buildUrlEntry(`${baseUrl}/blog/${slug}`, lastmod, 'weekly', '0.8'));
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(body);
  } catch {
    res.status(500).send('Failed to generate sitemap');
  }
}
