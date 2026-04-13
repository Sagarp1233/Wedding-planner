import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Copy,
  Sparkles,
  Heart,
  Star,
  Coins,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  Users,
  Camera,
  Flower2,
  Utensils,
  Music,
  Calculator,
  PiggyBank,
  BarChart3,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

// ─── Slug & static post ──────────────────────────────────────────────────────

export const BUDGET_CALCULATOR_SLUG = 'wedding-budget-calculator-how-to-allocate-money';

// Unsplash: Indian rupee coins and currency — money planning context
const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=85&auto=format&fit=crop';

export function getStaticBudgetCalculatorPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-budget-calculator-2026',
    title: 'Wedding Budget Calculator: How to Allocate Your Money Smartly',
    slug: BUDGET_CALCULATOR_SLUG,
    excerpt:
      'Use our free interactive Indian wedding budget calculator to instantly see how much to spend on every category. Get real allocation formulas, city-wise tips, and avoid the biggest budgeting mistakes.',
    content: '',
    tags: 'Wedding Budget, Budget Calculator, Indian Wedding, Money Planning',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Wedding Budget Calculator: How to Allocate Money Smartly for Indian Weddings | Wedora',
    meta_description:
      'Free interactive Indian wedding budget calculator. Enter your total budget and instantly get smart allocations for venue, catering, decor, photography and more. Plus expert tips.',
    keywords:
      'wedding budget calculator india, how to allocate wedding budget, indian wedding budget breakdown, wedding money allocation, wedding budget planner india 2026, wedora',
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

