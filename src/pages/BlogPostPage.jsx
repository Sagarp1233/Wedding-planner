import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clearArticleJsonLd, clearFaqPageJsonLd, setArticleJsonLd, setSEO } from '../lib/seo';
import { ensureHttps } from '../utils/ensureHttps';

// ── Static metadata + getter functions only — kept eager (tiny, needed immediately)
import { BUDGET_GUIDE_SLUG, getStaticBudgetGuidePost } from './blog/indianWeddingBudgetGuide2026';
import { WEDDING_5L_SLUG, getStaticWedding5LPost } from './blog/weddingUnder5Lakhs';
import { LOW_BUDGET_PREMIUM_SLUG, getStaticLowBudgetPremiumPost } from './blog/lowBudgetPremiumWedding';
import { PHOTOGRAPHY_CHECKLIST_SLUG, getStaticPhotographyChecklistPost } from './blog/weddingPhotographyChecklist';
import { BUDGET_CALCULATOR_SLUG, getStaticBudgetCalculatorPost } from './blog/weddingBudgetCalculator';
import { LAST_MINUTE_CHECKLIST_SLUG, getStaticLastMinuteChecklistPost } from './blog/lastMinuteWeddingChecklist';
import { WHATSAPP_INVITE_SLUG, getStaticWhatsAppInvitePost } from './blog/whatsappWeddingInvitations';
import { ARYA_SAMAJ_MARRIAGE_SLUG, getStaticAryaSamajPost } from './blog/aryaSamajMarriage';

// ── Article components — lazy loaded
// Each article only downloads when a user actually visits that specific blog post
const IndianWeddingBudgetGuide2026Article = lazy(() =>
  import('./blog/indianWeddingBudgetGuide2026').then(m => ({ default: m.IndianWeddingBudgetGuide2026Article }))
);
const WeddingUnder5LakhsArticle = lazy(() =>
  import('./blog/weddingUnder5Lakhs').then(m => ({ default: m.WeddingUnder5LakhsArticle }))
);
const LowBudgetPremiumWeddingArticle = lazy(() =>
  import('./blog/lowBudgetPremiumWedding').then(m => ({ default: m.LowBudgetPremiumWeddingArticle }))
);
const PhotographyChecklistArticle = lazy(() =>
  import('./blog/weddingPhotographyChecklist').then(m => ({ default: m.PhotographyChecklistArticle }))
);
const BudgetCalculatorArticle = lazy(() =>
  import('./blog/weddingBudgetCalculator').then(m => ({ default: m.BudgetCalculatorArticle }))
);
const LastMinuteChecklistArticle = lazy(() =>
  import('./blog/lastMinuteWeddingChecklist').then(m => ({ default: m.LastMinuteChecklistArticle }))
);
const WhatsAppInviteArticle = lazy(() =>
  import('./blog/whatsappWeddingInvitations').then(m => ({ default: m.WhatsAppInviteArticle }))
);
const AryaSamajMarriageArticle = lazy(() =>
  import('./blog/aryaSamajMarriage').then(m => ({ default: m.AryaSamajMarriageArticle }))
);

