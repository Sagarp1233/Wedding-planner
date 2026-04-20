import { Link } from 'react-router-dom';
import { Heart, Wallet, Users, CheckSquare, CalendarHeart, Camera, Star, ArrowRight, Sparkles, ShieldCheck, Store, Menu, X, Mail, ChevronRight, MessageCircle, Zap, Crown, Award, TrendingUp, BarChart3, Clock, MapPin, PartyPopper, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearArticleJsonLd, clearHomepageJsonLd, setHomepageJsonLd, setSEO } from '../lib/seo';
import { ensureHttps } from '../utils/ensureHttps';
import StickyMobileCTA from '../components/landing/StickyMobileCTA';
import WhatsAppMessageGenerator from '../components/landing/WhatsAppMessageGenerator';
import InvitationGenerator from '../components/landing/InvitationGenerator';

const SITE_DESCRIPTION =
  'India\'s most complete wedding planner — manage budgets, guests, vendors, timelines & create stunning digital invitations. All free for Indian couples.';

const SEO_KEYWORDS =
  'wedding planner India, free wedding planner app, wedding budget tracker, guest list manager, wedding vendor marketplace, wedding invitation creator, Indian wedding planning, Wedora';

/* ───────────────────────── DATA ───────────────────────── */

const HERO_STATS = [
  { value: '5,000+', label: 'Couples Trust Us', icon: Heart },
  { value: '₹500Cr+', label: 'Budgets Managed', icon: TrendingUp },
  { value: '4.9★', label: 'Average Rating', icon: Star },
  { value: '10K+', label: 'Invitations Created', icon: Mail },
];

