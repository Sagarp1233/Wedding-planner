import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px (past hero)
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden animate-slide-up">
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/80 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <Link
          to="/signup"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg shadow-rose-gold/25"
        >
          <Sparkles className="w-4 h-4" />
          Start Planning Your Wedding Free
        </Link>
      </div>
    </div>
  );
}