// Budget allocation categories — three profiles (Tight / Mid / Grand)
// pct values must sum to 100 for each profile
const CATEGORIES = [
  {
    id: 'venue',
    icon: '🏛️',
    label: 'Venue',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200/60',
    text: 'text-rose-700',
    bar: 'bg-rose-500',
    tight: 18,
    mid: 20,
    grand: 22,
    tip: 'Book 8–10 months early. Off-season (May–Jul) cuts cost 20–30%. Community halls & farm venues are 40–60% cheaper than hotels.',
  },
  {
    id: 'catering',
    icon: '🍽️',
    label: 'Catering & Food',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200/60',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    tight: 28,
    mid: 25,
    grand: 22,
    tip: 'Food is the #1 thing guests remember. Budget ₹500–₹1,500 per plate. A local halwai saves 30–40% vs a corporate caterer. Always do a tasting.',
  },
  {
    id: 'decor',
    icon: '💐',
    label: 'Decor & Flowers',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200/60',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
    tight: 10,
    mid: 12,
    grand: 13,
    tip: 'Marigold + fairy lights deliver the most premium look per rupee. Spend 60% of your decor budget on one focal point — the mandap. Everything else can be simple.',
  },
  {
    id: 'photography',
    icon: '📷',
    label: 'Photography & Video',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200/60',
    text: 'text-sky-700',
    bar: 'bg-sky-500',
    tight: 10,
    mid: 12,
    grand: 13,
    tip: 'Never cut this below ₹35K. Photos and videos are the only things that survive the wedding day. Invest here before anywhere else.',
  },
  {
    id: 'bridal',
    icon: '👗',
    label: 'Bridal Outfit & Jewellery',
    color: 'from-violet-500 to-purple-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200/60',
    text: 'text-violet-700',
    bar: 'bg-violet-500',
    tight: 12,
    mid: 12,
    grand: 11,
    tip: 'Buy lehenga from exhibitions (30–50% cheaper). Rent for secondary functions. Use or borrow family jewellery. Invest in one statement piece rather than many medium ones.',
  },
  {
    id: 'groom',
    icon: '🤵',
    label: "Groom's Outfit",
    color: 'from-slate-500 to-gray-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200/60',
    text: 'text-slate-700',
    bar: 'bg-slate-500',
    tight: 4,
    mid: 4,
    grand: 4,
    tip: "Rent the sherwani — a ₹40K piece rents for ₹6–8K. For the reception, a well-fitted suit or bandhgala in a classic navy or ivory always photographs well.",
  },
  {
    id: 'makeup',
    icon: '💄',
    label: 'Bridal Makeup & Mehendi',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200/60',
    text: 'text-pink-700',
    bar: 'bg-pink-500',
    tight: 5,
    mid: 5,
    grand: 5,
    tip: "Bridal makeup is the single biggest visual upgrade. A skilled local MUA delivers the same result as a celebrity artist for 1/5th the cost. Book your trial session 2 weeks before.",
  },
  {
    id: 'invitations',
    icon: '💌',
    label: 'Invitations & Stationery',
    color: 'from-teal-500 to-cyan-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200/60',
    text: 'text-teal-700',
    bar: 'bg-teal-500',
    tight: 2,
    mid: 2,
    grand: 2,
    tip: 'Go digital for 90% of guests — save ₹15K–₹30K. Print only 30–50 premium cards for elders. A Canva invite with a wax-seal envelope to key people looks more thoughtful than mass-printed cards.',
  },
  {
    id: 'entertainment',
    icon: '🎵',
    label: 'DJ & Entertainment',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200/60',
    text: 'text-indigo-700',
    bar: 'bg-indigo-500',
    tight: 3,
    mid: 3,
    grand: 3,
    tip: "A local DJ for 3 hours covers the reception well. For daytime functions, a curated Spotify playlist on a good speaker saves ₹15K–₹25K. Don't pay for a DJ you can't hear over conversation.",
  },
  {
    id: 'transport',
    icon: '🚗',
    label: 'Transport & Logistics',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200/60',
    text: 'text-orange-700',
    bar: 'bg-orange-500',
    tight: 2,
    mid: 2,
    grand: 2,
    tip: 'One decorated bridal car is all you need. For the baraat, family cars + 1–2 rentals works perfectly. Save the convoy spend for the honeymoon.',
  },
  {
    id: 'honeymoon',
    icon: '✈️',
    label: 'Honeymoon',
    color: 'from-rose-gold to-plum',
    bg: 'bg-rose-50',
    border: 'border-rose-200/60',
    text: 'text-rose-700',
    bar: 'bg-rose-gold',
    tight: 0,
    mid: 0,
    grand: 0,
    tip: 'Keep honeymoon budget completely separate from the wedding budget. Plan it independently — mixing them causes stress and usually results in cutting the honeymoon. Start a dedicated honeymoon savings fund the moment you get engaged.',
  },
  {
    id: 'buffer',
    icon: '🛡️',
    label: 'Buffer / Miscellaneous',
    color: 'from-gray-500 to-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200/60',
    text: 'text-gray-700',
    bar: 'bg-gray-500',
    tight: 6,
    mid: 3,
    grand: 3,
    tip: 'This is non-negotiable. Something ALWAYS costs more than quoted. Last-minute chairs, extra food plates, generator backup, forgotten pandit dakshina — the buffer absorbs all of it.',
  },
];

// Allocation profiles
const PROFILES = [
  {
    key: 'tight',
    label: 'Budget-Smart',
    sublabel: '₹5L – ₹12L',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Maximises value. Heavier weight on food and venue; lighter on decor. Best for intimate weddings under 150 guests.',
  },
  {
    key: 'mid',
    label: 'Mid-Range',
    sublabel: '₹12L – ₹30L',
    color: 'from-sky-500 to-blue-600',
    desc: 'The most popular balance in India. All categories get meaningful budgets. Works well for 150–350 guests.',
  },
  {
    key: 'grand',
    label: 'Grand',
    sublabel: '₹30L – ₹75L+',
    color: 'from-rose-gold to-plum',
    desc: 'Full celebration across 3–4 functions. Photography and decor get premium allocations. 350+ guests.',
  },
];

