import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { WedoraTextMark } from '../components/branding/WedoraLogo';
import { supabase } from '../lib/supabase';
import { clearArticleJsonLd, setSEO } from '../lib/seo';
import { ensureHttps } from '../utils/ensureHttps';

export default function BlogListingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canonicalUrl = `${ensureHttps(window.location.origin)}/blog`;
    setSEO({
      title: 'Wedding Planning Blog | Wedora',
      description: 'Read the latest wedding planning tips, budget guides, and inspiration on the Wedora blog.',
      keywords: 'wedding planning, indian wedding checklist, wedding budget tips',
      canonicalUrl,
      ogType: 'website'
    });
    clearArticleJsonLd();

    fetchPublishedPosts();
  }, []);

  async function fetchPublishedPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('slug, title, excerpt, featured_image, created_at, tags')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate read time approx (assuming 250 words per minute if we had full content, but we don't, so default to 3 min)
  const getReadTime = () => "3 min read";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <WedoraTextMark to="/" />
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</Link>
            <Link to="/signup" className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-rose-gold to-plum text-white rounded-lg hover:shadow-lg hover:shadow-rose-gold/20 transition-all duration-300">
              Start Planning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-14 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-gold/10 text-rose-gold text-xs font-semibold tracking-wider uppercase mb-4">
          Wedora Journal
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-4 animate-fade-in leading-tight">
          Wedding Planning <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-gold to-plum">Insights</span>
        </h1>
        <p className="text-lg text-gray-600 animate-slide-up animation-delay-100 max-w-2xl mx-auto">
          Expert tips, checklists, and guides to help you plan your dream Indian wedding without the stress.
        </p>
      </div>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="animate-pulse bg-white rounded-2xl h-96 overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                  <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-16 bg-gray-200 w-full rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-rose-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-rose-gold" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">Articles coming soon</h3>
            <p className="text-gray-500 mt-2">We are currently writing highly valuable content for you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <Link 
                to={`/blog/${post.slug}`} 
                key={post.slug}
                className={`group bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-gold/10 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                  {post.featured_image ? (
                    <img 
                      src={ensureHttps(post.featured_image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full max-h-full flex items-center justify-center text-rose-gold/50 font-serif text-2xl font-bold bg-gradient-to-br from-rose-gold/10 to-plum/5">
                      Wedora
                    </div>
                  )}
                  {post.tags && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900 rounded-full shadow-sm capitalize">
                        {post.tags.split(',')[0].trim()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 md:p-7">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium mb-3">
                    <span>{new Date(post.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{getReadTime()}</span>
                  </div>
                  
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-gold transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-sm text-gray-500 line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-rose-gold group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
