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
    return forceHttps(normalized);
  }
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const safeProto = proto === 'http' ? 'https' : proto;
  const host = req.headers.host;
  return forceHttps(`${safeProto}://${host}`);
}

export default function handler(req, res) {
  const baseUrl = getBaseUrl(req);
  const body = `User-agent: *
Allow: /

# Restrict private/admin surfaces
Disallow: /admin
Disallow: /onboarding
Disallow: /dashboard
Disallow: /budget
Disallow: /guests
Disallow: /tasks
Disallow: /timeline
Disallow: /vendors
Disallow: /inspiration
Disallow: /settings

Sitemap: https://wedora.in/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).send(body);
}
