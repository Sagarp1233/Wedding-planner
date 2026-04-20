import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Heart, ArrowRight, Mail, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { setSEO, clearArticleJsonLd, clearHomepageJsonLd } from '../lib/seo';
import { ensureHttps } from '../utils/ensureHttps';
import InvitationGenerator from '../components/landing/InvitationGenerator';

const SAMPLE_INVITATIONS = [
  { id: 'hindu', name: 'Hindu Style', image: '/templates/hindu.png' },
  { id: 'christian', name: 'Christian Style', image: '/templates/christian.png' },
  { id: 'muslim', name: 'Muslim Style', image: '/templates/muslim.png' },
  { id: 'telugu', name: 'Telugu Style', image: '/templates/telugu.png' },
  { id: 'modern', name: 'Modern Style', image: '/templates/modern.png' },
];

export default function CreateInvitationPage() {
  useEffect(() => {
    const origin = ensureHttps((import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, ''));
    clearArticleJsonLd();
    clearHomepageJsonLd();
    setSEO({
      title: 'Free Wedding Invitation Creator — Design & Share on WhatsApp | Wedora',
      description: 'Create beautiful wedding invitations in Hindu, Christian, Muslim, Telugu & Modern styles. Download or share directly on WhatsApp. 100% free!',
      keywords: 'free wedding invitation maker, wedding card creator, WhatsApp wedding invitation, Hindu wedding card, Muslim nikah invitation, Telugu wedding invitation, online wedding card maker',
      canonicalUrl: `${origin}/create-invitation`,
      ogType: 'website',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <link rel="canonical" href="https://wedora.in/create-invitation" />
      </Helmet>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-md">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">Wedora</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg shadow-rose-gold/25 hover:shadow-xl transition-all hover:-translate-y-0.5">
              Start Planning Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Sample Invitation Previews — moved from homepage */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 bg-gray-50/50 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">5 Beautiful Template Styles</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Sample Invitation Previews</h2>
            </div>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {SAMPLE_INVITATIONS.map(inv => (
                <a
                  key={inv.id}
                  href="#invitation-generator"
                  className="snap-center shrink-0 w-44 sm:w-52 group"
                >
                  <div className="rounded-2xl overflow-hidden shadow-lg shadow-black/10 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 border border-white/50">
                    <img src={inv.image} alt={`${inv.name} wedding invitation template`} className="w-full aspect-[3/4.25] object-cover" loading="lazy" />
                  </div>
                  <p className="text-center text-xs sm:text-sm font-medium text-gray-600 mt-3">{inv.name}</p>
                </a>
              ))}
            </div>
            <div className="text-center mt-4">
              <a href="#invitation-generator" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-gold hover:underline">
                Create yours below <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Invitation Generator */}
        <InvitationGenerator />

        {/* Upsell — Plan your wedding */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-rose-gold/5 to-plum/5">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-3xl mb-3">💒</div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-4">
              Love your invitation? Plan your entire wedding with Wedora!
            </h2>
            <p className="text-gray-500 mb-6">
              Sign up free to manage budgets, guests, vendors, timelines, and checklists — all in one dashboard. No spreadsheets, no chaos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                Start Planning Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
                Explore Wedora <Heart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="font-serif font-bold text-gray-900">Wedora</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-gray-700 transition-colors">Blog</Link>
            <Link to="/signup" className="hover:text-gray-700 transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 Wedora. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  );
}
