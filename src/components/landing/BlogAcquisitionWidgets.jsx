import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, X, HeartHandshake } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export default function BlogAcquisitionWidgets() {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show sticky CTA after scrolling down
    const handleScroll = () => {
      if (window.scrollY > 400 && !showSticky) {
        setShowSticky(true);
      }
    };

    // Exit intent detection
    const handleMouseLeave = (e) => {
      // If cursor leaves top of screen
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        const hasSeen = sessionStorage.getItem('exit_intent_seen');
        if (!hasSeen && !submitted) {
          setShowExitIntent(true);
          sessionStorage.setItem('exit_intent_seen', 'true');
          trackEvent('exit_intent_displayed');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Adding exit intent to mouseout
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showSticky, submitted]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    trackEvent('checklist_downloaded', { email });
    setSubmitted(true);
    setTimeout(() => {
      setShowExitIntent(false);
    }, 3000);
  };

  return (
    <>
      {/* Sticky Bottom CTA */}
      <div 
        className={`fixed bottom-6 right-6 z-[60] transition-all duration-500 transform ${
          showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <Link 
          to="/create-invitation"
          onClick={() => trackEvent('sticky_cta_clicked')}
          className="group flex items-center gap-3 bg-white p-2 rounded-full shadow-2xl shadow-rose-gold/20 border border-gray-100 hover:border-gray-200 transition-all hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center text-white shrink-0 shadow-inner">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="pr-4 hidden md:block">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5">Free Tool</p>
            <p className="text-sm font-semibold text-gray-900 group-hover:text-rose-gold transition-colors">Create Digital Invite</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 mr-3 hidden md:block group-hover:text-rose-gold transition-colors" />
        </Link>
      </div>

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 md:p-10 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <HeartHandshake className="w-8 h-8 text-rose-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
                Wait! Planning a wedding?
              </h3>
              <p className="text-gray-600 mb-8">
                Don't leave without our <strong className="text-rose-gold">Free Ultimate Indian Wedding Checklist (PDF)</strong>. Join 5,000+ couples planning stress-free.
              </p>
              
              {submitted ? (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center justify-center gap-2 animate-fade-in">
                  <HeartHandshake className="w-5 h-5" />
                  <span className="font-medium">Checklist sent! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-rose-gold to-plum text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-gold/20 transition-all hover:-translate-y-0.5"
                  >
                    Send me the Free Checklist
                  </button>
                </form>
              )}
              <p className="text-xs text-gray-400 mt-4">We respect your privacy. No spam ever.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
