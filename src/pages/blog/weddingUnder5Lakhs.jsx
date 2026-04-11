import { Link } from 'react-router-dom';
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
  Home,
  Utensils,
  IndianRupee,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const WEDDING_5L_SLUG = 'how-to-plan-wedding-under-5-lakhs-india';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=1600&q=85&auto=format&fit=crop';

export function getStaticWedding5LPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-wedding-5l-2026',
    title: 'How to Plan a Wedding Under ₹5 Lakhs in India',
    slug: WEDDING_5L_SLUG,
    excerpt:
      'Planning an Indian wedding under ₹5 lakhs? Discover a complete budget breakdown, money-saving hacks, vendor tips, and a free checklist to pull off a beautiful, debt-free wedding in 2026.',
    content: '',
    tags: 'Budget Wedding, Indian Wedding, ₹5 Lakh Wedding',
    featured_image: FEATURED_IMAGE,
    meta_title: 'How to Plan a Wedding Under ₹5 Lakhs in India (2026) | Wedora',
    meta_description:
      'Planning an Indian wedding under ₹5 lakhs? Complete budget breakdown, money-saving hacks, real example, and a free checklist for a beautiful, debt-free wedding in 2026.',
    keywords:
      'wedding under 5 lakhs india, budget indian wedding, cheap wedding tips india, low budget wedding 2026, 5 lakh wedding plan, wedora',
    author: 'Wedora Wedding Planning Team',
    published_at: now,
    created_at: now,
    updated_at: now,
    status: 'published',
    affiliate_link: null,
    affiliate_label: null,
  };
}

// ── Data ──────────────────────────────────────────────────────────────────────

const BUDGET_TABLE = [
  { cat: 'Venue', budget: '₹70K – 1 Lakh', tip: 'Community hall, temple hall, or home' },
  { cat: 'Catering (food + service)', budget: '₹1.2 – 1.5 Lakh', tip: 'Local halwai, simple veg menu' },
  { cat: 'Bridal Outfit (all functions)', budget: '₹40K – 60K', tip: 'Exhibition buy or rented lehenga' },
  { cat: "Groom's Outfit", budget: '₹10K – 20K', tip: 'Sherwani on rent or bandhgala purchase' },
  { cat: 'Bridal Makeup & Hair', budget: '₹15K – 25K', tip: 'Freelance MUA, home visit' },
  { cat: 'Photography (1 day)', budget: '₹35K – 55K', tip: 'Emerging local photographer, no video' },
  { cat: 'Decor & Flowers', budget: '₹25K – 40K', tip: 'Marigold, jasmine, DIY elements' },
  { cat: 'Mehendi Artist', budget: '₹7K – 12K', tip: 'Local artist, 1 function' },
  { cat: 'Jewellery (Bride)', budget: '₹20K – 30K', tip: 'Rent / borrow / use family jewellery' },
  { cat: 'Invitations', budget: '₹3K – 6K', tip: 'Mostly digital + 20–30 printed' },
  { cat: 'DJ / Music', budget: '₹10K – 18K', tip: 'Local DJ for reception only' },
  { cat: 'Transport', budget: '₹5K – 10K', tip: 'Family cars or shared rental' },
  { cat: 'Pandit / Officiant', budget: '₹5K – 8K', tip: 'Book early, discuss package' },
  { cat: 'Miscellaneous / Buffer', budget: '₹20K – 30K', tip: 'Always keep this — trust us!' },
];

