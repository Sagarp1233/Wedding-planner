import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Copy, Sparkles, Heart, Star,
  Lightbulb, AlertTriangle, CheckCircle2, ChevronDown,
  ChevronRight, MapPin, IndianRupee, Users, BookOpen,
  Building2, TreePine, Hotel, Landmark, Waves, Shield,
  CalendarDays, ClipboardList, Zap, Phone,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const VENUE_GUIDE_SLUG = 'wedding-venue-selection-guide-india-2026';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&auto=format&fit=crop';

export function getStaticVenueGuidePost() {
  const now = new Date().toISOString();
  return {
    id: 'static-venue-guide-2026',
    title: 'Wedding Venue Selection Guide India 2026: Types, Costs & How to Choose',
    slug: VENUE_GUIDE_SLUG,
    excerpt:
      'Complete Indian wedding venue guide 2026 — 6 venue types explained, interactive selector tool, cost breakdown by city, 20 questions to ask before booking, red flags, and the mistakes that trap couples.',
    content: '',
    tags: 'Wedding Venue, Banquet Hall, Farmhouse Wedding, Wedding Planning, Venue Selection',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Wedding Venue Selection Guide India 2026: Types, Costs & How to Choose | Wedora',
    meta_description:
      'Complete wedding venue guide India 2026 — 6 venue types, interactive venue selector, cost breakdown by city, 20 must-ask questions, red flags, and expert tips to find and book the right venue.',
    keywords:
      'wedding venue selection guide india, banquet hall vs farmhouse wedding india, how to choose wedding venue india 2026, wedding venue cost india, types of wedding venues india, farmhouse wedding india, destination wedding venue india',
    author: 'Wedora Wedding Planning Team',
    published_at: now,
    created_at: now,
    updated_at: now,
    status: 'published',
    affiliate_link: null,
    affiliate_label: null,
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'first-decision', label: 'Why the Venue is Your First Decision' },
  { id: 'selector',       label: 'Venue Type Selector (Interactive)' },
  { id: 'venue-types',    label: '6 Venue Types — Pros, Cons & Costs' },
  { id: 'city-costs',     label: 'City-Wise Cost Breakdown 2026' },
  { id: 'questions',      label: '20 Questions to Ask Before Booking' },
  { id: 'timing',         label: 'When to Book — Season & Advance Notice Guide' },
  { id: 'negotiation',    label: 'How to Negotiate Venue Pricing' },
  { id: 'red-flags',      label: 'Red Flags That Signal a Bad Venue Contract' },
  { id: 'destination',    label: 'Destination Weddings — Top 8 Cities' },
  { id: 'mistakes',       label: 'Mistakes That Cost Couples Lakhs' },
  { id: 'faq',            label: 'FAQs' },
];

