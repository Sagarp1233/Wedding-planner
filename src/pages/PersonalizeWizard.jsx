import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { generateBudgetCategories } from '../data/templates';
import {
  Heart, ArrowRight, ArrowLeft, Sparkles, Check,
  Wallet, Users, MapPin, Palette, HelpCircle
} from 'lucide-react';

const BUDGET_OPTIONS = [
  { value: 'under_5l', label: 'Under ₹5 Lakhs', emoji: '💰', amount: 500000 },
  { value: '5l_10l', label: '₹5L – ₹10L', emoji: '💎', amount: 750000 },
  { value: '10l_20l', label: '₹10L – ₹20L', emoji: '👑', amount: 1500000 },
  { value: '20l_plus', label: '₹20L+', emoji: '✨', amount: 2500000 },
];

const GUEST_OPTIONS = [
  { value: 'under_100', label: 'Under 100', emoji: '👥', desc: 'Intimate gathering' },
  { value: '100_300', label: '100 – 300', emoji: '🎉', desc: 'Medium celebration' },
  { value: '300_500', label: '300 – 500', emoji: '🏛️', desc: 'Grand wedding' },
  { value: '500_plus', label: '500+', emoji: '🎊', desc: 'Royal affair' },
];

const VENUE_OPTIONS = [
  { value: 'yes', label: 'Yes', emoji: '✅', desc: 'Already booked' },
  { value: 'no', label: 'No', emoji: '🔍', desc: 'Need to find one' },
  { value: 'exploring', label: 'Exploring', emoji: '💡', desc: 'Shortlisting options' },
];

const PLANNING_NEEDS = [
  { value: 'vendors', label: 'Finding Vendors', emoji: '🤝' },
  { value: 'budget', label: 'Budget Planning', emoji: '💰' },
  { value: 'guests', label: 'Guest Management', emoji: '👥' },
  { value: 'invitations', label: 'Invitations', emoji: '💌' },
  { value: 'full', label: 'Full Planning', emoji: '📋' },
];

const STYLE_OPTIONS = [
  { value: 'hindu', label: 'Hindu', emoji: '🙏' },
  { value: 'christian', label: 'Christian', emoji: '⛪' },
  { value: 'muslim', label: 'Muslim', emoji: '🌙' },
  { value: 'telugu', label: 'Telugu', emoji: '🪷' },
  { value: 'tamil', label: 'Tamil', emoji: '🏮' },
  { value: 'modern', label: 'Modern', emoji: '✨' },
  { value: 'destination', label: 'Destination', emoji: '✈️' },
  { value: 'other', label: 'Other', emoji: '💍' },
];

const TOTAL_STEPS = 5;

const STEP_CONFIG = [
  { icon: Wallet, title: 'What is your estimated budget?', subtitle: 'This helps us allocate your budget smartly', color: 'from-emerald-100 to-teal-100', iconColor: 'text-emerald-600' },
  { icon: Users, title: 'How many guests are expected?', subtitle: 'We\'ll help you plan seating and catering', color: 'from-blue-100 to-indigo-100', iconColor: 'text-blue-600' },
  { icon: MapPin, title: 'Have you booked a venue?', subtitle: 'We can suggest vendors near your location', color: 'from-amber-100 to-orange-100', iconColor: 'text-amber-600' },
  { icon: HelpCircle, title: 'What do you need help with?', subtitle: 'Select all that apply — we\'ll tailor your dashboard', color: 'from-pink-100 to-rose-100', iconColor: 'text-pink-600' },
  { icon: Palette, title: 'What\'s your wedding style?', subtitle: 'We\'ll customize your timeline and checklist', color: 'from-violet-100 to-purple-100', iconColor: 'text-violet-600' },
];

