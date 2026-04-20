import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Copy, Sparkles, Heart, Star,
  Lightbulb, AlertTriangle, CheckCircle2, ChevronDown,
  ChevronRight, IndianRupee, Users, Utensils, BookOpen,
  ThumbsUp, ThumbsDown, Shield, ClipboardList,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const CATERING_GUIDE_SLUG = 'indian-wedding-catering-guide-cost-menu-tips';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&auto=format&fit=crop';

export function getStaticCateringGuidePost() {
  const now = new Date().toISOString();
  return {
    id: 'static-catering-guide-2026',
    title: 'Indian Wedding Catering Guide 2026: Cost Per Plate, Menu Ideas & Expert Tips',
    slug: CATERING_GUIDE_SLUG,
    excerpt:
      'Complete Indian wedding catering guide 2026 — per plate cost breakdown by city, function-wise menu ideas, live counter guide, caterer selection checklist, and the mistakes that blow budgets.',
    content: '',
    tags: 'Wedding Catering, Wedding Menu, Wedding Food, Wedding Budget',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Indian Wedding Catering Guide 2026: Cost Per Plate, Menu Ideas & Expert Tips | Wedora',
    meta_description:
      'Complete Indian wedding catering guide 2026. Per-plate cost by city and tier, function-wise menus, live counter guide, caterer selection tips, budget calculator, and expert advice.',
    keywords:
      'indian wedding catering cost per plate 2026, wedding catering cost india, indian wedding menu ideas, wedding food per plate cost india, wedding catering budget india, live counters wedding india, wedding caterer selection india',
    author: 'Wedora Wedding Planning Team',
    published_at: now,
    created_at: now,
    updated_at: now,
    status: 'published',
    affiliate_link: null,
    affiliate_label: null,
  };
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'why-food-matters', label: 'Why Catering Deserves the Most Attention' },
  { id: 'cost-per-plate',   label: 'Cost Per Plate — 2026 Data by Tier & City' },
  { id: 'budget-formula',   label: 'How to Calculate Your Total Catering Budget' },
  { id: 'function-menus',   label: 'Function-Wise Menu Builder (Interactive)' },
  { id: 'regional',         label: 'Regional Menu Guide — North, South, East, West' },
  { id: 'live-counters',    label: 'Live Counters — The Best Investment in Catering' },
  { id: 'caterer-guide',    label: 'How to Choose & Vet Your Caterer' },
  { id: 'tasting',          label: 'The Food Tasting Checklist' },
  { id: 'dietary',          label: 'Dietary Requirements — Jain, Diabetic, Allergies' },
  { id: 'mistakes',         label: 'Mistakes That Blow Wedding Food Budgets' },
  { id: 'faq',              label: 'FAQs' },
];

// Per-plate cost tiers — cross-referenced from magicpin, hitkariproductions, venuelook 2026
const COST_TIERS = [
  {
    tier: 'Budget',
    icon: '🏠',
    range: '₹450 – ₹900',
    perPerson: '₹600 avg',
    includes: 'Local halwai / home-style catering. Basic veg buffet: 2–3 curries, dal, rice, 2 breads, 1–2 desserts. No live counters.',
    bestFor: 'Intimate home weddings, small guest lists under 150, haldi/mehendi functions',
    color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
  },
  {
    tier: 'Standard',
    icon: '🏨',
    range: '₹1,000 – ₹2,000',
    perPerson: '₹1,400 avg',
    includes: 'Professional caterer. Full veg buffet + 1–2 non-veg options. Chaat counter. Basic welcome drinks. 2 desserts.',
    bestFor: 'Most Indian weddings — the sweet spot of quality and value for 200–500 guests',
    color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
  },
  {
    tier: 'Mid-Premium',
    icon: '🏰',
    range: '₹2,000 – ₹4,000',
    perPerson: '₹2,800 avg',
    includes: 'Multi-cuisine buffet. 4–5 live counters (chaat, grill, pasta, dosa). Mocktail station. Elaborate dessert spread with kulfi. Full front-of-house service staff.',
    bestFor: 'Most receptions and main wedding day for 200–600 guests who want a premium experience',
    color: 'from-violet-500 to-purple-700', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
  },
  {
    tier: 'Premium',
    icon: '⭐',
    range: '₹4,000 – ₹8,000',
    perPerson: '₹5,500 avg',
    includes: 'Chef-led live stations (8+ counters). Imported ingredients. Plated service option. Full cocktail bar or premium mocktail bar. Themed food presentations. Dedicated service manager.',
    bestFor: 'Destination weddings, farmhouse receptions, 300–700 guests for families wanting luxury food experience',
    color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
  },
  {
    tier: 'Ultra-Premium (Hotel In-house)',
    icon: '👑',
    range: '₹8,000 – ₹15,000+',
    perPerson: '₹10,000+ avg',
    includes: 'Taj, ITC, Leela, Marriott in-house catering. Michelin-trained chefs. Everything included — crockery, linen, floral food presentations, premium bar. Zero coordination stress.',
    bestFor: '5-star hotel weddings where the venue mandates in-house catering. Convenience premium is steep but total.',
    color: 'from-rose-gold to-plum', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700',
  },
];

