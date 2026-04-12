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
  Camera,
  Flower2,
  Utensils,
  Palette,
  Gem,
  Music,
  Shirt,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

// ─── Slug & static post ──────────────────────────────────────────────────────

export const LOW_BUDGET_PREMIUM_SLUG = 'low-budget-wedding-ideas-india-look-premium';

// Verified Unsplash: Indian wedding mandap with marigold and fairy-light decor
const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=85&auto=format&fit=crop';

export function getStaticLowBudgetPremiumPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-low-budget-premium-2026',
    title: 'Low Budget Wedding Ideas in India That Look Premium',
    slug: LOW_BUDGET_PREMIUM_SLUG,
    excerpt:
      'Discover the smartest low budget Indian wedding ideas that look absolutely premium. From decor hacks to outfit tips, create a stunning wedding without the luxury price tag.',
    content: '',
    tags: 'Budget Wedding, Wedding Decor, Wedding Ideas, Indian Wedding',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Low Budget Wedding Ideas in India That Look Premium (2026) | Wedora',
    meta_description:
      'Discover low budget Indian wedding ideas that look premium. Decor hacks, outfit tips, catering tricks, and real examples to pull off a stunning wedding in 2026.',
    keywords:
      'low budget wedding ideas india, budget wedding that looks expensive, cheap indian wedding decor, premium look wedding on budget, wedding ideas india 2026, wedora',
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

