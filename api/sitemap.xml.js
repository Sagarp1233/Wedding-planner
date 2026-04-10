const STATIC_PATHS = ['/', '/blog', '/login', '/signup'];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getBaseUrl(req) {
  const envUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (envUrl) {
    return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
  }
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  return `${proto}://${host}`;
}

async function fetchPublishedPosts() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnon = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) return [];

  const url = `${supabaseUrl}/rest/v1/blogs?select=slug,updated_at,created_at,published_at,status&status=eq.published&order=updated_at.desc.nullslast`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnon,
      Authorization: `Bearer ${supabaseAnon}`
    }
  });

  if (!response.ok) return [];
  return response.json();
}

export default async function handler(req, res) {
  try {
    const baseUrl = getBaseUrl(req);
    const posts = await fetchPublishedPosts();

    const urls = [
      ...STATIC_PATHS.map((path) => ({ loc: `${baseUrl}${path}`, lastmod: null, changefreq: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? '1.0' : '0.7' })),
      ...posts.map((post) => ({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updated_at || post.published_at || post.created_at || null,
        changefreq: 'weekly',
        priority: '0.8'
      }))
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.status(200).send(body);
  } catch {
    res.status(500).send('Failed to generate sitemap');
  }
}