// City adjustment multipliers relative to Tier 2 baseline
const CITY_MULTIPLIERS = [
  { city: 'Mumbai', mult: 1.65, note: 'Highest venue costs in India. Consider Navi Mumbai or Thane suburbs to save 30%.' },
  { city: 'Delhi / NCR', mult: 1.55, note: 'Central Delhi is premium. Noida, Gurgaon, and Faridabad offer 20–35% savings.' },
  { city: 'Bengaluru', mult: 1.45, note: 'Tech-city prices. Whitefield and Sarjapur have more affordable banquet options.' },
  { city: 'Hyderabad', mult: 1.30, note: 'Strong value vs other metros. Secunderabad venues are typically 15% cheaper.' },
  { city: 'Chennai', mult: 1.25, note: 'Dharamapuri and outskirts offer excellent value. Traditional catering is cost-effective.' },
  { city: 'Pune', mult: 1.20, note: 'Good balance of quality and price. Kothrud and Hadapsar have affordable halls.' },
  { city: 'Jaipur', mult: 1.00, note: 'Excellent value. Heritage venues add prestige without metro pricing.' },
  { city: 'Ahmedabad', mult: 1.05, note: 'Strong local vendor ecosystem. Vegetarian-only weddings are very cost-effective here.' },
  { city: 'Tier 2 City', mult: 1.00, note: 'Baseline. Cities like Nagpur, Indore, Bhopal, Coimbatore, Kochi offer excellent value.' },
  { city: 'Tier 3 / Small City', mult: 0.75, note: 'Up to 25% cheaper than Tier 2 averages. Local vendors, community halls, home weddings.' },
];

// Per-guest cost guide
const GUEST_COST_GUIDE = [
  { range: '50 – 100', perGuest: '₹4,500 – ₹7,000', totalEst: '₹2.5L – ₹7L', profile: 'Intimate' },
  { range: '100 – 150', perGuest: '₹5,000 – ₹8,000', totalEst: '₹5L – ₹12L', profile: 'Close family' },
  { range: '150 – 250', perGuest: '₹6,000 – ₹10,000', totalEst: '₹9L – ₹25L', profile: 'Mid-range' },
  { range: '250 – 400', perGuest: '₹7,000 – ₹14,000', totalEst: '₹18L – ₹56L', profile: 'Grand' },
  { range: '400 – 600+', perGuest: '₹10,000 – ₹20,000+', totalEst: '₹40L – ₹1.2Cr+', profile: 'Luxury' },
];

// Where couples go wrong
const BUDGET_MISTAKES = [
  {
    mistake: 'Starting without a fixed total',
    detail: 'Planning before agreeing on a ceiling means every decision is made without context. Every vendor quote feels reasonable in isolation. The total shocks you at the end.',
    fix: 'Sit with both families. Agree on a hard number. Write it down. Sign it.',
  },
  {
    mistake: 'Guest list creep',
    detail: 'Every extra 50 guests adds ₹40,000–₹80,000 to your bill (venue + food + invites + seating). Guest list is the single biggest budget lever — and the hardest to control.',
    fix: 'Set a maximum number before you book any vendor. Every booking should be sized to that number.',
  },
  {
    mistake: 'Allocating by category without city adjustment',
    detail: "A ₹3L venue budget means a community hall in Pune but barely a deposit in Mumbai. Using national averages without adjusting for your city leads to constant shortfalls.",
    fix: 'Apply the city multiplier from our table above before finalising any category budget.',
  },
  {
    mistake: 'Ignoring GST and service charges',
    detail: "18% GST on services means a ₹1L catering quote becomes ₹1.18L. A ₹50K photography package becomes ₹59K. If you're not accounting for GST, you're understating your budget by 15–20%.",
    fix: "Always ask vendors for GST-inclusive quotes. Add 18% mentally to every figure you hear.",
  },
  {
    mistake: 'Paying full advance before delivery',
    detail: "Vendors who demand 100% upfront have no delivery accountability. Problems surface after you've paid, when you have no leverage.",
    fix: "Standard practice: 30–40% advance to book, 30% a month before, final 30–40% on delivery day.",
  },
  {
    mistake: 'No buffer category',
    detail: "Every wedding has unexpected costs. Generator backup, extra plates, transport delays, last-minute decorations, forgotten flowers for the pandit — these add up to ₹20K–₹80K easily.",
    fix: 'Keep 3–6% of your total budget completely untouched until the day before the wedding.',
  },
  {
    mistake: 'Mixing honeymoon into the wedding budget',
    detail: "When honeymoon and wedding share one budget, the honeymoon always loses. Couples end up cutting the trip or starting married life in debt from both.",
    fix: 'Open a separate savings account for the honeymoon the day you get engaged.',
  },
  {
    mistake: 'Vendor shopping without written quotes',
    detail: "Verbal quotes are forgotten, misremembered, or changed. A vendor who quoted ₹80K verbally will bill ₹1.1L on the day and you'll have no recourse.",
    fix: 'Always get itemised written quotes before paying any advance. No exceptions.',
  },
];

