import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Globe, ChevronRight, BadgeCheck, Heart, Send, MessageCircle, ArrowLeft, Clock, IndianRupee } from 'lucide-react';
import PublicNav from '../../components/layout/PublicNav';
import { setSEO } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';
import {
  fetchVendorBySlug,
  fetchVendorMedia,
  submitEnquiry,
  getCategoryLabel,
  getCategoryEmoji,
  formatPrice,
} from '../../lib/marketplace';

export default function VendorDetailPage() {
  const { category, slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Enquiry form
  const [formData, setFormData] = useState({ coupleName: '', phone: '', email: '', weddingDate: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const categoryLabel = getCategoryLabel(category);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const v = await fetchVendorBySlug(slug);
      if (v) {
        setVendor(v);
        const m = await fetchVendorMedia(v.id);
        setMedia(m);

        const origin = ensureHttps((import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ''));
        setSEO({
          title: `${v.business_name} — Wedding ${getCategoryLabel(v.category)} in ${v.city} | Wedora`,
          description: v.description?.substring(0, 160) || `${v.business_name} is a wedding ${getCategoryLabel(v.category).toLowerCase()} in ${v.city}. View portfolio, pricing, and send an enquiry on Wedora.`,
          keywords: `${v.business_name}, wedding ${getCategoryLabel(v.category).toLowerCase()} ${v.city}, ${v.city} wedding vendor`,
          canonicalUrl: `${origin}/marketplace/${v.category}/${v.slug}`,
        });

        // JSON-LD LocalBusiness
        const jsonLd = document.createElement('script');
        jsonLd.id = 'vendor-jsonld';
        jsonLd.type = 'application/ld+json';
        jsonLd.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: v.business_name,
          description: v.description,
          address: { '@type': 'PostalAddress', addressLocality: v.city, addressCountry: 'IN' },
          telephone: v.phone || undefined,
          email: v.email || undefined,
          url: v.website || undefined,
          priceRange: v.price_range_min ? `${formatPrice(v.price_range_min)} - ${formatPrice(v.price_range_max)}` : undefined,
        });
        document.getElementById('vendor-jsonld')?.remove();
        document.head.appendChild(jsonLd);
      }
      setLoading(false);
    }
    load();
    return () => document.getElementById('vendor-jsonld')?.remove();
  }, [slug, category]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!formData.coupleName.trim()) { setFormError('Please enter your name'); return; }
    if (!formData.phone.trim()) { setFormError('Please enter your phone number'); return; }

    setSubmitting(true);
    const result = await submitEnquiry(vendor.id, formData);
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setFormError('Something went wrong. Please try again.');
    }
  }

  function handleWhatsApp() {
    if (!vendor?.phone) return;
    const cleanPhone = vendor.phone.replace(/\D/g, '');
    const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const msg = encodeURIComponent(`Hi ${vendor.business_name}! I found your listing on Wedora and I'm interested in your services for my wedding. Could we discuss further?`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PublicNav />
        <div className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="h-64 sm:h-80 rounded-2xl animate-shimmer mb-8" />
          <div className="h-8 w-2/3 rounded animate-shimmer mb-4" />
          <div className="h-5 w-1/3 rounded animate-shimmer mb-8" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl animate-shimmer" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white">
        <PublicNav />
        <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Vendor Not Found</h1>
          <p className="text-gray-500 mb-6">This vendor listing may have been removed or is no longer available.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 animate-fade-in flex-wrap">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/marketplace" className="hover:text-gray-600 transition-colors">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/marketplace/${vendor.category}`} className="hover:text-gray-600 transition-colors">{categoryLabel}s</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">{vendor.business_name}</span>
          </nav>

          {/* Cover Image */}
          <div className="h-56 sm:h-80 rounded-2xl overflow-hidden mb-8 relative bg-gradient-to-br from-gray-100 to-gray-200 animate-fade-in-up">
            {vendor.cover_image ? (
              <img src={vendor.cover_image} alt={vendor.business_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">{getCategoryEmoji(vendor.category)}</span>
              </div>
            )}
            {vendor.featured && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wide shadow">
                ⭐ Featured Vendor
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Info */}
              <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-start gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">{vendor.business_name}</h1>
                  {vendor.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mt-1">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="text-lg">{getCategoryEmoji(vendor.category)}</span>
                    {getCategoryLabel(vendor.category)}
                  </span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {vendor.city}</span>
                  {vendor.price_range_min > 0 && (
                    <span className="flex items-center gap-1 font-semibold text-gray-900">
                      <IndianRupee className="w-4 h-4 text-gray-400" />
                      {formatPrice(vendor.price_range_min)}
                      {vendor.price_range_max > 0 ? ` – ${formatPrice(vendor.price_range_max)}` : '+'}
                    </span>
                  )}
                </div>
              </div>

              {/* About */}
              {vendor.description && (
                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <h2 className="text-lg font-serif font-bold text-gray-900 mb-3">About</h2>
                  <div className="glass-card p-5">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{vendor.description}</p>
                  </div>
                </div>
              )}

              {/* Contact Details */}
              <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                <h2 className="text-lg font-serif font-bold text-gray-900 mb-3">Contact Details</h2>
                <div className="glass-card p-5 space-y-3">
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-gold transition-colors">
                      <Phone className="w-4 h-4 text-gray-400" /> {vendor.phone}
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-gold transition-colors">
                      <Mail className="w-4 h-4 text-gray-400" /> {vendor.email}
                    </a>
                  )}
                  {vendor.website && (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-gold transition-colors">
                      <Globe className="w-4 h-4 text-gray-400" /> {vendor.website}
                    </a>
                  )}
                  {vendor.phone && (
                    <button
                      onClick={handleWhatsApp}
                      className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold shadow hover:shadow-lg transition-all hover:-translate-y-0.5"
                      id="whatsapp-button"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                    </button>
                  )}
                </div>
              </div>

              {/* Portfolio Gallery */}
              {media.length > 0 && (
                <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <h2 className="text-lg font-serif font-bold text-gray-900 mb-3">Portfolio</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {media.map((m, i) => (
                      <button
                        key={m.id}
                        onClick={() => setLightboxImg(m.image_url)}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity focus:ring-2 focus:ring-rose-gold/30 focus:outline-none"
                      >
                        <img src={m.image_url} alt={m.caption || `${vendor.business_name} portfolio ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — Enquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="glass-card p-6">
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">Send an Enquiry</h3>
                  <p className="text-xs text-gray-500 mb-5">Get in touch with {vendor.business_name} about your wedding</p>

                  {submitted ? (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-3">✅</div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">Enquiry Sent!</h4>
                      <p className="text-sm text-gray-600">
                        {vendor.business_name} will get back to you soon. You can also reach them directly via phone or WhatsApp.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="enquiry-name" className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                        <input
                          id="enquiry-name"
                          type="text"
                          value={formData.coupleName}
                          onChange={e => setFormData(p => ({ ...p, coupleName: e.target.value }))}
                          placeholder="e.g. Priya & Rahul"
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                        />
                      </div>
                      <div>
                        <label htmlFor="enquiry-phone" className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                        <input
                          id="enquiry-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                          placeholder="e.g. 9876543210"
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                        />
                      </div>
                      <div>
                        <label htmlFor="enquiry-email" className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input
                          id="enquiry-email"
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          placeholder="your@email.com"
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                        />
                      </div>
                      <div>
                        <label htmlFor="enquiry-date" className="block text-xs font-semibold text-gray-600 mb-1">Wedding Date</label>
                        <input
                          id="enquiry-date"
                          type="date"
                          value={formData.weddingDate}
                          onChange={e => setFormData(p => ({ ...p, weddingDate: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                        />
                      </div>
                      <div>
                        <label htmlFor="enquiry-message" className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                        <textarea
                          id="enquiry-message"
                          rows={3}
                          value={formData.message}
                          onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                          placeholder="Tell them about your wedding plans..."
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30 resize-none"
                        />
                      </div>
                      {formError && (
                        <p className="text-xs text-red-500 font-medium">{formError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                        id="submit-enquiry"
                      >
                        {submitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Enquiry</>}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <img src={lightboxImg} alt="Portfolio" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" />
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
