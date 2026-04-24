/**
 * Marketplace Data Layer — All Supabase queries for the Vendor Marketplace.
 * Keeps all DB logic in one place, shared across public pages, vendor portal, and admin.
 */
import { supabase } from './supabase';
import { VENDOR_CATEGORIES } from '../data/templates';

// ─── Constants ──────────────────────────────────────────────────────────────

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Chandigarh',
  'Patna', 'Vadodara', 'Goa', 'Udaipur', 'Jodhpur',
  'Kochi', 'Thiruvananthapuram', 'Coimbatore', 'Vizag',
  'Mysore', 'Mangalore', 'Dehradun', 'Rishikesh', 'Shimla',
  'Amritsar', 'Agra', 'Varanasi', 'Noida', 'Gurgaon',
  'Faridabad', 'Ghaziabad', 'Ranchi', 'Bhubaneswar',
  'Raipur', 'Ludhiana', 'Kanpur', 'Nashik', 'Aurangabad',
  'Rajkot', 'Madurai', 'Trichy', 'Vijayawada', 'Guntur',
  'Navi Mumbai', 'Thane', 'Other',
];

// Re-export categories for marketplace use
export const MARKETPLACE_CATEGORIES = VENDOR_CATEGORIES.filter(c => c.value !== 'other');

// ─── Slug Generator ─────────────────────────────────────────────────────────