// City-wise modifiers
const CITY_COSTS = [
  { city: 'Delhi / NCR', modifier: 'Base (1×)', standard: '₹1,200–₹2,200', mid: '₹2,500–₹4,000', note: 'Most competitive market — largest number of quality caterers. North Indian cuisine rates are lowest here.' },
  { city: 'Mumbai', modifier: '+20–30%', standard: '₹1,500–₹2,800', mid: '₹3,000–₹5,000', note: 'Higher venue costs, higher labour costs. Premium venues in South Mumbai inflate catering costs significantly.' },
  { city: 'Bengaluru', modifier: '+10–20%', standard: '₹1,300–₹2,500', mid: '₹2,800–₹4,500', note: 'Strong South Indian cuisine options. Tech-sector weddings push premium catering demand.' },
  { city: 'Hyderabad', modifier: 'Base–+10%', standard: '₹1,100–₹2,000', mid: '₹2,200–₹3,800', note: 'Biryani is a centrepiece dish — budget for premium biryani as a standalone item, not an afterthought.' },
  { city: 'Chennai', modifier: '–10–Base', standard: '₹900–₹1,800', mid: '₹2,000–₹3,500', note: 'South Indian cuisine, banana leaf service, and traditional thalis are extremely cost-effective. Best value.' },
  { city: 'Jaipur / Rajasthan', modifier: '+5–15%', standard: '₹1,200–₹2,200', mid: '₹2,500–₹4,200', note: 'Destination wedding premium. Dal baati churma counter is a must. Many wedding venues require approved caterer lists.' },
  { city: 'Pune', modifier: 'Base–+10%', standard: '₹1,100–₹2,000', mid: '₹2,200–₹3,800', note: 'Good mid-market options. Maharashtrian food (puran poli, modak) adds warmth to any function menu.' },
  { city: 'Kolkata', modifier: '–5–Base', standard: '₹900–₹1,800', mid: '₹2,000–₹3,500', note: 'Bengali wedding catering excels at fish and sweets. Mishti doi and sandesh are non-negotiable for dessert.' },
];

// Function-wise menus — the interactive feature
const FUNCTIONS = [
  {
    id: 'mehendi',
    label: 'Mehendi',
    emoji: '🌿',
    timing: 'Daytime / afternoon',
    vibe: 'Casual, colourful, light — guests are seated, hands occupied, mood is festive',
    color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
    menu: {
      welcome: ['Aam panna', 'Jaljeera', 'Nimbu sharbat', 'Coconut water station'],
      starters: ['Mini samosa with green chutney', 'Dahi bhalla', 'Aloo tikki chaat', 'Crispy corn', 'Bread pakora'],
      mains: ['Chole rice', 'Dahi puri counter', 'Paratha with butter + achaar', 'Pav bhaji counter', 'Light dal'],
      desserts: ['Falooda', 'Kulfi on stick', 'Gulab jamun (warm)'],
      note: 'Keep it finger-food friendly — guests have mehendi on their hands and cannot manage full plates comfortably. Focus on chaat counters and bite-sized items. Avoid gravy dishes as main course.',
    },
  },
  {
    id: 'haldi',
    label: 'Haldi',
    emoji: '💛',
    timing: 'Morning',
    vibe: 'Home-style, intimate, usually family only — no need for elaborate catering',
    color: 'from-amber-500 to-orange-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
    menu: {
      welcome: ['Haldi doodh (turmeric milk)', 'Fresh juice', 'Chai station'],
      starters: ['Poha', 'Upma', 'Mini idli with sambar', 'Bread butter jam'],
      mains: ['Puri bhaji', 'Khichdi + ghee', 'Simple dal chawal', 'Kheer'],
      desserts: ['Sheera / Halwa', 'Banana + fresh fruit plate', 'Laddoo'],
      note: 'This is a morning family function — breakfast / brunch format works best. Skip heavy non-veg and multi-cuisine. Keep it homestyle, warm, and comforting. Budget: ₹450–₹800/plate.',
    },
  },
  {
    id: 'sangeet',
    label: 'Sangeet',
    emoji: '🎶',
    timing: 'Evening / night',
    vibe: 'High energy, dance performances, mingling — cocktail-style or dinner format',
    color: 'from-violet-500 to-purple-700', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
    menu: {
      welcome: ['Signature mocktail named after the couple', 'Chaat counter', 'Panipuri station'],
      starters: ['Paneer tikka', 'Seekh kebab', 'Tandoori chicken', 'Crispy mushroom', 'Mini pizza', 'Spring rolls'],
      mains: ['Butter chicken + dal makhani', 'Penne arrabbiata counter', 'Rajma chawal', 'Tandoori roti / naan'],
      desserts: ['Matka kulfi counter', 'Chocolate fountain', 'Mini dessert shots (tiramisu, rasmalai)'],
      note: 'Sangeet food should be snackable and served across 3–4 hours while performances happen. Live counters work exceptionally well here — they keep guests busy and energised. Non-veg starters are a crowd favourite.',
    },
  },
  {
    id: 'wedding',
    label: 'Wedding Day',
    emoji: '🌸',
    timing: 'Lunch / dinner depending on muhurat',
    vibe: 'The main ceremony — formal, significant, traditional, full spread expected',
    color: 'from-rose-gold to-plum', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700',
    menu: {
      welcome: ['Thandai / sharbat', 'Fresh coconut water', 'Mocktail station', 'Rose milk'],
      starters: ['Chaat counter (pani puri, dahi bhalla)', 'Paneer tikka', 'Tandoori platter', 'Crispy corn', 'Papdi chaat'],
      mains: ['Paneer butter masala', 'Dal makhani', 'Shahi veg kofta', 'Dum biryani / pulao', 'Naan + tandoori roti + missi roti', 'Raita + salad bar', 'Regional curry based on family background'],
      desserts: ['Gulab jamun (warm)', 'Gajar ka halwa', 'Rasmalai', 'Kulfi counter', 'Mithai selection', 'Ice cream'],
      note: 'This is the most important meal of the entire wedding. Do not cut corners here. A minimum of 20–25 dishes across all courses is expected. Budget generously — guests will remember the food above all else.',
    },
  },
  {
    id: 'reception',
    label: 'Reception',
    emoji: '🥂',
    timing: 'Evening / dinner',
    vibe: 'Celebratory, inclusive, sometimes semi-formal — often the largest guest count function',
    color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
    menu: {
      welcome: ['Signature welcome drink', 'Live juice counter', 'Sparkling mocktails'],
      starters: ['Live grill counter', 'Pasta counter (penne + pizza)', 'Asian corner (momos, fried rice, dim sum)', 'South Indian dosa counter', 'Paneer + chicken tikka platters'],
      mains: ['Butter chicken + paneer makhani', 'Dal makhani', 'Mix veg', 'Biryani / pulao counter', 'Naan + kulcha + puri', 'Salad bar + raita + papad'],
      desserts: ['Gulab jamun + jalebi', 'Rabdi', 'Ice cream cart', 'Kulfi station', 'Brownie + chocolate cake section', 'Paan counter'],
      note: 'Reception typically has the highest guest count and the widest age range. Multi-cuisine live counters work best — international stations (pasta, Asian) satisfy younger guests while traditional buffet keeps elders happy. A well-run Paan counter at the end is a signature finishing touch.',
    },
  },
];