export default function PersonalizeWizard() {
  const navigate = useNavigate();
  const { currentUser, activeWeddingId, updateProfileField } = useAuth();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    budget_range: '',
    guest_count: '',
    venue_status: '',
    planning_needs: [],
    wedding_style: '',
    wedding_city: '',
  });

  function next() { if (step < TOTAL_STEPS) setStep(step + 1); }
  function back() { if (step > 1) setStep(step - 1); }

  function toggleNeed(value) {
    setForm(prev => ({
      ...prev,
      planning_needs: prev.planning_needs.includes(value)
        ? prev.planning_needs.filter(n => n !== value)
        : [...prev.planning_needs, value]
    }));
  }

  function canProceed() {
    switch (step) {
      case 1: return !!form.budget_range;
      case 2: return !!form.guest_count;
      case 3: return !!form.venue_status;
      case 4: return form.planning_needs.length > 0;
      case 5: return !!form.wedding_style;
      default: return false;
    }
  }

  async function handleComplete() {
    if (saving) return;
    setSaving(true);

    try {
      // 1. Save preferences to user profile
      await updateProfileField({
        budget_range: form.budget_range,
        guest_count: form.guest_count,
        venue_status: form.venue_status,
        planning_needs: form.planning_needs,
        wedding_style: form.wedding_style,
        onboarding_completed: true,
      });

      // 2. Update wedding record with the refined data if we have an active wedding
      if (activeWeddingId) {
        const budgetOption = BUDGET_OPTIONS.find(b => b.value === form.budget_range);
        const newBudget = budgetOption?.amount || 1000000;

        // Update wedding total_budget and style
        const updates = { total_budget: newBudget };
        if (form.wedding_style) updates.wedding_style = form.wedding_style;
        if (form.wedding_city) updates.location = form.wedding_city;

        await supabase.from('weddings').update(updates).eq('id', activeWeddingId);

        // 3. Regenerate budget categories with the new budget
        // Delete old categories and insert fresh ones
        await supabase.from('budget_categories').delete().eq('wedding_id', activeWeddingId);
        const newCategories = generateBudgetCategories(newBudget);
        if (newCategories.length > 0) {
          await supabase.from('budget_categories').insert(
            newCategories.map(c => ({
              wedding_id: activeWeddingId,
              name: c.name,
              icon: c.icon,
              color: c.color,
              allocated: c.allocated,
            }))
          );
        }
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('[Wedora] Personalization save error:', err);
      // Still navigate — data will be partially saved
      navigate('/dashboard', { replace: true });
    }
  }

  function handleSkip() {
    navigate('/dashboard', { replace: true });
  }

  const stepConfig = STEP_CONFIG[step - 1];
  const StepIcon = stepConfig.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blush to-ivory" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />

      <div className="relative w-full max-w-lg animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/20">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">Wedora</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Let's personalize your wedding plan <span className="text-base">💍</span>
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i + 1 < step ? 'bg-emerald-500 text-white scale-90' :
                i + 1 === step ? 'bg-gradient-to-br from-rose-gold to-plum text-white shadow-lg scale-110' :
                'bg-gray-100 text-gray-400'
              }`}>
                {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < TOTAL_STEPS - 1 && (
                <div className={`w-6 h-0.5 rounded transition-colors duration-300 ${i + 1 < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Step Header */}
          <div className="text-center mb-6 animate-fade-in" key={`header-${step}`}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stepConfig.color} flex items-center justify-center mx-auto mb-3`}>
              <StepIcon className={`w-7 h-7 ${stepConfig.iconColor}`} />
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900">{stepConfig.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{stepConfig.subtitle}</p>
          </div>

          {/* Step Content */}
          <div className="animate-fade-in-up" key={`content-${step}`}>
            {/* Step 1: Budget */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {BUDGET_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, budget_range: opt.value }))}
                    className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-200 group ${
                      form.budget_range === opt.value
                        ? 'border-rose-gold bg-gradient-to-br from-rose-gold/10 to-plum/5 shadow-md scale-[1.02]'
                        : 'border-gray-100 bg-white hover:border-rose-gold/40 hover:bg-rose-50/30'
                    }`}
                  >
                    <span className="text-2xl mb-2">{opt.emoji}</span>
                    <span className={`text-sm font-bold ${form.budget_range === opt.value ? 'text-rose-gold' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Guest Count */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {GUEST_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, guest_count: opt.value }))}
                    className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                      form.guest_count === opt.value
                        ? 'border-rose-gold bg-gradient-to-br from-rose-gold/10 to-plum/5 shadow-md scale-[1.02]'
                        : 'border-gray-100 bg-white hover:border-rose-gold/40 hover:bg-rose-50/30'
                    }`}
                  >
                    <span className="text-2xl mb-2">{opt.emoji}</span>
                    <span className={`text-sm font-bold ${form.guest_count === opt.value ? 'text-rose-gold' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Venue Status */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {VENUE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, venue_status: opt.value }))}
                      className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                        form.venue_status === opt.value
                          ? 'border-rose-gold bg-gradient-to-br from-rose-gold/10 to-plum/5 shadow-md scale-[1.02]'
                          : 'border-gray-100 bg-white hover:border-rose-gold/40 hover:bg-rose-50/30'
                      }`}
                    >
                      <span className="text-2xl mb-2">{opt.emoji}</span>
                      <span className={`text-sm font-bold ${form.venue_status === opt.value ? 'text-rose-gold' : 'text-gray-700'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
                {/* Wedding City inline */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 text-rose-gold" /> Wedding City
                  </label>
                  <input
                    value={form.wedding_city}
                    onChange={e => setForm(p => ({ ...p, wedding_city: e.target.value }))}
                    placeholder="e.g. Hyderabad, Mumbai, Jaipur"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                  />
                </div>
              </>
            )}

            {/* Step 4: Planning Needs (Multi-select) */}
            {step === 4 && (
              <div className="space-y-3">
                {PLANNING_NEEDS.map(opt => {
                  const selected = form.planning_needs.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleNeed(opt.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        selected
                          ? 'border-rose-gold bg-gradient-to-r from-rose-gold/10 to-plum/5 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-rose-gold/40 hover:bg-rose-50/30'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                      <span className={`text-sm font-bold flex-1 ${selected ? 'text-rose-gold' : 'text-gray-700'}`}>
                        {opt.label}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected ? 'border-rose-gold bg-rose-gold' : 'border-gray-300'
                      }`}>
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 5: Wedding Style */}
            {step === 5 && (
              <div className="grid grid-cols-2 gap-3">
                {STYLE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, wedding_style: opt.value }))}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 text-left ${
                      form.wedding_style === opt.value
                        ? 'border-rose-gold bg-gradient-to-r from-rose-gold/10 to-plum/5 shadow-md scale-[1.02]'
                        : 'border-gray-100 bg-white hover:border-rose-gold/40 hover:bg-rose-50/30'
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className={`text-sm font-bold ${form.wedding_style === opt.value ? 'text-rose-gold' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <button onClick={handleComplete} disabled={saving || !canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Personalizing...
                  </span>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Personalize My Plan</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-5">
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