// Venue type selector — the interactive feature
// User picks guest count + budget + vibe → gets recommended type
const VENUE_TYPES = [
  {
    id: 'banquet',
    label: 'Banquet Hall',
    icon: Building2,
    emoji: '🏛️',
    tagline: 'Climate-controlled, fully equipped, urban',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
    guestRange: '100 – 1,000+',
    costRange: '₹50,000 – ₹4,00,000 per event',
    bestFor: ['Urban weddings', 'Year-round availability', 'Monsoon-season weddings', 'Budget to mid-range', 'Large guest lists'],
    pros: [
      'Climate-controlled — works in any weather, any season',
      'Usually includes basic furniture, AV equipment, power backup',
      'Centrally located — easy for guests to reach',
      'Predictable pricing — fewer surprise add-ons',
      'Most offer in-house catering option (though outside vendors often allowed)',
    ],
    cons: [
      'Generic aesthetic — often requires heavy decor investment to personalise',
      'Noise restrictions in residential areas — music cutoff often 10–11 PM',
      'Limited parking at standalone halls in cities',
      'Multiple events on same day is common — brief handover windows',
      'Less photogenic than farmhouses or heritage venues',
    ],
    tip: 'Always ask: "How many events do you host on the same day?" A hall that hosts three weddings back-to-back will rush your setup and teardown. Get minimum 3 hours before and 2 hours after your event in writing.',
    bestPick: ['Tight budget', 'Monsoon wedding', 'City-centre convenience', 'Large guest count (500+)', 'Year-round planning'],
  },
  {
    id: 'farmhouse',
    label: 'Farmhouse / Lawn',
    icon: TreePine,
    emoji: '🌿',
    tagline: 'Outdoor, spacious, customisable, dramatic',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
    guestRange: '200 – 2,000+',
    costRange: '₹1,50,000 – ₹10,00,000 per event',
    bestFor: ['November–February (peak season)', 'Large guest lists (500–1500)', 'Full creative freedom on decor', 'Delhi NCR, Jaipur, Chandigarh, Pune'],
    pros: [
      'Full creative freedom — blank canvas for any decor theme',
      'Open-air ceremonies under the sky — deeply photogenic',
      'Typically no music cutoff restrictions (check local rules)',
      'Indoor + outdoor combination for different functions',
      'Often includes accommodation for family stays',
    ],
    cons: [
      'Weather-dependent — needs tent/canopy backup for rain/extreme heat',
      'Requires external vendors for everything (catering, furniture, AV, power)',
      'Generator/power backup essential and often expensive extra',
      'December–February dates booked 12–18 months in advance in Delhi NCR',
      'Guest parking logistics can be complex for very large weddings',
    ],
    tip: 'The single most important farmhouse question: "What is the cost of generator backup and is it mandatory?" Power backup for 500 guests can add ₹80,000–₹2,00,000 to the invoice and is often not included in the base quote.',
    bestPick: ['Grand outdoor ceremony', 'December–February', 'Large guest count', 'Full decor control', 'Delhi NCR / Jaipur'],
  },
  {
    id: 'hotel',
    label: '4-Star / 5-Star Hotel',
    icon: Hotel,
    emoji: '⭐',
    tagline: 'Luxury, convenience, everything included',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
    guestRange: '100 – 1,500',
    costRange: '₹3,00,000 – ₹30,00,000+ per event',
    bestFor: ['Luxury weddings', 'NRI couples', 'Out-of-town guests needing accommodation', 'Destination hotel weddings', 'Complete wedding package seekers'],
    pros: [
      'Everything in one place — venue, catering, décor coordination, accommodation',
      'Professional event management team included',
      'Accountability — a branded hotel has reputation stakes unlike an independent venue',
      'Premium in-house catering from trained chefs (though expensive)',
      'Guests can stay on-site — no transport logistics for family',
    ],
    cons: [
      'Most expensive option per head — in-house catering is non-negotiable at most 5-stars',
      'Less creative flexibility — hotel has standard setups they prefer',
      'In-house catering mandatory at most luxury hotels — no outside caterer allowed',
      'Peak season dates booked 12–24 months in advance at Taj, ITC, Leela',
      'Minimum spend / minimum room booking requirements are common',
    ],
    tip: 'Negotiate a "minimum billing" rather than per-plate cost. Hotels often have minimum F&B and room billing requirements. Ask what happens if your guest count is lower than the minimum — you still pay the minimum. Get clarity on this before signing.',
    bestPick: ['NRI wedding', 'Full-service convenience', 'Guest accommodation essential', 'Premium brand guarantee', 'Smaller but luxury wedding (100–300 guests)'],
  },
  {
    id: 'heritage',
    label: 'Heritage / Palace Property',
    icon: Landmark,
    emoji: '🏰',
    tagline: 'Royal, historic, unforgettable backdrop',
    color: 'from-violet-500 to-purple-700',
    bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
    guestRange: '50 – 1,000',
    costRange: '₹5,00,000 – ₹50,00,000+ per event',
    bestFor: ['Destination weddings in Rajasthan', 'Royal / heritage themes', 'Intimate luxury weddings', 'Celebrity-style weddings', 'NRI / international guests'],
    pros: [
      'Unmatched photogenic quality — the venue IS the décor',
      'Multi-day wedding experience with all guests staying in one place',
      'Exclusive buyout available — entire property is yours',
      'Deeply memorable for guests — something they have never experienced',
      'History and character that no banquet hall can replicate',
    ],
    cons: [
      'Among the most expensive wedding venues in India',
      'Location is often remote — guest transport must be planned and budgeted',
      'Structural restrictions — drilling, anchoring, and certain decor may be prohibited',
      'Advance booking of 12–24 months essential for top properties',
      'Infrastructure limitations — power, water, kitchen capacity at some historic properties',
    ],
    tip: 'Insist on a site visit before booking. Many heritage property photos are taken from one or two flattering angles — the actual event spaces and guest accommodation may not match the impression. Walk the entire property.',
    bestPick: ['Destination wedding', 'Royal / Rajasthani theme', 'Intimate luxury (50–300 guests)', 'Multi-day wedding', 'International guests'],
  },
  {
    id: 'resort',
    label: 'Resort / Outdoor Resort',
    icon: Waves,
    emoji: '🌴',
    tagline: 'Destination feel, nature, multi-day experience',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700',
    guestRange: '100 – 1,500',
    costRange: '₹2,00,000 – ₹20,00,000+ per event',
    bestFor: ['Destination weddings (Goa, Kerala, Mussoorie, Coorg)', 'Beach and nature weddings', 'Couples wanting a vacation-wedding hybrid', 'Mid to luxury budget'],
    pros: [
      'Guests and family stay on-site — creates a wedding retreat experience',
      'Beautiful natural backdrop — pool, gardens, beach, hills',
      'Full event support teams experienced with multi-day weddings',
      'Usually allows more flexibility on external vendors than 5-star hotels',
      'Multiple spaces for different functions across the property',
    ],
    cons: [
      'Weather is a significant risk for outdoor ceremony spaces',
      'Distance from major cities — guest travel and accommodation must be managed',
      'Popular Goa resorts (W, St Regis, Taj Exotica) book 12–15 months ahead for December',
      'Minimum room nights often mandatory — you pay for all rooms whether filled or not',
      'Capacity limitations — some resorts have small ballrooms for large indoor contingency',
    ],
    tip: 'For Goa resorts especially: the "minimum room nights" clause means you are responsible for the full room block even if guests don\'t show up. Negotiate a tiered minimum — 70% paid on booking, 30% credited if rooms go empty.',
    bestPick: ['Goa / Kerala / hill station wedding', 'Beach ceremony', 'Multi-day wedding retreat', 'Nature backdrop priority', '150–500 guests'],
  },
  {
    id: 'community',
    label: 'Community Hall / Kalyana Mandapam',
    icon: Users,
    emoji: '🕍',
    tagline: 'Traditional, community, highly affordable',
    color: 'from-stone-500 to-amber-600',
    bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700',
    guestRange: '100 – 800',
    costRange: '₹20,000 – ₹1,50,000 per event',
    bestFor: ['Traditional South Indian weddings', 'Budget-conscious families', 'Community / religious weddings', 'Tamil, Telugu, Kannada, Malayali weddings'],
    pros: [
      'Extremely cost-effective — often 5–10× cheaper than banquet halls',
      'Traditional ambience suited for religious ceremonies',
      'Community connections often make bookings and negotiations easier',
      'Often includes basic kitchen infrastructure for catering',
      'Familiar to community guests — no navigation or parking stress',
    ],
    cons: [
      'Basic infrastructure — may require significant decor investment',
      'Limited exclusivity — often booked by multiple families across different dates',
      'Not suited for large-production sangeet or reception events',
      'Availability in peak season is competitive in major cities',
      'Limited flexibility on outside vendors depending on community rules',
    ],
    tip: 'Community halls and Kalyana Mandapams in South Indian cities (Chennai, Bengaluru, Hyderabad) offer extraordinary value. A well-decorated Kalyana Mandapam with good lighting and fresh flowers can look as beautiful as a mid-range banquet hall at 20% of the cost.',
    bestPick: ['South Indian weddings', 'Budget under ₹10L', 'Traditional religious ceremony', 'Community venue', 'Morning ceremony'],
  },
];

// Venue selector logic
const SELECTOR_OPTIONS = {
  guests: [
    { val: 'small',  label: 'Under 150', icon: '👥' },
    { val: 'medium', label: '150 – 400',  icon: '👥👥' },
    { val: 'large',  label: '400 – 800',  icon: '👥👥👥' },
    { val: 'grand',  label: '800+',       icon: '🎊' },
  ],
  budget: [
    { val: 'budget',    label: 'Under ₹15L',   icon: '💰' },
    { val: 'mid',       label: '₹15L – ₹40L',  icon: '💰💰' },
    { val: 'premium',   label: '₹40L – ₹1Cr',  icon: '💰💰💰' },
    { val: 'luxury',    label: '₹1Cr+',         icon: '👑' },
  ],
  vibe: [
    { val: 'traditional', label: 'Traditional', icon: '🕉️' },
    { val: 'modern',      label: 'Modern / Urban', icon: '🌆' },
    { val: 'outdoor',     label: 'Outdoor / Nature', icon: '🌿' },
    { val: 'destination', label: 'Destination', icon: '✈️' },
  ],
};