// The 6 main "premium look" categories with ideas
const PREMIUM_CATEGORIES = [
  {
    id: 'decor',
    icon: Flower2,
    color: 'from-pink-500 to-rose-500',
    title: 'Decor That Looks Like a ₹10L Setup',
    subtitle: 'Marigold, draping & light tricks',
    ideas: [
      { label: 'Marigold canopy ceiling', detail: 'Strings of fresh marigold draped across the mandap ceiling cost ₹4,000–8,000 and photograph like a luxury florist setup. Double up with banana leaves.' },
      { label: 'Fairy lights everywhere', detail: 'Warm-white fairy lights (₹500–₹800 per roll) draped across walls or ceilings instantly elevate any community hall into something cinematic.' },
      { label: 'Fabric draping in ivory + gold', detail: 'Hire a local fabric draper (₹5,000–₹10,000) to cover bare walls with sheer ivory organza and gold dupatta. The result: a venue that looks 5× its cost.' },
      { label: 'Terracotta urli centrepieces', detail: 'Fill terracotta urlis (₹100–₹200 each) with water, floating candles, and rose petals. A table of 8 looks premium for under ₹800 total.' },
      { label: 'Wooden pallet backdrop', detail: 'A rustic wooden pallet "Love" backdrop painted white costs under ₹2,500 to assemble and creates an Instagram-worthy photo station.' },
      { label: 'Banana leaf + jasmine mandap', detail: 'A traditional banana-leaf mandap with jasmine garlands is deeply rooted, stunningly beautiful, and costs 60% less than a floral foam setup.' },
    ],
  },
  {
    id: 'photography',
    icon: Camera,
    color: 'from-sky-500 to-blue-600',
    title: 'Photography That Rivals ₹3L Studios',
    subtitle: 'The right shooter makes everything look expensive',
    ideas: [
      { label: 'Final-year photography students', detail: 'Students from NIFT, Symbiosis, or local arts colleges shoot full weddings for ₹20K–₹35K. Their natural-light work often outshines established studios.' },
      { label: 'Golden-hour ceremony timing', detail: 'Schedule your pheras or reception entry between 4–6 PM. Golden-hour light makes any venue and any outfit look editorial — for free.' },
      { label: 'Film-style preset editing', detail: 'Ask your photographer to deliver in a moody, film-tone preset. Warm tones hide venue imperfections and make even simple decor look intentional and stylish.' },
      { label: 'Candid over formal', detail: 'Candid photography looks more premium than posed group shots. Instruct your photographer to prioritise moments — laughing, dancing, emotional exchanges.' },
      { label: 'Skip the video, invest in photos', detail: 'A second videographer doubles cost but halves photo quality (they compete for positioning). Skip video; invest the saving in a slightly better photographer.' },
      { label: 'Drone shot for the mandap', detail: 'A single drone shot of the mandap and guests costs ₹3,000–₹6,000 as an add-on. That one aerial image makes the entire album look grand.' },
    ],
  },
  {
    id: 'outfits',
    icon: Shirt,
    color: 'from-violet-500 to-purple-600',
    title: 'Bridal Outfits That Look Designer',
    subtitle: 'Without designer price tags',
    ideas: [
      { label: 'Exhibition-bought lehengas', detail: 'Annual exhibitions (Surana, Nakshatra, Stree) sell near-identical designer lehengas at 30–50% of boutique price. Shop 6 months early for best selection.' },
      { label: 'Rent for secondary functions', detail: 'Wear a purchased lehenga for the main ceremony; rent for Mehendi and reception. Rental platforms offer ₹1–₹3L lehengas for ₹8K–₹18K per day.' },
      { label: 'Family heirloom saree styling', detail: 'A grandmother\'s Kanjivaram or Benarasi saree, freshly dry-cleaned and draped by a professional (₹500–₹1,000), photographs better than any new purchase.' },
      { label: 'Minimalist dupatta draping', detail: 'Invest in a single statement dupatta (₹5,000–₹12,000) and style a simple lehenga with it. Dupatta draping elevates a mid-range outfit to premium instantly.' },
      { label: 'Embroidered blouse upgrade', detail: 'A plain lehenga with a heavily embroidered custom blouse (₹4,000–₹8,000 to stitch) reads as far more expensive than both pieces bought ready-made.' },
      { label: 'Single jewellery focal point', detail: 'Choose one statement piece — maang tikka, choker, or nath — and keep everything else minimal. Excess jewellery reads as costume; restraint reads as couture.' },
    ],
  },
  {
    id: 'catering',
    icon: Utensils,
    color: 'from-amber-500 to-orange-500',
    title: 'Food Presentation That Impresses',
    subtitle: 'Great food + smart plating = premium feel',
    ideas: [
      { label: 'Copper serving vessels', detail: 'Ask your halwai to serve in copper handi and thali instead of steel or plastic. Copper vessels cost ₹200–₹500 to rent per piece and create an instant luxe impression.' },
      { label: 'Banana-leaf seated dining', detail: 'A traditional seated banana-leaf meal is deeply elegant, culturally rich, and dramatically cheaper per plate than a buffet. Guests remember it for years.' },
      { label: 'Curated dessert table', detail: 'Instead of a full sweet stall, arrange 5–6 homemade mithai on tiered wooden stands with a hand-written card for each. Costs ₹3,000–₹5,000, looks like a patisserie.' },
      { label: 'One live station only', detail: 'Skip 4 live counters. Choose just one — pani puri, dosa, or chaat — and make it theatrical. A single well-lit live station feels more premium than six ordinary ones.' },
      { label: 'Mocktail welcome drinks', detail: 'A fresh nimbu pani or rose sharbat served in glass bottles with paper straws (₹15–₹20 per guest) creates a sophisticated welcome moment for almost nothing.' },
      { label: 'Floral garnish on every dish', detail: 'A sprig of mint, an edible flower, or a small marigold petal scattered on each serving dish costs almost nothing but photographs beautifully and signals care.' },
    ],
  },
  {
    id: 'invitations',
    icon: Palette,
    color: 'from-teal-500 to-emerald-600',
    title: 'Invitations & Stationery That Wow',
    subtitle: 'First impressions at ₹0–₹500 per guest',
    ideas: [
      { label: 'Canva-designed digital invite', detail: 'A well-designed Canva invite with custom illustrations, the right font, and a gold palette looks better than most printed cards — and costs ₹0 to send on WhatsApp.' },
      { label: 'Premium digital video invite', detail: 'A 30-second animated video invite with your photo, music, and mandap illustration costs ₹1,500–₹3,000 from Fiverr/Instagram designers. Guests screenshot and share it.' },
      { label: '30 printed cards for key elders', detail: 'Print only 25–30 physical cards (₹30–₹60 each) for grandparents and senior family. Choose a single heavyweight card stock with embossed text — simple but premium.' },
      { label: 'Seed paper invites', detail: 'Plantable seed-paper invites cost ₹40–₹80 each and are memorable enough that guests talk about them. They signal sustainability and thoughtfulness — both premium markers.' },
      { label: 'Minimal design language', detail: 'White card + black serif text + a single gold line is the most premium-looking invitation design. Clutter and too many colours signal budget. Restraint signals luxury.' },
      { label: 'Monogram wax seal', detail: 'A custom wax seal stamp (₹600–₹1,200 one-time) with your initials on a plain envelope turns a simple printed invite into something people frame. Total per invite: ₹25 extra.' },
    ],
  },
  {
    id: 'ambience',
    icon: Music,
    color: 'from-rose-500 to-pink-600',
    title: 'Ambience, Music & Little Touches',
    subtitle: 'The details guests feel but cannot explain',
    ideas: [
      { label: 'Curated Spotify playlist', detail: 'A thoughtfully curated playlist of Bollywood classics, folk, and instrumental pieces on a good Bluetooth speaker costs ₹0 (Premium subscription: ₹119/month) and sets the mood perfectly.' },
      { label: 'Signature fragrance', detail: 'A few incense sticks or a scented candle near the entrance creates an immediate sensory impression that guests associate with luxury. Cost: ₹50–₹200.' },
      { label: 'Welcome baskets at entrance', detail: 'A small wicker basket with a rose, a small sweet, and a hand-written "welcome" card (₹80–₹120 per basket) at the entrance reads as extraordinarily thoughtful.' },
      { label: 'Monogrammed napkins', detail: 'Paper napkins with your initials printed in gold (₹4–₹8 each, minimum order 100) are a tiny detail that makes tables feel curated and personal rather than catered.' },
      { label: 'Mehendi as interactive art', detail: 'Set up your mehendi function as an open art station with a skilled artist and good lighting. Guests who get mehendi share it on Instagram — free word-of-mouth marketing.' },
      { label: 'Polaroid photo corner', detail: 'A Polaroid camera (rental ₹500–₹800/day) with a simple floral backdrop and a props box becomes the most-used station at any wedding, and guests take home a memory.' },
    ],
  },
];

