import { Link } from 'react-router-dom';
import BlogInternalLinks from '../../components/landing/BlogInternalLinks';
import {
  ArrowLeft,
  Clock,
  Copy,
  Sparkles,
  Heart,
  Star,
  Camera,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Users,
  Flower2,
  Sun,
  Moon,
  Image,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

// ─── Slug & static post ──────────────────────────────────────────────────────

export const PHOTOGRAPHY_CHECKLIST_SLUG = 'wedding-photography-checklist-must-have-shots';

// Unsplash: Indian bridal close-up with mehndi and jewellery details
// photo by Shardayyy Photography — verified Indian wedding content
const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=85&auto=format&fit=crop';

export function getStaticPhotographyChecklistPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-photography-checklist-2026',
    title: 'Wedding Photography Checklist — 50 Must-Have Shots',
    slug: PHOTOGRAPHY_CHECKLIST_SLUG,
    excerpt:
      'Never miss a precious moment. This complete Indian wedding photography checklist covers all 50 must-have shots — from bridal prep to the last dance — with tips for briefing your photographer.',
    content: '',
    tags: 'Wedding Photography, Checklist, Indian Wedding, Wedding Tips',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Wedding Photography Checklist: 50 Must-Have Shots for Indian Weddings | Wedora',
    meta_description:
      'Never miss a precious moment. Our Indian wedding photography checklist covers 50 must-have shots across every function — with tips on briefing your photographer perfectly.',
    keywords:
      'wedding photography checklist india, must have wedding shots, indian wedding photos list, wedding photographer brief india, wedding photo checklist 2026, wedora',
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

const SHOT_CATEGORIES = [
  {
    id: 'prep',
    icon: Sun,
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    textAccent: 'text-amber-700',
    label: 'Getting Ready',
    subtitle: 'Bridal & groom prep — before the ceremony begins',
    shots: [
      { n: 1,  shot: "Bride's outfit flat-lay — lehenga, jewellery, and accessories arranged on a bed or table", priority: 'essential' },
      { n: 2,  shot: 'Close-up of bridal jewellery — maang tikka, choker, bangles, and nath individually', priority: 'essential' },
      { n: 3,  shot: 'Bride getting makeup done — candid of the MUA at work', priority: 'essential' },
      { n: 4,  shot: "Bride's first full-look reveal — looking at herself in the mirror", priority: 'essential' },
      { n: 5,  shot: 'Bride with mother or sister — an intimate moment before leaving', priority: 'essential' },
      { n: 6,  shot: "Bride's hands — hennaed palms, bangles, and ring close-up", priority: 'essential' },
      { n: 7,  shot: "Bride putting on her dupatta — motion shot", priority: 'nice-to-have' },
      { n: 8,  shot: 'Groom getting dressed — tying pagri or sherwani buttons', priority: 'essential' },
      { n: 9,  shot: "Groom's detail flat-lay — shoes, watch, accessories, sehra", priority: 'nice-to-have' },
      { n: 10, shot: 'Groom with father or best friend — candid laugh or handshake', priority: 'essential' },
    ],
  },
  {
    id: 'mehendi',
    icon: Flower2,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    textAccent: 'text-emerald-700',
    label: 'Mehendi',
    subtitle: 'The most colourful and candid function of any Indian wedding',
    shots: [
      { n: 11, shot: "Mehendi being drawn — close-up of the artist's needle and bride's hand", priority: 'essential' },
      { n: 12, shot: "Bride's full mehendi reveal — both arms extended, top-down shot", priority: 'essential' },
      { n: 13, shot: "Groom's name hidden in the mehendi design — can you find it?", priority: 'essential' },
      { n: 14, shot: 'Bride surrounded by cousins or bridesmaids — group laughter shot', priority: 'essential' },
      { n: 15, shot: 'The mehendi artist at work — wide shot of bride, artist, and setting', priority: 'nice-to-have' },
      { n: 16, shot: 'Guests getting mehendi — candid smiles and reactions', priority: 'nice-to-have' },
    ],
  },
  {
    id: 'haldi',
    icon: Sun,
    color: 'from-yellow-400 to-amber-500',
    bgLight: 'bg-yellow-50',
    textAccent: 'text-yellow-700',
    label: 'Haldi',
    subtitle: 'Pure joy — the most photogenic chaos of the day',
    shots: [
      { n: 17, shot: 'Bride seated before the first haldi application — anticipation on her face', priority: 'essential' },
      { n: 18, shot: "Mother applying haldi to bride's face — pure emotion, close-up", priority: 'essential' },
      { n: 19, shot: 'Family crowding in with haldi — everyone laughing and smiling', priority: 'essential' },
      { n: 20, shot: "Bride mid-haldi — turmeric on cheeks, joy in the eyes", priority: 'essential' },
      { n: 21, shot: 'Bride lifting hands above head, haldi dripping — fun motion shot', priority: 'nice-to-have' },
      { n: 22, shot: "Groom's haldi ceremony — equivalent shots at his location", priority: 'essential' },
    ],
  },
  {
    id: 'ceremony',
    icon: Sparkles,
    color: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    textAccent: 'text-rose-700',
    label: 'The Ceremony',
    subtitle: 'The heart of the wedding — every ritual deserves a frame',
    shots: [
      { n: 23, shot: "Bride's processional entry — wide shot of the walk and crowd's reaction", priority: 'essential' },
      { n: 24, shot: "Bride's face during the entry — emotion, anticipation, joy", priority: 'essential' },
      { n: 25, shot: "Groom's first look at the bride — that exact moment of awe", priority: 'essential' },
      { n: 26, shot: 'Mandap wide shot — full setup with all participants seated', priority: 'essential' },
      { n: 27, shot: 'Jaimala / varmala — garland exchange, catching both expressions', priority: 'essential' },
      { n: 28, shot: 'Saat pheras — each of the seven rounds around the sacred fire', priority: 'essential' },
      { n: 29, shot: 'Sindoor ceremony — close-up of the sindoor being applied', priority: 'essential' },
      { n: 30, shot: "Mangalsutra — groom tying it, close-up of bride's face", priority: 'essential' },
      { n: 31, shot: "Bride's parents at the kanyadaan — faces showing joy and emotion", priority: 'essential' },
      { n: 32, shot: 'Sacred fire (agni) — atmospheric shot of the ceremony flames', priority: 'nice-to-have' },
      { n: 33, shot: 'Pandit ji in context — wide shot placing him within the ceremony', priority: 'nice-to-have' },
      { n: 34, shot: "Couple's joined hands during pheras — top-down close-up", priority: 'essential' },
    ],
  },
  {
    id: 'portraits',
    icon: Image,
    color: 'from-violet-500 to-purple-700',
    bgLight: 'bg-violet-50',
    textAccent: 'text-violet-700',
    label: 'Couple Portraits',
    subtitle: 'Just the two of you — captured forever',
    shots: [
      { n: 35, shot: 'Couple portrait at the mandap — posed, full-length, both in focus', priority: 'essential' },
      { n: 36, shot: 'Candid couple moment — a whisper, a laugh, a hand squeeze', priority: 'essential' },
      { n: 37, shot: 'Golden-hour portrait — backlit, warm-glow or silhouette', priority: 'essential' },
      { n: 38, shot: 'Looking at each other — not at the camera, natural emotion', priority: 'essential' },
      { n: 39, shot: 'Walking together — movement, optional gentle motion blur', priority: 'nice-to-have' },
      { n: 40, shot: 'Aerial drone shot of the couple at the mandap or venue garden', priority: 'nice-to-have' },
    ],
  },
  {
    id: 'family',
    icon: Users,
    color: 'from-sky-500 to-blue-600',
    bgLight: 'bg-sky-50',
    textAccent: 'text-sky-700',
    label: 'Family & Groups',
    subtitle: 'The people who made this day possible',
    shots: [
      { n: 41, shot: "Full family group photo — both sides together, everyone present", priority: 'essential' },
      { n: 42, shot: "Bride's family — parents, siblings, and close relatives", priority: 'essential' },
      { n: 43, shot: "Groom's family — same treatment, same care", priority: 'essential' },
      { n: 44, shot: 'Bride with bridesmaids or girl gang — fun, candid, and posed', priority: 'essential' },
      { n: 45, shot: 'Groom with groomsmen or best friends — same energy', priority: 'essential' },
      { n: 46, shot: "Grandparents with the couple — if present, never miss this one", priority: 'essential' },
    ],
  },
  {
    id: 'reception',
    icon: Moon,
    color: 'from-indigo-500 to-violet-600',
    bgLight: 'bg-indigo-50',
    textAccent: 'text-indigo-700',
    label: 'Reception & Celebration',
    subtitle: 'The evening, the dancing, the last memories',
    shots: [
      { n: 47, shot: "Reception entry — couple walking in, guests cheering, petals or confetti", priority: 'essential' },
      { n: 48, shot: 'First dance — wide shot capturing the floor, crowd, and couple together', priority: 'essential' },
      { n: 49, shot: "Cake cutting (if applicable) — close-up and candid laugh", priority: 'nice-to-have' },
      { n: 50, shot: 'The last slow dance or quiet moment together at the end of the night', priority: 'essential' },
    ],
  },
];

const ALL_SHOTS      = SHOT_CATEGORIES.flatMap((c) => c.shots);
const ESSENTIAL_COUNT = ALL_SHOTS.filter((s) => s.priority === 'essential').length;
const TOTAL_SHOTS    = ALL_SHOTS.length; // 50

const PHOTOGRAPHER_TIPS = [
  { tip: 'Share this checklist 2 weeks before the wedding', detail: "Don't hand it over on the day. A good photographer needs time to understand your priorities, scout the venue, and plan their positioning for each ritual." },
  { tip: 'Mark your top 10 non-negotiables clearly', detail: 'Highlight the shots you absolutely cannot miss — first look, sindoor moment, parents at kanyadaan. Make these explicit. Everything else is bonus.' },
  { tip: 'Assign a "shot wrangler" from the family', detail: 'Designate one calm, organised cousin or sibling (not a parent — they will be emotional) to round up people for group shots. Your photographer will love you for it.' },
  { tip: 'Block 15 minutes for couple portraits', detail: 'Schedule this between the ceremony and reception. Do not leave it to chance. Write it into the day\'s timeline and share that timeline with your photographer.' },
  { tip: 'Brief your guests about phone etiquette', detail: 'Ask the officiant to request a phone-free ceremony. One phone raised becomes ten. Your photographer loses the angle and the couple loses the moment.' },
  { tip: 'Share the full day timeline, not just the shot list', detail: 'Your photographer needs to know when each function starts, where the light falls at each time, and how long each ritual runs. A timeline + checklist = a perfect brief.' },
];

const MISTAKES = [
  { m: 'No shot list shared in advance', reason: 'Photographers cannot read minds. Without a list, key moments get missed and can never be recreated.' },
  { m: 'Skipping couple portrait time', reason: "When you leave portraits to 'whenever there's a gap', there is never a gap. Schedule it explicitly in the timeline." },
  { m: 'Poor ceremony lighting', reason: 'Many mandaps sit under harsh tubelights. Ask your venue about warm ambient lighting or request your photographer to bring a rim light for the ceremony.' },
  { m: 'Too many phone cameras at key moments', reason: 'A wall of phones blocks angles and distracts subjects. An officiant announcement goes a long way.' },
  { m: 'Booking without reviewing indoor work', reason: 'Any photographer looks good outdoors. Ask specifically for indoor, low-light ceremony shots from their portfolio before booking.' },
  { m: 'Forgetting detail and emotion shots', reason: 'The jewellery flat-lay, the mehendi artist at work, the grandmother\'s expression — these tell the full story. Remind your photographer of these explicitly.' },
];

const FAQS = [
  {
    q: 'How many photos should I expect from a full Indian wedding?',
    a: "A professional covering a full 1-day wedding (mehendi through reception) typically delivers 400–800 edited photos. For multi-day events (3 functions), expect 800–1,500 images. Always clarify the delivery count in writing before signing a contract — and confirm whether 'edited' means fully retouched or just colour-corrected.",
  },
  {
    q: 'Should I share this checklist directly with my photographer?',
    a: "Yes — but frame it as a guide, not a rigid demand. Share it 2 weeks before the wedding with your top 10 non-negotiables highlighted. A good photographer uses it to plan, not feel micromanaged.",
  },
  {
    q: 'How do I organise group family photos without chaos?',
    a: "Assign a 'shot wrangler' — a calm family member (cousin or sibling) to gather people for group shots using a printed list. Schedule family photos immediately after the ceremony while everyone is dressed, present, and still in a good mood.",
  },
  {
    q: 'What is the best time for outdoor couple portraits at an Indian wedding?',
    a: '4–6 PM is golden hour — warm, soft, and forgiving light. Schedule your couple portrait session to coincide with this window wherever possible. If the ceremony runs late, dusk blue-hour at 6:30–7 PM creates equally beautiful moody portraits.',
  },
  {
    q: 'Do I need a second photographer at my wedding?',
    a: 'For large weddings (300+ guests) or simultaneous events at different locations, a second shooter adds real value. For intimate weddings under 150 guests at a single venue, one skilled photographer is sufficient. Do not add a second shooter just for the sake of it — budget that money into a better primary photographer instead.',
  },
  {
    q: 'How soon after the wedding should my edited photos arrive?',
    a: 'Industry standard in India is 4–6 weeks for a full edited gallery. Clarify the delivery timeline in your contract before the wedding. For sneak peeks (5–10 preview photos), most photographers deliver within 48–72 hours. Never accept a photographer who cannot give you a clear written timeline.',
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

function ShotCategory({ cat, checked, onToggle }) {
  const catChecked = cat.shots.filter((s) => checked.has(s.n)).length;
  const isComplete = catChecked === cat.shots.length;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      {/* Category header */}
      <div className="px-5 py-4 flex items-center gap-4 border-b border-gray-100">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0 shadow-md`}>
          <cat.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif font-bold text-gray-900 leading-snug">{cat.label}</p>
          <p className="text-gray-400 text-xs mt-0.5 leading-snug">{cat.subtitle}</p>
        </div>
        <div className="shrink-0 text-right flex items-center gap-1.5">
          <span className={`text-sm font-bold ${isComplete ? 'text-emerald-600' : 'text-gray-400'}`}>
            {catChecked}/{cat.shots.length}
          </span>
          {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        </div>
      </div>

      {/* Shot rows */}
      <ul className="divide-y divide-gray-50">
        {cat.shots.map((s) => {
          const isDone = checked.has(s.n);
          return (
            <li key={s.n}>
              <button
                type="button"
                onClick={() => onToggle(s.n)}
                className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50/80 ${isDone ? 'bg-emerald-50/40' : ''}`}
              >
                {/* Checkbox */}
                <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  isDone ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
                }`}>
                  {isDone && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {/* Shot number */}
                <span className={`shrink-0 text-xs font-bold w-6 text-right mt-0.5 ${isDone ? 'text-emerald-400' : 'text-gray-300'}`}>
                  {s.n}
                </span>
                {/* Shot text */}
                <span className={`flex-1 text-sm leading-relaxed transition-colors ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {s.shot}
                </span>
                {/* Must badge */}
                {s.priority === 'essential' && (
                  <span className="shrink-0 self-start mt-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold border border-rose-gold/20">
                    Must
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PhotographyChecklistArticle({
  post,
  readTime,
  copied,
  onShare,
  affiliateHref,
  affiliateCtaLabel,
}) {
  const [openFaq, setOpenFaq]     = useState(0);
  const [checked, setChecked]     = useState(new Set());
  const [activeFilter, setFilter] = useState('all');

  const totalChecked = checked.size;
  const progressPct  = Math.round((totalChecked / TOTAL_SHOTS) * 100);

  function toggleShot(n) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  }

  function resetAll() { setChecked(new Set()); }

  const filteredCategories = SHOT_CATEGORIES.map((cat) => ({
    ...cat,
    shots: activeFilter === 'all'
      ? cat.shots
      : cat.shots.filter((s) => s.priority === activeFilter),
  })).filter((cat) => cat.shots.length > 0);

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
            <Camera className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">2026 Guide · Photography</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.08] mb-6 animate-fade-in-up">
            Wedding Photography{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-rose-gold">
              Checklist
            </span>
          </h1>

          {/* Stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 text-white text-sm font-bold shadow-lg">
              <Camera className="w-4 h-4" /> 50 Must-Have Shots
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-gold text-white text-sm font-bold shadow-lg">
              ★ {ESSENTIAL_COUNT} Essential
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
              7 Functions Covered
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Share this with your photographer before the wedding — then tick off each shot as the
            day unfolds. Every moment is irreplaceable.
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
          <div className="max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-sky-400/15 border-4 border-white ring-1 ring-sky-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="Indian bride with mehndi and jewellery details"
              className="w-full aspect-[21/9] object-cover object-top"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* ── Article body ───────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-16 md:space-y-24">

        {/* Intro */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 via-blue-300/15 to-rose-gold/20 rounded-[2rem] blur-xl opacity-60" />
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-sky-50/60 border border-sky-100/80 p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-sky-500 shrink-0" />
              Don't leave your wedding memories to chance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              You've spent months planning the perfect wedding. The lehenga, the flowers, the
              food — every detail is exactly right. And then, a week after the wedding, you open
              your photo gallery and realise: the sindoor moment is blurry. Your grandmother's
              face during kanyadaan was never captured. The first look was missed entirely.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              A photography checklist prevents that. Share this list with your photographer
              2 weeks before the wedding, mark your non-negotiables, and use the interactive
              checklist below to track progress on the day itself.
            </p>
          </div>
        </section>

        {/* ── INTERACTIVE CHECKLIST ─────────────────────────────────────────── */}
        <section id="checklist">

          {/* Sticky progress header */}
          <div className="sticky top-16 z-30 -mx-4 px-4 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm mb-8">
            <div className="max-w-4xl mx-auto">

              {/* Progress label row */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-bold text-gray-900">{totalChecked} of {TOTAL_SHOTS} shots</span>
                  <span className="text-gray-400 text-sm ml-2">ticked off</span>
                </div>
                <div className="flex items-center gap-3">
                  {totalChecked > 0 && (
                    <button type="button" onClick={resetAll} className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">
                      Reset
                    </button>
                  )}
                  <span className="text-sm font-bold text-sky-600">{progressPct}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-rose-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all',          label: `All ${TOTAL_SHOTS} shots` },
                  { key: 'essential',    label: `★ ${ESSENTIAL_COUNT} Essential only` },
                  { key: 'nice-to-have', label: `${TOTAL_SHOTS - ESSENTIAL_COUNT} Nice-to-have` },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeFilter === f.key
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category cards */}
          <div className="space-y-4">
            {filteredCategories.map((cat) => (
              <ShotCategory key={cat.id} cat={cat} checked={checked} onToggle={toggleShot} />
            ))}
          </div>

          {/* Completion message */}
          {totalChecked === TOTAL_SHOTS && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center shadow-xl animate-fade-in-up">
              <p className="text-2xl font-serif font-bold mb-1">🎉 All 50 shots captured!</p>
              <p className="text-white/90 text-sm">Your wedding album is going to be incredible.</p>
            </div>
          )}
        </section>

        {/* Briefing tips */}
        <section id="tips">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">How to brief your photographer</h2>
              <p className="text-gray-500 text-sm mt-1">6 things every couple should do before the wedding day.</p>
            </div>
          </div>
          <div className="space-y-4">
            {PHOTOGRAPHER_TIPS.map((item, i) => (
              <div key={item.tip} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-sky-300/40 hover:shadow-md transition-all">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{item.tip}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                </div>
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
                Photography mistakes couples regret
              </h2>
            </div>
            <ul className="p-6 md:p-8 space-y-4">
              {MISTAKES.map((row) => (
                <li key={row.m} className="flex gap-3 text-amber-950/90">
                  <span className="text-amber-600 font-bold text-lg leading-snug shrink-0">×</span>
                  <span className="leading-relaxed">
                    <strong>{row.m}:</strong> {row.reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pro tip callout */}
        <section>
          <div className="flex gap-4 p-6 md:p-8 rounded-2xl bg-sky-50 border border-sky-200/60">
            <Lightbulb className="w-7 h-7 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sky-900 mb-2 text-lg">The golden rule of wedding photography</p>
              <p className="text-sky-800 leading-relaxed">
                Schedule your couple portrait session for <strong>golden hour (4–6 PM)</strong>.
                Natural backlight turns any venue into a dream backdrop. Even a community hall
                courtyard looks editorial with warm evening sun. This single scheduling decision
                is worth more than ₹50,000 of extra photography equipment.
              </p>
            </div>
          </div>
        </section>

        {/* Tools CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-500 to-rose-gold p-1 shadow-2xl shadow-sky-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Plan every detail of your wedding
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Wedora's free wedding planning tools help you track vendors, manage your budget,
              and stay on top of every checklist — photography and beyond.
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
            Every shot on this list is a memory you'll keep for life
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Venues close. Flowers wilt. Food is eaten. But a photograph of your grandmother's
            face during the kanyadaan, or the exact moment the groom first saw the bride —
            those live forever. Brief your photographer well, share this checklist, and let
            the day unfold beautifully.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free wedding checklist</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Budget planner</span>
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
        <BlogInternalLinks currentSlug="wedding-photography-checklist" />
      </main>

      {/* Footer bar */}
      <div className="border-t border-rose-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Share:</span>
            <button type="button" onClick={onShare} className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative" title="Copy link">
              <Copy className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Copied!</span>
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