const REAL_EXAMPLE = [
  { item: 'Venue — Municipal community hall, Kothrud', cost: '₹28,000' },
  { item: 'Catering — Local halwai, veg thali × 100', cost: '₹44,000' },
  { item: 'Decor — Marigold + fairy lights, DIY', cost: '₹18,000' },
  { item: 'Photography — Second-year student, full day', cost: '₹38,000' },
  { item: 'Bridal Lehenga — Pune Fashion Street exhibition', cost: '₹32,000' },
  { item: "Groom Sherwani — Rented locally", cost: '₹6,500' },
  { item: 'Bridal Makeup — Freelance MUA, home visit', cost: '₹12,000' },
  { item: 'Mehendi — Local artist, 2 hours', cost: '₹7,000' },
  { item: 'Jewellery — Family jewellery + 2 rented pieces', cost: '₹0' },
  { item: 'Invitations — Digital + 40 printed', cost: '₹3,200' },
  { item: 'DJ — Local DJ, 3 hours only', cost: '₹8,000' },
  { item: 'Pandit — Family pandit, direct booking', cost: '₹4,500' },
  { item: 'Transport — Family cars + 1 rental', cost: '₹4,000' },
  { item: 'Miscellaneous — Last-minute extras, gifts', cost: '₹18,800' },
];

const STEPS = [
  {
    n: 1,
    title: 'Lock the budget with both families',
    body: 'Agree on a hard ceiling before any planning starts. Write it down. Decide who contributes what. Clarity here prevents every argument later.',
  },
  {
    n: 2,
    title: 'Decide guest count first — everything follows',
    body: 'At ₹5 lakhs, keep it under 120 guests — ideally 80–100 for breathing room. Every extra 50 guests adds ~₹50K–70K to the bill.',
  },
  {
    n: 3,
    title: 'Choose the right venue',
    body: 'Hotels are off the table. Community halls (₹15K–40K), temple halls (often free), home terraces, or farmhouses on the outskirts give you great ambience for a fraction of the cost.',
  },
  {
    n: 4,
    title: 'Plan the menu smartly',
    body: 'A local halwai at ₹350–500/plate beats any catering company. Skip live counters. For morning functions, chai + breakfast is much gentler on the wallet than a full lunch.',
  },
  {
    n: 5,
    title: 'Keep it to 1–2 functions',
    body: 'Haldi at home + main ceremony, or Mehendi at home + reception. Combining functions saves venue hire, decor, and catering for an entire day.',
  },
  {
    n: 6,
    title: 'Book a photographer — but the right one',
    body: 'Don\'t skip photos entirely. A talented second-year photography student or emerging local shooter gives stunning results at ₹35K–55K. Review 3 portfolios minimum.',
  },
  {
    n: 7,
    title: 'Track every paisa in real time',
    body: 'Use Wedora\'s free budget planner to enter quotes, log advance payments, and watch your running total — so nothing surprises you on wedding day.',
  },
];

const TIPS = [
  'Off-season wedding (May–Jul) — venues cost 20–30% less',
  'Weekday booking (Tue–Thu) — caterers and DJs charge less',
  'Go fully digital on invitations — save ₹15K–25K instantly',
  'Use family jewellery or rent pieces per function',
  'Borrow decor: lights, drapes, urlis from recently-married friends',
  'Buy bridal lehenga from a fashion exhibition or end-of-season sale',
  'Rent the groom\'s sherwani — a ₹40K piece rents for ₹6–8K',
  'Haldi & Mehendi at home — saves one venue booking entirely',
  'Local halwai instead of a catering company — same great food',
  'Hire a freelance MUA instead of a salon package',
  'Skip baraat convoy — one decorated car is enough',
  'Bulk flowers direct from local flower market, not a wedding florist',
  'Combo ask: photographer shoots Mehendi for a small add-on fee',
  'Spotify playlist on a good speaker for daytime functions — no DJ needed',
  'WhatsApp RSVP group instead of any paid RSVP service',
  'Book pandit directly, not through a venue-linked service',
  'Steel plates or banana-leaf serving — eco-friendly and cost-effective',
  'Family-made mithai for dessert — personal and free',
  'Community hall generator already included — ask before assuming',
  'Use Wedora\'s free checklist — avoid forgotten expenses that cost double last-minute',
];