// Regional menus
const REGIONAL_MENUS = [
  {
    region: 'North Indian',
    states: 'Punjab, Delhi, Haryana, UP, Rajasthan, HP',
    emoji: '🧡',
    signature: ['Butter Chicken / Murgh Makhani', 'Dal Makhani', 'Paneer Butter Masala', 'Dum Biryani (Lucknowi / Hyderabadi)', 'Pani Puri / Golgappa', 'Tandoori Roti, Naan, Kulcha', 'Gajar ka Halwa', 'Gulab Jamun', 'Jalebi + Rabdi'],
    tip: 'A live tandoor counter is essential. The sight and smell of fresh naan pulls guests immediately. Budget: ₹1,200–₹3,500/plate. Multi-level gravies + elaborate chaat are the hallmark.',
    color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50',
  },
  {
    region: 'South Indian',
    states: 'Tamil Nadu, Karnataka, Kerala, Andhra, Telangana',
    emoji: '🌴',
    signature: ['Banana Leaf Sadya (Kerala)', 'Masala Dosa + Chutney', 'Sambar + Rasam', 'Curd Rice + Papad', 'Hyderabadi Dum Biryani', 'Avial + Olan (Kerala)', 'Payasam (3+ varieties)', 'Mysore Pak', 'Kesari Bath'],
    tip: 'Banana leaf service is visually spectacular and culturally significant — worth the logistics. South Indian weddings deliver outstanding value: rich flavour at ₹900–₹2,000/plate. Multiple payasam varieties are non-negotiable.',
    color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50',
  },
  {
    region: 'Bengali',
    states: 'West Bengal, Odisha, parts of Assam',
    emoji: '🐟',
    signature: ['Ilish Machher Jhol (Hilsa fish curry)', 'Kosha Mangsho (slow-cooked mutton)', 'Luchi with Alur Dom', 'Chingri Malai Curry (prawn coconut curry)', 'Doi Maach', 'Mishti Doi (sweet yoghurt)', 'Sandesh', 'Rasgulla + Chamcham', 'Payesh (rice kheer)'],
    tip: 'Fish (especially Hilsa) is culturally central to Bengali weddings — do not skip it for cost reasons. Mishti doi and sandesh from a reputed Kolkata brand elevate the dessert section enormously. Budget: ₹1,100–₹2,500/plate.',
    color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50',
  },
  {
    region: 'Gujarati & Rajasthani',
    states: 'Gujarat, Rajasthan',
    emoji: '🏜️',
    signature: ['Dal Baati Churma (Rajasthan)', 'Gatte ki Sabzi', 'Ker Sangri', 'Dhokla + Khandvi (Gujarat)', 'Undhiyu (Gujarat)', 'Surti Locho', 'Mohanthal', 'Churma Laddoo', 'Jalebi + Fafda'],
    tip: 'A live Dal Baati Churma station is a crowd showstopper at Rajasthani weddings — the ghee pouring ritual alone gets photographed constantly. Gujarati thalis are remarkable value and variety. Budget: ₹900–₹2,200/plate.',
    color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50',
  },
];

// Live counters guide
const LIVE_COUNTERS = [
  { counter: 'Chaat Counter', dishes: 'Pani puri, dahi bhalla, aloo tikki, papdi chaat, bhel puri', capacity: '80–100 guests/hr', crowd: '⭐⭐⭐⭐⭐', note: 'The single most popular counter at every Indian wedding. Without exception. Budget ₹15,000–₹40,000 for a well-staffed chaat counter.' },
  { counter: 'Tandoor / Grill Counter', dishes: 'Paneer tikka, seekh kebab, tandoori chicken, fish tikka, rumali roti', capacity: '60–80 guests/hr', crowd: '⭐⭐⭐⭐⭐', note: 'The smoke, the aroma, the theatre — a live tandoor counter is the most impactful visual element in wedding catering. Essential for North Indian weddings.' },
  { counter: 'Dosa Counter', dishes: 'Plain, masala, ghee roast, cheese, rava dosa — with chutneys and sambar', capacity: '70–90 guests/hr', crowd: '⭐⭐⭐⭐⭐', note: 'Works at ALL Indian weddings regardless of region. The interactive preparation keeps guests engaged. A well-run dosa counter is consistently the longest queue.' },
  { counter: 'Kulfi / Ice Cream Counter', dishes: 'Matka kulfi, falooda, malai kulfi, rabdi kulfi — 4–6 flavours', capacity: '100–120 guests/hr', crowd: '⭐⭐⭐⭐⭐', note: 'After a spicy dinner, the kulfi counter is where 80% of guests end their meal. A matka kulfi counter with falooda is a signature wedding experience. Never skip this.' },
  { counter: 'Pasta / Continental Counter', dishes: 'Penne arrabbiata, pasta in white sauce, garlic bread, pizza slices', capacity: '70–90 guests/hr', crowd: '⭐⭐⭐⭐', note: 'Younger guests and children flock here. Balances the spice-forward main buffet. Costs ₹12,000–₹25,000 but increases guest satisfaction significantly for mixed-age weddings.' },
  { counter: 'Asian Corner', dishes: 'Momos (steamed + fried), fried rice, hakka noodles, dim sum, spring rolls', capacity: '70–90 guests/hr', crowd: '⭐⭐⭐⭐', note: 'Youth favourite. Indo-Chinese is already in every Indian\'s comfort zone. Great for sangeet and reception functions with younger guest demographics.' },
  { counter: 'Paan Counter', dishes: 'Meetha paan, saada paan, chocolate paan, flavoured paans — 8–12 varieties', capacity: '150+ guests/hr', crowd: '⭐⭐⭐⭐', note: 'The perfect finale to the wedding meal. A good paan counter at the exit point leaves guests with the final flavour of the evening. Low cost (₹8,000–₹15,000), extremely high impact.' },
  { counter: 'Biryani / Dum Counter', dishes: 'Dum biryani cooked in matka/handi at the counter, unveiled tableside', capacity: '100 guests/hr', crowd: '⭐⭐⭐⭐', note: 'The theatrical handi opening is a wedding moment in itself. Especially impactful at Hyderabadi, Awadhi, or Bengali receptions. Budget separately for premium biryani — ₹300–₹600 per plate additional.' },
];

