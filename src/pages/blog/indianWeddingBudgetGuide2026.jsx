import { Link } from 'react-router-dom';
import BlogInternalLinks from '../../components/landing/BlogInternalLinks';
import {
  ArrowLeft,
  Clock,
  Copy,
  Wallet,
  Users,
  Camera,
  Flower2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Heart,
  Coins,
  Star,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const BUDGET_GUIDE_SLUG = 'indian-wedding-budget-guide-2026';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&auto=format&fit=crop';

export function getStaticBudgetGuidePost() {
  const now = new Date().toISOString();
  return {
    id: 'static-budget-guide-2026',
    title: 'Complete Indian Wedding Budget Guide (2026)',
    slug: BUDGET_GUIDE_SLUG,
    excerpt:
      'Plan your dream Indian wedding on any budget in 2026. Real cost breakdowns, money-saving tips, budget templates, and FAQs for every Indian family.',
    content: '',
    tags: 'Budget Planning, Indian Wedding, 2026 Guide',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Complete Indian Wedding Budget Guide (2026) – Plan Under Any Budget | Wedora',
    meta_description:
      'Plan your dream Indian wedding on any budget in 2026. Real cost breakdowns, money-saving tips, budget templates, and FAQs for every Indian family.',
    keywords:
      'indian wedding budget 2026, wedding cost india, wedding budget breakdown, budget wedding india, wedding planner india, wedora',
    author: 'Wedora Wedding Planning Team',
    published_at: now,
    created_at: now,
    updated_at: now,
    status: 'published',
    affiliate_link: null,
    affiliate_label: null,
  };
}

const COST_BY_BUDGET = [
  { range: '₹5 – 8 Lakh', type: 'Simple & Intimate', guests: '50–100', functions: 'Mehendi, Haldi, Nikah/Pheras' },
  { range: '₹10 – 15 Lakh', type: 'Mid-Range', guests: '100–200', functions: '2–3 functions + Reception' },
  { range: '₹15 – 25 Lakh', type: 'Semi-Grand', guests: '200–350', functions: 'Full 3–4 day celebration' },
  { range: '₹25 – 50 Lakh', type: 'Grand Wedding', guests: '350–600', functions: 'Full functions + decor + photo' },
  { range: '₹50 Lakh+', type: 'Luxury / Destination', guests: '500+', functions: 'Multi-day, destination, designer' },
];

const BUDGET_BREAKDOWN = [
  { cat: 'Venue & Catering', pct: '35–40%', ex: '₹5.25 – 6 Lakh' },
  { cat: 'Wedding Photography & Video', pct: '10–15%', ex: '₹1.5 – 2.25 Lakh' },
  { cat: 'Decor & Flowers', pct: '10–12%', ex: '₹1.5 – 1.8 Lakh' },
  { cat: 'Bridal Outfits & Grooming', pct: '8–12%', ex: '₹1.2 – 1.8 Lakh' },
  { cat: "Groom's Outfits", pct: '3–5%', ex: '₹45K – 75K' },
  { cat: 'Jewellery (Bride)', pct: '10–15%', ex: '₹1.5 – 2.25 Lakh' },
  { cat: 'Mehendi Artist', pct: '1–2%', ex: '₹15K – 30K' },
  { cat: 'DJ / Entertainment', pct: '2–4%', ex: '₹30K – 60K' },
  { cat: 'Invitations & Stationery', pct: '1–2%', ex: '₹15K – 30K' },
  { cat: 'Transportation', pct: '2–3%', ex: '₹30K – 45K' },
  { cat: 'Honeymoon (Separate)', pct: '5–10%', ex: '₹75K – 1.5 Lakh' },
  { cat: 'Buffer / Miscellaneous', pct: '5%', ex: '₹75K' },
];

const SAMPLE_5L = [
  'Venue (community hall or home): ₹1 – 1.5 Lakh',
  'Catering (simple home-style menu): ₹1.5 Lakh',
  'Bridal outfit (one lehenga, rented jewellery): ₹60K',
  'Decor (marigold flowers, DIY): ₹40K',
  'Photography (1 day): ₹50K',
  'Mehendi: ₹10K',
  'Invitations (digital + 30 printed): ₹5K',
  'Miscellaneous: ₹35K',
];

const SAMPLE_10L = [
  'Venue (banquet hall, 150 pax): ₹3 Lakh',
  'Catering (full buffet, 150 guests): ₹2 Lakh',
  'Bridal lehenga + makeup: ₹1.2 Lakh',
  'Decor (floral + draping): ₹1 Lakh',
  'Photography + Videography: ₹1.2 Lakh',
  'DJ + Sound: ₹40K',
  'Mehendi + Haldi: ₹25K',
  'Invitations + Gifts: ₹30K',
  'Miscellaneous: ₹75K',
];

const SAMPLE_25L = [
  'Premium venue (3 functions): ₹8 Lakh',
  'Catering (300 guests, 2 meals): ₹6 Lakh',
  'Bridal trousseau + designer lehenga: ₹3 Lakh',
  'Professional decor team: ₹3 Lakh',
  'Photography + Cinematic video: ₹2 Lakh',
  'Jewellery (mix of gold + rental): ₹1.5 Lakh',
  'Entertainment + DJ: ₹75K',
  'Miscellaneous: ₹1.25 Lakh',
];

const STEPS = [
  { n: 1, title: 'Fix your total budget first', body: 'Sit with family and agree on a hard ceiling. Add contributions, savings, and gifts. Do not cross it.' },
  { n: 2, title: 'Build your priority list', body: 'Pick top 3 priorities (food, photos, decor…) and allocate more there. Cut lower-priority areas.' },
  { n: 3, title: 'Decide guest count early', body: 'Guest list drives ~60% of cost. Every extra 50 guests ≈ ₹50K–1 Lakh. Lock it before booking.' },
  { n: 4, title: 'Book venue + catering first', body: 'Often 40–50% of budget. Book 6–9 months ahead. Off-season (May–July) can save 15–25%.' },
  { n: 5, title: 'Track every expense', body: 'Use Wedora’s free budget planner for quotes, advances, and balances — so small spends don’t surprise you.' },
  { n: 6, title: 'Negotiate everything', body: 'Package deals and bundling (photo + video, decor + catering) often save 10–20%.' },
  { n: 7, title: 'Leave a buffer', body: 'Keep 5–8% untouched until wedding week — you will need it.' },
];

const TIPS = [
  'Book an off-season wedding (May–July) — save 15–25% on venue',
  'Choose a weekday (Tue–Thu) — venues are cheaper',
  'Go digital with invitations — save ₹20K–40K',
  'Rent jewellery instead of buying for every function',
  'Single photographer for small functions vs full crew',
  'Seasonal flowers (marigold, tuberose) vs imported roses',
  'Skip the cocktail party — often one of the priciest line items',
  'Local halwai for home functions vs full catering company',
  'WhatsApp for RSVPs instead of paid apps',
  'Borrow/rent decor: lights, drapes, urlis',
  'Haldi & Mehendi at home — save ₹50K+ on venue',
  'Combo deal: pre-wedding + wedding with same photographer',
  'Bridal outfit from exhibition/sale — 30–40% off',
  'Local MUA vs celebrity — same glow, ₹1–2L saved',
  'Venue in-house catering — usually cheaper',
];

const MISTAKES = [
  'No guest list limit — extra 100 guests can add ₹1–2 lakh',
  'Verbal vendor quotes only — get everything in writing',
  'Ignoring GST on services — can add 10–15% if not planned',
  'Paying >30–40% advance — keep leverage for delivery',
  'Pinterest dreams without price checks — that wedding may be ₹50L',
  'Hidden costs: generator, valet, changing rooms, mandap extras',
  'Starting 3–4 months out — higher prices, fewer options',
  'No written checklist — use Wedora’s checklist so nothing slips',
];

const CHECKLIST = [
  ['Set total wedding budget with family', '12+ months before'],
  ['Finalise guest list (hard limit)', '10–12 months before'],
  ['Book venue', '9–10 months before'],
  ['Book caterer / confirm venue catering', '8–9 months before'],
  ['Book photographer + videographer', '8–9 months before'],
  ['Book decor / florist', '6–8 months before'],
  ['Order bridal lehenga / outfit', '6–8 months before'],
  ['Book mehendi artist', '4–6 months before'],
  ['Book DJ / entertainment', '4–6 months before'],
  ['Send invitations (digital + physical)', '1–2 months before'],
  ['Confirm vendors + final headcount', '2–3 weeks before'],
  ['Settle vendor payments', '1 week before'],
  ['Keep buffer cash ready', 'Day of wedding'],
];

const FAQS = [
  {
    q: 'What is the average Indian wedding cost in 2026?',
    a: 'Roughly ₹8–12 lakh for a mid-sized wedding (150–250 guests). Grand weddings with 300+ guests and premium venues often run ₹25–50 lakh+. City, guest count, and number of functions matter most.',
  },
  {
    q: 'How can I plan an Indian wedding on a ₹10 lakh budget?',
    a: 'Cap guests at ~150, choose a banquet over a five-star, seasonal flower decor, a strong local photo team, and digital invites. Track every rupee with a wedding budget planner.',
  },
  {
    q: 'What percentage should go to catering?',
    a: 'Often 20–30% of total budget. For ₹10L and 150 guests, plan ₹1.5–2L for food. Per plate commonly ₹700–₹1,500+ depending on menu.',
  },
  {
    q: 'Can a good wedding happen under ₹5 lakh?',
    a: 'Yes — 50–100 guests, community hall or home, simple catering, meaningful rituals over flash. Intimate weddings are trending for a reason.',
  },
  {
    q: 'When should we start budgeting?',
    a: 'Ideally 9–12 months ahead for better rates and choices. Last-minute (3–4 months) usually costs more. A digital checklist keeps milestones on track.',
  },
  {
    q: 'How do we handle family pressure to overspend?',
    a: 'Align both families early on a fixed total. Be kind but firm: a debt-free start beats one extravagant day. Involve them in planning within that ceiling.',
  },
];

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

export function IndianWeddingBudgetGuide2026Article({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-gold/20 to-plum/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/60">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link to="/" className="text-xl font-serif font-bold bg-gradient-to-r from-rose-gold to-plum bg-clip-text text-transparent">
            Wedora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-rose-gold/25 shadow-sm mb-6 animate-fade-in-up">
            <Coins className="w-4 h-4 text-rose-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-gold/90">2026 Guide · India</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.08] mb-6 animate-fade-in-up">
            Complete Indian Wedding{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-gold via-rose-600 to-plum">Budget Guide</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Plan under any budget — from ₹5 lakh to ₹50 lakh+. Real numbers, honest breakdowns, and tools that keep you sane.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              <Clock className="w-4 h-4 text-rose-gold" />
              {readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              <Heart className="w-4 h-4 text-rose-gold" fill="currentColor" />
              {post.author || 'Wedora Team'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              Updated {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {post.featured_image && (
          <div className="max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-rose-gold/15 border-4 border-white ring-1 ring-rose-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="Indian wedding celebration — rings and festive details"
              className="w-full aspect-[21/9] object-cover"
              loading="eager"
            />
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-16 md:space-y-24">
        {/* Intro emotional hook */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-gold/30 via-plum/20 to-amber-200/30 rounded-[2rem] blur-xl opacity-60" />
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-rose-50/80 border border-rose-100/80 p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-rose-gold shrink-0" />
              The wedding budget panic is real — you’re not alone
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              You’re engaged, the family is ecstatic, and someone asks: <em>“Shaadi mein kitna kharcha hoga?”</em> Overnight you’re juggling aunties’ expectations, <em>izzat</em>, and brochures that make your budget feel smaller every time.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Millions of Indian families feel this every year. The good news: with clear numbers, priorities, and tracking, you can host a beautiful wedding — without debt or daily fights. This 2026 guide breaks down real costs, savings, mistakes to skip, and how to plan smart at any budget.
            </p>
          </div>
        </section>

        {/* Section 1: costs table */}
        <section id="costs">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/25">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">What does an Indian wedding cost in 2026?</h2>
              <p className="text-gray-500 text-sm mt-1">Indicative averages — Tier-1 cities; Tier 2/3 often 20–40% lower.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-rose-gold to-plum text-white text-left">
                    <th className="px-4 py-4 font-semibold">Budget</th>
                    <th className="px-4 py-4 font-semibold hidden sm:table-cell">Type</th>
                    <th className="px-4 py-4 font-semibold">Guests</th>
                    <th className="px-4 py-4 font-semibold hidden md:table-cell">Functions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COST_BY_BUDGET.map((row) => (
                    <tr key={row.range} className="hover:bg-rose-gold/5 transition-colors">
                      <td className="px-4 py-4 font-bold text-rose-gold">{row.range}</td>
                      <td className="px-4 py-4 text-gray-700 hidden sm:table-cell">{row.type}</td>
                      <td className="px-4 py-4 text-gray-600">{row.guests}</td>
                      <td className="px-4 py-4 text-gray-600 hidden md:table-cell">{row.functions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Breakdown */}
        <section id="breakdown">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Where does the money go?</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">Typical % split — example column uses a ₹15 lakh wedding.</p>
          <div className="grid gap-3">
            {BUDGET_BREAKDOWN.map((row) => (
              <div
                key={row.cat}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-rose-gold/30 transition-colors"
              >
                <span className="font-medium text-gray-900 sm:w-[40%]">{row.cat}</span>
                <span className="text-rose-gold font-bold sm:w-[15%]">{row.pct}</span>
                <span className="text-gray-500 text-sm sm:ml-auto">{row.ex} <span className="text-gray-400">(example)</span></span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200/60">
            <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-900 text-sm leading-relaxed">
              <strong>Pro tip:</strong> Keep a 5–8% buffer. Something always pops up — extra plates, a mandap fix, last-minute guests.
            </p>
          </div>
        </section>

        {/* Sample budgets */}
        <section id="samples">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Sample budgets for 2026</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '₹5 Lakh — Simple & beautiful', subtitle: 'Intimate & meaningful', items: SAMPLE_5L, grad: 'from-emerald-500 to-teal-600' },
              { title: '₹10 Lakh — Sweet spot', subtitle: 'Most popular range', items: SAMPLE_10L, grad: 'from-rose-gold to-rose-600' },
              { title: '₹25 Lakh — Semi-grand', subtitle: '3-day celebration', items: SAMPLE_25L, grad: 'from-plum to-violet-700' },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-xl bg-white flex flex-col hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`px-5 py-4 bg-gradient-to-r ${card.grad} text-white`}>
                  <h3 className="font-serif font-bold text-lg">{card.title}</h3>
                  <p className="text-white/90 text-sm">{card.subtitle}</p>
                </div>
                <ul className="p-5 space-y-2.5 flex-1 text-sm text-gray-700">
                  {card.items.map((line) => (
                    <li key={line} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section id="steps">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">Step-by-step budget planning</h2>
          <div className="relative">
            <div className="absolute left-[1.15rem] md:left-6 top-4 bottom-4 w-px bg-gradient-to-b from-rose-gold via-plum to-amber-300 hidden sm:block" />
            <div className="space-y-8">
              {STEPS.map((s) => (
                <div key={s.n} className="relative flex gap-4 md:gap-8 sm:pl-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum text-white font-bold flex items-center justify-center shrink-0 shadow-lg z-10 text-sm md:text-base">
                    {s.n}
                  </div>
                  <div className="flex-1 pt-1 pb-2 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                    <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips grid */}
        <section id="tips">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">15 genius ways to save</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Real tactics Indian couples used to cut lakhs — without looking “cheap”.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map((tip, i) => (
              <div
                key={tip}
                className="group p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-gold/25 transition-all"
              >
                <span className="inline-flex w-8 h-8 rounded-lg bg-rose-gold/10 text-rose-gold text-xs font-bold items-center justify-center mb-3 group-hover:bg-rose-gold group-hover:text-white transition-colors">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">Budget mistakes to avoid</h2>
            </div>
            <ul className="p-6 md:p-8 space-y-4">
              {MISTAKES.map((m) => (
                <li key={m} className="flex gap-3 text-amber-950/90">
                  <span className="text-amber-600 font-bold">×</span>
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Vendors */}
        <section id="vendors">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Choosing vendors inside your budget</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: 'Photo & video', body: 'You’ll relive this for decades — don’t cut too deep. From ~₹75K for quality. Compare 3 portfolios.', color: 'from-sky-500 to-blue-600' },
              { icon: Users, title: 'Catering', body: 'Guests remember the food. Plan ₹800–1,500/plate by menu. Always do a tasting.', color: 'from-orange-500 to-red-500' },
              { icon: Flower2, title: 'Decor', body: 'Biggest flex for savings: marigold & jasmine vs imported roses — stunning and far gentler on wallet.', color: 'from-pink-500 to-rose-600' },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4`}>
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-600 text-center text-sm">
            Bridal wear: designer replicas, rentals, and exhibition buys often deliver the same wow at 30–40% of boutique prices.
          </p>
        </section>

        {/* Checklist */}
        <section id="checklist">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">Your budget checklist</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Tick as you go — or let Wedora track it with reminders.</p>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600">
                    <th className="px-4 py-3 font-semibold">Task</th>
                    <th className="px-4 py-3 font-semibold">When</th>
                    <th className="px-4 py-3 font-semibold w-16 text-center">Done</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CHECKLIST.map(([task, when]) => (
                    <tr key={task} className="hover:bg-rose-gold/5">
                      <td className="px-4 py-3 text-gray-800">{task}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{when}</td>
                      <td className="px-4 py-3 text-center text-gray-300 font-mono">☐</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tools CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-rose-gold via-rose-600 to-plum p-1 shadow-2xl shadow-rose-gold/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">Tools that make budgeting easy</h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Track quotes, advances, and balances in one place. Manage vendors, guests, and deadlines — without spreadsheet chaos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-rose-50 transition-colors shadow-lg"
              >
                Start free with Wedora
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
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
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">Your dream wedding is within reach</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The most memorable weddings aren’t always the most expensive — they’re the ones where priorities are clear, guests feel cared for, and you’re genuinely happy. Set your budget, lock the guest list, and let Wedora help you stay on track from today.
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
            <a
              href={affiliateHref}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg"
            >
              {affiliateCtaLabel}
            </a>
          </aside>
        )}
        <BlogInternalLinks currentSlug="indian-wedding-budget-guide-2026" />
      </main>

      {/* Footer bar */}
      <div className="border-t border-rose-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Share:</span>
            <button
              type="button"
              onClick={onShare}
              className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Plan your wedding free — Wedora
          </Link>
        </div>
      </div>
    </div>
  );
}
