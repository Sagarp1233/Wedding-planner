import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Globe, ChevronRight, BadgeCheck, Heart, Send, MessageCircle, ArrowLeft, Clock, IndianRupee, Star, StarHalf, UserCircle2, Trash2 } from 'lucide-react';
import PublicNav from '../../components/layout/PublicNav';
import { setSEO } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';
import {
  fetchVendorBySlug,
  fetchVendorMedia,
  fetchVendorReviews,
  submitVendorReview,
  deleteVendorReview,
  submitEnquiry,
  trackProfileView,
  getCategoryLabel,
  getCategoryEmoji,
  formatPrice,
} from '../../lib/marketplace';
import { getOrCreateConversation } from '../../lib/chat';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function VendorDetailPage() {
  const { category, slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [media, setMedia] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Review form
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Enquiry form
  const [formData, setFormData] = useState({ coupleName: '', phone: '', email: '', weddingDate: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const categoryLabel = getCategoryLabel(category);
  const { isAuthenticated, activeWeddingId, currentUser } = useAuth();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [startingChat, setStartingChat] = useState(false);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setStartingChat(true);
    const result = await getOrCreateConversation(currentUser.id, vendor.user_id, vendor.id);
    if (result.success) {
      navigate('/dashboard/messages');
    } else {
      alert('Failed to start chat: ' + result.error);
      setStartingChat(false);
    }
  };

  const isShortlisted = vendor && state?.vendors?.some(
    v => v.name === vendor.business_name && v.phone === (vendor.phone || '')
  );

  function toggleShortlist() {
    if (!isAuthenticated || !activeWeddingId) {
      alert('Please log in and create a wedding plan to shortlist vendors!');
      return;
    }
    if (isShortlisted) {
      const match = state.vendors.find(v => v.name === vendor.business_name && v.phone === (vendor.phone || ''));
      if (match) {
        dispatch({ type: 'DELETE_VENDOR', payload: match.id });
      }
    } else {
      dispatch({
        type: 'ADD_VENDOR',
        payload: {
          name: vendor.business_name,
          category: vendor.category, // Map marketplace category to tracker category
          contactPerson: '',
          phone: vendor.phone || '',
          email: vendor.email || '',
          location: vendor.city,
          quotedAmount: vendor.price_range_min || 0,
          advancePaid: 0,
          nextPaymentDate: '',
          notes: `Found on Wedora Marketplace: ${window.location.href}`,
          status: 'shortlisted'
        }
      });
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const v = await fetchVendorBySlug(slug);
      if (v) {
        setVendor(v);
        const m = await fetchVendorMedia(v.id);
        setMedia(m);
        const r = await fetchVendorReviews(v.id);
        setReviews(r);

        // Track profile view (fire-and-forget)
        trackProfileView(v.id, currentUser?.id || null);

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

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) return alert("Please log in to submit a review.");
    if (reviewRating === 0) return alert("Please select a star rating.");
    
    setSubmittingReview(true);
    const res = await submitVendorReview(vendor.id, currentUser?.id, reviewRating, reviewComment);
    setSubmittingReview(false);
    
    if (res.success) {
      setReviewRating(0);
      setReviewComment('');
      // Reload reviews
      const updatedReviews = await fetchVendorReviews(vendor.id);
      setReviews(updatedReviews);
    } else {
      alert("Failed to submit review.");
    }
  }

  async function handleDeleteReview(reviewId) {
    if (confirm("Are you sure you want to delete this review?")) {
      const res = await deleteVendorReview(reviewId);
      if (res.success) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
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
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">{vendor.business_name}</h1>
                    {vendor.is_verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mt-1">
                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  {(isAuthenticated) ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={handleStartChat}
                        disabled={startingChat}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:opacity-90 disabled:opacity-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">{startingChat ? 'Starting...' : 'Live Chat'}</span>
                      </button>
                      <button 
                        onClick={toggleShortlist}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${isShortlisted ? 'bg-rose-gold text-white hover:bg-rose-gold/90' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-rose-gold'}`}
                      >
                        <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline">{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
                       <MessageCircle className="w-4 h-4" /> Log in to Chat
                    </Link>
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
                {isAuthenticated ? (
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
                ) : (
                  <div className="glass-card p-6 text-center bg-gray-50/50 border border-dashed border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Contact details are locked</p>
                    <p className="text-xs text-gray-500 mb-4">Please log in to view phone number, email, and website.</p>
                    <Link to="/login" className="inline-flex items-center px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 transition-colors">
                      Log In to View
                    </Link>
                  </div>
                )}
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
              {/* Reviews Section */}
              <div className="animate-fade-in-up" id="reviews" style={{ animationDelay: '350ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-serif font-bold text-gray-900">Reviews & Ratings</h2>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{reviews.length}</span>
                </div>

                {/* Review Form (Authenticated only & if they haven't reviewed) */}
                {isAuthenticated ? (
                  !reviews.some(r => r.user_id === currentUser?.id) ? (
                    <div className="glass-card p-5 mb-6 bg-gradient-to-br from-rose-gold/5 border flex flex-col gap-3">
                      <h3 className="text-sm font-bold text-gray-900">Rate your experience</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star} 
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star 
                              className={`w-7 h-7 sm:w-8 sm:h-8 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Share your experience working with this vendor..."
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30 resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={handleReviewSubmit}
                          disabled={submittingReview || reviewRating === 0}
                          className="px-6 py-2 rounded-xl bg-gray-900 text-white font-semibold text-sm shadow hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                          {submittingReview ? 'Submitting...' : 'Post Review'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-4 mb-6 bg-gray-50 text-center border">
                      <p className="text-sm text-gray-600">You have already left a review for this vendor.</p>
                    </div>
                  )
                ) : (
                  <div className="glass-card p-5 mb-6 bg-gray-50 text-center border border-dashed">
                    <p className="text-sm text-gray-600 mb-3">Log in to leave a review and help other couples.</p>
                    <Link to="/login" className="inline-flex items-center px-5 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold shadow-sm hover:border-gray-300">
                      Log In
                    </Link>
                  </div>
                )}

                {/* Review List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-3xl mb-2 opacity-50">✨</div>
                      <p className="text-sm text-gray-500">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="glass-card p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                              <UserCircle2 className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{review.users?.name || 'Happy Couple'}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center flex-col items-end gap-1">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200 fill-gray-200'}`} />
                              ))}
                            </div>
                            {isAuthenticated && currentUser?.id === review.user_id && (
                              <button 
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 mt-1 opacity-60 hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            )}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">{review.comment}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar — Enquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="glass-card p-6">
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">Send an Enquiry</h3>
                  <p className="text-xs text-gray-500 mb-5">Get in touch with {vendor.business_name} about your wedding</p>

                  {isAuthenticated ? (
                    submitted ? (
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
                    )
                  ) : (
                    <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Want to contact {vendor.business_name}?</p>
                      <p className="text-xs text-gray-500 mb-5 px-4">Log in to send an enquiry and manage your shortlisted vendors.</p>
                      <Link to="/login" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow hover:shadow-lg transition-all">
                        Log In to Enquire
                      </Link>
                    </div>
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