const MISTAKES = [
  'No guest list limit — every extra 10 guests adds ₹5K–7K immediately',
  'Booking a venue without visiting in person — photos are deceptive',
  'Ignoring GST — 18% on services turns a ₹50K quote into ₹59K',
  'Paying 100% advance to any vendor — always keep delivery leverage',
  'No written contract — verbal promises disappear the week before',
  'Too many functions — Sangeet + Mehendi + Haldi + Pheras + Reception is a ₹15–20L wedding',
  'Comparing to others\' weddings — their budget has nothing to do with yours',
  'No buffer money — always keep ₹20K–30K untouched for the day itself',
];

const CHECKLIST = [
  ['Set total budget + family contributions', '9–12 months before'],
  ['Lock guest count (hard limit: 100–120)', '9–12 months before'],
  ['Decide on functions (max 2)', '9–12 months before'],
  ['Visit and book venue', '8–9 months before'],
  ['Shortlist caterer + do food tasting', '7–8 months before'],
  ['Book photographer (review portfolios)', '6–8 months before'],
  ['Order bridal outfit (allow time for alterations)', '6–8 months before'],
  ['Book decor / florist or plan DIY decor', '5–6 months before'],
  ['Book mehendi artist', '4–5 months before'],
  ['Send digital invitations', '6–8 weeks before'],
  ['Distribute printed invitations', '4–5 weeks before'],
  ['Confirm final guest count to caterer', '2 weeks before'],
  ['Do a final venue walkthrough', '1 week before'],
  ['Confirm all vendors + timings', '3–5 days before'],
  ['Keep ₹20K buffer cash ready', 'Day of wedding'],
];