// Before/After comparison
const BEFORE_AFTER = [
  { element: 'Venue', budget: 'Community hall — ₹25,000', premium_hack: '+ fairy lights + draping = looks like ₹2L venue' },
  { element: 'Flowers', budget: 'Marigold + jasmine — ₹15,000', premium_hack: 'Copper urlis + banana leaves = traditional luxury' },
  { element: 'Bridal outfit', budget: 'Exhibition lehenga — ₹35,000', premium_hack: '+ custom embroidered blouse + heirloom jewellery = couture look' },
  { element: 'Photography', budget: 'Student photographer — ₹28,000', premium_hack: '+ golden hour timing + candid brief = editorial album' },
  { element: 'Catering', budget: 'Local halwai — ₹380/plate', premium_hack: '+ copper vessels + floral garnish = five-star presentation' },
  { element: 'Invitations', budget: 'Canva digital — ₹0', premium_hack: '+ 30 printed seed-paper cards for elders = premium first impression' },
  { element: 'Music', budget: 'Spotify playlist — ₹119/month', premium_hack: '+ curated set + good speaker + single live musician = intimate concert feel' },
  { element: 'Welcome touch', budget: 'Rose + sweet + card — ₹90/guest', premium_hack: 'Guests perceive a 5-star welcome for ₹90 spend' },
];

