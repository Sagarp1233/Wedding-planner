import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Filter, ChevronRight, BadgeCheck, Search, X, ArrowRight } from 'lucide-react';
import PublicNav from '../../components/layout/PublicNav';
import { setSEO } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';
import {
  INDIAN_CITIES,
  fetchVendorsByCategory,
  getCategoryLabel,
  getCategoryEmoji,
  formatPrice,
} from '../../lib/marketplace';

export default function CategoryListingPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Filters
  const [city, setCity] = useState(initialCity);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categoryLabel = getCategoryLabel(category);
  const categoryEmoji = getCategoryEmoji(category);

  useEffect(() => {
    const origin = ensureHttps((import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ''));
    const cityText = city ? ` in ${city}` : ' in India';
    setSEO({
      title: `Top Wedding ${categoryLabel}s${cityText} — Wedora Marketplace`,
      description: `Find the best wedding ${categoryLabel.toLowerCase()}s${cityText}. Browse portfolios, compare prices, and send enquiries on Wedora.`,
      keywords: `wedding ${categoryLabel.toLowerCase()}${city ? ` ${city}` : ''}, wedding vendor, ${categoryLabel.toLowerCase()} near me, Wedora`,
      canonicalUrl: `${origin}/marketplace/${category}`,
    });
  }, [category, categoryLabel, city]);

  useEffect(() => {
    loadVendors(0);
  }, [category, city, verifiedOnly]);

  async function loadVendors(pageNum) {
    setLoading(true);
    const result = await fetchVendorsByCategory(category, { city, verifiedOnly }, pageNum);
    if (pageNum === 0) {
      setVendors(result.vendors);
    } else {
      setVendors(prev => [...prev, ...result.vendors]);
    }
    setTotal(result.total);
    setPage(pageNum);
    setLoading(false);
  }

  function handleLoadMore() {
    loadVendors(page + 1);
  }

  function clearFilters() {
    setCity('');
    setVerifiedOnly(false);
  }

  const hasActiveFilters = city || verifiedOnly;

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 animate-fade-in">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/marketplace" className="hover:text-gray-600 transition-colors">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">{categoryLabel}s</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{categoryEmoji}</span>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
                  Wedding {categoryLabel}s
                  {city && <span className="text-rose-gold"> in {city}</span>}
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${total} vendor${total !== 1 ? 's' : ''} found`}
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                hasActiveFilters
                  ? 'bg-rose-gold/10 border-rose-gold/30 text-rose-gold'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              id="filter-toggle"
            >
              <Filter className="w-4 h-4" />
              Filters {hasActiveFilters && '(Active)'}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="glass-card p-5 mb-8 animate-scale-in">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                    id="filter-city"
                  >
                    <option value="">All Cities</option>
                    {INDIAN_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer" id="filter-verified">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={e => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 font-medium">Verified Only</span>
                  </label>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Vendor Grid */}
          {loading && vendors.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <div className="h-44 animate-shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 rounded animate-shimmer" />
                    <div className="h-4 w-1/2 rounded animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">{categoryEmoji}</div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No vendors found</h3>
              <p className="text-sm text-gray-500 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filters to see more results.'
                  : `We're growing our ${categoryLabel.toLowerCase()} directory. Check back soon!`}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm font-semibold text-rose-gold hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {vendors.map(v => (
                  <Link
                    key={v.id}
                    to={`/marketplace/${v.category}/${v.slug}`}
                    className="glass-card-hover overflow-hidden group"
                    id={`vendor-${v.slug}`}
                  >
                    {/* Cover */}
                    <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                      {v.cover_image ? (
                        <img src={v.cover_image} alt={v.business_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">{categoryEmoji}</span>
                        </div>
                      )}
                      {v.featured && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide">
                          Featured
                        </span>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base font-serif font-bold text-gray-900 group-hover:text-rose-gold transition-colors line-clamp-1">{v.business_name}</h3>
                        {v.is_verified && <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.city}</span>
                        {v.price_range_min > 0 && (
                          <span className="font-medium text-gray-700">
                            {formatPrice(v.price_range_min)}
                            {v.price_range_max > 0 ? ` – ${formatPrice(v.price_range_max)}` : '+'}
                          </span>
                        )}
                      </div>
                      {v.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{v.description}</p>
                      )}
                      <span className="text-xs font-semibold text-rose-gold flex items-center gap-1">
                        View Profile <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {vendors.length < total && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-rose-gold/30 hover:bg-rose-gold/5 transition-all disabled:opacity-50"
                    id="load-more"
                  >
                    {loading ? 'Loading...' : `Load More (${total - vendors.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Vendor CTA */}
          <div className="mt-16 text-center glass-card p-8 bg-gradient-to-br from-rose-gold/5 to-plum/5">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Are you a {categoryLabel.toLowerCase()}?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              List your business on Wedora for free and reach couples planning their wedding.
            </p>
            <Link
              to="/vendor/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Create Free Listing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