// Recommendation engine
function getRecommendations(guests, budget, vibe) {
  if (!guests || !budget || !vibe) return [];
  const scores = { banquet: 0, farmhouse: 0, hotel: 0, heritage: 0, resort: 0, community: 0 };
  // Guest count
  if (guests === 'small')  { scores.hotel += 3; scores.heritage += 3; scores.community += 2; scores.banquet += 1; }
  if (guests === 'medium') { scores.banquet += 3; scores.farmhouse += 3; scores.hotel += 2; scores.resort += 2; }
  if (guests === 'large')  { scores.farmhouse += 3; scores.banquet += 3; scores.resort += 1; }
  if (guests === 'grand')  { scores.farmhouse += 3; scores.banquet += 3; }
  // Budget
  if (budget === 'budget')   { scores.community += 4; scores.banquet += 3; scores.farmhouse += 1; }
  if (budget === 'mid')      { scores.banquet += 3; scores.farmhouse += 3; scores.resort += 2; scores.hotel += 1; }
  if (budget === 'premium')  { scores.farmhouse += 2; scores.hotel += 3; scores.resort += 3; scores.heritage += 2; }
  if (budget === 'luxury')   { scores.heritage += 4; scores.hotel += 3; scores.resort += 3; }
  // Vibe
  if (vibe === 'traditional')  { scores.community += 3; scores.banquet += 2; scores.heritage += 2; }
  if (vibe === 'modern')       { scores.banquet += 3; scores.hotel += 3; scores.farmhouse += 1; }
  if (vibe === 'outdoor')      { scores.farmhouse += 4; scores.resort += 3; scores.heritage += 2; }
  if (vibe === 'destination')  { scores.heritage += 4; scores.resort += 4; scores.hotel += 2; }
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => VENUE_TYPES.find(v => v.id === id));
}

// City-wise costs
const CITY_COSTS = [
  { city: 'Delhi / NCR', banquet: '₹70K–₹3L', farmhouse: '₹2.5L–₹12L', hotel: '₹4L–₹30L+', note: 'Farmhouse weddings dominate Delhi. Dec–Jan farmhouses book 12–18 months ahead. Chatarpur and Mehrauli belt are the prime farmhouse zones.' },
  { city: 'Mumbai', banquet: '₹1L–₹5L', farmhouse: '₹2L–₹8L (Alibaug)', hotel: '₹5L–₹40L+', note: 'Space is the biggest constraint. Premium venues cost 2× Delhi equivalents. Alibaug is the destination resort alternative for Mumbai couples.' },
  { city: 'Bengaluru', banquet: '₹75K–₹3.5L', farmhouse: '₹1.5L–₹6L', hotel: '₹3.5L–₹20L+', note: 'Resorts on Nandi Hills, Devanahalli, and Kanakapura Road are popular alternatives to city venues. Book well ahead for November–February dates.' },
  { city: 'Jaipur', banquet: '₹60K–₹2L', farmhouse: '₹1.5L–₹5L', hotel: '₹3L–₹25L+', note: 'Heritage palaces and palace-hotels make Jaipur India\'s top destination wedding city. The Rambagh Palace, Samode, and Chomu Palace are must-shortlist.' },
  { city: 'Hyderabad', banquet: '₹60K–₹2.5L', farmhouse: '₹1.5L–₹5L', hotel: '₹3L–₹18L+', note: 'Convention centres and banquet halls in Jubilee Hills and Banjara Hills are highly developed for large guest lists (500–2000).' },
  { city: 'Chennai', banquet: '₹50K–₹2L', farmhouse: '₹1L–₹4L', hotel: '₹2.5L–₹15L+', note: 'Kalyana Mandapams dominate traditional South Indian weddings. East Coast Road resorts are popular for beach ceremonies.' },
  { city: 'Goa', banquet: '₹1.5L–₹4L', farmhouse: 'N/A (resort culture)', hotel: '₹8L–₹60L+', note: 'W Goa, St Regis, Taj Exotica, and The Leela are the benchmark venues. December is booked 12–15 months ahead. Off-season (June–Aug) offers dramatic discounts.' },
  { city: 'Udaipur', banquet: '₹80K–₹3L', farmhouse: '₹2L–₹7L', hotel: '₹8L–₹80L+', note: 'Fateh Garh, Devigarh, Oberoi Udaivilas, and Raffles set the luxury benchmark. The entire city is a wedding backdrop — every venue benefits from the lake-city setting.' },
];

// 20 questions to ask
const QUESTIONS_BOOKING = [
  { cat: 'Availability & Exclusivity', qs: [
    'How many events do you host on the same date? Is the venue exclusively ours?',
    'What is the minimum setup time before our event and teardown time after?',
    'Is the venue available for a site visit before we sign? Can we see it during an event?',
  ]},
  { cat: 'Catering & Vendors', qs: [
    'Can we bring our own caterer, or is in-house catering mandatory?',
    'If in-house catering, what is the per-plate cost and what is included?',
    'Are there empanelled vendor lists for decoration, music, and photography we must use?',
    'What is the corkage charge if we bring our own bar?',
  ]},
  { cat: 'Infrastructure & Logistics', qs: [
    'What is included in the venue rental — furniture, crockery, AV system, power backup?',
    'What is the generator/power backup capacity and is it included in the price?',
    'What is the parking capacity and who manages guest parking?',
    'What is the kitchen infrastructure — is it sufficient for our caterer?',
  ]},
  { cat: 'Costs & Contract', qs: [
    'What is the advance payment and what is the cancellation/postponement policy?',
    'What additional charges are NOT included in the base quote — service charge, GST, security deposit?',
    'Is there a noise restriction / music cutoff time? What is the penalty for exceeding it?',
    'What is the damage deposit and how is it assessed and returned?',
  ]},
  { cat: 'Weather & Backup', qs: [
    'For outdoor venues: what is the contingency plan for rain or extreme weather?',
    'Is there an indoor backup space available if needed? At what additional cost?',
    'What is the venue\'s monsoon policy — do they offer reschedule options if weather disrupts?',
  ]},
  { cat: 'Accommodation (for destination weddings)', qs: [
    'How many rooms are on-site and what is the mandatory room block requirement?',
    'What happens to unused rooms in the block — are we fully liable or is there flexibility?',
  ]},
];

