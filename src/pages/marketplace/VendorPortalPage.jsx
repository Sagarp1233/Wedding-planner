import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, ArrowRight, Eye, Phone, Mail, Calendar, MessageCircle, Edit3, ExternalLink, AlertCircle, CheckCircle2, Clock, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { fetchMyListing, fetchLeadsForVendor, getCategoryLabel, getCategoryEmoji, formatPrice } from '../../lib/marketplace';

export default function VendorPortalPage() {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const myLeads = await fetchLeadsForVendor(myListing.id);
        setLeads(myLeads);
      }
      setLoading(false);
    }
    load();
  }, [currentUser, isAuthenticated, authLoading, navigate]);

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
    pending: { icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200', label: '⏳ Your listing is being reviewed', desc: 'Our team will review your listing within 24 hours.' },
    approved: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: '✅ Your listing is live!', desc: 'Couples can now find and contact you through Wedora.' },
    rejected: { icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200', label: '❌ Your listing needs changes', desc: 'Please update your listing and resubmit for review.' },
    suspended: { icon: AlertCircle, color: 'bg-gray-100 text-gray-600 border-gray-200', label: '⚠️ Your listing has been suspended', desc: 'Contact support if you believe this is an error.' },
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
              to="/vendor-portal/edit"
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

  // ─── Has Listing — Dashboard ──────────────────────────────────────
  const status = STATUS_CONFIG[listing.status] || STATUS_CONFIG.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blush to-ivory px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-1">Vendor Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your listing, view leads, and grow your business</p>
          </div>
          <Link
            to="/vendor-portal/edit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            id="edit-listing-button"
          >
            <Edit3 className="w-4 h-4" /> Edit Listing
          </Link>
        </div>

        {/* Status Banner */}
        <div className={`glass-card p-4 mb-6 border ${status.color} animate-fade-in-up`} style={{ animationDelay: '100ms' }}>
          <p className="font-semibold text-sm">{status.label}</p>
          <p className="text-xs mt-0.5 opacity-80">{status.desc}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-serif font-bold text-gray-900">{leads.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Enquiries</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-serif font-bold text-gray-900">{leads.filter(l => l.status === 'new').length}</p>
            <p className="text-xs text-gray-500 mt-0.5">New Leads</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-serif font-bold capitalize text-gray-900">{listing.status}</p>
            <p className="text-xs text-gray-500 mt-0.5">Listing Status</p>
          </div>
        </div>

        {/* Listing Preview */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-serif font-bold text-gray-900 mb-3">Your Listing Preview</h2>
          <div className="glass-card overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {listing.cover_image ? (
                <img src={listing.cover_image} alt={listing.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl">{getCategoryEmoji(listing.category)}</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">{listing.business_name}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                <span>{getCategoryLabel(listing.category)}</span>
                <span>📍 {listing.city}</span>
                {listing.price_range_min > 0 && (
                  <span className="font-medium text-gray-700">
                    {formatPrice(listing.price_range_min)} – {formatPrice(listing.price_range_max)}
                  </span>
                )}
              </div>
              {listing.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
              )}
              {listing.status === 'approved' && (
                <Link
                  to={`/marketplace/${listing.category}/${listing.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-gold hover:underline"
                  target="_blank"
                >
                  View Public Page <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-lg font-serif font-bold text-gray-900 mb-3">
            Enquiries Received ({leads.length})
          </h2>

          {leads.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">📬</div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No enquiries yet</h3>
              <p className="text-sm text-gray-500">
                {listing.status === 'approved'
                  ? "Once couples find your listing, their enquiries will appear here."
                  : "Your listing needs to be approved before couples can send enquiries."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map(lead => (
                <div key={lead.id} className="glass-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{lead.couple_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    {lead.status === 'new' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">New</span>
                    )}
                  </div>
                  {lead.message && <p className="text-sm text-gray-600 mb-3">{lead.message}</p>}
                  <div className="flex flex-wrap items-center gap-3">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </a>
                    )}
                    {lead.wedding_date && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs">
                        <Calendar className="w-3 h-3" /> {new Date(lead.wedding_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {lead.phone && (
                      <a
                        href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${lead.couple_name}! Thank you for your enquiry on Wedora. I'd love to discuss your wedding plans. 😊`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
