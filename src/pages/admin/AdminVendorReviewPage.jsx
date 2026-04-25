import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, MapPin, Phone, Mail, Globe, CheckCircle2, XCircle, Star, Shield, ExternalLink, Clock } from 'lucide-react';
import {
  adminFetchVendorById,
  adminUpdateVendorStatus,
  adminToggleVerified,
  adminToggleFeatured,
  fetchVendorMedia,
  fetchLeadsForVendor,
  getCategoryLabel,
  getCategoryEmoji,
  formatPrice,
} from '../../lib/marketplace';

export default function AdminVendorReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [media, setMedia] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    async function load() {
      const v = await adminFetchVendorById(id);
      if (v) {
        setVendor(v);
        const [m, l] = await Promise.all([
          fetchVendorMedia(v.id),
          fetchLeadsForVendor(v.id),
        ]);
        setMedia(m);
        setLeads(l);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleStatus(newStatus) {
    setActionLoading(newStatus);
    const result = await adminUpdateVendorStatus(vendor.id, newStatus);
    if (result.success) {
      setVendor(prev => ({ ...prev, status: newStatus }));
    }
    setActionLoading('');
  }

  async function handleVerified() {
    setActionLoading('verify');
    const result = await adminToggleVerified(vendor.id, !vendor.is_verified);
    if (result.success) {
      setVendor(prev => ({ ...prev, is_verified: !prev.is_verified }));
    }
    setActionLoading('');
  }

  async function handleFeatured() {
    setActionLoading('featured');
    const result = await adminToggleFeatured(vendor.id, !vendor.featured);
    if (result.success) {
      setVendor(prev => ({ ...prev, featured: !prev.featured }));
    }
    setActionLoading('');
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse-soft">
        <div className="h-8 w-1/3 rounded animate-shimmer" />
        <div className="h-48 rounded-2xl animate-shimmer" />
        <div className="h-32 rounded-2xl animate-shimmer" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">Vendor Not Found</h2>
        <button onClick={() => navigate('/admin/vendors')} className="text-sm text-rose-gold hover:underline">← Back to list</button>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    suspended: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">

      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate('/admin/vendors')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">{vendor.business_name}</h1>
          <p className="text-sm text-gray-500">
            {getCategoryEmoji(vendor.category)} {getCategoryLabel(vendor.category)} · {vendor.city}
          </p>
        </div>
      </div>

      {/* Status + Actions */}
      <div className="glass-card p-5 mb-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[vendor.status]}`}>
              {vendor.status}
            </span>
            {vendor.is_verified && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
            {vendor.featured && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {vendor.status !== 'approved' && (
              <button
                onClick={() => handleStatus('approved')}
                disabled={!!actionLoading}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </button>
            )}
            {vendor.status !== 'rejected' && (
              <button
                onClick={() => handleStatus('rejected')}
                disabled={!!actionLoading}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            )}
            {vendor.status !== 'suspended' && vendor.status !== 'pending' && (
              <button
                onClick={() => handleStatus('suspended')}
                disabled={!!actionLoading}
                className="px-4 py-2 rounded-xl bg-gray-500 text-white text-xs font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Suspend
              </button>
            )}
            <button
              onClick={handleVerified}
              disabled={!!actionLoading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                vendor.is_verified
                  ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> {vendor.is_verified ? 'Remove Verified' : 'Mark Verified'}
            </button>
            <button
              onClick={handleFeatured}
              disabled={!!actionLoading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                vendor.featured
                  ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Star className="w-3.5 h-3.5" /> {vendor.featured ? 'Remove Featured' : 'Mark Featured'}
            </button>
          </div>
        </div>
      </div>

      {/* Listing Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        {/* Cover Image */}
        <div className="glass-card overflow-hidden lg:col-span-2 animate-fade-in-up bg-gradient-to-br from-gray-100 to-gray-200" style={{ animationDelay: '100ms' }}>
          <div className="aspect-[21/9] w-full relative">
            {vendor.cover_image ? (
              <img src={vendor.cover_image} alt={vendor.business_name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl drop-shadow-sm">{getCategoryEmoji(vendor.category)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="glass-card p-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Details</h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{vendor.city}</span></p>
            {vendor.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{vendor.phone}</span></p>}
            {vendor.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate" title={vendor.email}>{vendor.email}</span></p>}
            {vendor.website && (
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400 shrink-0" /> 
                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-rose-gold hover:underline truncate" title={vendor.website}>
                  {vendor.website.replace(/^https?:\/\//, '')}
                </a>
              </p>
            )}
            {vendor.price_range_min > 0 && (
              <p className="text-gray-700 font-medium">
                Price Range: {formatPrice(vendor.price_range_min)} – {formatPrice(vendor.price_range_max)}
              </p>
            )}
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Submitted {new Date(vendor.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {vendor.status === 'approved' && (
            <Link
              to={`/marketplace/${vendor.category}/${vendor.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-gold hover:underline mt-2"
            >
              <ExternalLink className="w-3 h-3" /> View Public Page
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      {vendor.description && (
        <div className="glass-card p-5 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Description</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{vendor.description}</p>
        </div>
      )}

      {/* Portfolio */}
      {media.length > 0 && (
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Portfolio ({media.length} photos)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {media.map(m => (
              <div key={m.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img src={m.image_url} alt="Portfolio" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leads */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
          Enquiries ({leads.length})
        </h3>
        {leads.length === 0 ? (
          <div className="glass-card p-6 text-center text-sm text-gray-500">No enquiries received yet</div>
        ) : (
          <div className="space-y-2">
            {leads.map(lead => (
              <div key={lead.id} className="glass-card p-3 flex items-start gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{lead.couple_name}</p>
                  <p className="text-xs text-gray-500">{lead.phone} · {lead.email}</p>
                  {lead.message && <p className="text-xs text-gray-600 mt-1">{lead.message}</p>}
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