// Destination cities
const DESTINATION_CITIES = [
  { city: 'Udaipur', state: 'Rajasthan', emoji: '🏰', tagline: 'City of Lakes — India\'s top destination wedding city', bestFor: 'Royal heritage weddings, lake-view ceremonies, palace buyouts', season: 'Oct – Mar', topVenues: 'Oberoi Udaivilas, Raffles Udaipur, Taj Lake Palace, Devigarh, Fateh Garh', cost: '₹40L – ₹3Cr+', crowd: '⭐⭐⭐⭐⭐' },
  { city: 'Jaipur', state: 'Rajasthan', emoji: '🌸', tagline: 'Pink City — grand forts, royal palaces, marigold grandeur', bestFor: 'Royal Rajasthani theme, large weddings, fort ceremonies', season: 'Oct – Feb', topVenues: 'Rambagh Palace (Taj), Samode Palace, Chomu Palace, Dera Amer, Nahargarh Fort', cost: '₹20L – ₹2Cr+', crowd: '⭐⭐⭐⭐⭐' },
  { city: 'Goa', state: 'Goa', emoji: '🌊', tagline: 'Beach, resort luxury, barefoot pheras', bestFor: 'Beach weddings, resort luxury, destination party vibe', season: 'Nov – Feb', topVenues: 'W Goa, St Regis Goa, Taj Exotica, The Leela Goa, Alila Diwa', cost: '₹25L – ₹1.5Cr+', crowd: '⭐⭐⭐⭐⭐' },
  { city: 'Jodhpur', state: 'Rajasthan', emoji: '💙', tagline: 'Blue City — Mehrangarh fort, dramatic desert sunsets', bestFor: 'Fort weddings, desert backdrop, Rajasthani grandeur', season: 'Oct – Feb', topVenues: 'Umaid Bhawan Palace, RAAS Jodhpur, Ajit Bhawan, Bal Samand Lake Palace', cost: '₹30L – ₹2Cr+', crowd: '⭐⭐⭐⭐' },
  { city: 'Rishikesh', state: 'Uttarakhand', emoji: '🌿', tagline: 'Mountains, Ganga, spiritual — intimate & serene', bestFor: 'Intimate weddings, nature backdrop, spiritual ceremonies', season: 'Feb – Jun, Sep – Nov', topVenues: 'Ananda in the Himalayas, The Glasshouse on the Ganges, Aloha on the Ganges', cost: '₹15L – ₹60L', crowd: '⭐⭐⭐' },
  { city: 'Mussoorie / Shimla', state: 'Uttarakhand / HP', emoji: '❄️', tagline: 'Colonial hill station charm, mountain mist', bestFor: 'Winter mountain weddings, intimate celebrations, hill station backdrop', season: 'Apr – Jun, Sep – Dec', topVenues: 'Jaypee Residency Mussoorie, Windamere Hotel Darjeeling, Wildflower Hall Shimla', cost: '₹15L – ₹80L', crowd: '⭐⭐⭐' },
  { city: 'Alibaug / Lonavala', state: 'Maharashtra', emoji: '🌅', tagline: 'Mumbai\'s nearest destination — sea, greenery, resorts', bestFor: 'Mumbai couples wanting destination feel without long travel', season: 'Nov – Feb', topVenues: 'SaffronStays properties, The Machan (Lonavala), U Tan Sea Resort, Radisson Alibaug', cost: '₹12L – ₹60L', crowd: '⭐⭐⭐⭐' },
  { city: 'Kerala Backwaters', state: 'Kerala', emoji: '⛵', tagline: 'Houseboats, coconut palms, serene waterways', bestFor: 'Intimate Kerala weddings, backwater ceremonies, coastal resort weddings', season: 'Sep – Mar', topVenues: 'Taj Kumarakom, Coconut Lagoon CGH Earth, Zuri Kumarakom, Spice Village', cost: '₹20L – ₹1Cr', crowd: '⭐⭐⭐⭐' },
];

// Negotiation tips
const NEGOTIATION_TIPS = [
  { tip: 'Always get competing quotes from 3 venues before negotiating', detail: 'Venue managers reduce prices when they know you\'re comparing options. A competing quote from a comparable venue is your strongest negotiating tool. Never reveal your maximum budget — present a range 20% below your actual ceiling.' },
  { tip: 'Negotiate on add-ons, not just the base price', detail: 'Venues rarely reduce the base rental significantly. But you can negotiate free generator backup (₹80K–₹2L value), extra setup hours, complimentary accommodation for the bridal suite, complimentary parking, or upgraded catering inclusions.' },
  { tip: 'Off-peak dates and weekdays get 20–40% off', detail: 'Sunday–Thursday events at venues that primarily do Saturday weddings can be negotiated down significantly. January and September–October (post-Navratri) are softer months in many cities — use this for leverage.' },
  { tip: 'Bundling multiple functions at one venue saves 15–25%', detail: 'If you hold mehendi, sangeet, wedding, and reception all at the same venue (or same property), you have strong bundling leverage. Ask for a package rate across all functions explicitly.' },
  { tip: 'Book early — but finalise terms completely before paying any advance', detail: 'Advance bookings 8–12 months out often get better rates. But never pay an advance until every term — cancellation policy, included services, external vendor policy, music cutoff — is in the signed contract.' },
];

// Mistakes
const MISTAKES = [
  { m: 'Booking the venue before fixing the guest list', r: 'Venue capacity, per-plate catering cost, and parking are all determined by guest count. Booking a venue before you have a realistic guest count estimate leads to either a cramped venue (embarrassing) or an enormous empty space (depressing). Always shortlist venues AFTER setting a guest count range.' },
  { m: 'Paying a large advance without a written contract', r: 'Multiple Indian couples lose lakhs annually to verbal assurances. The contract must specify: exact function dates and times, services included, cancellation/postponement terms, music cutoff time, external vendor policy, and payment schedule. If the venue refuses a written contract — leave.' },
  { m: 'Ignoring the external vendor policy until after booking', r: 'Many venues, particularly hotels and branded resorts, mandate in-house catering, empanelled decorators, and preferred vendors. This can add 40–100% to your catering cost versus bringing your own caterer. Ask for the full vendor policy before signing — not after.' },
  { m: 'Not visiting the venue at the same time of day as your event', r: 'A venue that looks stunning at noon in photos can look completely different at 8 PM under artificial lighting. Always visit the venue at the approximate time your function will run — and if possible, during or just after another wedding.' },
  { m: 'Forgetting the monsoon contingency for outdoor venues', r: 'Outdoor farmhouses and resort lawns require a tent or shamiyana backup plan for rain. Ask what the tent/backup space costs, who arranges it, and what triggers its deployment. Some venues charge ₹2–5L for emergency tent setup that was not in the original quote.' },
  { m: 'Assuming the quoted price is the final invoice', r: 'A venue quote in India typically excludes: service charge (8–12%), GST (18% on banquet services), generator charges, parking management, security deposit, and overtime charges. The final invoice is routinely 25–40% higher than the quoted price. Always ask for an all-inclusive estimate.' },
];

