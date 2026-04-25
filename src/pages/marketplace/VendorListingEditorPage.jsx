import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, ArrowLeft, Save, Plus, X, HelpCircle, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import {
  MARKETPLACE_CATEGORIES,
  INDIAN_CITIES,
  fetchMyListing,
  fetchVendorMedia,
  upsertListing,
  saveVendorMedia,
  generateSlug,
  uploadVendorMedia
} from '../../lib/marketplace';
import { optimizeImage } from '../../utils/imageOptimizer';

export default function VendorListingEditorPage() {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [existingId, setExistingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [coverImage, setCoverImage] = useState({ url: '', file: null });
  const [portfolioMedia, setPortfolioMedia] = useState([]);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate('/login', { replace: true }); return; }

    async function load() {
      const existing = await fetchMyListing(currentUser.id);
      if (existing) {
        setExistingId(existing.id);
        setBusinessName(existing.business_name || '');
        setCategory(existing.category || '');
        setCity(existing.city || '');
        setDescription(existing.description || '');
        setPriceMin(existing.price_range_min > 0 ? String(existing.price_range_min) : '');
        setPriceMax(existing.price_range_max > 0 ? String(existing.price_range_max) : '');
        setPhone(existing.phone || '');
        setEmail(existing.email || '');
        setWebsite(existing.website || '');
        setCoverImage({ url: existing.cover_image || '', file: null });

        const media = await fetchVendorMedia(existing.id);
        if (media.length > 0) {
          setPortfolioMedia(media.map(m => ({ url: m.image_url, file: null })));
        }
      }
      setLoading(false);
    }
    load();
  }, [currentUser, isAuthenticated, authLoading, navigate]);

  function handleCoverFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverImage({ url, file });
  }

  function handlePortfolioFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    // Calculate remaining slots
    const slotsLeft = 10 - portfolioMedia.length;
    const filesToAdd = files.slice(0, slotsLeft);
    
    const newMedia = filesToAdd.map(file => ({
      url: URL.createObjectURL(file), // Used for fast local preview
      file: file
    }));
    
    setPortfolioMedia(prev => [...prev, ...newMedia]);
  }

  function removePortfolioSlot(index) {
    setPortfolioMedia(prev => {
       const newArr = [...prev];
       // Clean up object URLs to prevent memory leaks in dev
       if (newArr[index].file && newArr[index].url.startsWith('blob:')) {
           URL.revokeObjectURL(newArr[index].url);
       }
       newArr.splice(index, 1);
       return newArr;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaved(false);

    // Validation
    if (!businessName.trim()) { setError('Please enter your business name'); return; }
    if (!category) { setError('Please select a category'); return; }
    if (!city) { setError('Please select your city'); return; }
    if (!phone.trim()) { setError('Please enter your phone number so couples can reach you'); return; }

    setSaving(true);

    const slug = existingId ? undefined : generateSlug(businessName, city);
    let listingData = {
      businessName: businessName.trim(),
      slug,
      category,
      city,
      description: description.trim(),
      priceMin: priceMin || '0',
      priceMax: priceMax || '0',
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      coverImage: coverImage.url && !coverImage.file ? coverImage.url : '', // Initially save existing URL if no new file
    };

    if (existingId) delete listingData.slug;

    setUploadProgress('Saving details...');
    let result = await upsertListing(currentUser.id, listingData, existingId);

    if (result.success) {
      const vendorId = result.listing.id;
      let needsFinalUpdate = false;

      // Handles Cover Image Upload
      if (coverImage.file) {
         setUploadProgress('Optimizing & uploading cover photo...');
         try {
            const optimized = await optimizeImage(coverImage.file, { maxWidth: 1200, maxHeight: 600 });
            const uploadRes = await uploadVendorMedia(optimized, vendorId);
            if (uploadRes.success) {
                listingData.coverImage = uploadRes.publicUrl;
                needsFinalUpdate = true;
            } else {
                console.error("Cover image upload failed:", uploadRes.error);
                setError("Cover photo couldn't be saved, but listing was created. " + uploadRes.error);
            }
         } catch(err) {
            console.error(err);
         }
      }
      
      // Update listing with new cover image URL
      if (needsFinalUpdate) {
         await upsertListing(currentUser.id, listingData, existingId || vendorId);
      }

      // Handle Portfolio Uploads
      setUploadProgress('Optimizing & saving portfolio photos...');
      const finalPortfolioUrls = [];
      
      for (const item of portfolioMedia) {
          if (!item.file && item.url) {
              // Existing remote URL
              finalPortfolioUrls.push(item.url);
          } else if (item.file) {
              // New local file
              try {
                  const optimized = await optimizeImage(item.file, { maxWidth: 1200, maxHeight: 1200 });
                  const uploadRes = await uploadVendorMedia(optimized, vendorId);
                  if (uploadRes.success) {
                      finalPortfolioUrls.push(uploadRes.publicUrl);
                  }
              } catch(err) {
                  console.error("Failed to upload portfolio image", err);
              }
          }
      }

      if (finalPortfolioUrls.length > 0 || portfolioMedia.length === 0) {
        await saveVendorMedia(vendorId, finalPortfolioUrls);
      }

      setUploadProgress('');
      setSaved(true);
      if (!existingId) setExistingId(vendorId);
      setTimeout(() => navigate('/vendor/dashboard'), 2000);
    } else {
      setUploadProgress('');
      setError(result.error || 'Something went wrong. Please try again.');
    }
    setSaving(false);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blush to-ivory flex items-center justify-center">
        <div className="text-center animate-pulse-soft">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-gray-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blush to-ivory px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
          <button onClick={() => navigate('/vendor/dashboard')} className="p-2 rounded-xl hover:bg-white/80 transition-colors" aria-label="Go back">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
              {existingId ? 'Edit Your Listing' : 'Create Your Business Listing'}
            </h1>
            <p className="text-xs text-gray-500">
              {existingId
                ? 'Update your details below. Changes require re-review.'
                : 'Fill in your business details. It takes less than 5 minutes!'}
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {saved && (
          <div className="glass-card p-4 mb-6 border border-emerald-200 bg-emerald-50 animate-scale-in">
            <p className="text-sm font-semibold text-emerald-700">✅ Your listing has been saved and submitted for review!</p>
            <p className="text-xs text-emerald-600 mt-0.5">We'll notify you once it's approved. Redirecting to dashboard...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Basic Info */}
          <div className="glass-card p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-base font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-gold/10 flex items-center justify-center text-xs font-bold text-rose-gold">1</span>
              Business Details
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="business-name" className="block text-xs font-semibold text-gray-700 mb-1">Business Name *</label>
                <input
                  id="business-name"
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="e.g. Sharma Photography Studios"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                  maxLength={100}
                />
                <p className="text-[10px] text-gray-400 mt-1">This is how couples will see your business</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                  >
                    <option value="">Choose category...</option>
                    {MARKETPLACE_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                  <select
                    id="city"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                  >
                    <option value="">Choose city...</option>
                    {INDIAN_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="glass-card p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-base font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-gold/10 flex items-center justify-center text-xs font-bold text-rose-gold">2</span>
              About Your Business
            </h2>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Tell couples about your services, experience, and what makes your work special..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30 resize-none"
                maxLength={2000}
              />
              <div className="flex justify-between mt-1">
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Tip: Mention your experience, style, and specialties
                </p>
                <p className="text-[10px] text-gray-400">{description.length}/2000</p>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing */}
          <div className="glass-card p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-base font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-gold/10 flex items-center justify-center text-xs font-bold text-rose-gold">3</span>
              Pricing
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price-min" className="block text-xs font-semibold text-gray-700 mb-1">Starting Price (₹)</label>
                <input
                  id="price-min"
                  type="number"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="price-max" className="block text-xs font-semibold text-gray-700 mb-1">Maximum Price (₹)</label>
                <input
                  id="price-max"
                  type="number"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  placeholder="e.g. 200000"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                  min="0"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Leave blank if you prefer to share pricing privately</p>
          </div>

          {/* Section 4: Contact */}
          <div className="glass-card p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <h2 className="text-base font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-gold/10 flex items-center justify-center text-xs font-bold text-rose-gold">4</span>
              Contact Details
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">Phone Number * (also used for WhatsApp)</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                />
              </div>
              <div>
                <label htmlFor="vendor-email" className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  id="vendor-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@business.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                />
              </div>
              <div>
                <label htmlFor="vendor-website" className="block text-xs font-semibold text-gray-700 mb-1">Website / Instagram</label>
                <input
                  id="vendor-website"
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://www.yourbusiness.com or Instagram URL"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Images */}
          <div className="glass-card p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-gold/10 flex items-center justify-center text-xs font-bold text-rose-gold">5</span>
                Media & Photos
              </h2>
              <span className="text-[10px] bg-rose-gold/10 text-rose-gold font-bold px-2 py-1 rounded tracking-wide uppercase mt-2 sm:mt-0">Auto-Optimized</span>
            </div>

            <div className="space-y-6">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Cover Image *</label>
                {!coverImage.url ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-rose-gold/30 rounded-2xl bg-rose-gold/5 hover:bg-rose-gold/10 cursor-pointer transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-rose-gold/50 mb-2" />
                      <p className="text-sm font-semibold text-gray-700">Click to upload cover photo</p>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 1200 x 600px</p>
                    </div>
                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleCoverFile} />
                  </label>
                ) : (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-gray-100 group">
                    <img src={coverImage.url} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-50 transition shadow-lg">
                        Change Photo
                        <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleCoverFile} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Portfolio Uploads */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold text-gray-700">Portfolio Photos</label>
                  <span className="text-xs font-medium text-gray-500">{portfolioMedia.length} / 10 added</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {portfolioMedia.map((media, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group shadow-sm border border-gray-200">
                      <img src={media.url} alt={`Portfolio ${i+1}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removePortfolioSlot(i)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {media.file && <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-500 text-white shadow-sm">NEW</span>}
                    </div>
                  ))}

                  {portfolioMedia.length < 10 && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-rose-gold/5 hover:border-rose-gold/30 cursor-pointer transition-colors">
                      <Plus className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-[10px] font-semibold text-gray-500">Add Photos</span>
                      <input type="file" multiple className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handlePortfolioFiles} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="glass-card p-4 border border-red-200 bg-red-50">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={saving || saved}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              id="save-listing"
            >
              {saving ? (uploadProgress || 'Saving...') : saved ? '✅ Saved!' : <><Save className="w-4 h-4" /> {existingId ? 'Update & Resubmit' : 'Submit for Review'}</>}
            </button>
            <button
              type="button"
              onClick={() => navigate('/vendor/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            By submitting, your listing will be reviewed by our team. Approved listings appear publicly on the Wedora Marketplace.
          </p>
        </form>
      </div>
    </div>
  );
}
