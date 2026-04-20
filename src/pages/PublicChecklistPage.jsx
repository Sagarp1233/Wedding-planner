import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Save, Clock, Download, Share2, Info } from 'lucide-react';
import { setSEO } from '../lib/seo';
import { trackEvent } from '../utils/analytics';
import PublicNav from '../components/layout/PublicNav';

const DEFAULT_CHECKLIST = [
  { id: 'c1', label: 'Set initial wedding budget', phase: '12+ Months Before', checked: false },
  { id: 'c2', label: 'Draft preliminary guest list', phase: '12+ Months Before', checked: false },
  { id: 'c3', label: 'Hire a wedding planner (optional)', phase: '12+ Months Before', checked: false },
  { id: 'c4', label: 'Shortlist and book venue', phase: '10-12 Months Before', checked: false },
  { id: 'c5', label: 'Book photographer and videographer', phase: '10-12 Months Before', checked: false },
  { id: 'c6', label: 'Book caterer (if not included with venue)', phase: '8-10 Months Before', checked: false },
  { id: 'c7', label: 'Shop for bridal outfit (lehenga/saree)', phase: '6-8 Months Before', checked: false },
  { id: 'c8', label: 'Book Makeup Artist (MUA)', phase: '6-8 Months Before', checked: false },
  { id: 'c9', label: 'Book Decorator', phase: '6-8 Months Before', checked: false },
  { id: 'c10', label: 'Finalize guest list and gather addresses', phase: '4-6 Months Before', checked: false },
  { id: 'c11', label: 'Create digital invitations', phase: '4-6 Months Before', checked: false },
  { id: 'c12', label: 'Send out invitations / Save the dates', phase: '2-4 Months Before', checked: false },
  { id: 'c13', label: 'Buy wedding rings / Mangalsutra', phase: '2-4 Months Before', checked: false },
  { id: 'c14', label: 'Finalize menu tasting', phase: '1-2 Months Before', checked: false },
  { id: 'c15', label: 'Confirm all vendor timings and final payments', phase: '1-2 Weeks Before', checked: false },
];

export default function PublicChecklistPage() {
  const [items, setItems] = useState(DEFAULT_CHECKLIST);

  useEffect(() => {
    setSEO({
      title: 'Ultimate Indian Wedding Checklist 2026 | Free Timeline Planner | Wedora',
      description: 'The most comprehensive Indian wedding checklist and timeline planner. Track tasks from 12 months out to the big day. Interactive, free, and printable.',
      keywords: 'indian wedding checklist, wedding planning timeline, marriage tasks schedule',
    });
  }, []);

  const toggleCheck = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    trackEvent('public_checklist_toggled');
  };

  const completedCount = items.filter(i => i.checked).length;
  const progress = (completedCount / items.length) * 100;

  // Group items by phase
  const phases = [...new Set(items.map(i => i.phase))];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <PublicNav />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-10">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">Free Interactive Tool</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            The Ultimate Indian Wedding Checklist
          </h1>
          <p className="text-lg text-gray-600">
            A step-by-step interactive timeline to keep your wedding planning completely stress-free. Don't forget a single detail.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Main Checklist Body */}
          <div className="lg:col-span-8 space-y-8">
            {phases.map(phase => (
              <div key={phase} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                  <Clock className="w-5 h-5 text-plum" />
                  {phase}
                </h2>
                <div className="space-y-3">
                  {items.filter(i => i.phase === phase).map(item => (
                    <label 
                      key={item.id} 
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors border ${
                        item.checked ? 'bg-indigo-50/50 border-indigo-100/50' : 'bg-gray-50/50 border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 cursor-pointer"
                        />
                      </div>
                      <span className={`text-base flex-1 transition-all ${item.checked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            {/* Progress Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/20 border border-indigo-50">
              <h3 className="font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-gold to-plum h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {completedCount} of {items.length} tasks completed
              </p>

              <hr className="my-6 border-gray-100" />
              
              <div className="flex bg-amber-50 p-4 rounded-2xl border border-amber-100 gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  <strong>Warning:</strong> This progress will be lost if you close your browser. Create a free Wedora account to securely save your checklist and get email reminders.
                </p>
              </div>

              <Link to="/signup" className="mt-5 w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save My Checklist
              </Link>
            </div>

            {/* Cross-Promo Card */}
            <div className="bg-gradient-to-br from-rose-gold/10 to-plum/10 rounded-3xl p-6 border border-rose-gold/20">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">Next Step: Budgeting</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have you figured out how much to allocate to your venue vs photography? Use our free budget calculator.
              </p>
              <Link to="/wedding-budget-calculator" className="w-full py-3 bg-white text-gray-900 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Open Budget Calculator
              </Link>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