// DIY ideas with effort + impact rating
const DIY_IDEAS = [
  { idea: 'String your own marigold toran for the entrance', effort: 'Easy', impact: 'High', cost: '₹300–₹600' },
  { idea: 'Make terracotta centrepieces with candles + petals', effort: 'Easy', impact: 'High', cost: '₹800–₹1,500' },
  { idea: 'Sew a fabric photo backdrop with dupatta + bamboo', effort: 'Medium', impact: 'High', cost: '₹1,000–₹2,000' },
  { idea: 'Bake or order homemade mithai as wedding favours', effort: 'Medium', impact: 'High', cost: '₹30–₹60/guest' },
  { idea: 'Design your own wedding hashtag + signage (Canva)', effort: 'Easy', impact: 'Medium', cost: '₹0–₹500' },
  { idea: 'Assemble welcome baskets with rose + sweet + card', effort: 'Easy', impact: 'High', cost: '₹80–₹120/guest' },
  { idea: 'Paint glass bottles as candle holders for dinner tables', effort: 'Medium', impact: 'High', cost: '₹20–₹40/bottle' },
  { idea: 'Create a seating chart board with dried flowers frame', effort: 'Medium', impact: 'Medium', cost: '₹500–₹1,200' },
];

// What makes it look expensive vs cheap
const LOOK_PREMIUM_RULES = [
  { rule: 'Less is more — edit ruthlessly', why: 'Excess decor signals budget panic. Curated simplicity signals confidence and taste.' },
  { rule: 'Consistent colour palette (max 3 colours)', why: 'A single palette (ivory + gold + blush, or rust + emerald + ivory) unifies a space and reads as intentional design.' },
  { rule: 'Good lighting over expensive flowers', why: 'Warm lighting hides imperfections and creates atmosphere. Even a basic hall looks beautiful with the right bulb temperature.' },
  { rule: 'Quality over quantity in everything', why: 'Ten perfect marigold centrepieces look more luxurious than twenty messy mixed arrangements.' },
  { rule: 'Elevate one focal point completely', why: "Spend 60% of your decor budget on the mandap or backdrop. Make that one thing extraordinary. Everything else can be simple." },
  { rule: 'Personal touches beat generic decor', why: 'A framed childhood photo of the couple, a handwritten menu board, a family recipe dish — personalisation is the hallmark of premium events.' },
];

const FAQS = [
  {
    q: 'Can a low budget Indian wedding really look premium?',
    a: 'Absolutely. The perception of luxury comes from consistency, restraint, and small thoughtful details — not from how much you spend. A community hall with a unified colour palette, warm fairy lights, fresh marigolds, and copper vessels will photograph more beautifully than a cluttered hotel ballroom. Thousands of Indian couples prove this every year.',
  },
  {
    q: 'Which wedding element gives the biggest premium look for the lowest cost?',
    a: 'Lighting is the single highest-ROI upgrade. Warm fairy lights or string lights cost ₹500–₹2,000 and transform the feel of any venue. After lighting, fabric draping is second — even sheer white organza over bare walls makes a space look intentional and elegant.',
  },
  {
    q: 'How do I make my wedding decor look expensive on a small budget?',
    a: 'Follow three rules: choose a consistent 2–3 colour palette, invest in one statement focal point (the mandap or entry arch), and use marigold + fairy lights as your base. Skip plastic decor entirely — nothing says "budget" faster than plastic flowers or coloured tinsel.',
  },
  {
    q: 'Is a Canva digital invitation good enough for a premium-looking wedding?',
    a: 'Yes, with the right design. A minimal Canva invite with a serif font, a gold palette, and clean layout looks more premium than a cluttered printed card. For key elders, print 25–30 cards on heavyweight paper with a wax seal. The combination reads as curated and thoughtful.',
  },
  {
    q: 'How can I make my bridal outfit look more expensive?',
    a: 'Three upgrades: (1) have a custom embroidered blouse made for your lehenga even if the skirt is mid-range, (2) choose one statement jewellery piece and keep everything else minimal, and (3) invest in professional bridal makeup — the single biggest visual upgrade available to a bride.',
  },
  {
    q: 'What should I absolutely NOT cheap out on if I want a premium look?',
    a: "Photography and makeup are the two things that cannot be fixed after the event. A bad photographer makes even a beautiful wedding look cheap. A great photographer makes even a simple wedding look editorial. Allocate at least ₹35K–₹55K for photography. For makeup, a skilled local MUA is sufficient — you don't need a celebrity name.",
  },
];