export function generateSlug(businessName, city) {
  const base = `${businessName} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  // Append short random suffix to avoid collisions
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

// ─── Format helpers ─────────────────────────────────────────────────────────

export function formatPrice(amount) {
  if (!amount || amount <= 0) return '';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getCategoryLabel(value) {
  const cat = VENDOR_CATEGORIES.find(c => c.value === value);
  return cat ? cat.label : value;
}

export function getCategoryEmoji(value) {
  const cat = VENDOR_CATEGORIES.find(c => c.value === value);
  return cat ? cat.emoji : '📦';
}

// ─── Public Queries ─────────────────────────────────────────────────────────

/**
 * Fetch approved vendors by category with optional filters and pagination.
 */
export async function fetchVendorsByCategory(category, { city, minPrice, maxPrice, verifiedOnly } = {}, page = 0, pageSize = 12) {
  let query = supabase
    .from('marketplace_vendors')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .eq('category', category)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (city && city !== 'All Cities') query = query.eq('city', city);
  if (verifiedOnly) query = query.eq('is_verified', true);
  if (minPrice > 0) query = query.gte('price_range_min', minPrice);
  if (maxPrice > 0) query = query.lte('price_range_max', maxPrice);

  const { data, error, count } = await query;
  if (error) { console.error('[Marketplace] fetchVendorsByCategory error:', error); return { vendors: [], total: 0 }; }
  return { vendors: data || [], total: count || 0 };
}

/**
 * Fetch top featured vendors across all categories.
 */
export async function fetchFeaturedVendors(limit = 6) {
  const { data, error } = await supabase
    .from('marketplace_vendors')
    .select('*')
    .eq('status', 'approved')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) { console.error('[Marketplace] fetchFeaturedVendors error:', error); return []; }
  return data || [];
}

/**
 * Fetch category vendor counts for the landing page.
 */
export async function fetchCategoryCounts() {
  const { data, error } = await supabase
    .from('marketplace_vendors')
    .select('category')
    .eq('status', 'approved');

  if (error) { console.error('[Marketplace] fetchCategoryCounts error:', error); return {}; }

  const counts = {};
  (data || []).forEach(v => {
    counts[v.category] = (counts[v.category] || 0) + 1;
  });
  return counts;
}

/**
 * Fetch a single vendor by slug.
 */
export async function fetchVendorBySlug(slug) {
  const { data, error } = await supabase
    .from('marketplace_vendors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) { console.error('[Marketplace] fetchVendorBySlug error:', error); return null; }
  return data;
}

/**
 * Fetch media (portfolio images) for a vendor.
 */
export async function fetchVendorMedia(vendorId) {
  const { data, error } = await supabase
    .from('vendor_media')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('sort_order', { ascending: true });

  if (error) { console.error('[Marketplace] fetchVendorMedia error:', error); return []; }
  return data || [];
}

/**
 * Submit an enquiry lead for a vendor.
 */
export async function submitEnquiry(vendorId, { coupleName, phone, email, weddingDate, message, source = 'marketplace' }) {
  const { error } = await supabase
    .from('vendor_leads')
    .insert({
      vendor_id: vendorId,
      couple_name: coupleName,
      phone,
      email,
      wedding_date: weddingDate || null,
      message,
      source,
    });

  if (error) { console.error('[Marketplace] submitEnquiry error:', error); return { success: false, error: error.message }; }
  return { success: true };
}

// ─── Analytics / Tracking ───────────────────────────────────────────────────

/**
 * Track a profile view when a couple visits a vendor's detail page.
 * Fire-and-forget — errors are silently ignored.
 */
export async function trackProfileView(vendorId, viewerId = null) {
  try {
    await supabase.from('vendor_profile_views').insert({
      vendor_id: vendorId,
      viewer_id: viewerId,
    });
  } catch (err) {
    // Silent fail — tracking should never block user experience
    console.warn('[Marketplace] trackProfileView error:', err);
  }
}

/**
 * Fetch profile view stats for a vendor (total, by period, and daily chart data).
 */
export async function fetchProfileViewStats(vendorId, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString();

  // Fetch views within the period
  const { data, error } = await supabase
    .from('vendor_profile_views')
    .select('created_at')
    .eq('vendor_id', vendorId)
    .gte('created_at', sinceStr)
    .order('created_at', { ascending: true });

  if (error) { console.error('[Marketplace] fetchProfileViewStats error:', error); return { total: 0, chartData: [] }; }

  const views = data || [];

  // Group by date for chart
  const dailyMap = {};
  views.forEach(v => {
    const day = new Date(v.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });

  const chartData = Object.entries(dailyMap).map(([date, count]) => ({ date, views: count }));

  return { total: views.length, chartData };
}

/**
 * Fetch lead source breakdown for a vendor.
 */
export async function fetchLeadSourceStats(vendorId) {
  const { data, error } = await supabase
    .from('vendor_leads')
    .select('source')
    .eq('vendor_id', vendorId);

  if (error) { console.error('[Marketplace] fetchLeadSourceStats error:', error); return []; }

  const sources = {};
  (data || []).forEach(l => {
    const src = l.source || 'marketplace';
    sources[src] = (sources[src] || 0) + 1;
  });

  const total = Object.values(sources).reduce((a, b) => a + b, 0);
  const COLORS = { marketplace: '#C0707A', whatsapp: '#25D366', direct: '#F59E0B', blog: '#8B5CF6' };
  const LABELS = { marketplace: 'Wedora Search', whatsapp: 'WhatsApp Share', direct: 'Direct Link', blog: 'Blog Posts' };

  return Object.entries(sources).map(([key, count]) => ({
    name: LABELS[key] || key,
    value: count,
    pct: total > 0 ? Math.round((count / total) * 100) : 0,
    color: COLORS[key] || '#94A3B8',
  }));
}

/**
 * Fetch reviews for a vendor, complete with the reviewer's name
 */
export async function fetchVendorReviews(vendorId) {
  const { data, error } = await supabase
    .from('vendor_reviews')
    .select(`
      id, rating, comment, created_at, user_id,
      users ( name )
    `)
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Marketplace] fetchVendorReviews error:', error); return []; }
  return data || [];
}

/**
 * Submit or update a review.
 */
export async function submitVendorReview(vendorId, userId, rating, comment) {
  const { data, error } = await supabase
    .from('vendor_reviews')
    .upsert({
      vendor_id: vendorId,
      user_id: userId,
      rating,
      comment,
      updated_at: new Date().toISOString()
    }, { onConflict: 'vendor_id, user_id' })
    .select()
    .single();

  if (error) { console.error('[Marketplace] submitVendorReview error:', error); return { success: false, error: error.message }; }
  return { success: true, data };
}

/**
 * Delete a user's own review.
 */
export async function deleteVendorReview(reviewId) {
  const { error } = await supabase
    .from('vendor_reviews')
    .delete()
    .eq('id', reviewId);
    
  if (error) { console.error('[Marketplace] deleteVendorReview error:', error); return { success: false, error: error.message }; }
  return { success: true };
}

// ─── Vendor Portal Queries ──────────────────────────────────────────────────

/**
 * Fetch the current user's marketplace listing.
 */
export async function fetchMyListing(userId) {
  const { data, error } = await supabase
    .from('marketplace_vendors')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) { console.error('[Marketplace] fetchMyListing error:', error); return null; }
  return data;
}

/**
 * Create or update a vendor listing.
 */
export async function upsertListing(userId, listingData, existingId) {
  const payload = {
    user_id: userId,
    business_name: listingData.businessName,
    slug: listingData.slug,
    category: listingData.category,
    city: listingData.city,
    description: listingData.description || '',
    price_range_min: parseInt(listingData.priceMin) || 0,
    price_range_max: parseInt(listingData.priceMax) || 0,
    phone: listingData.phone || '',
    email: listingData.email || '',
    website: listingData.website || '',
    cover_image: listingData.coverImage || '',
    status: 'pending', // Always set to pending on edit for re-review
  };

  let result;
  if (existingId) {
    // Update
    const { data, error } = await supabase
      .from('marketplace_vendors')
      .update(payload)
      .eq('id', existingId)
      .eq('user_id', userId)
      .select()
      .single();
    result = { data, error };
  } else {
    // Insert
    const { data, error } = await supabase
      .from('marketplace_vendors')
      .insert(payload)
      .select()
      .single();
    result = { data, error };
  }

  if (result.error) {
    console.error('[Marketplace] upsertListing error:', result.error);
    return { success: false, error: result.error.message };
  }
  return { success: true, listing: result.data };
}

/**
 * Save portfolio media URLs for a vendor.
 */
export async function saveVendorMedia(vendorId, imageUrls) {
  // Delete existing media first
  await supabase.from('vendor_media').delete().eq('vendor_id', vendorId);

  // Insert new ones
  if (imageUrls.length === 0) return { success: true };

  const rows = imageUrls
    .filter(url => url.trim())
    .map((url, i) => ({
      vendor_id: vendorId,
      image_url: url.trim(),
      sort_order: i,
    }));

  if (rows.length === 0) return { success: true };

  const { error } = await supabase.from('vendor_media').insert(rows);
  if (error) { console.error('[Marketplace] saveVendorMedia error:', error); return { success: false, error: error.message }; }
  return { success: true };
}

/**
 * Fetch leads for the vendor's own listing.
 */
export async function fetchLeadsForVendor(vendorId) {
  const { data, error } = await supabase
    .from('vendor_leads')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Marketplace] fetchLeadsForVendor error:', error); return []; }
  return data || [];
}

// ─── Admin Queries ──────────────────────────────────────────────────────────

/**
 * Admin: fetch all vendors with optional status filter.
 */
export async function adminFetchVendors(statusFilter = 'all') {
  let query = supabase
    .from('marketplace_vendors')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) { console.error('[Marketplace] adminFetchVendors error:', error); return []; }
  return data || [];
}

/**
 * Admin: fetch a single vendor by ID (any status).
 */
export async function adminFetchVendorById(vendorId) {
  const { data, error } = await supabase
    .from('marketplace_vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (error) { console.error('[Marketplace] adminFetchVendorById error:', error); return null; }
  return data;
}

/**
 * Admin: update vendor status (approve, reject, suspend).
 */
export async function adminUpdateVendorStatus(vendorId, status) {
  const { error } = await supabase
    .from('marketplace_vendors')
    .update({ status })
    .eq('id', vendorId);

  if (error) { console.error('[Marketplace] adminUpdateVendorStatus error:', error); return { success: false }; }
  return { success: true };
}

/**
 * Admin: toggle vendor verification badge.
 */
export async function adminToggleVerified(vendorId, isVerified) {
  const { error } = await supabase
    .from('marketplace_vendors')
    .update({ is_verified: isVerified })
    .eq('id', vendorId);

  if (error) { console.error('[Marketplace] adminToggleVerified error:', error); return { success: false }; }
  return { success: true };
}

/**
 * Admin: toggle featured status.
 */
export async function adminToggleFeatured(vendorId, featured) {
  const { error } = await supabase
    .from('marketplace_vendors')
    .update({ featured })
    .eq('id', vendorId);

  if (error) { console.error('[Marketplace] adminToggleFeatured error:', error); return { success: false }; }
  return { success: true };
}