const FAQS = [
  {
    q: 'What is the average wedding venue cost in India in 2026?',
    a: 'Venue rental costs vary widely by type and city. As a general range: community halls and Kalyana Mandapams cost ₹20,000–₹1,50,000 per event; standalone banquet halls ₹50,000–₹4,00,000; farmhouses ₹1,50,000–₹10,00,000; 4-star hotel ballrooms ₹3,00,000–₹15,00,000; 5-star hotels ₹5,00,000–₹30,00,000+; heritage palaces ₹5,00,000–₹50,00,000+. For a standard Delhi NCR wedding with 400 guests across 4 functions, expect ₹8–20 lakh in venue costs alone across the full wedding.',
  },
  {
    q: 'Which is better — banquet hall or farmhouse for an Indian wedding?',
    a: 'It depends on your priorities. Choose a banquet hall if: you\'re marrying during monsoon, you need a year-round date, you want climate control, you\'re in a congested urban area, or your budget is tight. Choose a farmhouse if: you\'re marrying between November and February, you want full creative freedom on décor, you have a large guest list (300+), or you want the open-air ceremony aesthetic. For Delhi NCR in particular, the farmhouse wedding experience is the dominant choice for the November–February season.',
  },
  {
    q: 'How far in advance should I book a wedding venue in India?',
    a: 'For peak season dates (November–February, May): book 9–12 months in advance for top farmhouses and 12–24 months for luxury hotels and heritage properties. For off-peak dates: 4–6 months is generally sufficient. The rule of thumb: book your venue first — before the photographer, decorator, or caterer — because venue availability drives every other date. The best venues in Delhi, Mumbai, Jaipur, and Goa fill up within days of opening the calendar for a peak wedding month.',
  },
  {
    q: 'What questions should I ask before booking a wedding venue?',
    a: 'The 5 most critical: (1) Is the venue exclusively ours on the date, or do you host multiple events? (2) Can we bring our own caterer and decorator, or are external vendors restricted? (3) What is NOT included in the base quote — generator, parking, service charge, GST? (4) What is the cancellation and postponement policy — in writing? (5) For outdoor venues: what is the contingency plan for rain, and what does it cost? See the full 20-question checklist in this guide for complete coverage.',
  },
  {
    q: 'What is the best destination wedding venue city in India?',
    a: 'Udaipur is consistently ranked India\'s top destination wedding city — the combination of Lake Palace, City Palace, Devigarh, and Oberoi Udaivilas is unmatched globally for a wedding backdrop. Jaipur is the second choice for royal Rajasthani grandeur. Goa leads for beach resort weddings. For intimate mountain weddings, Rishikesh, Mussoorie, and Shimla are emerging strongly. For Kerala, the backwater resorts around Kumarakom and Alappuzha are extraordinary for smaller, intimate weddings.',
  },
  {
    q: 'Can I negotiate wedding venue pricing in India?',
    a: 'Yes — and you should. The most effective negotiation tactics: present competing quotes from comparable venues; ask for off-peak or weekday dates (20–40% cheaper); negotiate add-ons (free generator, extra setup hours, complimentary suites) rather than just base price; bundle multiple functions at the same property for a package discount. Never reveal your maximum budget. Book early and negotiate before paying any advance — your leverage disappears the moment money changes hands.',
  },
  {
    q: 'Is it mandatory to use a hotel\'s in-house caterer for a wedding?',
    a: 'At most 5-star hotels (Taj, ITC, Leela, Marriott, Hyatt), in-house catering is mandatory — you cannot bring an outside caterer. This significantly increases the per-plate cost (typically ₹4,000–₹15,000 per plate vs ₹1,500–₹4,000 for an equivalent outside caterer). At most standalone banquet halls, farmhouses, and many 4-star hotels, outside catering is allowed — sometimes with a "corkage" or kitchen access fee. Always clarify the external vendor policy before committing to any venue.',
  },
  {
    q: 'What is the music/noise cutoff time at Indian wedding venues?',
    a: 'This varies significantly by city and venue type. In most Indian cities, local regulations require music to stop at 10 PM–12 midnight at venues in or near residential areas. Delhi NCR has a general 10 PM rule for residential zones but many designated event venues and farmhouses in commercial/event zones are permitted until later. Goa allows music until 11 PM at most licensed venues. Always verify the exact cutoff for your specific venue with the local authority — not just the venue manager\'s verbal assurance. Non-compliance can result in police complaints and fines.',
  },
];

// ─── Components ───────────────────────────────────────────────────────────────
function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/90 overflow-hidden shadow-sm">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-sky-50/50 transition-colors"
        aria-expanded={open}>
        <span className="font-semibold text-gray-900 pr-2 text-sm md:text-base">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-sky-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{item.a}</div>}
    </div>
  );
}