const FAQS = [
  {
    q: 'Can you really have a good Indian wedding for under ₹5 lakhs?',
    a: 'Absolutely yes. Thousands of Indian couples do it every year. The key is keeping guests under 120, choosing a non-hotel venue, using a local caterer, and doing some of the work yourself. A ₹5 lakh wedding planned with intention will outshine a flashier one done without thought.',
  },
  {
    q: 'What is the biggest expense in a ₹5 lakh Indian wedding?',
    a: 'Catering and venue together typically take 40–50% of budget — roughly ₹2–2.5 lakhs. This is why your guest count and venue choice are the two most important decisions. Photography, bridal outfit, and decor follow.',
  },
  {
    q: 'How many guests can I invite with a ₹5 lakh budget?',
    a: 'Realistically, 80–120 guests in most Indian cities. In Tier 2/3 cities you can stretch to 150 with careful planning. In metros like Mumbai or Delhi, 60–80 guests gives you the best experience without compromise.',
  },
  {
    q: 'Should I skip a photographer to save money?',
    a: 'We strongly recommend against it — photography is the one thing you keep forever. Instead, find an emerging local photographer or a talented photography student. You can get excellent coverage for ₹35K–55K if you look beyond the big studios.',
  },
  {
    q: 'How do I handle family pressure to spend more?',
    a: 'Be calm, clear, and early. Have the conversation before any planning starts. Involve family in decisions within the budget — menu, guest list — so they feel included. Remind them a debt-free start to married life is more valuable than one extravagant day.',
  },
  {
    q: 'Which city in India is best for a budget wedding under ₹5 lakhs?',
    a: 'Tier 2 cities like Pune, Jaipur, Nagpur, Indore, Bhopal, and Coimbatore offer the best value. Community halls are affordable, local caterers are excellent, and photographers deliver quality at lower rates. Smaller cities in UP, Rajasthan, and Bihar can go even lower.',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

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
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-rose-gold transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function WeddingUnder5LakhsArticle({
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
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
      </div>

      {/* Sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/60">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link
            to="/"
            className="text-xl font-serif font-bold bg-gradient-to-r from-rose-gold to-plum bg-clip-text text-transparent"
          >
            Wedora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-emerald-400/30 shadow-sm mb-6 animate-fade-in-up">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              2026 Guide · Budget Wedding
            </span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.08] mb-6 animate-fade-in-up">
            Wedding Under{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-rose-gold">
              ₹5 Lakhs
            </span>{' '}
            in India
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Real numbers, honest hacks, and a step-by-step plan for a beautiful, debt-free Indian
            wedding — no matter how tight the budget.
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
              Updated{' '}
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {post.featured_image && (
          <div className="max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-400/15 border-4 border-white ring-1 ring-emerald-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="Simple Indian wedding celebration — intimate and joyful"
              className="w-full aspect-[21/9] object-cover"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* ── Article body ───────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-16 md:space-y-24">

        {/* Intro emotional hook */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-300/15 to-amber-200/20 rounded-[2rem] blur-xl opacity-60" />
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-emerald-50/60 border border-emerald-100/80 p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-emerald-500 shrink-0" />
              Yes, a beautiful ₹5 lakh wedding is absolutely possible
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              The moment you announce your engagement, someone in the family will whisper a venue name
              that costs more than your entire budget. Suddenly you're not just planning a wedding —
              you're managing expectations, <em>izzat</em>, and a wishlist that grows daily.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Here's what nobody tells you: some of the most heartfelt, memorable weddings in India
              have happened in community halls with marigold garlands and home-cooked food. This guide
              gives you every tool to plan yours — with real numbers, zero fluff, and zero debt.
            </p>
          </div>
        </section>

        {/* Is it realistic? */}
        <section id="realistic">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Is ₹5 lakhs realistic in 2026?
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Short answer: yes — if you plan smart.
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            A ₹5 lakh wedding works beautifully when:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {[
              'Guest list between 50–120 people',
              'Non-hotel venue (community hall, home, farmhouse)',
              'Maximum 1–2 functions (not a 3-day extravaganza)',
              'Willingness to DIY and involve family',
              'Vendors booked 6+ months in advance',
              'Off-season or weekday date chosen',
            ].map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200/60">
            <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-900 text-sm leading-relaxed">
              <strong>Real talk:</strong> In Tier 2/3 cities a ₹5 lakh wedding for 150 guests is
              absolutely achievable. In metros, aim for 60–80 guests for the best experience at
              this budget.
            </p>
          </div>
        </section>

        {/* Full budget breakdown */}
        <section id="breakdown">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Complete ₹5 lakh budget breakdown
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Recommended allocation across all categories.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left">
                    <th className="px-4 py-4 font-semibold">Category</th>
                    <th className="px-4 py-4 font-semibold">Budget Range</th>
                    <th className="px-4 py-4 font-semibold hidden md:table-cell">
                      How to stay in range
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {BUDGET_TABLE.map((row, i) => (
                    <tr
                      key={row.cat}
                      className={`hover:bg-emerald-50/50 transition-colors ${
                        row.cat.includes('TOTAL') ? 'bg-emerald-50 font-bold' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">{row.cat}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{row.budget}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">
                        {row.tip}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="bg-emerald-600 text-white">
                    <td className="px-4 py-4 font-bold text-base">💰 ESTIMATED TOTAL</td>
                    <td className="px-4 py-4 font-bold text-base">₹4.85 – 5.14 Lakh</td>
                    <td className="px-4 py-4 text-white/80 text-sm hidden md:table-cell">
                      Stay on the lower end of each range
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-gray-500 text-sm text-center italic">
            Figures are averages for Tier 2 cities. Metro cities may run 20–30% higher — adjust accordingly.
          </p>
        </section>

        {/* Step-by-step guide */}
        <section id="steps">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">
            Step-by-step: how to pull it off
          </h2>
          <div className="relative">
            <div className="absolute left-[1.15rem] md:left-6 top-4 bottom-4 w-px bg-gradient-to-b from-emerald-400 via-teal-400 to-amber-300 hidden sm:block" />
            <div className="space-y-8">
              {STEPS.map((s) => (
                <div key={s.n} className="relative flex gap-4 md:gap-8 sm:pl-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center shrink-0 shadow-lg z-10 text-sm md:text-base">
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

        {/* 20 savings tips */}
        <section id="tips">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
              20 genius ways to save
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Real tactics Indian couples used to stay under ₹5 lakhs — without it looking "budget".
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map((tip, i) => (
              <div
                key={tip}
                className="group p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-400/30 transition-all"
              >
                <span className="inline-flex w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
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
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                Budget mistakes to avoid
              </h2>
            </div>
            <ul className="p-6 md:p-8 space-y-4">
              {MISTAKES.map((m) => (
                <li key={m} className="flex gap-3 text-amber-950/90">
                  <span className="text-amber-600 font-bold text-lg leading-snug">×</span>
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Real example */}
        <section id="example">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/25">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Real example: ₹4.84 lakh wedding, Pune
              </h2>
              <p className="text-gray-500 text-sm mt-1">100 guests · 2025 · Zero debt</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-rose-gold to-plum text-white text-left">
                    <th className="px-4 py-4 font-semibold">What they did</th>
                    <th className="px-4 py-4 font-semibold text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {REAL_EXAMPLE.map((row, i) => (
                    <tr key={row.item} className="hover:bg-rose-gold/5 transition-colors">
                      <td className="px-4 py-3 text-gray-700">{row.item}</td>
                      <td className="px-4 py-3 font-bold text-rose-gold text-right whitespace-nowrap">
                        {row.cost}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-600 text-white">
                    <td className="px-4 py-4 font-bold text-base">💰 Grand Total</td>
                    <td className="px-4 py-4 font-bold text-base text-right">₹4,84,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-200/60">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-emerald-900 text-sm leading-relaxed">
              <strong>The result:</strong> A warm, beautiful wedding with 100 happy guests, stunning photos,
              and zero debt. The bride says it was the best decision they made — choosing intimacy
              over extravagance.
            </p>
          </div>
        </section>

        {/* Vendor tips */}
        <section id="vendors">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
            Choosing vendors on a tight budget
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: 'Photography',
                body: "Don't skip it — you'll look at these forever. An emerging local photographer or final-year student gives stunning results from ₹35K. Review 3 portfolios.",
                color: 'from-sky-500 to-blue-600',
              },
              {
                icon: Utensils,
                title: 'Catering',
                body: 'Food is what guests remember. A local halwai at ₹350–500/plate is far better than corporate caterers at ₹800+. Always do a tasting before confirming.',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: Flower2,
                title: 'Decor',
                body: 'Biggest savings are here. Marigold + jasmine decor is traditional, stunning, and costs 1/3rd of roses. DIY fairy lights transform any hall.',
                color: 'from-pink-500 to-rose-600',
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4`}
                >
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-600 text-center text-sm">
            Bridal wear: fashion exhibitions, end-of-season sales, and rental lehengas deliver the
            same wow at 30–40% of boutique prices.
          </p>
        </section>

        {/* Checklist */}
        <section id="checklist">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">
            Your ₹5 lakh wedding checklist
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Tick as you go — or let Wedora track it with automated reminders.
          </p>
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
        <section className="rounded-[2rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-rose-gold p-1 shadow-2xl shadow-emerald-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Tools that make budget planning easy
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Track vendor quotes, advances, and balances in one place. Manage guests, deadlines, and
              payments — without spreadsheet chaos. It's free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
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
            Your ₹5 lakh wedding can be the most memorable one
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The couples who remember their wedding most fondly are not the ones who spent the most.
            They're the ones who were most present, most intentional, and surrounded by people who
            genuinely love them. Set your budget, lock the guest list, and let Wedora keep everything
            on track from today.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">
              Free budget planner
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">
              Wedding checklist
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">
              Vendor tracker
            </span>
          </div>
        </section>

        {/* Affiliate block (conditional) */}
        {affiliateHref && (
          <aside className="rounded-2xl border border-rose-gold/25 bg-white p-8 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-gold/80 mb-3">
              Partner pick
            </p>
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