// ── Skeleton shown while a lazy article chunk is downloading
function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-8 max-w-4xl mx-auto px-4">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      <div className="h-5 bg-gray-200 rounded w-5/6"></div>
      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
      <div className="h-5 bg-gray-200 rounded w-4/5"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  function applyPostSEO(data) {
    const base = ensureHttps((import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ''));
    const canonicalUrl = `${base}/blog/${data.slug}`;
    setSEO({
      title: data.meta_title || `${data.title} | Wedora Blog`,
      description: data.meta_description || data.excerpt || 'Read this insightful article on Wedora.',
      keywords: data.keywords || data.tags || '',
      canonicalUrl,
      ogType: 'article',
      ogImage: data.featured_image,
    });
    setArticleJsonLd({
      title: data.title,
      description: data.meta_description || data.excerpt || '',
      image: data.featured_image,
      datePublished: data.published_at || data.created_at,
      dateModified: data.updated_at || data.created_at,
      author: data.author || 'Wedora Team',
      url: canonicalUrl,
    });
  }

  async function fetchPost() {
    try {
      setLoading(true);

      if (slug === BUDGET_GUIDE_SLUG) {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        const resolved = !error && data ? data : getStaticBudgetGuidePost();
        setPost(resolved);
        applyPostSEO(resolved);
        return;
      }

      // DB-first helper with static fallback
      async function tryDB(getter) {
        const { data: d, error: e } = await supabase
          .from('blogs').select('*').eq('slug', slug)
          .eq('status', 'published').maybeSingle();
        return (!e && d) ? d : getter();
      }
      if (slug === WEDDING_5L_SLUG) { const r = await tryDB(getStaticWedding5LPost); setPost(r); applyPostSEO(r); return; }
      if (slug === LOW_BUDGET_PREMIUM_SLUG) { const r = await tryDB(getStaticLowBudgetPremiumPost); setPost(r); applyPostSEO(r); return; }
      if (slug === PHOTOGRAPHY_CHECKLIST_SLUG) { const r = await tryDB(getStaticPhotographyChecklistPost); setPost(r); applyPostSEO(r); return; }
      if (slug === BUDGET_CALCULATOR_SLUG) { const r = await tryDB(getStaticBudgetCalculatorPost); setPost(r); applyPostSEO(r); return; }
      if (slug === LAST_MINUTE_CHECKLIST_SLUG) { const r = await tryDB(getStaticLastMinuteChecklistPost); setPost(r); applyPostSEO(r); return; }
      if (slug === WHATSAPP_INVITE_SLUG) { const r = await tryDB(getStaticWhatsAppInvitePost); setPost(r); applyPostSEO(r); return; }
      if (slug === ARYA_SAMAJ_MARRIAGE_SLUG) { const r = await tryDB(getStaticAryaSamajPost); setPost(r); applyPostSEO(r); return; }

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setPost(data);
      if (data) applyPostSEO(data);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setPost(null);
      const origin = ensureHttps((import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ''));
      setSEO({
        title: 'Article not found | Wedora Blog',
        description: 'This article may have been removed or the link is incorrect.',
        canonicalUrl: `${origin}/blog`,
        ogType: 'website',
      });
      clearArticleJsonLd();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      clearArticleJsonLd();
      clearFaqPageJsonLd();
    };
  }, []);

  function handleShareURL() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-gold/30 border-t-rose-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  let affiliateHref = null;
  if (post.affiliate_link && typeof post.affiliate_link === 'string') {
    try {
      const u = new URL(ensureHttps(post.affiliate_link.trim()));
      if (u.protocol === 'https:') affiliateHref = u.href;
    } catch {
      /* ignore invalid */
    }
  }
  const affiliateCtaLabel = (post.affiliate_label && String(post.affiliate_label).trim()) || 'Learn more';

  // ── Static article renders — each wrapped in Suspense so they lazy load
  if (post.slug === BUDGET_GUIDE_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <IndianWeddingBudgetGuide2026Article
          post={post}
          readTime={14}
          copied={copied}
          onShare={handleShareURL}
          affiliateHref={affiliateHref}
          affiliateCtaLabel={affiliateCtaLabel}
        />
      </Suspense>
    );
  }
  if (post.slug === WEDDING_5L_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <WeddingUnder5LakhsArticle post={post} readTime={12} copied={copied} onShare={handleShareURL} affiliateHref={affiliateHref} affiliateCtaLabel={affiliateCtaLabel} />
      </Suspense>
    );
  }
  if (post.slug === LOW_BUDGET_PREMIUM_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <LowBudgetPremiumWeddingArticle post={post} readTime={13} copied={copied} onShare={handleShareURL} affiliateHref={affiliateHref} affiliateCtaLabel={affiliateCtaLabel} />
      </Suspense>
    );
  }
  if (post.slug === PHOTOGRAPHY_CHECKLIST_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <PhotographyChecklistArticle post={post} readTime={10} copied={copied} onShare={handleShareURL} affiliateHref={affiliateHref} affiliateCtaLabel={affiliateCtaLabel} />
      </Suspense>
    );
  }
  if (post.slug === BUDGET_CALCULATOR_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <BudgetCalculatorArticle post={post} readTime={11} copied={copied} onShare={handleShareURL} affiliateHref={affiliateHref} affiliateCtaLabel={affiliateCtaLabel} />
      </Suspense>
    );
  }
  if (post.slug === LAST_MINUTE_CHECKLIST_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <LastMinuteChecklistArticle post={post} readTime={12} copied={copied} onShare={handleShareURL} affiliateHref={affiliateHref} affiliateCtaLabel={affiliateCtaLabel} />
      </Suspense>
    );
  }
  if (post.slug === WHATSAPP_INVITE_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <WhatsAppInviteArticle post={post} readTime={11} copied={copied} onShare={handleShareURL} affiliateHref={affiliateHref} affiliateCtaLabel={affiliateCtaLabel} />
      </Suspense>
    );
  }
  if (post.slug === ARYA_SAMAJ_MARRIAGE_SLUG) {
    return (
      <Suspense fallback={<ArticleSkeleton />}>
        <AryaSamajMarriageArticle post={post} readTime={16} copied={copied} onShare={handleShareURL} affiliateHref={affiliateHref} affiliateCtaLabel={affiliateCtaLabel} />
      </Suspense>
    );
  }

  // ── Dynamic DB post render (ReactMarkdown) — unchanged
  const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200) || 1;

  const MarkdownComponents = {
    h1: ({node, ...props}) => <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mt-12 mb-6" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900 mt-10 mb-5" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-serif font-bold text-gray-900 mt-8 mb-4" {...props} />,
    p: ({node, ...props}) => <p className="text-lg text-gray-700 leading-relaxed mb-6" {...props} />,
    a: ({node, href, children, ...props}) => (
      <a {...props} href={href ? ensureHttps(href) : undefined} className="text-rose-gold hover:underline font-medium">
        {children}
      </a>
    ),
    ul: ({node, ...props}) => <ul className="list-disc pl-6 text-lg text-gray-700 mb-6 space-y-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 text-lg text-gray-700 mb-6 space-y-2" {...props} />,
    li: ({node, ...props}) => <li className="pl-2" {...props} />,
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-rose-gold pl-4 italic text-gray-600 my-8 bg-rose-gold/5 py-4 pr-4 rounded-r-lg" {...props} />,
    code: ({node, inline, ...props}) =>
      inline
      ? <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
      : <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono mb-6"><code {...props} /></pre>,
    img: ({node, src, alt, ...props}) => (
      <img
        {...props}
        src={src ? ensureHttps(src) : undefined}
        className="w-full h-auto rounded-2xl mb-8 mt-4 shadow-sm"
        alt={alt || 'Blog image'}
        loading="lazy"
      />
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link to="/" className="text-xl font-serif font-bold text-gray-900 tracking-tight">Wedora</Link>
        </div>
      </nav>

      <main className="pt-24 pb-32 max-w-6xl mx-auto px-4 lg:px-8">

        {/* Header */}
        <header className="mb-12 text-center animate-fade-in max-w-4xl mx-auto">
          {post.tags && (
            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {post.tags.split(',').map(tag => (
                <span key={tag} className="px-3 py-1 bg-rose-gold/10 text-rose-gold text-xs font-semibold rounded-full uppercase tracking-wider">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mt-4">
            By {(post.author || 'Wedora Team')}
          </p>
        </header>

        <div className="max-w-5xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-10 rounded-3xl overflow-hidden shadow-xl shadow-rose-gold/10 border border-white/70 animate-slide-up">
              <img src={ensureHttps(post.featured_image)} alt={post.title} className="w-full object-cover aspect-[16/7]" loading="lazy" />
            </div>
          )}

          {/* Article Body */}
          <article className="prose prose-lg max-w-none text-gray-800 animate-slide-up animation-delay-100 bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-lg p-6 md:p-10 lg:p-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
              {post.content}
            </ReactMarkdown>
          </article>

          {affiliateHref && (
            <aside className="mt-10 max-w-5xl mx-auto rounded-2xl border border-rose-gold/20 bg-gradient-to-br from-rose-gold/5 to-plum/5 p-6 md:p-8 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-gold/80 mb-3">Partner pick</p>
              <a
                href={affiliateHref}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg shadow-rose-gold/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                {affiliateCtaLabel}
              </a>
            </aside>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span className="mr-2">Share this article:</span>
            <button onClick={handleShareURL} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors relative" title="Copy Link">
              <Copy className="w-4 h-4" />
              {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded">Copied!</span>}
            </button>
          </div>

          <Link to="/" className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-rose-gold/20 transition-all">
            Plan Your Wedding For Free
          </Link>
        </div>

      </main>
    </div>
  );
}
