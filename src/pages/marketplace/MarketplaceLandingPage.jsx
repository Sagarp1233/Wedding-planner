import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Search, MapPin, ArrowRight, Star, ShieldCheck, Heart, ChevronRight, Store, Sparkles, BadgeCheck } from 'lucide-react';
import PublicNav from '../../components/layout/PublicNav';
import { setSEO } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';
import {
  MARKETPLACE_CATEGORIES,
  INDIAN_CITIES,
  fetchFeaturedVendors,
  fetchCategoryCounts,
  getCategoryEmoji,
  formatPrice,
} from '../../lib/marketplace';

export default function MarketplaceLandingPage() {
  const [searchCity, setSearchCity] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const origin = ensureHttps((import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ''));
    setSEO({
      title: 'Wedding Vendor Marketplace — Find Photographers, Venues, Decorators | Wedora',
      description: 'Discover verified wedding vendors near you — photographers, venues, decorators, caterers, makeup artists & more. Compare prices, view portfolios, and enquire directly.',
      keywords: 'wedding vendors India, wedding photographer near me, wedding venue, wedding decorator, wedding caterer, bridal makeup artist, wedding planner, Wedora marketplace',
      canonicalUrl: `${origin}/marketplace`,
    });

    async function load() {
      const [counts, featuredVendors] = await Promise.all([
        fetchCategoryCounts(),
        fetchFeaturedVendors(6),
      ]);
      setCategoryCounts(counts);
      setFeatured(featuredVendors);
      setLoading(false);
    }
    load();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchCategory) {
      const params = searchCity ? `?city=${encodeURIComponent(searchCity)}` : '';
      window.location.href = `/marketplace/${searchCategory}${params}`;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* ━━━ HERO ━━━ */}
      <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-40 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/10 border border-rose-gold/20 mb-6 animate-fade-in-up">
            <Store className="w-4 h-4 text-rose-gold" />
            <span className="text-xs sm:text-sm font-medium text-rose-gold">Verified Wedding Vendors Across India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Find the Perfect{' '}
            <span className="gradient-text">Wedding Vendors</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Browse photographers, venues, decorators, caterers & more. Compare prices, view portfolios, and send enquiries — all in one place.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="glass-card p-2 flex flex-col sm:flex-row gap-2">
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                id="search-category"
              >
                <option value="">Select a category...</option>
                {MARKETPLACE_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
                ))}
              </select>
              <select
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                id="search-city"
              >
                <option value="">All Cities</option>
                {INDIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!searchCategory}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                id="search-button"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ━━━ CATEGORY GRID ━━━ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Choose a category to explore top-rated vendors
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to={`/marketplace/${cat.value}`}
                className="glass-card-hover p-5 text-center group"
                id={`category-${cat.value}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:from-rose-gold/15 group-hover:to-plum/10 transition-colors">
                  <span className="text-xl">{cat.emoji}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-rose-gold transition-colors">{cat.label}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {loading ? '...' : `${categoryCounts[cat.value] || 0} vendors`}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FEATURED VENDORS ━━━ */}
      {featured.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold mb-3 tracking-wide uppercase">
                <Star className="w-3.5 h-3.5" fill="currentColor" /> Featured Vendors
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
                Top-Rated Wedding Vendors
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(v => (
                <Link
                  key={v.id}
                  to={`/marketplace/${v.category}/${v.slug}`}
                  className="glass-card-hover overflow-hidden group"
                  id={`featured-${v.slug}`}
                >
                  {/* Cover image */}
                  <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {v.cover_image ? (
                      <img src={v.cover_image} alt={v.business_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">{getCategoryEmoji(v.category)}</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-serif font-bold text-gray-900 group-hover:text-rose-gold transition-colors">{v.business_name}</h3>
                      {v.is_verified && <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.city}</span>
                      {v.price_range_min > 0 && (
                        <span>From {formatPrice(v.price_range_min)}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-rose-gold flex items-center gap-1">
                      View Profile <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ VENDOR CTA ━━━ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 sm:p-12 bg-gradient-to-br from-rose-gold/5 via-white/90 to-plum/5 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rose-gold/8 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-plum/8 blur-2xl" />
            <div className="relative">
              <div className="text-4xl mb-4">🏪</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3">
                Are You a Wedding Vendor?
              </h2>
              <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
                List your business on Wedora for free. Reach thousands of couples planning their wedding across India.
              </p>
              <Link
                to="/vendor-portal"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:-translate-y-1 transition-all"
                id="vendor-cta"
              >
                List Your Business — It's Free <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-gray-400 mt-3">No credit card required · Get leads from real couples</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SEO CONTENT ━━━ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-3xl mx-auto prose prose-gray prose-sm">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
            Find the Best Wedding Vendors in India — Wedora Marketplace
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Planning an Indian wedding involves coordinating with dozens of vendors — from photographers and decorators to caterers and makeup artists. Wedora's Vendor Marketplace makes it easy to discover verified wedding professionals in your city. Browse portfolios, compare prices, read reviews, and send enquiries — all for free.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Whether you're looking for a wedding venue in Mumbai, a photographer in Delhi, a decorator in Bangalore, or a mehendi artist in Jaipur — Wedora has you covered. Our curated directory features vendors across 50+ cities, with transparent pricing and verified contact details.
          </p>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="py-10 px-4 sm:px-6 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-serif font-bold text-gray-900">Wedora</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">India's most complete wedding planner & vendor marketplace</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-gray-700 transition-colors">Blog</Link>
            <Link to="/marketplace" className="hover:text-gray-700 transition-colors">Vendors</Link>
            <Link to="/signup" className="hover:text-gray-700 transition-colors">Sign Up</Link>
          </div>
          <p className="text-[10px] text-gray-300 mt-4">© 2026 Wedora. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  );
}