// Smart saving strategies mapped to categories
const SAVING_STRATEGIES = [
  { cat: 'Venue', saving: '₹30K – ₹2L', how: 'Book off-season (May–Jul) or weekday. Community hall vs hotel. Farmhouse outskirts vs city centre.' },
  { cat: 'Catering', saving: '₹30K – ₹80K', how: 'Local halwai vs catering company. Simple menu vs live stations. Vegetarian vs non-veg per plate cost.' },
  { cat: 'Decor', saving: '₹20K – ₹1L', how: 'Marigold vs imported roses. DIY centrepieces. One focal mandap vs full venue decor. Rent fairy lights.' },
  { cat: 'Photography', saving: '₹20K – ₹60K', how: 'Emerging shooter vs established studio. Photos only vs full video production. Student photographers for secondary functions.' },
  { cat: 'Bridal outfit', saving: '₹20K – ₹1.5L', how: 'Exhibition vs boutique. Rent for secondary functions. Custom blouse on mid-range skirt. Family heirloom jewellery.' },
  { cat: 'Invitations', saving: '₹15K – ₹30K', how: 'Digital for 90% of guests. 30 premium printed cards only. Canva design vs custom designer.' },
  { cat: 'Entertainment', saving: '₹10K – ₹25K', how: 'Spotify playlist for daytime. Local DJ vs city DJ. 3-hour set vs full-night booking.' },
  { cat: 'Transport', saving: '₹10K – ₹30K', how: 'One decorated car vs full baraat convoy. Family cars vs hired fleet. Skip the band/baaja for the pheras.' },
];

const FAQS = [
  {
    q: 'What percentage of an Indian wedding budget should go to catering?',
    a: "Catering typically takes 22–28% of the total wedding budget in India. For a ₹15 lakh wedding, that's ₹3.3L–₹4.2L. Per-plate costs range from ₹500 (local halwai, simple veg menu) to ₹2,500+ (premium hotel catering, multi-cuisine buffet). Always budget per plate × confirmed guest count, then add 10% for last-minute additions.",
  },
  {
    q: 'How do I calculate my wedding budget if I don\'t know where to start?',
    a: "Start with two numbers: your total confirmed budget and your expected guest count. Divide total budget by guests to get a per-head figure — anything above ₹6,000/head gives you reasonable comfort across all categories. Then use our calculator above to see category-wise allocations, and apply the city multiplier from the table for your location.",
  },
  {
    q: 'Is ₹10 lakhs enough for a good Indian wedding in 2026?',
    a: "Yes — for a wedding of 100–150 guests in a Tier 2 city. In metros like Mumbai or Delhi, ₹10L is tight for that guest count. Use our calculator in Budget-Smart mode: you'll get ~₹2L for venue, ~₹2.5L for catering, ~₹1.2L for photography, and ~₹1L for bridal outfit. Every category gets a real, workable amount.",
  },
  {
    q: 'What should I absolutely not cut from my wedding budget?',
    a: "Three things: photography (memories are permanent), catering quality (food is what guests discuss for years), and the buffer fund (unexpected costs always appear). Everything else has a budget-friendly alternative. A skilled student photographer beats a mediocre studio photographer every time.",
  },
  {
    q: 'How does GST affect my wedding budget in India?',
    a: "GST is 18% on most wedding services (catering, photography, decor, entertainment). This means every ₹1 lakh quoted by a vendor becomes ₹1.18 lakh after tax. On a ₹15 lakh wedding, GST adds roughly ₹2.2–₹2.7 lakhs if not accounted for. Always ask for GST-inclusive quotes and build GST into your category allocations from the start.",
  },
  {
    q: 'Should the honeymoon be included in the wedding budget?',
    a: "No — always keep honeymoon completely separate. When they share a budget, the honeymoon consistently loses to wedding day pressures. Open a dedicated honeymoon savings account the month you get engaged. Even ₹5,000–₹10,000/month saved over 12 months gives you a ₹60K–₹1.2L honeymoon fund without touching the wedding budget.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/90 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-rose-gold/5 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 pr-2">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-rose-gold transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
}

// Format rupees
function formatRs(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1).replace('.0', '')}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

