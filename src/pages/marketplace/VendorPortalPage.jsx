import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Store, ArrowRight, Eye, Phone, Mail, Calendar, MessageCircle, Edit3,
  ExternalLink, AlertCircle, CheckCircle2, Clock, XCircle, ChevronLeft,
  Star, TrendingUp, Zap, Lock, BarChart3, Lightbulb, Users, ArrowUpRight,
  ArrowDownRight, Briefcase, Image, Camera, CheckCircle, ChevronDown, Check, X, Shield, IndianRupee
} from 'lucide-react';
import {
  fetchMyListing, fetchLeadsForVendor, fetchVendorReviews, fetchVendorMedia,
  fetchProfileViewStats, fetchLeadSourceStats, updateLeadCRM,
  getCategoryLabel, getCategoryEmoji, formatPrice,
} from '../../lib/marketplace';
import VendorInbox from '../../components/chat/VendorInbox';
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

  // CRM UI State
  const [updatingLeadId, setUpdatingLeadId] = useState(null);
  const [activeNotesEditor, setActiveNotesEditor] = useState(null);
  const [tempNotes, setTempNotes] = useState('');
  const [tempValue, setTempValue] = useState('');

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

            <Link
              to="/vendor/dashboard/edit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              Create Your Free Listing <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── SaaS Dashboard Logic ────────────────────────────
  const status = STATUS_CONFIG[listing.status] || STATUS_CONFIG.pending;
  
  // Pipeline Stats
  const newLeads = leads.filter(l => l.status === 'new');
  const bookedLeads = leads.filter(l => l.status === 'booked');
  
  // Revenue Stats
  const potentialRevenue = leads.filter(l => l.status !== 'closed_lost').reduce((acc, l) => acc + (l.estimated_value || 0), 0);
  const wonRevenue = bookedLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);
  const pipelineConversionRate = leads.length > 0 ? ((bookedLeads.length / leads.length) * 100).toFixed(1) : '0.0';

  // AI Insights Engine (Pseudo Dynamic based on stats)
  const aiInsights = [
    { icon: Eye, text: "Your profile is viewed most on weekends", metric: "+15% weekend traffic" },
    { icon: IndianRupee, text: "Couples prefer vendors with clear pricing", metric: "3x more leads" },
    { icon: Zap, text: "Replying within 1 hour boosts bookings", metric: "40% higher close rate" },
  ];

  // Profile Health Score (max 100)
  let healthScore = 20; // Base presence
  let missingHealthItems = [];
  if (media.length >= 5) healthScore += 20; else missingHealthItems.push('Upload 5+ photos');
  if (listing.price_range_min > 0) healthScore += 20; else missingHealthItems.push('Add pricing details');
  if (listing.description && listing.description.length > 50) healthScore += 20; else missingHealthItems.push('Expand description');
  if (reviews.length > 0) healthScore += 20; else missingHealthItems.push('Get your first review');

  const avgRating = listing.rating_avg || 0;
  const totalReviews = listing.reviews_count || 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star, count: reviews.filter(r => r.rating === star).length,
  }));
  const maxRatingCount = Math.max(...ratingDistribution.map(r => r.count), 1);
  const DONUT_COLORS = ['#C0707A', '#25D366', '#F59E0B', '#8B5CF6', '#94A3B8'];

  // CRM Handlers
  const handleLeadStatusChange = async (leadId, newStatus) => {
    setUpdatingLeadId(leadId);
    const result = await updateLeadCRM(leadId, { status: newStatus });
    if (result.success) {
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    }
    setUpdatingLeadId(null);
  };

  const handleSaveNotes = async (leadId) => {
    setUpdatingLeadId(leadId);
    const result = await updateLeadCRM(leadId, { notes: tempNotes, estimatedValue: tempValue });
    if (result.success) {
      setLeads(leads.map(l => l.id === leadId ? { ...l, notes: tempNotes, estimated_value: parseInt(tempValue) || 0 } : l));
      setActiveNotesEditor(null);
    }
    setUpdatingLeadId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* ═══ HERO BANNER ═══ */}
      <div className="relative">
        <div className="h-48 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 overflow-hidden">
          {listing.cover_image ? (
            <img src={listing.cover_image} alt={listing.business_name} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl block mb-2">{getCategoryEmoji(listing.category)}</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>

        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Link to="/vendor/dashboard/edit" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                <Edit3 className="w-4 h-4" /> Edit Listing
              </Link>
            </div>
          </div>
        </div>

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
                  {listing.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
              {listing.status === 'approved' && (
                <Link to={`/marketplace/${listing.category}/${listing.slug}`} target="_blank" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-semibold hover:bg-white/20 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Page
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2 pb-10 relative z-20 space-y-5">
        {listing.status !== 'approved' ? (
          <div className={`mt-8 rounded-2xl p-8 sm:p-12 text-center border-2 shadow-sm ${status.color}`}>
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-white shadow-md border border-inherit">
              <status.icon className="w-10 h-10 border-inherit" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{status.label}</h2>
            <p className="text-sm sm:text-base opacity-90 max-w-lg mx-auto leading-relaxed">{status.desc}</p>
            
            {listing.status === 'rejected' && (
              <Link to="/vendor/dashboard/edit" className="inline-block mt-8 px-8 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition shadow-lg">
                Edit Listing to Resubmit
              </Link>
            )}
            
            {listing.status === 'pending' && (
              <div className="mt-10 p-6 bg-white/50 rounded-xl border border-inherit max-w-xl mx-auto text-left flex flex-col items-center">
                <div className="w-full">
                  <h3 className="font-bold text-sm mb-3 text-inherit">What happens next?</h3>
                  <ul className="text-sm space-y-2 opacity-90 text-inherit">
                    <li>• Our moderation team reviews all details to ensure quality.</li>
                    <li>• This usually takes between 12 to 24 hours.</li>
                    <li>• Once approved, you will unlock this dashboard to view your profile analytics, respond to couples, and track your business.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
        {/* Profile Health Score & Banner */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm border border-gray-100 animate-fade-in-up">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={healthScore === 100 ? '#10B981' : '#C0707A'} strokeWidth="3" strokeDasharray={`${healthScore}, 100`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-[13px] font-bold text-gray-900">{healthScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Profile Health Score</p>
              <p className="text-xs text-gray-500">
                {healthScore === 100 ? 'Your profile is optimized for maximum conversions! 🚀' : 'Improve your profile to rank higher and get more leads.'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
            {missingHealthItems.slice(0, 2).map((item, i) => (
              <Link key={i} to="/vendor/dashboard/edit" className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-rose-gold/5 border border-rose-gold/20 text-rose-gold rounded-lg text-xs font-semibold hover:bg-rose-gold/10 transition">
                <ArrowRight className="w-3 h-3" /> {item}
              </Link>
            ))}
            {newLeads.length > 0 && (
              <a href="#leads" className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                <MessageCircle className="w-3 h-3" /> Respond to {newLeads.length} new lead{newLeads.length > 1 && 's'}
              </a>
            )}
            {!listing.is_verified && (
               <a href="mailto:support@wedora.in?subject=Verification Request" className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition">
                <Shield className="w-3 h-3" /> Get Verified Badge
              </a>
            )}
          </div>
        </div>

        {/* 4 Summary Cards (REVENUE/CRM TRACKING) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <SummaryCard
            icon={Eye} iconColor="text-blue-600" iconBg="bg-gradient-to-br from-blue-100 to-blue-50"
            label="PROFILE VIEWS" value={viewStats.total}
            borderColor="border-l-blue-500"
          />
          <SummaryCard
            icon={IndianRupee} iconColor="text-amber-600" iconBg="bg-gradient-to-br from-amber-100 to-amber-50"
            label="PIPELINE VALUE" value={formatPrice(potentialRevenue) || '₹0'}
            borderColor="border-l-amber-500"
            subtext="Active open deals"
          />
          <SummaryCard
            icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-gradient-to-br from-emerald-100 to-emerald-50"
            label="BOOKINGS WON" value={bookedLeads.length}
            borderColor="border-l-emerald-500"
            subtext={`${formatPrice(wonRevenue)} derived revenue`}
          />
          <SummaryCard
            icon={BarChart3} iconColor="text-violet-600" iconBg="bg-gradient-to-br from-violet-100 to-violet-50"
            label="CONVERSION %" value={`${pipelineConversionRate}%`}
            borderColor="border-l-violet-500"
            subtext="Enquiry to Booked rate"
          />
        </div>

        {/* Lead Pipeline CRM */}
        <div id="leads" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-gold" /> Lead Pipeline (CRM)
              </h2>
              <p className="text-xs text-gray-500">Manage your enquiries, update statuses, and track revenue.</p>
            </div>
            {leads.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold whitespace-nowrap">
                {leads.length} Active Deals
              </span>
            )}
          </div>

          {leads.length === 0 ? (
            <div className="py-10 text-center rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/50">
              <div className="text-3xl mb-2">📬</div>
              <p className="text-sm font-medium text-gray-600 mb-1">Your pipeline is empty</p>
              <p className="text-xs text-gray-400">Enquiries will appear here. Build your profile to attract leads.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[11px] uppercase text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-semibold px-2">Couple & Date</th>
                    <th className="pb-3 font-semibold px-2">Via</th>
                    <th className="pb-3 font-semibold px-2">Est Value</th>
                    <th className="pb-3 font-semibold px-2">Status</th>
                    <th className="pb-3 font-semibold px-2 text-right">CRM Notes / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="group hover:bg-rose-gold/5 transition-colors">
                      <td className="py-3 px-2 min-w-[140px]">
                        <p className="font-semibold text-gray-900">{lead.couple_name}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} 
                          {lead.wedding_date && ` • W: ${new Date(lead.wedding_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                        </p>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] uppercase font-bold">
                          {lead.source || 'Search'}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium text-gray-700">
                        {lead.estimated_value > 0 ? formatPrice(lead.estimated_value) : '—'}
                      </td>
                      <td className="py-3 px-2">
                        <div className="relative inline-block w-32">
                          <select
                            disabled={updatingLeadId === lead.id}
                            value={lead.status}
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                            className={`w-full appearance-none px-2.5 py-1.5 pr-6 rounded-lg text-xs font-bold uppercase transition focus:outline-none focus:ring-2 focus:ring-rose-gold/20 cursor-pointer ${
                              lead.status === 'new' ? 'bg-blue-50 text-blue-700' :
                              lead.status === 'contacted' ? 'bg-sky-50 text-sky-700' :
                              lead.status === 'negotiating' ? 'bg-amber-50 text-amber-700' :
                              lead.status === 'booked' ? 'bg-emerald-50 text-emerald-700' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <option value="new">🆕 New</option>
                            <option value="contacted">📞 Contacted</option>
                            <option value="negotiating">💬 Negotiating</option>
                            <option value="booked">✅ Booked</option>
                            <option value="closed_lost">❌ Closed Lost</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none opacity-50" />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5 w-full">
                           {lead.status === 'booked' && (
                              <a href={`mailto:${lead.email}?subject=Review us on Wedora!&body=Hi ${lead.couple_name},%0D%0A%0D%0AThank you for booking us! We would love if you could drop a review on our Wedora profile.%0D%0A%0D%0AThanks!`}
                                 className="px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition whitespace-nowrap text-[10px] font-bold"
                                 title="Send Review Request"
                              >
                                ⭐ Request Review
                              </a>
                            )}
                          <button
                            onClick={() => { setActiveNotesEditor(lead.id); setTempNotes(lead.notes || ''); setTempValue(lead.estimated_value || ''); }}
                            className="px-2 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-[10px] font-bold uppercase"
                          >
                            {lead.notes ? 'View Notes' : '+ Note'}
                          </button>
                          {lead.phone && (
                            <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition" title="WhatsApp">
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Inline Edit Modal for Notes & Value */}
          {activeNotesEditor && (
             <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-left">
               <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                 <button onClick={() => setActiveNotesEditor(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <X className="w-4 h-4" />
                 </button>
                 <h3 className="font-serif font-bold text-gray-900 mb-4 text-lg">Lead Details (CRM)</h3>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Estimated Deal Value (₹)</label>
                     <input type="number" value={tempValue} onChange={(e) => setTempValue(e.target.value)} placeholder="e.g. 150000" className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-gold/20 focus:border-rose-gold outline-none text-sm transition-all" />
                     <p className="text-[10px] text-gray-400 mt-1">Used to calculate your potential pipeline revenue.</p>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Private Notes</label>
                     <textarea value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} placeholder="Type private notes about this lead here... (Only you can see this)" rows={4} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-gold/20 focus:border-rose-gold outline-none text-sm transition-all resize-none" />
                   </div>
                 </div>

                 <button
                    disabled={updatingLeadId === activeNotesEditor}
                    onClick={() => handleSaveNotes(activeNotesEditor)}
                    className="w-full mt-6 h-11 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                 >
                   {updatingLeadId === activeNotesEditor ? 'Saving...' : 'Save CRM Details'}
                 </button>
               </div>
             </div>
          )}
        </div>

        {/* Real-time Chat Inbox */}
        <div id="messages" className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <VendorInbox vendorId={listing.user_id} />
        </div>

        {/* Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 animate-fade-in-up md:h-72" style={{ animationDelay: '120ms' }}>
          {/* Profile Views Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-serif font-bold text-gray-900">Profile Views Over Time</h2>
                <p className="text-xs text-gray-500">Daily views from couple searches</p>
              </div>
            </div>
            {viewStats.chartData.length > 0 ? (
              <div className="flex-1 min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewStats.chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="views" stroke="#C0707A" strokeWidth={2.5} dot={{ fill: '#C0707A', r: 4, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-white">
                <p className="text-sm text-gray-400 font-medium">No views recorded yet in this period.</p>
              </div>
            )}
          </div>

          {/* Automated AI Insights */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl shadow-sm border border-indigo-100 p-5 sm:p-6 h-full flex flex-col">
            <h2 className="text-base font-serif font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500/20" /> Automated Insights
            </h2>
            <p className="text-xs text-gray-500 mb-4">AI-driven ideas to boost your bookings (Static)</p>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="bg-white/60 p-3 rounded-xl border border-white flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                     <insight.icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase mb-1">
                      {insight.metric}
                    </span>
                    <p className="text-[11px] font-medium text-gray-700 leading-snug">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
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
              Manage Photos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {media.slice(0, 5).map((item, i) => (
                <div key={item.id || i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer relative">
                  <img src={item.image_url} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
              ))}
              {media.length > 5 && (
                <Link to="/vendor/dashboard/edit" className="aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-500">+{media.length - 5}</p>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-10 text-center bg-gray-50/50">
              <Camera className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700 mb-1">No portfolio photos yet</p>
              <Link to="/vendor/dashboard/edit" className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-gold text-white text-sm font-semibold hover:shadow-lg transition-all">
                Add Photography
              </Link>
            </div>
          )}
        </div>

        {/* REVIEWS & NEW MONETIZATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
          
          {/* Reviews & Ratings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col">
            <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-500" fill="#f59e0b" /> Reviews & Ratings
            </h2>
            <p className="text-xs text-gray-500 mb-5">From verified couples on Wedora</p>

            {totalReviews > 0 ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-5">
                  <p className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1.5">Based on {totalReviews} reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingDistribution.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2.5 text-xs">
                      <span className="w-3 text-gray-500 text-right font-medium">{star}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${(count / maxRatingCount) * 100}%` }} />
                      </div>
                      <span className="w-6 text-right text-gray-500 font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 rounded-xl bg-amber-50/30">
                <Star className="w-10 h-10 text-amber-200 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">No reviews yet</p>
                <p className="text-xs text-gray-400 mt-1">Ask happy clients to review you!</p>
              </div>
            )}
          </div>

          {/* SaaS Pricing Plans (Monetization Engine) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
               <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
                 <Briefcase className="w-4 h-4 text-rose-gold" /> Upgrade Your Plan
               </h2>
               <p className="text-xs text-gray-500 mt-0.5">Scale your wedding business faster.</p>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
               {/* Featured Plan */}
               <div className="border border-gray-200 rounded-xl p-4 flex flex-col">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Featured</p>
                 <div className="mt-1 mb-3">
                   <span className="text-xl font-bold text-gray-900">₹999</span>
                   <span className="text-[10px] text-gray-500">/mo</span>
                 </div>
                 <ul className="space-y-2 mb-4 flex-1">
                   <li className="flex items-start gap-2 text-xs text-gray-600">
                     <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" /> Top Placement
                   </li>
                   <li className="flex items-start gap-2 text-xs text-gray-600">
                     <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" /> Verified Badge
                   </li>
                 </ul>
                 <button onClick={() => alert("Monetization gateway coming soon")} className="w-full py-2 rounded-lg border-2 border-gray-900 text-gray-900 text-xs font-bold hover:bg-gray-900 hover:text-white transition">
                   Upgrade Now
                 </button>
               </div>

               {/* Pro Plan */}
               <div className="border-2 border-orange-400 bg-gradient-to-b from-orange-50/50 to-white rounded-xl p-4 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-orange-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                 <p className="text-xs font-bold text-orange-500 uppercase tracking-wide flex items-center gap-1">Pro <Zap className="w-3 h-3 fill-current" /></p>
                 <div className="mt-1 mb-3">
                   <span className="text-xl font-bold text-gray-900">₹2499</span>
                   <span className="text-[10px] text-gray-500">/mo</span>
                 </div>
                 <ul className="space-y-2 mb-4 flex-1">
                   <li className="flex items-start gap-2 text-xs font-medium text-gray-800">
                     <Check className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" /> See Who Viewed Profile
                   </li>
                   <li className="flex items-start gap-2 text-xs text-gray-600">
                     <Check className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" /> Priority Leads
                   </li>
                   <li className="flex items-start gap-2 text-xs text-gray-600">
                     <Check className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" /> Advanced CRM Analytics
                   </li>
                 </ul>
                 <button onClick={() => alert("Monetization gateway coming soon")} className="w-full py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition">
                   Upgrade to Pro
                 </button>
               </div>
            </div>
          </div>
          
            </div>
          </>
        )}
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
