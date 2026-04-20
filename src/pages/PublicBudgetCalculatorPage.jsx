import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft, ArrowRight, PieChart, Info, ShieldCheck, Banknote } from 'lucide-react';
import { setSEO } from '../lib/seo';
import PublicNav from '../components/layout/PublicNav';

// ── Configuration ─────────────────────────────────────────────────────────────
const MIN_BUDGET = 300000;
const MAX_BUDGET = 10000000;
const DEFAULT_BUDGET = 1500000;

// Standard Indian wedding budget allocation rules (matches Blog advice somewhat)
const CATEGORIES = [
  { id: 'venue', label: 'Venue & Catering', pct: 0.40, color: 'from-amber-400 to-orange-500' },
  { id: 'photo', label: 'Photography & Video', pct: 0.12, color: 'from-sky-400 to-blue-500' },
  { id: 'decor', label: 'Decor & Light', pct: 0.12, color: 'from-pink-400 to-rose-500' },
  { id: 'attire', label: 'Bridal & Groom Attire', pct: 0.10, color: 'from-fuchsia-400 to-purple-500' },
  { id: 'jewel', label: 'Jewellery', pct: 0.10, color: 'from-yellow-400 to-amber-500' },
  { id: 'misc', label: 'Logistics, Invites & Buffer', pct: 0.16, color: 'from-gray-400 to-slate-500' },
];

function formatINR(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

export default function PublicBudgetCalculatorPage() {
  const [totalBudget, setTotalBudget] = useState(DEFAULT_BUDGET);

  useEffect(() => {
    setSEO({
      title: 'Indian Wedding Budget Calculator 2026 | Free Tool | Wedora',
      description: 'Calculate your Indian wedding budget instantly. Specify your total amount and see the exact breakdown for venue, decor, photography, and more. 100% free.',
      keywords: 'wedding budget calculator india, indian wedding budget planner, marriage expense calculator',
    });
  }, []);

  const handleSliderChange = (e) => {
    setTotalBudget(Number(e.target.value));
  };

  // Preset buttons
  const setPreset = (val) => setTotalBudget(val);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <PublicNav />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-plum rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            Wedding Budget Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Find out exactly how to split your wedding budget across venue, photography, decor, and fashion. Based on data from 5,000+ Indian weddings.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Input */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-rose-gold/10 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-rose-gold" />
              What is your total budget?
            </h2>
            
            <div className="mb-8">
              <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1">Total Limit</span>
                <span className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                  {formatINR(totalBudget)}
                </span>
              </div>
              
              <input 
                type="range"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step={100000}
                value={totalBudget}
                onChange={handleSliderChange}
                className="w-full h-2 bg-rose-gold/20 rounded-lg appearance-none cursor-pointer accent-rose-gold"
              />
              <div className="flex justify-between mt-2 text-xs font-semibold text-gray-400">
                <span>₹3L</span>
                <span>₹1Cr+</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-600 mb-3">Popular targets:</p>
              <div className="flex flex-wrap gap-2">
                {[500000, 1000000, 1500000, 3000000, 5000000].map(val => (
                  <button
                    key={val}
                    onClick={() => setPreset(val)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      totalBudget === val 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                    }`}
                  >
                    {val >= 10000000 ? `${val/10000000}Cr` : `${val/100000}L`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h3 className="text-sm font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Ready to track real expenses?
              </h3>
              <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                Don't just estimate. Use our free dashboard to log advances, track pending vendor payments, and avoid going broke!
              </p>
              <Link to="/signup" className="block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold text-center rounded-xl transition-colors shadow-sm">
                Start Tracking Free
              </Link>
            </div>
          </div>

          {/* Right Column: Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-plum" />
              Recommended Breakdown
            </h2>

            {CATEGORIES.map(cat => {
              const amount = totalBudget * cat.pct;
              return (
                <div key={cat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                  <div className={`w-3 h-12 rounded-full bg-gradient-to-b ${cat.color} shrink-0`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <h3 className="font-bold text-gray-900">{cat.label}</h3>
                      <span className="text-lg font-bold text-gray-700">{formatINR(amount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Suggested allocation</span>
                      <span className="font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{(cat.pct * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-8 p-6 bg-gradient-to-br from-rose-gold/10 to-plum/10 rounded-[2rem] border border-rose-gold/20 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Want to customize this?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Every wedding is different. Create a free Wedora account to adjust these percentages, add custom categories, and share access with your partner or parents.
                </p>
              </div>
              <Link to="/signup" className="shrink-0 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:-translate-y-1">
                Customize Budget
              </Link>
            </div>
            
          </div>
        </div>

        {/* SEO Text Content */}
        <article className="mt-20 prose prose-lg max-w-4xl mx-auto text-gray-700 leading-relaxed">
          <h2 className="font-serif text-3xl font-bold text-gray-900">How to use our Indian Wedding Budget Calculator</h2>
          <p>
            Planning a wedding in India comes with unique expenses. While western calculators focus heavily on alcohol and DJ costs, our <strong>Indian wedding budget planner</strong> is built specifically to address heavy catering costs, multiple functions (Mehendi, Haldi, Sangeet), heavy gold jewellery, and large guest counts.
          </p>
          <h3 className="font-serif text-2xl font-bold text-gray-900">The 40% Venue & Catering Rule</h3>
          <p>
            For almost every Indian wedding, the venue and the food will consume roughly 40% to 50% of your total budget. This depends heavily on your <strong>guest count</strong>. If you are trying to lower your budget, the absolute fastest way is to reduce the guest list, which instantly drops venue size requirements and per-plate catering costs.
          </p>
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 my-8 not-prose">
            <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-2"><Info className="w-5 h-5"/> Hidden Expenses to Watch Out For:</h4>
            <ul className="list-disc pl-5 text-rose-800 space-y-1 text-sm">
              <li>Vendor travel and accommodation (if booking out-of-town artists)</li>
              <li>GST on services (often 18% added at the last minute)</li>
              <li>Generator runs and extra lighting costs at venues</li>
              <li>Gifts for extended family (Milni/Shagun)</li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}