// The main interactive budget calculator
function BudgetCalculator() {
  const [totalBudget, setTotalBudget]   = useState(1500000); // ₹15L default
  const [profile, setProfile]           = useState('mid');
  const [cityMult, setCityMult]         = useState(1.0);
  const [openTip, setOpenTip]           = useState(null);
  const [inputRaw, setInputRaw]         = useState('15,00,000');

  // Derive allocations
  const allocations = CATEGORIES.map((cat) => {
    const pct    = cat[profile];
    const amount = Math.round((totalBudget * pct) / 100 / 1000) * 1000; // round to nearest ₹1K
    return { ...cat, pct, amount };
  });

  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);

  // Handle formatted input
  function handleBudgetInput(raw) {
    setInputRaw(raw);
    const clean = raw.replace(/[₹,\s]/g, '');
    const n = parseInt(clean, 10);
    if (!isNaN(n) && n >= 100000 && n <= 100000000) setTotalBudget(n);
  }

  const selectedProfile = PROFILES.find((p) => p.key === profile);
  const selectedCity    = CITY_MULTIPLIERS.find((c) => c.mult === cityMult) || CITY_MULTIPLIERS[8];

  // Adjusted total with city multiplier
  const adjustedBudget = Math.round(totalBudget * cityMult);

  return (
    <div className="space-y-6">

      {/* ── Input row ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Step 1 — Enter your total wedding budget</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1.5">Total budget (₹)</label>
            <input
              type="text"
              value={inputRaw}
              onChange={(e) => handleBudgetInput(e.target.value)}
              placeholder="e.g. 15,00,000"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:outline-none text-lg font-bold text-gray-900 transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1.5">Your city</label>
            <select
              value={cityMult}
              onChange={(e) => setCityMult(parseFloat(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:outline-none text-base font-medium text-gray-900 bg-white transition-colors"
            >
              {CITY_MULTIPLIERS.map((c) => (
                <option key={c.city} value={c.mult}>{c.city} {c.mult !== 1.0 ? `(${c.mult > 1 ? '+' : ''}${Math.round((c.mult - 1) * 100)}%)` : '(baseline)'}</option>
              ))}
            </select>
          </div>
        </div>
        {cityMult !== 1.0 && (
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            💡 {selectedCity.note} Your effective budget power in this city: <strong>{formatRs(adjustedBudget)}</strong> equivalent.
          </p>
        )}
      </div>

      {/* ── Profile selector ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Step 2 — Choose your wedding profile</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {PROFILES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setProfile(p.key)}
              className={`rounded-xl p-4 text-left border-2 transition-all ${
                profile === p.key
                  ? 'border-sky-500 bg-sky-50 shadow-md'
                  : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              }`}
            >
              <div className={`inline-block px-2.5 py-1 rounded-lg bg-gradient-to-r ${p.color} text-white text-xs font-bold mb-2`}>
                {p.sublabel}
              </div>
              <p className="font-bold text-gray-900 text-sm mb-1">{p.label}</p>
              <p className="text-gray-500 text-xs leading-snug">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Allocation results ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-serif font-bold text-gray-900 text-lg">Your personalised allocation</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Based on {formatRs(totalBudget)} · {selectedProfile.label} profile · {selectedCity.city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total allocated</p>
            <p className="font-bold text-gray-900">{formatRs(totalAllocated)}</p>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {allocations.map((cat) => (
            <div key={cat.id} className="px-5 py-0">
              <button
                type="button"
                onClick={() => setOpenTip(openTip === cat.id ? null : cat.id)}
                className="w-full py-4 text-left hover:bg-gray-50/50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {/* Emoji icon */}
                  <span className="text-xl w-8 shrink-0 text-center">{cat.icon}</span>

                  {/* Label + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-gray-800">{cat.label}</span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs text-gray-400">{cat.pct}%</span>
                        <span className={`text-sm font-bold ${cat.text}`}>{formatRs(cat.amount)}</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.bar} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(cat.pct, 0.5) * 3}%` }}
                      />
                    </div>
                  </div>

                  {/* Tip chevron */}
                  <ChevronDown className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${openTip === cat.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expandable tip */}
              {openTip === cat.id && (
                <div className="pb-4 pl-11">
                  <div className={`rounded-xl ${cat.bg} border ${cat.border} px-4 py-3`}>
                    <p className={`text-xs leading-relaxed ${cat.text}`}>
                      <strong>💡 Smart tip:</strong> {cat.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400 leading-relaxed">
            * Allocations are percentage-based recommendations derived from real Indian wedding data. Honeymoon is excluded from allocation — budget it separately.
            GST (18%) is not included — add it to vendor quotes. All figures are pre-GST estimates.
          </p>
        </div>
      </div>

      {/* CTA to Wedora planner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-rose-gold p-px shadow-lg">
        <div className="rounded-[calc(1rem-1px)] bg-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif font-bold text-gray-900">Save and track this budget on Wedora</p>
            <p className="text-sm text-gray-500 mt-0.5">Add vendors, log payments, and watch your budget in real time — for free.</p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-rose-gold text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
          >
            Start free →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BudgetCalculatorArticle({
  post,
  readTime,
  copied,
  onShare,
  affiliateHref,
  affiliateCtaLabel,
}) {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-400/15 to-blue-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/60">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <Link to="/" className="text-xl font-serif font-bold bg-gradient-to-r from-rose-gold to-plum bg-clip-text text-transparent">
            Wedora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-sky-400/30 shadow-sm mb-6 animate-fade-in-up">
            <Calculator className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              2026 Guide · Budget Planning
            </span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.08] mb-6 animate-fade-in-up">
            Wedding Budget{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-rose-gold">
              Calculator
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
            How to allocate your money smartly — with a free interactive calculator
            that shows you exactly how much to spend in every category.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-600 text-white text-xs font-bold shadow">
              <Calculator className="w-3.5 h-3.5" /> Free Interactive Calculator
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-gold text-white text-xs font-bold shadow">
              <BarChart3 className="w-3.5 h-3.5" /> 12 Budget Categories
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm">
              10 Indian Cities
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm">
              3 Budget Profiles
            </span>
          </div>

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
          <div className="max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-sky-400/15 border-4 border-white ring-1 ring-sky-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="Indian couple planning their wedding budget"
              className="w-full aspect-[21/9] object-cover object-center"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* Article body */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-16 md:space-y-24">

        {/* Intro hook */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 via-blue-300/15 to-rose-gold/20 rounded-[2rem] blur-xl opacity-60" />
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-sky-50/60 border border-sky-100/80 p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-sky-500 shrink-0" />
              Most couples don't run out of money — they run out of allocation
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Here's what actually happens: a couple has ₹15 lakhs. They spend ₹6L on the venue
              because it felt reasonable at the time. Then ₹4L on catering. Suddenly there's only
              ₹5L left for everything else — photographer, bridal outfit, decor, invitations,
              makeup, DJ, transport, and buffer. The panic sets in.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              This isn't a budget problem. It's an <strong>allocation problem.</strong> The money
              was always there. It just wasn't distributed with intention.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              This guide gives you a precise, data-backed framework for how to split your wedding
              budget across every category — with a free interactive calculator, city-by-city
              adjustments, and the allocation mistakes that drain budgets silently.
            </p>
          </div>
        </section>

        {/* ── INTERACTIVE CALCULATOR ─────────────────────────────────────── */}
        <section id="calculator">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Free wedding budget calculator
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter your budget, pick your profile, get instant allocations.
              </p>
            </div>
          </div>
          <BudgetCalculator />
        </section>

        {/* How to read your allocations */}
        <section id="understand">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                How to read and use your allocations
              </h2>
              <p className="text-gray-500 text-sm mt-1">Turn the numbers above into a real action plan.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                n: '01',
                title: 'Treat each category as a ceiling, not a target',
                body: "Your decor allocation is a maximum, not a goal. If you find a decorator who delivers the look you want for 70% of the allocation, bank that 30% into the buffer. Every category where you come in under-budget strengthens the whole wedding financially.",
                color: 'from-sky-500 to-blue-600',
              },
              {
                n: '02',
                title: 'Lock the guest count before spending a rupee',
                body: "Venue cost, catering cost, invitation count, seating — everything scales with guests. Until you have a confirmed guest count, every allocation number is guesswork. Get this number agreed by both families before you call a single vendor.",
                color: 'from-emerald-500 to-teal-600',
              },
              {
                n: '03',
                title: 'Apply GST to every vendor quote',
                body: "Add 18% to every figure a vendor gives you verbally or in their initial quote. A ₹1L photography quote is actually ₹1.18L after GST. On a ₹15L wedding, this adds roughly ₹2–2.5L in taxes if not planned for. Always ask: 'Is this quote GST-inclusive?'",
                color: 'from-amber-500 to-orange-500',
              },
              {
                n: '04',
                title: 'Book in priority order',
                body: "Book venue first (highest cost, limited availability), then catering (often linked to venue), then photographer (best photographers book 8–10 months out), then decor, then everything else. Booking in reverse order is how couples end up with a magnificent photographer and nowhere to hold the wedding.",
                color: 'from-rose-500 to-pink-600',
              },
              {
                n: '05',
                title: 'Leave the buffer category untouched until the week before',
                body: "The buffer exists for the week before and day of the wedding. Last-minute flower additions, an extra generator hour, additional food plates, a tip for the venue staff — these are real costs. If you spend the buffer on upgrading decor two months before, you will regret it.",
                color: 'from-violet-500 to-purple-700',
              },
              {
                n: '06',
                title: 'Track actual spend vs allocation in real time',
                body: "The calculator gives you the plan. But the plan only works if you track what you actually pay. Keep a running total of every advance paid, every item purchased, every deposit made. Use Wedora's free budget planner to do this automatically — so you always know your remaining balance per category.",
                color: 'from-indigo-500 to-violet-600',
              },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 md:gap-6 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-md`}>
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1.5">{s.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Per-guest cost guide */}
        <section id="per-guest">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Per-guest cost guide for India (2026)
              </h2>
              <p className="text-gray-500 text-sm mt-1">Use this to sanity-check your total budget against your guest count.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-left">
                    <th className="px-4 py-4 font-semibold">Guests</th>
                    <th className="px-4 py-4 font-semibold">Per guest (all-in)</th>
                    <th className="px-4 py-4 font-semibold">Total estimate</th>
                    <th className="px-4 py-4 font-semibold hidden md:table-cell">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {GUEST_COST_GUIDE.map((row, i) => (
                    <tr key={row.range} className={`hover:bg-amber-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.range}</td>
                      <td className="px-4 py-3 font-semibold text-amber-600">{row.perGuest}</td>
                      <td className="px-4 py-3 text-gray-700">{row.totalEst}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{row.profile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60 mt-4">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-900 text-sm leading-relaxed">
              <strong>The quick sanity check:</strong> Divide your total wedding budget by your expected guest count.
              If the result is below ₹5,000/head, you'll need to cut guests or increase the budget.
              Below ₹3,500/head makes it very challenging to cover all essentials comfortably.
            </p>
          </div>
        </section>

        {/* Where couples overspend — saving strategies table */}
        <section id="savings">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Where to save in each category
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Every rupee saved in one category can upgrade another.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left">
                    <th className="px-4 py-4 font-semibold">Category</th>
                    <th className="px-4 py-4 font-semibold">Typical saving</th>
                    <th className="px-4 py-4 font-semibold hidden md:table-cell">How to achieve it</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SAVING_STRATEGIES.map((row, i) => (
                    <tr key={row.cat} className={`hover:bg-emerald-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.cat}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 whitespace-nowrap">{row.saving}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden md:table-cell">{row.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Budget mistakes */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                8 budget mistakes that drain weddings silently
              </h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              {BUDGET_MISTAKES.map((item) => (
                <div key={item.mistake} className="flex gap-3">
                  <span className="text-amber-600 font-bold text-lg leading-snug shrink-0 mt-0.5">×</span>
                  <div>
                    <p className="font-semibold text-amber-950 mb-1">{item.mistake}</p>
                    <p className="text-amber-800/80 text-sm leading-relaxed mb-1.5">{item.detail}</p>
                    <p className="text-emerald-700 text-xs font-medium bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-lg inline-block">
                      ✓ Fix: {item.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pro tip callout */}
        <section>
          <div className="flex gap-4 p-6 md:p-8 rounded-2xl bg-violet-50 border border-violet-200/60">
            <Lightbulb className="w-7 h-7 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-violet-900 mb-2 text-lg">The 60-20-20 negotiation rule</p>
              <p className="text-violet-800 leading-relaxed">
                For any vendor, pay <strong>no more than 40% upfront</strong> as a booking advance.
                Pay the second 30% one month before the wedding. Pay the final 30% on the day
                of delivery — after you've confirmed everything is as agreed. This structure
                keeps every vendor accountable right up to the last minute. Vendors who refuse
                this structure are a red flag.
              </p>
            </div>
          </div>
        </section>

        {/* Tools CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-600 to-rose-gold p-1 shadow-2xl shadow-sky-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Track your budget live — it's free on Wedora
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Enter your vendor quotes, log advances paid, and watch your remaining balance
              per category update in real time. No spreadsheets. No surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-sky-50 transition-colors shadow-lg">
                Start free with Wedora
              </Link>
              <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="text-center max-w-2xl mx-auto pb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            A wedding budget works when it's a plan, not a guess
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            You don't need more money to have a better wedding. You need a clearer allocation,
            an honest guest count, and a tool that keeps you on track. Use the calculator above,
            apply your city adjustment, pick your profile — and then track every rupee on Wedora
            so the plan stays a plan.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free budget planner</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Wedding checklist</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Vendor tracker</span>
          </div>
        </section>

        {affiliateHref && (
          <aside className="rounded-2xl border border-rose-gold/25 bg-white p-8 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-gold/80 mb-3">Partner pick</p>
            <a href={affiliateHref} target="_blank" rel="sponsored noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">
              {affiliateCtaLabel}
            </a>
          </aside>
        )}
      </main>

      {/* Footer bar */}
      <div className="border-t border-rose-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Share:</span>
            <button type="button" onClick={onShare} className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative" title="Copy link">
              <Copy className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
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
