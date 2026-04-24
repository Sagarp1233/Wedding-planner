import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Store, ArrowRight, Eye, Phone, Mail, Calendar, MessageCircle, Edit3,
  ExternalLink, AlertCircle, CheckCircle2, Clock, XCircle, ChevronLeft,
  Star, TrendingUp, Zap, Lock, BarChart3, Lightbulb, Users, ArrowUpRight,
  ArrowDownRight, Briefcase, Image, Camera
} from 'lucide-react';
import {
  fetchMyListing, fetchLeadsForVendor, fetchVendorReviews, fetchVendorMedia,
  fetchProfileViewStats, fetchLeadSourceStats,
  getCategoryLabel, getCategoryEmoji, formatPrice,
} from '../../lib/marketplace';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

export default function VendorPortalPage() {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [leads, setLeads] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [media, setMedia] = useState([]);
  const [viewStats, setViewStats] = useState({ total: 0, chartData: [] });
  const [leadSources, setLeadSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    async function load() {
      const myListing = await fetchMyListing(currentUser.id);
      setListing(myListing);
      if (myListing) {
        const [myLeads, myReviews, myMedia, myViews, mySources] = await Promise.all([
          fetchLeadsForVendor(myListing.id),
          fetchVendorReviews(myListing.id),
          fetchVendorMedia(myListing.id),
          fetchProfileViewStats(myListing.id, period === '7d' ? 7 : period === '90d' ? 90 : 30),
          fetchLeadSourceStats(myListing.id),
        ]);
        setLeads(myLeads);
        setReviews(myReviews);
        setMedia(myMedia);
        setViewStats(myViews);
        setLeadSources(mySources);
      }
      setLoading(false);
    }
    load();
  }, [currentUser, isAuthenticated, authLoading, navigate, period]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blush to-ivory flex items-center justify-center">
        <div className="text-center animate-pulse-soft">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-gray-400">Loading your vendor dashboard...</p>
        </div>
      </div>
    );
  }

  const STATUS_CONFIG = {
    pending: { icon: Clock, color: 'border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-800', label: '⏳ Your listing is being reviewed', desc: 'Our team will review your listing within 24 hours.' },
    approved: { icon: CheckCircle2, color: 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-800', label: '✅ Your listing is live!', desc: 'Couples can now find and contact you through Wedora.' },
    rejected: { icon: XCircle, color: 'border-red-300 bg-gradient-to-r from-red-50 to-red-100/50 text-red-800', label: '❌ Your listing needs changes', desc: 'Please update your listing and resubmit for review.' },
    suspended: { icon: AlertCircle, color: 'border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100/50 text-gray-700', label: '⚠️ Your listing has been suspended', desc: 'Contact support if you believe this is an error.' },
  };

  // ─── No Listing Yet ─────────────────────────────────────────────────
  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blush to-ivory px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="glass-card p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-gold/20">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3">
              Create Your Business Listing
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              List your wedding business on Wedora for free. Reach thousands of couples planning their dream wedding across India.
            </p>

            <div className="space-y-3 text-left mb-8">
              {[
                { emoji: '📸', text: 'Showcase your portfolio and past work' },
                { emoji: '💰', text: 'Display your pricing to attract the right couples' },
                { emoji: '📱', text: 'Get enquiries directly to your phone via WhatsApp' },
                { emoji: '⭐', text: 'Build trust with a verified Wedora badge' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-sm text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              to="/vendor/dashboard/edit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:-translate-y-1 transition-all"
              id="create-listing-button"
            >
              Create Your Free Listing <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-gray-400 mt-3">Takes less than 5 minutes · No cost involved</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Has Listing — Analytics Dashboard ────────────────────────────
  const status = STATUS_CONFIG[listing.status] || STATUS_CONFIG.pending;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const thisMonthLeads = leads.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Reviews stats
  const avgRating = listing.rating_avg || 0;
  const totalReviews = listing.reviews_count || 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));
  const maxRatingCount = Math.max(...ratingDistribution.map(r => r.count), 1);

  // Conversion rate
  const conversionRate = viewStats.total > 0 ? ((leads.length / viewStats.total) * 100).toFixed(1) : '0.0';

  // Lead source colors for donut chart
  const DONUT_COLORS = ['#C0707A', '#25D366', '#F59E0B', '#8B5CF6', '#94A3B8'];

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* ═══ HERO BANNER with Cover Photo ═══ */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 overflow-hidden">
          {listing.cover_image ? (
            <img
              src={listing.cover_image}
              alt={listing.business_name}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl block mb-2">{getCategoryEmoji(listing.category)}</span>
                <p className="text-white/40 text-sm">Add a cover photo to make your dashboard shine ✨</p>
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>

        {/* Floating Nav Within Hero */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {/* Period Toggle */}
              <div className="hidden sm:flex items-center bg-white/10 backdrop-blur-md rounded-xl p-0.5">
                {['7d', '30d', '90d'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Link
                to="/vendor/dashboard/edit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Edit3 className="w-4 h-4" /> Edit Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Business Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-5 sm:pb-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1 drop-shadow-lg">
                  {listing.business_name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                  <span>{getCategoryLabel(listing.category)}</span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>📍 {listing.city}</span>
                  {listing.price_range_min > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="font-semibold text-white/90">
                        {formatPrice(listing.price_range_min)} – {formatPrice(listing.price_range_max)}
                      </span>
                    </>
                  )}
                  {listing.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
              {listing.status === 'approved' && (
                <Link
                  to={`/marketplace/${listing.category}/${listing.slug}`}
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-semibold hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Page
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2 pb-10 relative z-20 space-y-5">
        {/* Status Banner */}
        <div className={`rounded-2xl p-4 border-l-4 shadow-sm ${status.color} animate-fade-in-up`}>
          <p className="font-semibold text-sm">{status.label}</p>
          <p className="text-xs mt-0.5 opacity-80">{status.desc}</p>
        </div>

        {/* Promo Banner */}
        {thisMonthLeads > 0 && (
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in-up shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">You received {thisMonthLeads} enquiries this month! 🎉</p>
                <p className="text-gray-400 text-xs">Reply within 24hrs — fast responses increase booking rate by 40%.</p>
              </div>
            </div>
          </div>
        )}

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <SummaryCard
            icon={Eye} iconColor="text-blue-600" iconBg="bg-gradient-to-br from-blue-100 to-blue-50"
            label="PROFILE VIEWS" value={viewStats.total}
            borderColor="border-l-blue-500"
            trend={viewStats.total > 0 ? `${viewStats.total} in ${period}` : null} trendUp
          />
          <SummaryCard
            icon={MessageCircle} iconColor="text-emerald-600" iconBg="bg-gradient-to-br from-emerald-100 to-emerald-50"
            label="LEADS RECEIVED" value={leads.length}
            borderColor="border-l-emerald-500"
            subtext={newLeads > 0 ? `${newLeads} new` : 'No new leads'}
          />
          <SummaryCard
            icon={Star} iconColor="text-amber-500" iconBg="bg-gradient-to-br from-amber-100 to-amber-50"
            label="AVG RATING" value={avgRating > 0 ? avgRating.toFixed(1) : '—'}
            borderColor="border-l-amber-500"
            subtext={totalReviews > 0 ? `${totalReviews} reviews` : 'No reviews yet'}
          />
          <SummaryCard
            icon={BarChart3} iconColor="text-violet-600" iconBg="bg-gradient-to-br from-violet-100 to-violet-50"
            label="VIEW → LEAD" value={`${conversionRate}%`}
            borderColor="border-l-violet-500"
            trend={parseFloat(conversionRate) >= 10 ? 'Great' : parseFloat(conversionRate) > 0 ? 'Growing' : null}
            trendUp={parseFloat(conversionRate) >= 10}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          {/* Profile Views Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-serif font-bold text-gray-900">Profile Views Over Time</h2>
                <p className="text-xs text-gray-500">Daily views from couple searches</p>
              </div>
              {viewStats.total > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                  {viewStats.total} total
                </span>
              )}
            </div>
            {viewStats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={viewStats.chartData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C0707A" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#C0707A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Line
                    type="monotone" dataKey="views" stroke="#C0707A" strokeWidth={2.5}
                    dot={{ fill: '#C0707A', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#C0707A', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">No views yet</p>
                  <p className="text-xs text-gray-400 mt-1">Views appear once couples visit your profile</p>
                </div>
              </div>
            )}
          </div>

          {/* Lead Sources Donut */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-serif font-bold text-gray-900 mb-1">Lead Sources</h2>
            <p className="text-xs text-gray-500 mb-4">Where your leads come from</p>

            {leadSources.length > 0 ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={leadSources} dataKey="value" cx="50%" cy="50%"
                          innerRadius={50} outerRadius={70} paddingAngle={3}
                        >
                          {leadSources.map((entry, i) => (
                            <Cell key={i} fill={entry.color || DONUT_COLORS[i % DONUT_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{leads.length}</p>
                        <p className="text-[10px] text-gray-500">Total</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {leadSources.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-gray-600">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{s.value}</span>
                        <span className="text-gray-400 w-8 text-right">{s.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-400">Sources appear after your first enquiry</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ PORTFOLIO GALLERY ═══ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-gold" /> Portfolio Gallery
              </h2>
              <p className="text-xs text-gray-500">{media.length > 0 ? `${media.length} photos uploaded` : 'Showcase your best work to couples'}</p>
            </div>
            <Link
              to="/vendor/dashboard/edit"
              className="text-xs font-semibold text-rose-gold hover:underline flex items-center gap-1"
            >
              {media.length > 0 ? 'Manage Photos' : 'Add Photos'} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {media.slice(0, 10).map((item, i) => (
                <div
                  key={item.id || i}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer relative"
                >
                  <img
                    src={item.image_url}
                    alt={`Portfolio ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
              {media.length > 10 && (
                <Link
                  to="/vendor/dashboard/edit"
                  className="aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-rose-gold/40 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-500">+{media.length - 10}</p>
                    <p className="text-[10px] text-gray-400">more</p>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-10 text-center bg-gradient-to-br from-gray-50/50 to-white">
              <div className="w-14 h-14 rounded-2xl bg-rose-gold/10 flex items-center justify-center mx-auto mb-3">
                <Image className="w-6 h-6 text-rose-gold" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No portfolio photos yet</p>
              <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
                Listings with 5+ photos get 3x more enquiries. Add your best work now!
              </p>
              <Link
                to="/vendor/dashboard/edit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Camera className="w-4 h-4" /> Add Portfolio Photos
              </Link>
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-gray-900">Recent Leads</h2>
              <p className="text-xs text-gray-500">Couples who contacted you this month</p>
            </div>
            {leads.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                {leads.length} total
              </span>
            )}
          </div>

          {leads.length === 0 ? (
            <div className="py-10 text-center rounded-xl bg-gradient-to-br from-gray-50/50 to-white">
              <div className="text-3xl mb-2">📬</div>
              <p className="text-sm font-medium text-gray-600 mb-1">No enquiries yet</p>
              <p className="text-xs text-gray-400">
                {listing.status === 'approved' ? 'They\'ll appear here once couples find your listing.' : 'Your listing needs approval first.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-semibold">Couple</th>
                    <th className="pb-3 font-semibold hidden sm:table-cell">Via</th>
                    <th className="pb-3 font-semibold hidden sm:table-cell">Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.slice(0, 8).map(lead => (
                    <tr key={lead.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5">
                        <p className="font-semibold text-gray-900">{lead.couple_name}</p>
                        {lead.wedding_date && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.wedding_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          lead.source === 'whatsapp' ? 'bg-[#25D366]/10 text-[#25D366]' :
                          lead.source === 'direct' ? 'bg-amber-50 text-amber-600' :
                          lead.source === 'blog' ? 'bg-violet-50 text-violet-600' :
                          'bg-rose-gold/10 text-rose-gold'
                        }`}>
                          {lead.source === 'whatsapp' ? '📱 WhatsApp' :
                           lead.source === 'direct' ? '🔗 Direct' :
                           lead.source === 'blog' ? '📝 Blog' :
                           '🔍 Search'}
                        </span>
                      </td>
                      <td className="py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                          lead.status === 'contacted' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            lead.status === 'new' ? 'bg-blue-500 animate-pulse' :
                            lead.status === 'contacted' ? 'bg-emerald-500' :
                            'bg-gray-400'
                          }`} />
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {lead.phone && (
                            <a
                              href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${lead.couple_name}! Thank you for your enquiry on Wedora. 😊`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                              title="Reply on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`}
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.email && (
                            <a href={`mailto:${lead.email}`}
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              title="Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leads.length > 8 && (
                <div className="text-center pt-4 border-t border-gray-100 mt-2">
                  <button className="text-xs font-semibold text-rose-gold hover:underline">
                    View all {leads.length} leads →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reviews + Tips + Premium Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
          {/* Reviews & Ratings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-500" fill="#f59e0b" /> Reviews & Ratings
            </h2>
            <p className="text-xs text-gray-500 mb-5">From verified couples on Wedora</p>

            {totalReviews > 0 ? (
              <>
                <div className="text-center mb-5">
                  <p className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                  <div className="flex items-center justify-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'}`}
                        fill={s <= Math.round(avgRating) ? '#fbbf24' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Based on {totalReviews} reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingDistribution.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2.5 text-xs">
                      <span className="w-3 text-gray-500 text-right font-medium">{star}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                          style={{ width: `${(count / maxRatingCount) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-gray-500 font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8 text-center rounded-xl bg-gradient-to-br from-amber-50/30 to-white">
                <Star className="w-10 h-10 text-amber-200 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">No reviews yet</p>
                <p className="text-xs text-gray-400 mt-1">Ask happy clients to review you on Wedora!</p>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Growth Tips
            </h2>
            <p className="text-xs text-gray-500 mb-4">Boost your profile performance</p>
            <div className="space-y-3.5">
              {[
                { emoji: '📸', tip: 'Add 5+ portfolio photos — profiles with photos get 3× more enquiries', highlight: !media.length },
                { emoji: '💰', tip: 'Keep pricing updated — couples filter vendors by budget range' },
                { emoji: '⏰', tip: 'Reply to leads within 24hrs — fast responses increase bookings by 40%' },
                { emoji: '⭐', tip: 'Ask happy clients for reviews — 5+ reviews helps you rank higher' },
                { emoji: '📱', tip: 'Share your Wedora link on WhatsApp, Instagram & Google Maps' },
              ].map((item, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${item.highlight ? 'bg-rose-gold/5 border border-rose-gold/10' : 'hover:bg-gray-50'}`}>
                  <span className="text-base flex-shrink-0 mt-0.5">{item.emoji}</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Teaser */}
          <div className="relative bg-white rounded-2xl shadow-sm border border-orange-200/60 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-amber-50/40 to-white" />
            <div className="relative p-5 sm:p-6">
              <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-500" /> Premium Insights
              </h2>
              <p className="text-xs text-gray-500 mb-6">Unlock advanced analytics</p>

              <div className="text-center py-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Lock className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">See Who's Viewing Your Profile</h3>
                <p className="text-xs text-gray-500 mb-5 max-w-[220px] mx-auto leading-relaxed">
                  Get full name, wedding date, city, and budget of every couple who views your listing — then reach out first.
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5">
                  Start Free Trial →
                </button>
                <p className="text-[10px] text-gray-400 mt-2.5">₹999/month · First 30 days free · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Summary Card Component ──────────────────────────────────────────
function SummaryCard({ icon: Icon, iconColor, iconBg, label, value, trend, trendUp, subtext, borderColor = 'border-l-gray-300' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${borderColor} p-4 sm:p-5 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-gray-400">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </p>
      )}
      {subtext && !trend && <p className="text-xs text-gray-500 mt-1.5">{subtext}</p>}
    </div>
  );
}
