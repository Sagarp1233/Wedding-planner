import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { WEDDING_TYPES, generateBudgetCategories, generateTasks, generateEvents } from '../data/templates';
import { ArrowRight, ArrowLeft, MapPin, Calendar, Wallet, Users, Sparkles, Check } from 'lucide-react';
import { WedoraLogoCentered } from '../components/branding/WedoraLogo';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { markOnboarded, currentUser } = useAuth();
  const { dispatch } = useApp();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    partner1: '',
    partner2: '',
    weddingType: 'hindu',
    weddingDate: '',
    location: '',
    totalBudget: '',
    guestEstimate: '',
  });

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  function canProceed() {
    switch (step) {
      case 1: return form.partner1.trim() && form.partner2.trim();
      case 2: return form.weddingDate;
      case 3: return form.totalBudget && Number(form.totalBudget) > 0;
      case 4: return true;
      default: return false;
    }
  }

  function handleComplete() {
    const budget = Number(form.totalBudget) || 500000;
    const weddingData = {
      partner1: form.partner1.trim(),
      partner2: form.partner2.trim(),
      weddingDate: form.weddingDate,
      location: form.location.trim(),
      totalBudget: budget,
      weddingType: form.weddingType,
      guestEstimate: Number(form.guestEstimate) || 0,
    };

    const budgetCategories = generateBudgetCategories(budget);
    const tasks = generateTasks(form.weddingDate);
    const events = generateEvents(form.weddingDate, form.weddingType);

    dispatch({
      type: 'INIT_WEDDING',
      payload: {
        wedding: weddingData,
        budgetCategories,
        expenses: [],
        guests: [],
        tasks,
        events,
        vendors: [],
        inspirations: [],
      },
    });

    markOnboarded();
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blush to-ivory" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />

      <div className="relative w-full max-w-lg animate-fade-in-up">
        {/* Logo */}
        <div className="mb-6">
          <WedoraLogoCentered to="/" />
          <p className="text-sm text-gray-500 mt-4 text-center">
            Welcome, <span className="font-semibold text-gray-700">{currentUser?.name}</span>! Let's set up your wedding.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i + 1 < step ? 'bg-emerald-500 text-white' :
                i + 1 === step ? 'bg-gradient-to-br from-rose-gold to-plum text-white shadow-lg' :
                'bg-gray-100 text-gray-400'
              }`}>
                {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < TOTAL_STEPS - 1 && (
                <div className={`w-8 h-0.5 ${i + 1 < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Step 1: Couple Details */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-7 h-7 text-rose-gold" />
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-900">Who's Getting Married?</h2>
                <p className="text-sm text-gray-500 mt-1">Enter the names of the lucky couple</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">👰 Bride's Name</label>
                  <input
                    value={form.partner1}
                    onChange={e => setForm({ ...form, partner1: e.target.value })}
                    placeholder="e.g. Priya"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">🤵 Groom's Name</label>
                  <input
                    value={form.partner2}
                    onChange={e => setForm({ ...form, partner2: e.target.value })}
                    placeholder="e.g. Rahul"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">💒 Wedding Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {WEDDING_TYPES.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setForm({ ...form, weddingType: t.value })}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                          form.weddingType === t.value
                            ? 'border-rose-gold bg-rose-gold/5 text-rose-gold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{t.emoji}</span>
                        <span className="truncate">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Location */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7 text-amber-600" />
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-900">When & Where?</h2>
                <p className="text-sm text-gray-500 mt-1">Your wedding date and location</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="w-4 h-4 text-rose-gold" /> Wedding Date
                  </label>
                  <input
                    type="date"
                    value={form.weddingDate}
                    onChange={e => setForm({ ...form, weddingDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold outline-none transition-all text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 text-rose-gold" /> Location
                  </label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Udaipur, Rajasthan"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-3">
                  <Wallet className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-900">Budget & Guest Count</h2>
                <p className="text-sm text-gray-500 mt-1">We'll auto-allocate your budget to categories</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <Wallet className="w-4 h-4 text-rose-gold" /> Estimated Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={form.totalBudget}
                    onChange={e => setForm({ ...form, totalBudget: e.target.value })}
                    placeholder="e.g. 2500000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    {[500000, 1000000, 2500000, 5000000].map(amt => (
                      <button key={amt} type="button"
                        onClick={() => setForm({ ...form, totalBudget: String(amt) })}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          Number(form.totalBudget) === amt
                            ? 'border-rose-gold bg-rose-gold/5 text-rose-gold'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}>
                        ₹{(amt / 100000).toFixed(0)}L
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <Users className="w-4 h-4 text-rose-gold" /> Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    value={form.guestEstimate}
                    onChange={e => setForm({ ...form, guestEstimate: e.target.value })}
                    placeholder="e.g. 200"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7 text-violet-600" />
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-900">You're All Set!</h2>
                <p className="text-sm text-gray-500 mt-1">Confirm your details to start planning</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Couple</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {form.partner1} & {form.partner2}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Wedding Type</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {WEDDING_TYPES.find(t => t.value === form.weddingType)?.label || form.weddingType}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {form.weddingDate ? new Date(form.weddingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>
                {form.location && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-semibold text-gray-900">{form.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Budget</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{Number(form.totalBudget || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {form.guestEstimate && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-sm text-gray-500">Guests</span>
                    <span className="text-sm font-semibold text-gray-900">~{form.guestEstimate}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-emerald-700">
                  <span className="font-semibold">✨ We'll auto-generate:</span> Budget allocation across 11 categories, 21 planning tasks with smart deadlines, and ceremony timeline based on your wedding type.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button onClick={back}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <button onClick={next} disabled={!canProceed()}
                className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                <Sparkles className="w-4 h-4" /> Start Planning
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