// ─── FaqItem ─────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function LowBudgetPremiumWeddingArticle({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-gold/20 to-plum/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-200/20 blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-rose-gold/30 shadow-sm mb-6 animate-fade-in-up">
            <Gem className="w-4 h-4 text-rose-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-gold/90">
              2026 Guide · Wedding Styling
            </span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.08] mb-6 animate-fade-in-up">
            Low Budget Weddings{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-gold via-plum to-amber-500">
              That Look Premium
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            The secret is not how much you spend — it's where and how you spend it. Here are the
            ideas Indian couples are using to create stunning, magazine-worthy weddings at a fraction
            of the cost.
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
          <div className="max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-rose-gold/15 border-4 border-white ring-1 ring-rose-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="Beautiful Indian wedding decor — marigold and fairy lights"
              className="w-full aspect-[21/9] object-cover"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* Article body */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-16 md:space-y-24">

        {/* Intro hook */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-gold/20 via-plum/15 to-amber-200/20 rounded-[2rem] blur-xl opacity-60" />
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-rose-50/60 border border-rose-100/80 p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-rose-gold shrink-0" />
              The truth about "expensive-looking" weddings
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              You've seen those wedding photos — the ones with warm golden light, fresh flowers
              everywhere, and a bride who looks like she stepped off a magazine cover. You assume it
              cost ₹30 lakhs. More often than not, it cost ₹8 lakhs.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              The secret to a premium-looking wedding isn't money. It's <strong>restraint, consistency,
              and knowing where a small rupee creates a big impact.</strong> A unified colour palette,
              warm lighting, and one well-executed focal point will outshine a ₹25 lakh wedding
              that tried to do everything.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              This guide breaks down every category — decor, photography, outfits, catering,
              invitations, and ambience — with specific, actionable ideas that look expensive but
              aren't.
            </p>
          </div>
        </section>

        {/* The 6 rules of looking premium */}
        <section id="rules">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/25">
              <Gem className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">6 rules that make any wedding look premium</h2>
              <p className="text-gray-500 text-sm mt-1">These apply regardless of budget.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {LOOK_PREMIUM_RULES.map((item, i) => (
              <div key={item.rule} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-rose-gold/25 hover:shadow-md transition-all">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-gold to-plum text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{item.rule}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The 6 main idea categories */}
        <section id="ideas">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3 text-center">
            36 ideas across 6 categories
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm max-w-xl mx-auto">
            Every idea below has been used by real Indian couples to create a premium look on a
            budget. Tap a category to explore all ideas.
          </p>

          <div className="space-y-4">
            {PREMIUM_CATEGORIES.map((cat) => {
              const isOpen = openCategory === cat.id;
              return (
                <div key={cat.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  {/* Category header — always visible */}
                  <button
                    type="button"
                    onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-rose-gold/5 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0 shadow-md`}>
                      <cat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-lg text-gray-900 leading-snug">{cat.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{cat.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                        6 ideas
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Ideas grid — shown when open */}
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-gray-50">
                      <div className="grid sm:grid-cols-2 gap-4 pt-5">
                        {cat.ideas.map((idea, i) => (
                          <div key={idea.label} className="flex gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-rose-gold/20 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm mb-1">{idea.label}</p>
                              <p className="text-gray-500 text-xs leading-relaxed">{idea.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Before / After table */}
        <section id="before-after">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Before & after: the premium upgrade table</h2>
              <p className="text-gray-500 text-sm mt-1">What you spend vs. what guests perceive.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-rose-gold to-plum text-white text-left">
                    <th className="px-4 py-4 font-semibold">Element</th>
                    <th className="px-4 py-4 font-semibold">Budget version</th>
                    <th className="px-4 py-4 font-semibold hidden md:table-cell">The premium hack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {BEFORE_AFTER.map((row, i) => (
                    <tr key={row.element} className={`hover:bg-rose-gold/5 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row.element}</td>
                      <td className="px-4 py-3 text-gray-600">{row.budget}</td>
                      <td className="px-4 py-3 text-emerald-700 font-medium text-sm hidden md:table-cell">{row.premium_hack}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-gray-500 text-sm text-center italic">
            Each "premium hack" adds ₹500–₹5,000 to the base cost but transforms perceived value by 10×.
          </p>
        </section>

        {/* DIY ideas */}
        <section id="diy">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
              8 DIY touches guests will notice
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              These small personal touches are what guests remember and photograph. All under ₹2,000.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {DIY_IDEAS.map((item, i) => (
              <div key={item.idea} className="group p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-gold/25 transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="inline-flex w-8 h-8 rounded-lg bg-rose-gold/10 text-rose-gold text-xs font-bold items-center justify-center shrink-0 group-hover:bg-rose-gold group-hover:text-white transition-colors">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {item.cost}
                  </span>
                </div>
                <p className="text-gray-800 text-sm font-medium leading-snug mb-2">{item.idea}</p>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Effort: {item.effort}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Impact: {item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to NEVER cut */}
        <section id="never-cut">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                Things to never cut to save money
              </h2>
            </div>
            <ul className="p-6 md:p-8 space-y-4">
              {[
                { item: 'Photography', reason: "Bad photos cannot be retaken. A great photographer makes a ₹5L wedding look like ₹20L. Allocate ₹35K minimum." },
                { item: 'Bridal makeup', reason: "The single biggest visual upgrade for a bride. A skilled local MUA is all you need — spend here before anywhere else." },
                { item: 'Food quality', reason: "Guests forgive a simple venue. They do not forgive bad food. The halwai's quality is everything." },
                { item: 'Seating comfort', reason: "Uncomfortable chairs are the #1 guest complaint. A rented chair upgrade (₹20–₹30 per chair extra) is always worth it." },
                { item: 'Lighting for the ceremony', reason: "Poor ceremony lighting makes even expensive decor look dull. One good rental lighting setup transforms the space." },
                { item: 'The welcome experience', reason: "First impressions set the entire tone. A rose, a sweet, and a greeting cost ₹100 per guest and are remembered for years." },
              ].map((row) => (
                <li key={row.item} className="flex gap-3 text-amber-950/90">
                  <span className="text-amber-600 font-bold text-lg leading-snug">×</span>
                  <span className="leading-relaxed"><strong>{row.item}:</strong> {row.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pro tip callout */}
        <section>
          <div className="flex gap-4 p-6 md:p-8 rounded-2xl bg-violet-50 border border-violet-200/60">
            <Lightbulb className="w-7 h-7 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-violet-900 mb-2 text-lg">The one colour palette rule</p>
              <p className="text-violet-800 leading-relaxed">
                Pick two base colours and one accent. Classic combinations that always look premium:
                <strong> Ivory + Gold + Blush</strong>,{' '}
                <strong>Rust + Ivory + Emerald</strong>, or{' '}
                <strong>Deep Red + Marigold + White</strong>.
                Stick to it for every element — decor, invitations, outfit backdrop, cake, even the welcome basket ribbon. Consistency is the most premium thing money cannot buy.
              </p>
            </div>
          </div>
        </section>

        {/* Tools CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-rose-gold via-rose-600 to-plum p-1 shadow-2xl shadow-rose-gold/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Plan every detail, track every rupee
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Wedora's free tools help you manage your budget, checklist, and vendors in one place —
              so you can focus on making it beautiful, not stressful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-rose-50 transition-colors shadow-lg">
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
            Your wedding will look exactly as premium as you make it feel
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The most stunning wedding photos you've ever seen were not bought — they were curated.
            A clear colour palette, warm light, one breathtaking focal point, and a photographer who
            knows how to find moments: that's the formula. Budget is just a starting point.
            Use Wedora to plan every detail and make every rupee count.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free budget planner</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Wedding checklist</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Vendor tracker</span>
          </div>
        </section>

        {/* Affiliate */}
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