const CORE_FEATURES = [
  { icon: Wallet, title: 'Smart Budget Tracker', desc: 'Track every rupee with auto-allocated categories, real-time charts, and over-budget alerts. Know exactly where your money goes.', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200/50', tag: 'Most Popular' },
  { icon: Users, title: 'Guest List Manager', desc: 'Manage RSVPs, plus-ones, dietary needs, seating, and meal preferences. Export your list instantly.', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50', tag: null },
  { icon: CheckSquare, title: 'Planning Checklist', desc: 'Auto-generated tasks with smart deadlines based on your wedding date. Never miss a detail.', color: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-200/50', tag: null },
  { icon: CalendarHeart, title: 'Event Timeline', desc: 'Visualize every ceremony from engagement to reception on a beautiful, shareable timeline.', color: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-200/50', tag: null },
  { icon: Store, title: 'Vendor Tracker', desc: 'Track all vendors — costs, payments, contracts, contacts, and status. No more spreadsheet chaos.', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50', tag: null },
  { icon: Camera, title: 'Inspiration Board', desc: 'Collect and organize your wedding inspiration — outfits, decor, venues — in one mood board.', color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-200/50', tag: null },
  { icon: Mail, title: 'Invitation Creator', desc: 'Design beautiful invitations in Hindu, Christian, Muslim, Telugu & Modern styles. Download or share on WhatsApp — free!', color: 'from-rose-gold to-plum', shadow: 'shadow-rose-200/50', tag: 'Free Tool', link: '/create-invitation' },
  { icon: MessageCircle, title: 'WhatsApp Invite Tool', desc: 'Generate ready-made wedding invite messages in 3 tones — Emotional, Formal, or Fun. Copy & share instantly.', color: 'from-[#25D366] to-[#128C7E]', shadow: 'shadow-emerald-200/50', tag: 'Free Tool', link: '#whatsapp-tool' },
];

const PLANNING_STEPS = [
  { num: '01', title: 'Create Your Wedding', desc: 'Sign up free, add your partner details, wedding date, and budget. We auto-set up your dashboard.', emoji: '💍' },
  { num: '02', title: 'Plan Every Detail', desc: 'Use smart checklists, budget tracker, guest manager, and vendor tools to organize everything.', emoji: '📋' },
  { num: '03', title: 'Invite & Celebrate', desc: 'Create beautiful digital invitations, share on WhatsApp, and enjoy your stress-free wedding day!', emoji: '🎉' },
];

const TESTIMONIALS = [
  { name: 'Ananya & Rohan', location: 'Mumbai', text: 'Wedora\'s budget tracker literally saved us ₹2 lakh! We tracked 18 vendors, managed 400+ guests, and the auto-checklist kept us sane for 8 months.', avatar: '👩‍❤️‍👨', rating: 5, highlight: 'Budget tracker saved ₹2L' },
  { name: 'Meera & Arjun', location: 'Bangalore', text: 'We planned our entire 3-day wedding using just Wedora. The timeline feature was incredible — every ceremony, every vendor, perfectly coordinated.', avatar: '💑', rating: 5, highlight: 'Planned entire 3-day wedding' },
  { name: 'Fatima & Ahmed', location: 'Hyderabad', text: 'Managing 500+ guests was a nightmare until we found Wedora. RSVPs, dietary needs, seating — everything organized beautifully. The invitation tool was a bonus!', avatar: '👫', rating: 5, highlight: '500+ guests managed' },
  { name: 'Priti & Sahil', location: 'Delhi', text: 'From vendor negotiations to last-minute checklist items — Wedora thought of everything we didn\'t. It\'s like having a wedding planner in your pocket.', avatar: '💕', rating: 5, highlight: 'Wedding planner in your pocket' },
];

const MARKETPLACE_CATEGORIES = [
  { icon: Camera, name: 'Photographers', count: '500+' },
  { icon: Store, name: 'Venues', count: '300+' },
  { icon: PartyPopper, name: 'Decorators', count: '200+' },
  { icon: Users, name: 'Caterers', count: '400+' },
  { icon: Crown, name: 'Makeup Artists', count: '150+' },
  { icon: Globe, name: 'Planners', count: '100+' },
];

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const origin = ensureHttps((import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ''));
    clearArticleJsonLd();
    setSEO({
      title: 'Wedora — Free Wedding Planner & Invitation Creator for Indian Couples',
      description: SITE_DESCRIPTION,
      keywords: SEO_KEYWORDS,
      canonicalUrl: `${origin}/`,
      ogType: 'website',
      ogImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=630&fit=crop&q=80',
    });
    setHomepageJsonLd({ siteUrl: origin, description: SITE_DESCRIPTION });
    return () => clearHomepageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ━━━ STICKY NAVBAR ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-md">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">Wedora</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">Features</a>
            <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">How It Works</a>
            <a href="#free-tools" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">Free Tools</a>
            <Link to="/blog" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">Blog</Link>
            <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">Log In</Link>
            <Link to="/signup" className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg shadow-rose-gold/25 hover:shadow-xl hover:shadow-rose-gold/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
              Start Planning Free
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in">
            <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Features</a>
            <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">How It Works</a>
            <a href="/#free-tools" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Free Tools</a>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Blog</Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Log In</Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">Start Planning Free</Link>
          </div>
        )}
      </nav>

      <main id="main-content">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            HERO — Wedding Planner First, Invitation Tool as Hook
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden" aria-label="Introduction">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl animate-float" />
            <div className="absolute -bottom-20 -left-40 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] rounded-full bg-gradient-to-br from-rose-gold/5 to-transparent blur-3xl" />
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #b76e79 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          <div className="max-w-5xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/10 border border-rose-gold/20 mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-rose-gold" />
              <span className="text-xs sm:text-sm font-medium text-rose-gold">100% Free · Trusted by 5,000+ Indian Couples</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1] mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Your Complete{' '}
              <span className="gradient-text">Wedding Planner</span>
              <br className="hidden sm:block" />
              <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-600 font-medium">All in One Place</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 px-2 animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms' }}>
              Budget tracking, guest management, vendor coordination, timelines, checklists — and even{' '}
              <span className="font-semibold text-rose-gold">free digital invitations</span>.
              Everything you need to plan a perfect Indian wedding.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link to="/signup" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:shadow-rose-gold/30 transition-all hover:-translate-y-1 active:translate-y-0 text-center flex items-center justify-center gap-2">
                Start Planning Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/create-invitation" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-rose-gold/30 hover:bg-rose-gold/5 transition-all text-center flex items-center justify-center gap-2">
                Create Free Invitation <Mail className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 sm:mt-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '500ms' }}>
              {HERO_STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <stat.icon className="w-4 h-4 text-rose-gold" />
                    <p className="text-lg sm:text-2xl font-serif font-bold gradient-text">{stat.value}</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-6 text-xs sm:text-sm text-gray-400 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Secure & Private</span>
              <span className="hidden sm:inline">•</span>
              <span>🇮🇳 Made for Indian Weddings</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> No Credit Card Required</span>
            </div>
          </div>
        </section>

        {/* ━━━ SOCIAL PROOF BAR ━━━ */}
        <section className="py-6 sm:py-8 px-4 sm:px-6 bg-gray-50/80 border-y border-gray-100/50">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['A', 'M', 'P', 'R', 'S'].map((l, i) => (
                  <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white border-2 border-white bg-gradient-to-br ${
                    ['from-rose-400 to-pink-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500', 'from-purple-400 to-violet-500'][i]
                  }`}>{l}</span>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Loved by 5,000+ couples</p>
                <p className="text-xs text-gray-500">across Mumbai, Delhi, Bangalore, Hyderabad & more</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />)}
              <span className="text-sm font-semibold text-gray-700 ml-1">4.9/5</span>
              <span className="text-xs text-gray-400 ml-1">average rating</span>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CORE FEATURES — Wedding Planning Tools (Main USP)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="features" className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold mb-3 tracking-wide uppercase">
                <BarChart3 className="w-3.5 h-3.5" /> Powerful Planning Tools
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
                Everything You Need to{' '}
                <span className="gradient-text">Plan Your Wedding</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
                Six powerful tools that replace messy spreadsheets, scattered notes, and endless WhatsApp groups. One dashboard to rule them all.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {CORE_FEATURES.map((f, i) => (
                <div key={i} className="glass-card-hover p-6 sm:p-7 group relative">
                  {f.tag && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                      {f.tag}
                    </span>
                  )}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg ${f.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-10">
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:-translate-y-1 transition-all">
                Start Planning Free <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-gray-400 mt-3">No credit card · No hidden fees · Set up in 2 minutes</p>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            HOW IT WORKS — Planning Journey
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-3 tracking-wide uppercase">
                <Heart className="w-3.5 h-3.5" /> How It Works
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
                Plan Your Dream Wedding in 3 Steps
              </h2>
              <p className="text-base sm:text-lg text-gray-500">From engagement to reception — we've got every step covered.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {PLANNING_STEPS.map((s, i) => (
                <div key={i} className="text-center relative">
                  {i < PLANNING_STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-rose-gold/30 to-transparent" />
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-gold/10 to-plum/5 flex items-center justify-center mx-auto mb-4 border border-rose-gold/15">
                    <span className="text-2xl">{s.emoji}</span>
                  </div>
                  <div className="text-xs font-bold text-rose-gold/60 uppercase tracking-widest mb-1.5">Step {s.num}</div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 max-w-[280px] mx-auto">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-0.5">
                Create Your Wedding Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TESTIMONIALS — Wedding Planner Focused
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold mb-3 tracking-wide uppercase">
                <Star className="w-3.5 h-3.5" fill="currentColor" /> Real Stories
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
                How Couples Planned Their Wedding with Wedora
              </h2>
              <p className="text-base sm:text-lg text-gray-500">Real results from real Indian weddings — budget savings, stress reduction, perfect coordination.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="glass-card p-6 sm:p-7 hover:shadow-lg transition-shadow duration-300 relative">
                  {/* Highlight badge */}
                  <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-gold/10 to-plum/10 border border-rose-gold/15">
                    <span className="text-[10px] font-bold text-rose-gold">{t.highlight}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-5 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <span className="text-2xl">{t.avatar}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Join 5,000+ Happy Couples <Heart className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FREE TOOLS — Invitation & WhatsApp (Traffic Magnets)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ━━━ INVITATION GENERATOR (Working Tool) ━━━ */}
        <section id="free-tools" className="py-0">
          <InvitationGenerator />
        </section>

        {/* ━━━ WHATSAPP INVITE TOOL (Working Generator) ━━━ */}
        <section id="whatsapp-tool" className="py-0">
          <WhatsAppMessageGenerator />
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            VENDOR MARKETPLACE — Coming Soon
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold mb-3 tracking-wide uppercase">
                <Store className="w-3.5 h-3.5" /> Coming Soon
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
                Vendor <span className="gradient-text">Marketplace</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
                Discover verified wedding vendors near you — photographers, venues, decorators, caterers & more. Compare, review, and book directly.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
              {MARKETPLACE_CATEGORIES.map((cat, i) => (
                <div key={i} className="glass-card p-4 text-center group hover:border-rose-gold/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-2.5 group-hover:from-rose-gold/10 group-hover:to-plum/5 transition-colors">
                    <cat.icon className="w-5 h-5 text-gray-400 group-hover:text-rose-gold transition-colors" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{cat.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{cat.count}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-soft" />
                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Launching soon!</span> Get early access by signing up.</p>
              </div>
              <div className="mt-5">
                <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  Get Early Access <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ BLOG / RESOURCES TEASER ━━━ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-3 tracking-wide uppercase">
                <Award className="w-3.5 h-3.5" /> Wedding Guides
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Free Wedding Planning Resources</h2>
              <p className="text-base sm:text-lg text-gray-500">Expert guides, budget breakdowns, and planning tips for Indian weddings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: 'Complete Indian Wedding Budget Guide 2026', desc: 'Plan every rupee — from venue to photography, with real cost data.', slug: 'indian-wedding-budget-guide-2026', emoji: '💰' },
                { title: 'How to Plan a Wedding Under ₹5 Lakh', desc: 'Budget-friendly strategies for a beautiful celebration without compromise.', slug: 'how-to-plan-wedding-under-5-lakhs-india', emoji: '✨' },
                { title: 'Last-Minute Wedding Checklist', desc: 'Essential tasks and timelines for the final weeks of planning.', slug: 'last-minute-wedding-checklist-30-days-before', emoji: '📋' },
              ].map((post, i) => (
                <Link key={i} to={`/blog/${post.slug}`} className="glass-card-hover p-6 group">
                  <span className="text-3xl block mb-3">{post.emoji}</span>
                  <h3 className="text-base font-serif font-bold text-gray-900 mb-2 group-hover:text-rose-gold transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{post.desc}</p>
                  <span className="text-sm font-semibold text-rose-gold flex items-center gap-1">
                    Read More <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                View All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ━━━ PRO TEASER ━━━ */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 bg-gradient-to-br from-plum/5 to-rose-gold/5">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum/10 text-plum text-xs font-semibold mb-4 tracking-wide uppercase">
              <Crown className="w-3.5 h-3.5" /> Coming Soon
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3">
              Wedora Pro — Premium Wedding Experience
            </h2>
            <p className="text-base text-gray-500 mb-6 max-w-lg mx-auto">
              Collaborative planning, premium invitation templates, video invitations, RSVP tracking, and AI-powered vendor negotiation tips.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-plum to-rose-gold text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              <Crown className="w-4 h-4" /> Join the Waitlist
            </Link>
          </div>
        </section>

        {/* ━━━ FINAL CTA ━━━ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass-card p-8 sm:p-12 bg-gradient-to-br from-rose-gold/5 via-white/90 to-plum/5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rose-gold/8 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-plum/8 blur-2xl" />
              <div className="relative">
                <div className="text-4xl mb-4">💒</div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">
                  Ready to Plan Your Dream Wedding?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                  Join thousands of Indian couples who planned stress-free weddings with Wedora — budgets, guests, vendors, timelines, and invitations. All free.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Start Planning Free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/create-invitation" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all">
                    Create Free Invitation <Mail className="w-5 h-5" />
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-4">No credit card • No hidden fees • Set up in under 2 minutes</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="py-10 sm:py-14 px-4 sm:px-6 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" fill="white" />
                </div>
                <span className="font-serif font-bold text-gray-900 text-lg">Wedora</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                India's most complete wedding planner — trusted by thousands of couples to plan their dream wedding.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Planning Tools</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/signup" className="hover:text-gray-700 transition-colors">Budget Tracker</Link></li>
                <li><Link to="/signup" className="hover:text-gray-700 transition-colors">Guest Manager</Link></li>
                <li><Link to="/signup" className="hover:text-gray-700 transition-colors">Task Checklist</Link></li>
                <li><Link to="/signup" className="hover:text-gray-700 transition-colors">Vendor Tracker</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Free Tools</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/wedding-budget-calculator" className="hover:text-gray-700 transition-colors">Budget Calculator 2026</Link></li>
                <li><Link to="/wedding-checklist" className="hover:text-gray-700 transition-colors">Interactive Checklist</Link></li>
                <li><Link to="/create-invitation" className="hover:text-gray-700 transition-colors">Invitation Creator</Link></li>
                <li><Link to="/blog/whatsapp-wedding-invitations-modern-trend-guide" className="hover:text-gray-700 transition-colors">WhatsApp Invitations</Link></li>
                <li><Link to="/blog/indian-wedding-budget-guide-2026" className="hover:text-gray-700 transition-colors">Budget Guide</Link></li>
                <li><Link to="/blog/wedding-photography-checklist-must-have-shots" className="hover:text-gray-700 transition-colors">Photography Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/blog" className="hover:text-gray-700 transition-colors">Blog</Link></li>
                <li><Link to="/login" className="hover:text-gray-700 transition-colors">Log In</Link></li>
                <li><Link to="/signup" className="hover:text-gray-700 transition-colors">Sign Up Free</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">© 2026 Wedora. Made with ❤️ in India.</p>
            <p className="text-xs text-gray-400">Wedding Planner · Budget Tracker · Guest Manager · Vendor Marketplace · Invitation Creator</p>
          </div>
        </div>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