function CtaSignup({ headline, sub }) {
  return (
    <div className="my-10 rounded-2xl bg-gradient-to-r from-rose-gold to-plum p-px shadow-xl shadow-rose-gold/20">
      <div className="rounded-[calc(1rem-1px)] bg-white px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-serif font-bold text-gray-900 text-lg leading-snug">{headline}</p>
          <p className="text-sm text-gray-500 mt-1">{sub}</p>
        </div>
        <Link to="/signup" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
          Start free <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function CtaTool({ icon: Icon, headline, sub, btnLabel, btnTo, color }) {
  return (
    <div className={`my-10 rounded-2xl border-2 ${color.border} ${color.bg} p-5 flex flex-col sm:flex-row items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center shrink-0 shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${color.title} mb-0.5`}>{headline}</p>
        <p className="text-sm text-gray-500 leading-snug">{sub}</p>
      </div>
      <Link to={btnTo} className={`shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r ${color.grad} text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap`}>
        {btnLabel} <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function WeddingVenueGuideArticle({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq]     = useState(-1);
  const [showToc, setShowToc]     = useState(false);
  const [activeVenue, setActiveV] = useState(null);
  const [selGuests, setSelG]      = useState(null);
  const [selBudget, setSelB]      = useState(null);
  const [selVibe, setSelV]        = useState(null);
  const [showResult, setShowResult] = useState(false);

  const recommendations = showResult ? getRecommendations(selGuests, selBudget, selVibe) : [];

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-400/15 to-blue-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/60">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <Link to="/" className="text-xl font-serif font-bold bg-gradient-to-r from-rose-gold to-plum bg-clip-text text-transparent">Wedora</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 md:pb-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-400 font-medium">
            <Link to="/blog" className="hover:text-rose-gold transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-sky-600 font-semibold">Wedding Planning</span>
            <ChevronRight className="w-3 h-3" />
            <span>Venue Guide</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-sky-400/30 shadow-sm mb-6">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">2026 Guide · 6 Venue Types · Interactive Selector</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.08] mb-4">
            Wedding Venue{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600">
              Selection Guide
            </span>
          </h1>
          <p className="text-base text-sky-700 font-semibold mb-5">
            India 2026 · Types · Costs · Questions to Ask · Destination Cities
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {[
              { icon: '🏛️', label: '6 venue types' },
              { icon: '🎯', label: 'Interactive selector' },
              { icon: '💰', label: 'City-wise costs' },
              { icon: '❓', label: '20 questions to ask' },
              { icon: '✈️', label: 'Top 8 destination cities' },
              { icon: '⚠️', label: 'Red flags & mistakes' },
            ].map(p => (
              <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-sky-200/60 text-gray-700 text-xs font-semibold shadow-sm">
                {p.icon} {p.label}
              </span>
            ))}
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            The venue is the single decision that determines everything else — your caterer,
            decorator, photographer, guest accommodation, and date. Get it right first.
            Everything else falls into place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              <Clock className="w-4 h-4 text-rose-gold" />{readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              <Heart className="w-4 h-4 text-rose-gold" fill="currentColor" />{post.author || 'Wedora Team'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              Updated {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {post.featured_image && (
          <div className="max-w-5xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-2xl shadow-sky-400/15 border-4 border-white ring-1 ring-sky-100">
            <img src={ensureHttps(post.featured_image)} alt="Indian wedding venue selection guide 2026"
              className="w-full aspect-[21/9] object-cover object-center" loading="eager" />
          </div>
        )}
      </header>

      {/* TOC */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 mb-8">
        <div className="rounded-2xl bg-white border border-sky-100 shadow-sm overflow-hidden">
          <button type="button" onClick={() => setShowToc(!showToc)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-sky-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span className="font-semibold text-gray-900">Table of Contents</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{TOC.length} sections</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} />
          </button>
          {showToc && (
            <div className="border-t border-gray-100 px-5 py-4 grid sm:grid-cols-2 gap-1">
              {TOC.map((item, i) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setShowToc(false)}
                  className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-sky-600 transition-colors group">
                  <span className="w-5 h-5 rounded-md bg-sky-50 text-sky-600 text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">{i + 1}</span>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-14 md:space-y-20">

        {/* WHY FIRST */}
        <section id="first-decision">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 via-blue-300/15 to-violet-300/15 rounded-[2rem] blur-xl opacity-60" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-sky-50/60 border border-sky-100/80 p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-sky-500 shrink-0" />
                The venue is your first decision — everything else follows from it
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Most couples start planning their wedding by thinking about the décor,
                the lehenga, or the photographer. The ones who plan smoothly start with
                the venue — because the venue determines everything else.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                The venue sets your date (availability), your guest capacity (space),
                your caterer (in-house mandate or outside), your décor possibilities
                (blank canvas or branded property), your budget ceiling (rental plus
                mandatory minimums), and your family's travel and accommodation plan.
                No other decision has this many downstream consequences.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Book the venue first. Sign the contract, pay the advance,
                confirm the date — and only then begin everything else.
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '📅', title: 'Sets your date', desc: 'Venue availability determines your wedding date. All other vendors — caterer, photographer, pandit — are booked around it.' },
              { icon: '👥', title: 'Sets your guest count ceiling', desc: 'The venue capacity is the hard ceiling for your guest list. Overcrowding a venue is one of the most common and avoidable wedding mistakes.' },
              { icon: '💰', title: 'Sets 40–60% of your total budget', desc: 'Venue rental, in-house catering, and mandatory minimums together often represent 40–60% of the total wedding spend.' },
            ].map(c => (
              <div key={c.title} className="flex flex-col gap-2 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-3xl">{c.icon}</span>
                <p className="font-semibold text-gray-900">{c.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <CtaSignup headline="Found your venue? Start planning everything else on Wedora — free."
          sub="Budget planner, vendor tracker, checklist, and invitation generator — your complete wedding toolkit." />

        {/* VENUE SELECTOR — INTERACTIVE */}
        <section id="selector">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Venue type selector</h2>
              <p className="text-gray-500 text-sm mt-0.5">Answer 3 questions — get your top 3 recommended venue types.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-sky-100 shadow-sm overflow-hidden">
            {/* Guest count */}
            <div className="p-5 border-b border-gray-100">
              <p className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                How many guests are you expecting?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SELECTOR_OPTIONS.guests.map(opt => (
                  <button key={opt.val} type="button" onClick={() => { setSelG(opt.val); setShowResult(false); }}
                    className={`p-3 rounded-xl text-sm font-semibold border-2 transition-all ${selGuests === opt.val ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-sky-300'}`}>
                    <span className="block text-lg mb-0.5">{opt.icon}</span>{opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="p-5 border-b border-gray-100">
              <p className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                What is your total wedding budget?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SELECTOR_OPTIONS.budget.map(opt => (
                  <button key={opt.val} type="button" onClick={() => { setSelB(opt.val); setShowResult(false); }}
                    className={`p-3 rounded-xl text-sm font-semibold border-2 transition-all ${selBudget === opt.val ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-sky-300'}`}>
                    <span className="block text-lg mb-0.5">{opt.icon}</span>{opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div className="p-5 border-b border-gray-100">
              <p className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">3</span>
                What vibe are you going for?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SELECTOR_OPTIONS.vibe.map(opt => (
                  <button key={opt.val} type="button" onClick={() => { setSelV(opt.val); setShowResult(false); }}
                    className={`p-3 rounded-xl text-sm font-semibold border-2 transition-all ${selVibe === opt.val ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-sky-300'}`}>
                    <span className="block text-lg mb-0.5">{opt.icon}</span>{opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Get result button */}
            <div className="p-5">
              <button type="button"
                disabled={!selGuests || !selBudget || !selVibe}
                onClick={() => setShowResult(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {(!selGuests || !selBudget || !selVibe) ? 'Answer all 3 questions above ↑' : '🎯 Show My Best Venue Types →'}
              </button>
            </div>

            {/* Results */}
            {showResult && recommendations.length > 0 && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-5">
                <p className="font-bold text-gray-900 mb-4">Your top 3 recommended venue types:</p>
                {recommendations.map((v, i) => v && (
                  <div key={v.id} className={`rounded-xl border-2 ${v.border} ${v.bg} p-4`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${v.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>{i + 1}</span>
                      <span className="text-xl">{v.emoji}</span>
                      <p className={`font-bold ${v.text}`}>{v.label}</p>
                      <span className="text-xs text-gray-500 ml-auto hidden sm:block">{v.costRange}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">{v.tagline}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.bestPick.map(p => (
                        <span key={p} className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white border ${v.border} ${v.text}`}>{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-400 text-center pt-2">Scroll down to see full pros, cons, and costs for each venue type →</p>
              </div>
            )}
          </div>
        </section>

        {/* 6 VENUE TYPES */}
        <section id="venue-types">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">6 venue types — full comparison</h2>
              <p className="text-gray-500 text-sm mt-0.5">Click any venue type to expand pros, cons, cost, and the expert tip.</p>
            </div>
          </div>

          <div className="space-y-3">
            {VENUE_TYPES.map((venue, i) => {
              const IconComp = venue.icon;
              return (
                <div key={venue.id}
                  onClick={() => setActiveV(activeVenue === i ? null : i)}
                  className={`rounded-2xl border overflow-hidden cursor-pointer transition-all hover:shadow-md ${activeVenue === i ? `border-2 ${venue.border} shadow-md` : 'border border-gray-100 bg-white shadow-sm'}`}>
                  <div className={`flex items-center justify-between px-5 py-4 ${activeVenue === i ? venue.bg : 'bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{venue.emoji}</span>
                      <div>
                        <p className="font-bold text-gray-900">{venue.label}</p>
                        <p className="text-gray-500 text-xs">{venue.tagline} · {venue.guestRange} guests</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`hidden sm:block text-xs font-bold ${venue.text}`}>{venue.costRange.split(' ')[0]} {venue.costRange.split(' ')[1]}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeVenue === i ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {activeVenue === i && (
                    <div className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pros
                          </p>
                          <ul className="space-y-1.5">
                            {venue.pros.map(p => (
                              <li key={p} className="flex gap-2 text-xs text-gray-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Cons
                          </p>
                          <ul className="space-y-1.5">
                            {venue.cons.map(c => (
                              <li key={c} className="flex gap-2 text-xs text-gray-700">
                                <span className="text-rose-400 shrink-0 mt-0.5 font-bold">×</span>{c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className={`${venue.bg} rounded-xl p-3`}>
                          <p className={`text-xs font-bold ${venue.text} uppercase tracking-wider mb-1`}>💰 Cost range</p>
                          <p className={`font-bold ${venue.text}`}>{venue.costRange}</p>
                          <p className="text-gray-500 text-xs mt-0.5">Guest range: {venue.guestRange}</p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">💡 Expert tip</p>
                          <p className="text-amber-800 text-xs leading-relaxed">{venue.tip}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <CtaTool icon={IndianRupee} headline="Use Wedora's budget calculator to plan your total wedding spend"
          sub="Venue + catering + decor + photography — see your full budget breakdown in one place."
          btnLabel="Open budget calculator" btnTo="/blog/wedding-budget-calculator-how-to-allocate-money"
          color={{ bg: 'bg-emerald-50', border: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', title: 'text-emerald-900' }} />

        {/* CITY COSTS */}
        <section id="city-costs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">City-wise venue cost breakdown 2026</h2>
              <p className="text-gray-500 text-sm mt-0.5">Per event, per function — not total wedding cost.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">City</th>
                    <th className="px-4 py-3.5 font-semibold hidden sm:table-cell">Banquet Hall</th>
                    <th className="px-4 py-3.5 font-semibold">Farmhouse / Lawn</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">Hotel (5-star)</th>
                    <th className="px-4 py-3.5 font-semibold hidden lg:table-cell">Key Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CITY_COSTS.map((row, i) => (
                    <tr key={row.city} className={`hover:bg-emerald-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.city}</td>
                      <td className="px-4 py-3 text-sky-600 font-medium text-xs hidden sm:table-cell">{row.banquet}</td>
                      <td className="px-4 py-3 text-emerald-600 font-medium text-xs">{row.farmhouse}</td>
                      <td className="px-4 py-3 text-violet-600 font-medium text-xs hidden md:table-cell">{row.hotel}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden lg:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>These are per-event venue rental costs</strong> — not total wedding costs. A 4-function wedding (mehendi, haldi, wedding, reception) will have 3–4× this figure in total venue spend. Hotel costs also typically include mandatory F&B minimums not shown here. Always request an all-inclusive quote.
            </p>
          </div>
        </section>

        {/* 20 QUESTIONS */}
        <section id="questions">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">20 questions to ask before booking any venue</h2>
              <p className="text-gray-500 text-sm mt-0.5">Organised by category — print this and carry it to every site visit.</p>
            </div>
          </div>

          <div className="space-y-4">
            {QUESTIONS_BOOKING.map(cat => (
              <div key={cat.cat} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-gradient-to-r from-rose-gold to-plum text-white">
                  <p className="font-bold text-sm">{cat.cat}</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {cat.qs.map(q => (
                      <li key={q} className="flex gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded border-2 border-gray-200 shrink-0 mt-0.5 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-sm bg-transparent" />
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TIMING */}
        <section id="timing">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-sky-200/80 bg-gradient-to-br from-sky-50 to-blue-50/40 shadow-xl">
            <div className="px-6 py-4 bg-sky-100/80 border-b border-sky-200 flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-sky-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-sky-950">When to book — advance notice by venue type</h2>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              {[
                { type: '5-star hotel / Heritage palace (peak season)', advance: '12 – 24 months', detail: 'Taj Lake Palace, Oberoi Udaivilas, W Goa, Rambagh Palace — these properties fill up for entire November–February seasons. An enquiry in July for December is often already too late for the best properties.' },
                { type: 'Delhi NCR farmhouse / lawn (November – February)', advance: '10 – 18 months', detail: 'Top Chattarpur, Mehrauli, and Kundli farmhouses are booked 12–18 months ahead for the peak winter season. If you\'re planning a December wedding, enquire no later than December of the previous year.' },
                { type: 'Goa resort (December – January)', advance: '12 – 15 months', detail: 'W Goa, St Regis, and Taj Exotica report December weekends filled 12–15 months in advance. Off-season Goa (June–August) is available with 2–3 months\' notice and comes with 40–60% discounts.' },
                { type: 'City banquet hall (any season)', advance: '4 – 8 months', detail: 'Good banquet halls in metro cities have reasonable availability with 4–6 months\' notice for non-peak dates. Peak season (November–February) fills faster — book 8 months ahead for these.' },
                { type: 'Kalyana Mandapam / community hall', advance: '3 – 6 months', detail: 'Generally better availability than commercial venues but popular mandapams in South Indian cities book out for peak muhurat dates. Book 4–6 months ahead for good dates.' },
              ].map(item => (
                <div key={item.type} className="flex gap-4 p-4 bg-white/80 rounded-xl">
                  <div className="shrink-0 w-32 text-center">
                    <p className="font-black text-sky-600 text-sm leading-tight">{item.advance}</p>
                    <p className="text-xs text-gray-400 mt-0.5">advance</p>
                  </div>
                  <div>
                    <p className="font-bold text-sky-950 text-sm mb-1">{item.type}</p>
                    <p className="text-sky-800/80 text-xs leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60">
                <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm"><strong>The rule:</strong> Book the venue first. Every other vendor can be found — the venue date is the only constraint that cannot be solved with money after the fact.</p>
              </div>
            </div>
          </div>
        </section>

        <CtaTool icon={CalendarDays} headline="Check your muhurat date — then find a venue that's available"
          sub="See all 52+ auspicious Hindu wedding dates in 2026 and 96+ in 2027 — with Nakshatra details."
          btnLabel="See muhurat dates" btnTo="/blog/hindu-wedding-muhurat-dates-2026-2027"
          color={{ bg: 'bg-violet-50', border: 'border-violet-200', grad: 'from-violet-500 to-purple-700', title: 'text-violet-900' }} />

        {/* NEGOTIATION */}
        <section id="negotiation">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">How to negotiate venue pricing</h2>
              <p className="text-gray-500 text-sm mt-0.5">5 tactics that actually work.</p>
            </div>
          </div>
          <div className="space-y-3">
            {NEGOTIATION_TIPS.map((item, i) => (
              <div key={item.tip} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-emerald-200/60 hover:shadow-md transition-all">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{item.tip}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RED FLAGS */}
        <section id="red-flags">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-rose-200/80 bg-gradient-to-br from-rose-50 to-pink-50/40 shadow-xl">
            <div className="px-6 py-4 bg-rose-100/80 border-b border-rose-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-rose-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-rose-950">Red flags that signal a bad venue contract</h2>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              {[
                { flag: 'No written contract — only verbal assurances', why: 'If the venue refuses to put everything in writing, assume the verbal promises will not be honoured. "We always do it this way" is not enforceable. Walk away.' },
                { flag: 'Cancellation clause with no refund on advance', why: 'Standard practice is 25–50% refund if cancellation is more than 6 months out, 0% if within 3 months. A clause that keeps 100% of the advance from day one for any cancellation reason is aggressive — negotiate a partial refund for early cancellation.' },
                { flag: 'Vague "additional charges as applicable" line in the contract', why: 'This clause is how venues add generator charges (₹1–2L), parking fees, overtime charges, and service fees after the event. Insist every possible charge is listed explicitly in the contract before signing.' },
                { flag: 'Unable to provide references from recent weddings', why: 'Any professional venue should be able to connect you with 2–3 couples who held weddings there in the past 6 months. Reluctance to provide references is a red flag about quality, reliability, or hidden past issues.' },
                { flag: '"We\'ll sort it on the day" responses to specific questions', why: 'If the venue manager responds to concrete questions (music cutoff, parking capacity, weather backup) with vague assurances, those things will not be sorted on the day — they\'ll be problems.' },
                { flag: 'No site visit allowed before booking', why: 'A venue that won\'t let you visit the actual event space before paying an advance — only showing photos or a showroom — is hiding something about the real condition of the property.' },
              ].map(item => (
                <div key={item.flag} className="flex gap-3">
                  <span className="text-rose-600 font-bold text-lg leading-snug shrink-0">🚩</span>
                  <div>
                    <p className="font-semibold text-rose-950 mb-1">{item.flag}</p>
                    <p className="text-rose-800/80 text-sm leading-relaxed">{item.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DESTINATION CITIES */}
        <section id="destination">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Top 8 destination wedding cities in India</h2>
              <p className="text-gray-500 text-sm mt-0.5">Best season, top venues, and cost range for each.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {DESTINATION_CITIES.map(c => (
              <div key={c.city} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-200/40">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.emoji}</span>
                    <div>
                      <p className="font-bold text-gray-900">{c.city}</p>
                      <p className="text-gray-500 text-xs">{c.state} · {c.crowd}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <p className="text-gray-600 leading-relaxed italic">"{c.tagline}"</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Best season</p>
                      <p className="text-gray-700 font-medium">{c.season}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Budget range</p>
                      <p className="text-emerald-600 font-bold">{c.cost}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Top venues</p>
                    <p className="text-gray-600 leading-relaxed">{c.topVenues}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Best for</p>
                    <p className="text-amber-800 leading-relaxed">{c.bestFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MISTAKES */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">Mistakes that cost couples lakhs</h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              {MISTAKES.map(item => (
                <div key={item.m} className="flex gap-3">
                  <span className="text-amber-600 font-bold text-lg leading-snug shrink-0">×</span>
                  <div>
                    <p className="font-semibold text-amber-950 mb-1">{item.m}</p>
                    <p className="text-amber-800/80 text-sm leading-relaxed">{item.r}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaSignup headline="Found your venue? Plan everything else on Wedora — free."
          sub="Budget calculator, vendor tracker, last-minute checklist, and WhatsApp invitation generator." />

        {/* RELATED */}
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Star className="w-5 h-5 text-sky-500" fill="currentColor" />
              <p className="font-serif font-bold text-gray-900">More wedding planning guides on Wedora</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Complete Indian Wedding Budget Guide 2026', slug: 'indian-wedding-budget-guide-2026', icon: '💰' },
                { title: 'Hindu Wedding Muhurat Dates 2026 & 2027', slug: 'hindu-wedding-muhurat-dates-2026-2027', icon: '🗓️' },
                { title: 'Indian Wedding Catering Guide 2026', slug: 'indian-wedding-catering-guide-cost-menu-tips', icon: '🍛' },
                { title: 'Indian Wedding Decoration Guide 2026', slug: 'indian-wedding-decoration-ideas-mandap-guide-2026', icon: '🌸' },
                { title: 'Pre-Wedding Shoot Ideas & Locations Guide', slug: 'pre-wedding-shoot-ideas-locations-india', icon: '📸' },
                { title: 'Last-Minute Wedding Checklist: 30 Days Before', slug: 'last-minute-wedding-checklist-30-days-before', icon: '✅' },
              ].map(a => (
                <Link key={a.slug} to={`/blog/${a.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 border border-transparent hover:border-sky-200/60 transition-all group">
                  <span className="text-lg">{a.icon}</span>
                  <p className="text-sm text-gray-700 group-hover:text-sky-600 font-medium transition-colors">{a.title}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-sky-500 shrink-0 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BIG CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 p-1 shadow-2xl shadow-sky-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Venue booked. Now plan your entire wedding on Wedora.
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Budget calculator, catering planner, decoration guide, muhurat calendar,
              pre-wedding shoot planner, and WhatsApp invitation builder — all free on Wedora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-sky-50 transition-colors shadow-lg">
                Start planning free — Wedora
              </Link>
              <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3 text-center">Frequently asked questions</h2>
          <p className="text-center text-gray-500 mb-8 text-sm max-w-2xl mx-auto">
            Every question Indian couples ask about wedding venue selection — answered.
          </p>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <section className="text-center max-w-2xl mx-auto pb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            One right venue decision unlocks everything else
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Use the selector above to identify your venue type. Get competing quotes from
            at least three properties. Visit every shortlisted venue in person at the time of
            day your event will run. Ask every question on the checklist. Read every line of
            the contract before paying anything. Then book early — the best venues in India
            don't wait.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Wedding venue guide India</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Banquet vs farmhouse</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free planning tools</span>
          </div>
        </section>

        {affiliateHref && (
          <aside className="rounded-2xl border border-rose-gold/25 bg-white p-8 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-gold/80 mb-3">Partner pick</p>
            <a href={affiliateHref} target="_blank" rel="sponsored noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">
              {affiliateCtaLabel}
            </a>
          </aside>
        )}
      </main>

      <div className="border-t border-rose-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Share:</span>
            <button type="button" onClick={onShare} className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative">
              <Copy className="w-4 h-4" />
              {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Copied!</span>}
            </button>
          </div>
          <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
            Plan your wedding free — Wedora
          </Link>
        </div>
      </div>
    </div>
  );
}