// Caterer selection checklist
const CATERER_CHECKLIST = [
  { item: 'Verify their actual capacity for your guest count', detail: 'Ask directly: "What is the largest wedding you have handled?" A caterer comfortable with 200 guests may struggle with 500. Get references for events of your size.' },
  { item: 'Request a tasting before signing any contract', detail: 'Never commit without a tasting. Arrange a tasting of at least 8–10 dishes covering starters, mains, and desserts. The tasting should be as close as possible to the actual preparation method (not a home-cooked sample).' },
  { item: 'Confirm the serving team size per 100 guests', detail: 'Industry standard is 1 serving staff per 15–20 guests for a buffet, 1 per 8–10 guests for plated service. Understaffed catering leads to empty trays, long queues, and unhappy guests.' },
  { item: 'Get clarity on what is included vs extra', detail: 'Ask for a written inclusions list: food, serving staff, crockery, cutlery, chafing dishes, serving spoons, table covers, generator backup (if needed), cleanup. Many caterers charge separately for each.' },
  { item: 'Ask about their cold chain and food safety practice', detail: 'For large weddings, food is partially prepared hours in advance. Ask how they maintain temperature for hot items and cold chain for proteins. Request their FSSAI license number — this is a legal requirement.' },
  { item: 'Confirm exact headcount for the final invoice', detail: 'Get clarity on the billing model: per-plate (actual consumption) or per-head-invited (riskier for you). Negotiate a 10% buffer above your RSVP count — not the full invited list.' },
  { item: 'Discuss vendor payment timeline and cancellation terms', detail: 'Standard is 25–30% advance on booking, 40% 30 days before, balance 3–7 days before the event. Ensure the contract covers cancellation, date change, and force majeure terms.' },
  { item: 'Ask about food surplus and donation policy', detail: 'Good caterers partner with organisations like Robin Hood Army or Feeding India for surplus food collection. This is increasingly a priority for conscious couples.' },
];

// Mistakes
const MISTAKES = [
  { m: 'Fixing the guest count too high with the caterer', r: 'Most Indian couples over-invite and see 20–30% no-shows. If you give your caterer the full invited list, you\'ll pay for 500 plates when 380 people attend. Give your caterer your confirmed RSVP count + 10% buffer, not your invitation list.' },
  { m: 'Booking the cheapest caterer without a tasting', r: 'Budget caterers who cannot deliver consistent quality for 400+ guests are a genuine risk. A wedding where food runs out, tastes poor, or is served cold is remembered for the wrong reasons. Always taste before you sign.' },
  { m: 'Putting all functions on one caterer without negotiating a package discount', r: 'If the same caterer does your mehendi, haldi, sangeet, wedding, and reception, you have significant negotiating power. Ask for a package rate — most caterers will discount 10–20% for multi-function bookings.' },
  { m: 'Skipping live counters to save money', r: 'Live counters cost ₹10,000–₹40,000 each but deliver 10× their cost in guest experience. Guests remember the chaat counter experience more than any other food moment. Cut elsewhere before cutting live counters.' },
  { m: 'Not accounting for the service charge and GST in the budget', r: 'Caterers quote per-plate prices that often exclude service charges (8–12%) and GST (5–18% depending on category). The actual invoice can be 20–30% higher than the quoted per-plate rate. Always ask for an all-inclusive quote.' },
  { m: 'Choosing a caterer too far from the wedding venue', r: 'Transportation logistics for hot food over long distances compromise quality. A caterer who needs 2+ hours to transport food to your venue will struggle to maintain temperature and freshness. Local proximity is a quality factor, not just a cost factor.' },
  { m: 'Not planning function-specific menus', r: 'Using the same caterer, same menu, same setup for all 4–5 functions creates a repetitive experience guests find boring. Each function has a different time, vibe, and guest energy — the menu should reflect that.' },
];

