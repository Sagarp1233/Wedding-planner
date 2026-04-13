import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';

export default function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-md">
            <Heart className="w-4.5 h-4.5 text-white" fill="white" />
          </div>
          <span className="text-xl font-serif font-bold text-gray-900">Wedora</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <a href="/#features" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">Features</a>
          <a href="/#how-it-works" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">How It Works</a>
          <a href="/#free-tools" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">Free Tools</a>
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
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in shadow-lg">
          <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Features</a>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">How It Works</a>
          <a href="/#free-tools" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Free Tools</a>
          <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Blog</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Log In</Link>
          <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">Start Planning Free</Link>
        </div>
      )}
    </nav>
  );
}
