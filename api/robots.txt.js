function getBaseUrl(req) {
  const envUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (envUrl) {
    return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
  }
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  return `${proto}://${host}`;
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

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).send(body);
}
