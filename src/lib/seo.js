const DEFAULT_SITE_NAME = 'Wedora';

function upsertMeta({ attr, key, value }) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonical(url) {
  if (!url) return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

export function setSEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  siteName = DEFAULT_SITE_NAME
}) {
  if (title) {
    document.title = title;
    upsertMeta({ attr: 'property', key: 'og:title', value: title });
    upsertMeta({ attr: 'name', key: 'twitter:title', value: title });
  }
  if (description) {
    upsertMeta({ attr: 'name', key: 'description', value: description });
    upsertMeta({ attr: 'property', key: 'og:description', value: description });
    upsertMeta({ attr: 'name', key: 'twitter:description', value: description });
  }
  if (keywords) upsertMeta({ attr: 'name', key: 'keywords', value: keywords });

  upsertMeta({ attr: 'property', key: 'og:type', value: ogType });
  upsertMeta({ attr: 'property', key: 'og:site_name', value: siteName });
  upsertMeta({ attr: 'name', key: 'twitter:card', value: 'summary_large_image' });

  if (canonicalUrl) {
    setCanonical(canonicalUrl);
    upsertMeta({ attr: 'property', key: 'og:url', value: canonicalUrl });
  }
  if (ogImage) {
    upsertMeta({ attr: 'property', key: 'og:image', value: ogImage });
    upsertMeta({ attr: 'name', key: 'twitter:image', value: ogImage });
  }
}

export function setArticleJsonLd(article) {
  const existing = document.getElementById('article-jsonld');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = 'article-jsonld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? [article.image] : undefined,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'Wedora Team'
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SITE_NAME
    },
    mainEntityOfPage: article.url
  });
  document.head.appendChild(script);
}

export function clearArticleJsonLd() {
  const existing = document.getElementById('article-jsonld');
  if (existing) existing.remove();
}

export function setFaqPageJsonLd(items) {
  const existing = document.getElementById('faq-jsonld');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = 'faq-jsonld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  });
  document.head.appendChild(script);
}

export function clearFaqPageJsonLd() {
  document.getElementById('faq-jsonld')?.remove();
}

const HOMEPAGE_JSONLD_ID = 'homepage-jsonld';

export function setHomepageJsonLd({ siteUrl, siteName = DEFAULT_SITE_NAME, description }) {
  const existing = document.getElementById(HOMEPAGE_JSONLD_ID);
  if (existing) existing.remove();

  const base = siteUrl.replace(/\/$/, '');
  const script = document.createElement('script');
  script.id = HOMEPAGE_JSONLD_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: siteName,
        description: description || undefined,
        publisher: { '@id': `${base}/#organization` },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: siteName,
        url: base,
      },
    ],
  });
  document.head.appendChild(script);
}

export function clearHomepageJsonLd() {
  document.getElementById(HOMEPAGE_JSONLD_ID)?.remove();
}