const FAQS = [
  {
    q: 'What is the average cost of wedding catering per plate in India in 2026?',
    a: 'The average cost per plate for Indian wedding catering in 2026 ranges from ₹450–₹900 for budget (local halwai), ₹1,000–₹2,000 for standard professional catering, ₹2,000–₹4,000 for mid-premium multi-cuisine with live counters, ₹4,000–₹8,000 for premium chef-led catering, and ₹8,000–₹15,000+ for 5-star hotel in-house catering. The most common range for a mid-size Indian wedding is ₹1,200–₹2,500 per plate.',
  },
  {
    q: 'How much does catering cost for a 300-guest Indian wedding in 2026?',
    a: 'For a 300-guest wedding at standard tier (₹1,500/plate): ₹4,50,000 for one function. For 4 functions (mehendi, haldi, wedding, reception): approximately ₹12–18 lakh for catering alone at standard rates. At mid-premium (₹2,500/plate, 4 functions): ₹25–30 lakh. Note: caterers typically charge full plate rate for all functions separately — negotiate a multi-function package discount.',
  },
  {
    q: 'Is it better to use the venue\'s in-house catering or hire an outside caterer?',
    a: 'In-house catering at premium hotels (Taj, ITC, Leela) offers convenience, accountability, and guaranteed food quality — but is 30–50% more expensive than comparable outside caterers. Outside caterers offer greater menu flexibility, potentially better cuisine expertise, and lower per-plate costs. For heritage venues and farmhouses that allow outside catering, a carefully selected independent caterer often delivers a better guest experience at significantly lower cost. Always check whether your venue mandates in-house catering before comparing.',
  },
  {
    q: 'How many live counters do I need for 300 guests?',
    a: 'For 300 guests: plan for a minimum of 4–5 live counters operating simultaneously. Each counter can serve 80–100 guests per hour — so for 300 guests, 4 counters running simultaneously means everyone is served within 45–60 minutes. With only 2 counters, you\'ll have queues of 20–30 minutes which frustrates guests. The standard recommendation: 1 live counter per 60–80 guests for a smooth experience.',
  },
  {
    q: 'What are the must-have dishes at an Indian wedding?',
    a: 'The non-negotiable dishes at an Indian wedding are: (1) Pani puri / chaat counter — the most-loved station at every function; (2) Paneer Butter Masala — the universal vegetarian main; (3) Dal Makhani — the slow-cooked foundation of any North Indian wedding meal; (4) Dum Biryani — a centrepiece dish; (5) Fresh naan / tandoori roti from a live tandoor; (6) Gulab jamun (warm) — the classic wedding dessert; (7) Kulfi — especially matka kulfi at evening functions. These seven are the baseline around which everything else is built.',
  },
  {
    q: 'How do I handle dietary requirements — Jain, diabetic, gluten-free?',
    a: 'For Jain guests: remove all dishes containing onion, garlic, and root vegetables (potato, carrot, beetroot, radish). Ask your caterer to prepare a separate Jain section with clearly labelled dishes — at least 4–5 mains and 2 desserts. For diabetic guests: ensure there are non-sweet beverage options, low-sugar desserts (fruit plate, sugar-free mithai), and avoid offering only sweet welcome drinks. For gluten-free guests: rice, dal, most curries, and fruits are naturally gluten-free — just ensure the kitchen hasn\'t cross-contaminated. Always communicate dietary requirements to the caterer 1–2 weeks before the wedding.',
  },
  {
    q: 'When should I finalise the caterer and conduct a food tasting?',
    a: 'Book your caterer 4–6 months before the wedding for peak-season dates (November–February, May). Conduct the food tasting 6–8 weeks before the wedding — this gives enough time to discuss changes with the caterer. The tasting should cover all major dishes including starters, at least 3 main course items, bread, rice, and 2–3 desserts. Never commit to a caterer without a tasting of your actual wedding menu.',
  },
  {
    q: 'How do I calculate a realistic catering budget for my wedding?',
    a: 'Use this formula: (Confirmed RSVP count + 10% buffer) × per-plate cost × number of functions. Example: 300 confirmed guests + 30 buffer = 330 × ₹1,800/plate × 3 functions = ₹17.82 lakh. Then add: service charges (8–12%), GST (5%), and live counter costs (₹50,000–₹1.5 lakh depending on number and type). Your all-in catering budget will typically be 25–35% higher than the simple per-plate calculation. Catering should represent 25–35% of your total wedding budget.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/90 overflow-hidden shadow-sm">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-orange-50/50 transition-colors"
        aria-expanded={open}>
        <span className="font-semibold text-gray-900 pr-2 text-sm md:text-base">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-orange-500 transition-transform ${open ? 'rotate-180' : ''}`} />
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

// ─── Main Component ───────────────────────────────────────────────────────────
export function IndianWeddingCateringGuideArticle({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq]         = useState(-1);
  const [showToc, setShowToc]         = useState(false);
  const [activeFunction, setActiveFn] = useState('wedding');
  const [activeCostTier, setActiveCt] = useState(null);

  const activeFnData = FUNCTIONS.find(f => f.id === activeFunction);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-400/15 to-amber-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-rose-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-200/20 blur-3xl" />
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
            <span className="text-orange-600 font-semibold">Wedding Planning</span>
            <ChevronRight className="w-3 h-3" />
            <span>Catering Guide</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-orange-400/30 shadow-sm mb-6">
            <Utensils className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-700">2026 Guide · Food Is the Soul</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.08] mb-4">
            Indian Wedding{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-rose-gold">
              Catering Guide
            </span>
          </h1>
          <p className="text-base text-orange-700 font-semibold mb-5">
            Cost Per Plate · Menu Ideas · Live Counters · Expert Tips · 2026
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {[
              { icon: '💰', label: '5-tier cost breakdown' },
              { icon: '🍽️', label: 'Function-wise menus' },
              { icon: '🔥', label: 'Live counters guide' },
              { icon: '🗺️', label: 'City-wise pricing' },
              { icon: '📋', label: 'Caterer checklist' },
              { icon: '⚠️', label: 'Mistakes that blow budgets' },
            ].map(p => (
              <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-orange-200/60 text-gray-700 text-xs font-semibold shadow-sm">
                {p.icon} {p.label}
              </span>
            ))}
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Long after guests forget the décor, they will remember whether the biryani was
            perfectly spiced and whether the pani puri water was tangy enough. Catering is
            30–40% of your wedding budget — and the most talked-about decision you'll make.
            This guide covers all of it.
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
          <div className="max-w-5xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-2xl shadow-orange-400/15 border-4 border-white ring-1 ring-orange-100">
            <img src={ensureHttps(post.featured_image)} alt="Indian wedding celebration — catering and food guide"
              className="w-full aspect-[21/9] object-cover object-center" loading="eager" />
          </div>
        )}
      </header>

      {/* TOC */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 mb-8">
        <div className="rounded-2xl bg-white border border-orange-100 shadow-sm overflow-hidden">
          <button type="button" onClick={() => setShowToc(!showToc)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-orange-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-900">Table of Contents</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{TOC.length} sections</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} />
          </button>
          {showToc && (
            <div className="border-t border-gray-100 px-5 py-4 grid sm:grid-cols-2 gap-1">
              {TOC.map((item, i) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setShowToc(false)}
                  className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-orange-600 transition-colors group">
                  <span className="w-5 h-5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">{i + 1}</span>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-14 md:space-y-20">

        {/* WHY FOOD MATTERS */}
        <section id="why-food-matters">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-amber-300/15 to-rose-gold/15 rounded-[2rem] blur-xl opacity-60" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-orange-50/60 border border-orange-100/80 p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-orange-500 shrink-0" />
                Food is the only thing every guest experiences equally
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                At a wedding, not every guest will notice the table centrepieces. Not everyone
                will see the bridal outfit up close. Not everyone will catch every dance
                performance. But <strong>every single guest will eat the food</strong> — and
                they will form their lasting impression of the wedding around it.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                The Indian wedding catering industry is worth <strong>₹85,000 crore annually</strong>.
                The average Indian wedding serves 350 guests across 3–4 functions —
                that is 1,000–1,400 individual covers of food per wedding. At standard rates,
                catering represents <strong>30–40% of the total wedding budget</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                No other single wedding decision affects as many people, costs as much money,
                or creates as many lasting memories. This guide helps you spend it wisely.
              </p>
            </div>
          </div>
        </section>

        <CtaSignup headline="Tracking your wedding catering budget? Wedora makes it simple."
          sub="Free budget planner, vendor tracker, and checklist — all in one place. No spreadsheets needed." />

        {/* COST PER PLATE */}
        <section id="cost-per-plate">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg"><IndianRupee className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Cost per plate — 2026 data by tier</h2>
              <p className="text-gray-500 text-sm mt-0.5">Cross-referenced from market research and vendor quotes, April 2026.</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {COST_TIERS.map((tier) => (
              <div key={tier.tier}
                onClick={() => setActiveCt(activeCostTier === tier.tier ? null : tier.tier)}
                className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-md ${activeCostTier === tier.tier ? `${tier.border} shadow-md` : 'border-gray-100 bg-white'}`}>
                <div className={`flex items-center justify-between px-5 py-4 ${activeCostTier === tier.tier ? tier.bg : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                      <p className="font-serif font-bold text-gray-900">{tier.tier}</p>
                      <p className={`text-sm font-bold ${tier.text}`}>{tier.range} per plate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${tier.bg} ${tier.text} border ${tier.border}`}>
                      avg {tier.perPerson}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeCostTier === tier.tier ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {activeCostTier === tier.tier && (
                  <div className={`px-5 pb-4 pt-3 border-t ${tier.border} ${tier.bg}`}>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">What's included</p>
                        <p className={`leading-relaxed ${tier.text}`}>{tier.includes}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Best for</p>
                        <p className="text-gray-700 leading-relaxed">{tier.bestFor}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* City costs table */}
          <h3 className="font-serif font-bold text-lg text-gray-900 mb-3">City-wise cost variation</h3>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">City</th>
                    <th className="px-4 py-3.5 font-semibold hidden sm:table-cell">vs Delhi</th>
                    <th className="px-4 py-3.5 font-semibold">Standard</th>
                    <th className="px-4 py-3.5 font-semibold hidden sm:table-cell">Mid-Premium</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CITY_COSTS.map((row, i) => (
                    <tr key={row.city} className={`hover:bg-orange-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.city}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{row.modifier}</td>
                      <td className="px-4 py-3 font-medium text-orange-600">{row.standard}</td>
                      <td className="px-4 py-3 font-medium text-violet-600 hidden sm:table-cell">{row.mid}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BUDGET FORMULA */}
        <section id="budget-formula">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-orange-200/80 bg-gradient-to-br from-orange-50 to-amber-50/50 shadow-xl">
            <div className="px-6 py-4 bg-orange-100/80 border-b border-orange-200 flex items-center gap-3">
              <IndianRupee className="w-7 h-7 text-orange-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-orange-950">How to calculate your total catering budget</h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-orange-200/60 text-center">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">The Formula</p>
                <p className="font-mono text-lg text-gray-900 font-bold">
                  (RSVP count + 10% buffer) × per-plate cost × no. of functions
                </p>
                <p className="text-gray-500 text-xs mt-2">Then add: service charge (8–12%) + GST (5%) + live counter costs</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: 'Budget Example', guests: 300, plate: 900, functions: 4, total: '~₹11.9L', note: 'Local halwai, simple setup' },
                  { label: 'Standard Example', guests: 300, plate: 1600, functions: 4, total: '~₹21.1L', note: 'Professional caterer, some live counters' },
                  { label: 'Premium Example', guests: 300, plate: 3000, functions: 4, total: '~₹39.6L', note: 'Multi-cuisine, full live counter setup' },
                ].map(ex => (
                  <div key={ex.label} className="bg-white rounded-xl p-4 border border-orange-200/60">
                    <p className="font-bold text-orange-700 text-sm mb-2">{ex.label}</p>
                    <p className="text-xs text-gray-500">{ex.guests} guests × ₹{ex.plate.toLocaleString()} × {ex.functions} functions</p>
                    <p className="text-xl font-black text-gray-900 mt-1">{ex.total}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ex.note}</p>
                    <p className="text-xs text-orange-600 mt-1 font-medium">+20–30% for taxes & counters</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm leading-relaxed">
                  <strong>Key insight:</strong> Catering should represent 25–35% of your total wedding budget.
                  For a ₹15 lakh wedding, plan ₹4–5 lakh for catering. For a ₹50 lakh wedding, plan ₹15–18 lakh.
                  Never use the full invited list for per-plate calculation — use your confirmed RSVP + 10% buffer.
                  Indian weddings average 20–30% no-shows.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaTool icon={IndianRupee} headline="Use Wedora's free budget calculator for the full picture"
          sub="Allocate your entire wedding budget across catering, venue, decor, photography and more — instantly."
          btnLabel="Open budget calculator" btnTo="/blog/wedding-budget-calculator-how-to-allocate-money"
          color={{ bg: 'bg-emerald-50', border: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', title: 'text-emerald-900' }} />

        {/* FUNCTION MENUS — INTERACTIVE */}
        <section id="function-menus">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/25">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Function-wise menu builder</h2>
              <p className="text-gray-500 text-sm mt-0.5">Select a function to see the recommended menu composition.</p>
            </div>
          </div>

          {/* Function selector tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {FUNCTIONS.map(fn => (
              <button key={fn.id} type="button" onClick={() => setActiveFn(fn.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  activeFunction === fn.id
                    ? `bg-gradient-to-r ${fn.color} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                <span>{fn.emoji}</span>{fn.label}
              </button>
            ))}
          </div>

          {/* Function content */}
          {activeFnData && (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className={`px-5 py-4 bg-gradient-to-r ${activeFnData.color} text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeFnData.emoji}</span>
                  <div>
                    <p className="font-serif font-bold text-xl">{activeFnData.label} — Recommended Menu</p>
                    <p className="text-white/80 text-sm">{activeFnData.timing} · {activeFnData.vibe}</p>
                  </div>
                </div>
              </div>

              {/* Menu sections */}
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {[
                  { label: '🥤 Welcome Drinks', items: activeFnData.menu.welcome },
                  { label: '🍢 Starters', items: activeFnData.menu.starters },
                  { label: '🍛 Main Course', items: activeFnData.menu.mains },
                  { label: '🍮 Desserts', items: activeFnData.menu.desserts },
                ].map(section => (
                  <div key={section.label} className={`p-4 rounded-xl ${activeFnData.bg} border ${activeFnData.border}`}>
                    <p className={`font-bold text-sm mb-2 ${activeFnData.text}`}>{section.label}</p>
                    <ul className="space-y-1">
                      {section.items.map(item => (
                        <li key={item} className="flex gap-2 text-gray-700 text-sm">
                          <ChevronRight className={`w-3.5 h-3.5 ${activeFnData.text} shrink-0 mt-0.5`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Planner's note */}
              <div className={`mx-5 mb-5 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60`}>
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm leading-relaxed"><strong>Planner's note:</strong> {activeFnData.menu.note}</p>
              </div>
            </div>
          )}
        </section>

        {/* REGIONAL GUIDE */}
        <section id="regional">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg"><BookOpen className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Regional menu guide</h2>
              <p className="text-gray-500 text-sm mt-0.5">North, South, East, West — signature dishes and expert tips.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {REGIONAL_MENUS.map(r => (
              <div key={r.region} className={`rounded-2xl border border-gray-100 overflow-hidden shadow-sm`}>
                <div className={`px-5 py-4 bg-gradient-to-r ${r.color} text-white flex items-center gap-3`}>
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <p className="font-bold">{r.region}</p>
                    <p className="text-white/80 text-xs">{r.states}</p>
                  </div>
                </div>
                <div className={`p-5 ${r.bg}`}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Signature dishes</p>
                  <ul className="space-y-1 mb-3">
                    {r.signature.map(d => (
                      <li key={d} className="flex gap-2 text-gray-700 text-sm">
                        <span className="text-orange-400 shrink-0">•</span>{d}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-white/80 rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
                    {r.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE COUNTERS */}
        <section id="live-counters">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Live counters — the best investment in catering</h2>
              <p className="text-gray-500 text-sm mt-0.5">Queue capacity, crowd ratings, and why each counter is worth its cost.</p>
            </div>
          </div>

          <div className="space-y-3">
            {LIVE_COUNTERS.map(c => (
              <div key={c.counter} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-amber-200/60 hover:shadow-md transition-all">
                <div className="shrink-0 text-center min-w-[52px]">
                  <p className="text-2xl mb-1">🔥</p>
                  <p className="text-[10px] text-gray-400 font-bold">{c.crowd}</p>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{c.counter}</p>
                    <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full font-medium">
                      {c.capacity}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mb-1.5">{c.dishes}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200/60">
            <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-1">The queue management rule</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                One live counter can serve approximately 80–100 guests per hour.
                For 300 guests, you need a minimum of <strong>4–5 live counters running simultaneously</strong>
                to prevent queues longer than 8–10 minutes. Plan your counter count based on guest
                numbers — not budget alone. A 10-minute queue at a wedding is a failure of planning,
                not just catering.
              </p>
            </div>
          </div>
        </section>

        <CtaTool icon={ClipboardList} headline="Use the Wedora checklist to track your caterer decisions"
          sub="Tasting appointments, contract milestones, headcount confirmations — never miss a catering deadline."
          btnLabel="Open free checklist" btnTo="/signup"
          color={{ bg: 'bg-sky-50', border: 'border-sky-200', grad: 'from-sky-500 to-blue-600', title: 'text-sky-900' }} />

        {/* CATERER CHECKLIST */}
        <section id="caterer-guide">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">How to choose and vet your caterer</h2>
              <p className="text-gray-500 text-sm mt-0.5">8 non-negotiable checks before you sign any contract.</p>
            </div>
          </div>

          <div className="space-y-3">
            {CATERER_CHECKLIST.map((item, i) => (
              <div key={item.item} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-emerald-200/60 transition-all">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{item.item}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TASTING CHECKLIST */}
        <section id="tasting">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-teal-50/40 shadow-xl">
            <div className="px-6 py-4 bg-emerald-100/80 border-b border-emerald-200 flex items-center gap-3">
              <Utensils className="w-7 h-7 text-emerald-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-emerald-950">
                The food tasting checklist — what to assess
              </h2>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" /> What to assess
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Temperature — is hot food actually hot, cold food cold?',
                      'Consistency — do the same dishes taste the same on both days?',
                      'Spice levels — can they adjust for guests who prefer mild?',
                      'Portion generosity — is the serving size adequate?',
                      'Presentation quality — how are dishes plated / presented?',
                      'Dietary options — how do they handle Jain / vegan requests?',
                      'Live counter execution — watch them set up and serve at least one item',
                      'Dessert quality — gulab jamun temperature, kulfi firmness, mithai freshness',
                    ].map(item => (
                      <li key={item} className="flex gap-2 text-sm text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-rose-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Red flags to watch for
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Caterer reluctant to do a tasting — major red flag, walk away',
                      'Tasting done with home-cooked food, not catering-quantity preparation',
                      'Cannot show references from weddings of your guest count size',
                      'Vague about staff numbers on the day',
                      'No FSSAI license when asked',
                      'Cannot answer questions about Jain / special dietary handling',
                      'Subcontracts without disclosing — your booked caterer uses a different team',
                      'Requires 100% payment upfront — never agree to this',
                    ].map(item => (
                      <li key={item} className="flex gap-2 text-sm text-rose-800">
                        <span className="text-rose-500 shrink-0 mt-0.5 font-bold">×</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIETARY */}
        <section id="dietary">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Dietary requirements — a practical guide</h2>
              <p className="text-gray-500 text-sm mt-0.5">Jain, diabetic, gluten-free, vegan — how to handle each correctly.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                type: '🕉️ Jain diet', color: 'border-amber-200 bg-amber-50',
                rules: 'Exclude ALL root vegetables: onion, garlic, potato, carrot, beetroot, radish, turnip, and certain underground tubers. This affects most gravies, chaat items, and starters significantly.',
                howTo: 'Ask caterer to prepare a clearly labelled separate Jain section with: 2–3 Jain curries (paneer-based or dal-based without onion/garlic), 1 Jain rice dish, 1–2 Jain breads, and 2–3 Jain desserts. Estimate 15–25% of your guest list as Jain if the family is Gujarati / Jain community.',
              },
              {
                type: '🩺 Diabetic guests', color: 'border-sky-200 bg-sky-50',
                rules: 'High-sugar welcome drinks, sweet lassi, and dessert-heavy counters are problematic. Many elderly guests have type-2 diabetes.',
                howTo: 'Ensure: at least one non-sweet welcome drink option (nimbu paani, plain water with lemon), a fruit plate alongside sweet desserts, and if possible 1–2 sugar-free mithai options. Brief serving staff to point these out when asked.',
              },
              {
                type: '🌱 Vegan guests', color: 'border-emerald-200 bg-emerald-50',
                rules: 'Traditional Indian vegetarian food often contains dairy (ghee, butter, dahi, paneer, cream). Vegan guests cannot have any of these.',
                howTo: 'Growing requirement at modern Indian weddings. Ask caterer if they can prepare 2–3 vegan-friendly dishes (dal, sabzi made with oil not ghee, plain rice). Label them clearly on the buffet. Pre-alert the caterer with estimated vegan count.',
              },
              {
                type: '🌾 Gluten-free guests', color: 'border-violet-200 bg-violet-50',
                rules: 'Wheat-based foods (naan, roti, puri) and maida-based items (samosa, jalebi) are off-limits. Cross-contamination in the kitchen is also a concern for severe celiacs.',
                howTo: 'Dal, rice, most sabzis, raita, and fresh fruits are naturally gluten-free. Ask the caterer to mark GF items on the buffet labels. Pre-inform them of any severe celiac guests who need strict cross-contamination prevention.',
              },
            ].map(item => (
              <div key={item.type} className={`rounded-2xl border-2 ${item.color} p-5`}>
                <p className="font-bold text-gray-900 mb-2 text-base">{item.type}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Restrictions</p>
                    <p className="text-gray-700 leading-relaxed">{item.rules}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">How to handle</p>
                    <p className="text-gray-700 leading-relaxed">{item.howTo}</p>
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
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                7 mistakes that blow Indian wedding catering budgets
              </h2>
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

        <CtaSignup headline="Ready to plan your wedding menu? Start on Wedora — free."
          sub="Budget planner, vendor tracker, checklist, and invitation generator — your complete wedding planning toolkit." />

        {/* RELATED */}
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Star className="w-5 h-5 text-orange-500" fill="currentColor" />
              <p className="font-serif font-bold text-gray-900">More wedding planning guides on Wedora</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Wedding Budget Calculator: Allocate Money Smartly', slug: 'wedding-budget-calculator-how-to-allocate-money', icon: '🧮' },
                { title: 'Complete Indian Wedding Budget Guide 2026', slug: 'indian-wedding-budget-guide-2026', icon: '💰' },
                { title: 'Last-Minute Wedding Checklist: 30 Days Before', slug: 'last-minute-wedding-checklist-30-days-before', icon: '✅' },
                { title: 'Hindu Wedding Muhurat Dates 2026 & 2027', slug: 'hindu-wedding-muhurat-dates-2026-2027', icon: '🗓️' },
                { title: 'WhatsApp Wedding Invitations — Modern Guide', slug: 'whatsapp-wedding-invitations-modern-trend-guide', icon: '💬' },
                { title: 'Low Budget Wedding Ideas That Look Premium', slug: 'low-budget-wedding-ideas-india-look-premium', icon: '✨' },
              ].map(a => (
                <Link key={a.slug} to={`/blog/${a.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-200/60 transition-all group">
                  <span className="text-lg">{a.icon}</span>
                  <p className="text-sm text-gray-700 group-hover:text-orange-700 font-medium transition-colors">{a.title}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 shrink-0 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BIG CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-orange-500 via-amber-500 to-rose-gold p-1 shadow-2xl shadow-orange-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Plan your entire wedding on Wedora — completely free
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              From catering budget to final checklist, vendor management to guest invitations —
              Wedora gives you every tool you need to plan your dream Indian wedding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-orange-50 transition-colors shadow-lg">
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
            The most-searched questions about Indian wedding catering costs and menus.
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
            Feed your guests well. They'll remember nothing else more.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The most talked-about Indian weddings are always the ones where the food was
            exceptional. Pick the right caterer, conduct a proper tasting, invest in live
            counters, plan function-specific menus, and budget with the all-in cost in mind.
            That chaat counter, that live tandoor, that warm gulab jamun — these are the
            memories that outlast every photograph.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Wedding catering guide</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Cost per plate India</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free budget planner</span>
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
            <button type="button" onClick={onShare} className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative" title="Copy link">
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
