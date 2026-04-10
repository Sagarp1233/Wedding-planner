import { Link } from 'react-router-dom';
import { Heart, Wallet, Users, CheckSquare, CalendarHeart, Camera, Star, ArrowRight, Sparkles, ShieldCheck, Store, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  { icon: Wallet, title: 'Smart Budget', desc: 'Track every rupee with auto-allocated categories, charts, and over-budget warnings.', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200/50' },
  { icon: Users, title: 'Guest Manager', desc: 'Manage RSVPs, plus-ones, dietary needs, and export your guest list instantly.', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50' },
  { icon: CheckSquare, title: 'Planning Checklist', desc: 'Auto-generated tasks with smart deadlines based on your wedding date.', color: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-200/50' },
  { icon: CalendarHeart, title: 'Event Timeline', desc: 'Visualize every ceremony from engagement to reception on a beautiful timeline.', color: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-200/50' },
  { icon: Store, title: 'Vendor Tracker', desc: 'Keep tabs on all your vendors — costs, payments, contacts, and status.', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50' },
  { icon: Camera, title: 'Inspiration Board', desc: 'Collect and organize your wedding inspiration in one beautiful mood board.', color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-200/50' },
];

const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up with your name and email — takes 30 seconds.', emoji: '✨' },
  { num: '02', title: 'Set Up Your Wedding', desc: 'Enter your partner details, date, and budget. We auto-set everything up.', emoji: '💍' },
  { num: '03', title: 'Start Planning', desc: 'Use your personalized dashboard, checklist, and tools. All free!', emoji: '🎉' },
];

const TESTIMONIALS = [
  { name: 'Ananya & Rohan', location: 'Mumbai', text: 'Wedora made our wedding planning stress-free! The budget tracker alone saved us ₹2 lakh.', avatar: '👩‍❤️‍👨' },
  { name: 'Meera & Arjun', location: 'Bangalore', text: 'We loved the auto-generated checklist. No more forgetting tasks — everything was organized perfectly.', avatar: '💑' },
  { name: 'Priti & Sahil', location: 'Delhi', text: 'The vendor tracker is a game-changer. We tracked 15+ vendors without a single spreadsheet!', avatar: '👫' },
];

const STATS = [
  { value: '10,000+', label: 'Couples trust us' },
  { value: '₹500Cr+', label: 'Budgets managed' },
  { value: '4.9★', label: 'Average rating' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-md">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">Wedora</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/blog" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Blog
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg shadow-rose-gold/25 hover:shadow-xl hover:shadow-rose-gold/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in">
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              Blog
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              Log In
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-br from-rose-gold/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/10 border border-rose-gold/20 mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-rose-gold" />
            <span className="text-xs sm:text-sm font-medium text-rose-gold">100% Free · No Credit Card Required</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.15] mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Plan Your{' '}
            <span className="gradient-text">Dream</span>
            <br className="sm:hidden" />{' '}
            <span className="gradient-text">Wedding</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 px-2 animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms' }}>
            The all-in-one wedding planner trusted by thousands of Indian couples. Manage budgets, guests, vendors, and timelines — all in one beautiful place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/signup" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:shadow-rose-gold/30 transition-all hover:-translate-y-1 active:translate-y-0 text-center flex items-center justify-center gap-2">
              Start Planning Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all text-center">
              See Features
            </a>
          </div>

          {/* Stats row (replacing trust badges on mobile for better layout) */}
          <div className="grid grid-cols-3 gap-4 mt-10 sm:mt-14 max-w-md sm:max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '500ms' }}>
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-lg sm:text-2xl font-serif font-bold gradient-text">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Trust badges - shown below stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-6 text-xs sm:text-sm text-gray-400 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Secure & Private</span>
            <span className="hidden sm:inline">•</span>
            <span>🇮🇳 Made for Indian Weddings</span>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold mb-3 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">Six powerful tools to plan your perfect wedding — from budget to inspiration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className={`glass-card-hover p-5 sm:p-6 group`}>
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg ${f.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-3 tracking-wide uppercase">
              <Heart className="w-3.5 h-3.5" /> How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Get Started in Minutes</h2>
            <p className="text-base sm:text-lg text-gray-500">Three simple steps to your organized, stress-free wedding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center relative">
                {i < STEPS.length - 1 && (
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
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-blush to-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold mb-3 tracking-wide uppercase">
              <Star className="w-3.5 h-3.5" fill="currentColor" /> Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Loved by Couples</h2>
            <p className="text-base sm:text-lg text-gray-500">Real stories from real couples who planned with Wedora.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card p-5 sm:p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-8 sm:p-12 bg-gradient-to-br from-rose-gold/5 via-white/90 to-plum/5 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rose-gold/8 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-plum/8 blur-2xl" />

            <div className="relative">
              <div className="text-4xl mb-4">💒</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">
                Ready to Start Planning?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                Join thousands of couples and plan your dream wedding — completely free!
              </p>
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:shadow-rose-gold/30 transition-all hover:-translate-y-1 active:translate-y-0">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-gray-400 mt-4">No credit card • No hidden fees • Start in under 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="font-serif font-bold text-gray-900">Wedora</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-700 transition-colors">Features</a>
            <Link to="/blog" className="hover:text-gray-700 transition-colors">Blog</Link>
            <Link to="/login" className="hover:text-gray-700 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-gray-700 transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 Wedora. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  );
}
