import { Link } from 'react-router-dom';
import { Heart, Wallet, Users, CheckSquare, CalendarHeart, Camera, Star, ArrowRight, Sparkles, ShieldCheck, Store } from 'lucide-react';

const FEATURES = [
  { icon: Wallet, title: 'Smart Budget', desc: 'Track every rupee with auto-allocated categories, donut charts, and over-budget warnings.', color: 'from-emerald-400 to-teal-500' },
  { icon: Users, title: 'Guest Manager', desc: 'Manage RSVPs, plus-ones, dietary needs, and export your guest list instantly.', color: 'from-blue-400 to-indigo-500' },
  { icon: CheckSquare, title: 'Planning Checklist', desc: 'Auto-generated tasks with smart deadlines based on your wedding date.', color: 'from-purple-400 to-violet-500' },
  { icon: CalendarHeart, title: 'Event Timeline', desc: 'Visualize every ceremony from engagement to reception on a beautiful timeline.', color: 'from-rose-400 to-pink-500' },
  { icon: Store, title: 'Vendor Tracker', desc: 'Keep tabs on all your vendors — costs, payments, contacts, and status.', color: 'from-amber-400 to-orange-500' },
  { icon: Camera, title: 'Inspiration Board', desc: 'Collect and organize your wedding inspiration in one beautiful mood board.', color: 'from-cyan-400 to-blue-500' },
];

const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up with your name and email — takes 30 seconds.' },
  { num: '02', title: 'Set Up Your Wedding', desc: 'Enter your partner details, date, and budget. We auto-set everything up.' },
  { num: '03', title: 'Start Planning', desc: 'Use your personalized dashboard, checklist, and tools. All free!' },
];

const TESTIMONIALS = [
  { name: 'Ananya & Rohan', location: 'Mumbai', text: 'WedPlanner made our wedding planning stress-free! The budget tracker alone saved us ₹2 lakh.', avatar: '👩‍❤️‍👨' },
  { name: 'Meera & Arjun', location: 'Bangalore', text: 'We loved the auto-generated checklist. No more forgetting tasks — everything was organized perfectly.', avatar: '💑' },
  { name: 'Priti & Sahil', location: 'Delhi', text: 'The vendor tracker is a game-changer. We tracked 15+ vendors without a single spreadsheet!', avatar: '👫' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">WedPlanner</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-gold/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/10 border border-rose-gold/20 mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-rose-gold" />
            <span className="text-sm font-medium text-rose-gold">100% Free · No Credit Card Required</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Plan Your <span className="gradient-text">Dream Wedding</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            The all-in-one wedding planner trusted by thousands of Indian couples. Manage budgets, guests, vendors, and timelines — all in one beautiful place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/signup" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-center flex items-center justify-center gap-2">
              Start Planning Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all text-center">
              See Features
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-gray-400 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure & Private</span>
            <span>•</span>
            <span>🇮🇳 Made for Indian Weddings</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" fill="currentColor" /> 4.9/5 Rating</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">Six powerful tools to plan your perfect wedding — from budget to inspiration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card-hover p-6 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Get Started in Minutes</h2>
            <p className="text-lg text-gray-500">Three simple steps to your organized, stress-free wedding planning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-rose-gold/30 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-gold/10 to-plum/5 flex items-center justify-center mx-auto mb-4 border border-rose-gold/15">
                  <span className="text-2xl font-serif font-bold gradient-text">{s.num}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-blush to-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Loved by Couples</h2>
            <p className="text-lg text-gray-500">Real stories from real couples who planned with WedPlanner.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card p-6">
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 bg-gradient-to-br from-rose-gold/5 via-white/90 to-plum/5">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
              Ready to Start Planning?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of couples and plan your dream wedding — completely free!
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-gray-400 mt-4">No credit card • No hidden fees • Start in under 2 minutes</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="font-serif font-bold text-gray-900">WedPlanner</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-700 transition-colors">Features</a>
            <Link to="/login" className="hover:text-gray-700 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-gray-700 transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 WedPlanner. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  );
}
