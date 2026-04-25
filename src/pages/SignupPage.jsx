import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  User, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, 
  Building2, MapPin, Phone, Heart, Store, Calendar, Wallet, Users, Check 
} from 'lucide-react';
import PublicNav from '../components/layout/PublicNav';
import { VENDOR_CATEGORIES, WEDDING_TYPES, generateBudgetCategories, generateTasks, generateEvents } from '../data/templates';
import HowItWorks from '../components/landing/HowItWorks';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, signInWithGoogle, refreshSessionAndOnboarding } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('couple');
  const [form, setForm] = useState({ 
    name: '',          // Couple: Full Name, Vendor: Full Name
    partner2: '',      // Couple: Partner Name
    email: '', 
    password: '', 
    businessName: '',  // Vendor
    category: 'venue', // Vendor
    city: '',          // Common: Vendor City / Couple Wedding City
    phone: '',         // Vendor
    weddingDate: '',   // Couple
    weddingType: 'hindu', // Couple
    totalBudget: '',   // Couple
    guestEstimate: ''  // Couple
  });
  
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function nextStep() {
    setStep(2);
    setError('');
  }

  function prevStep() {
    setStep(1);
    setError('');
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setError('');

    // Validation
    if (!form.name.trim()) return setError('Please enter your full name');
    if (!form.email.trim()) return setError('Please enter your email');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    if (role === 'couple') {
      if (!form.partner2.trim()) return setError('Please enter your partner\'s name');
      if (!form.weddingDate) return setError('Please select a wedding date');
    }

    if (role === 'vendor') {
      if (!form.businessName.trim()) return setError('Please enter your business name');
      if (!form.city.trim()) return setError('Please enter your city');
      if (!form.phone.trim()) return setError('Please enter your WhatsApp/Phone number');
    }

    setLoading(true);
    try {
      let vendorData = null;
      if (role === 'vendor') {
        vendorData = {
          businessName: form.businessName.trim(),
          category: form.category,
          city: form.city.trim(),
          phone: form.phone.trim()
        };
      }

      const result = await signup(form.name.trim(), form.email.trim(), form.password, role, vendorData);
      
      if (result.success) {
        if (role === 'couple') {
          // Immediately setup wedding data so they can go to dashboard
          try {
            const budget = 1000000; // Default: ₹10L — user will customize in PersonalizeWizard
            const uid = result.user.id;
            
            const { data: newWedding, error: wedErr } = await supabase.from('weddings').insert({
              user_id: uid,
              partner1: form.name.trim() || 'Partner 1',
              partner2: form.partner2.trim() || 'Partner 2',
              wedding_date: form.weddingDate,
              location: '',
              wedding_style: 'hindu',
              total_budget: budget,
            }).select('*').single();

            if (wedErr) throw wedErr;

            const newWeddingId = newWedding.id;
            const budgetCategories = generateBudgetCategories(budget);
            const tasks = generateTasks(form.weddingDate);
            const events = generateEvents(form.weddingDate, 'hindu');

            const insertPromises = [];
            if (budgetCategories.length > 0) insertPromises.push(supabase.from('budget_categories').insert(budgetCategories.map(c => ({ wedding_id: newWeddingId, name: c.name, icon: c.icon, color: c.color, allocated: c.allocated }))));
            if (tasks.length > 0) insertPromises.push(supabase.from('tasks').insert(tasks.map(t => ({ wedding_id: newWeddingId, title: t.title, notes: t.description || '', due_date: t.deadline || '', status: t.status }))));
            if (events.length > 0) insertPromises.push(supabase.from('timeline_events').insert(events.map(e => ({ wedding_id: newWeddingId, start_time: e.time || '', name: e.name || 'Event', notes: e.description || '', venue: e.location || '', date: e.date || new Date().toISOString().split('T')[0] }))));
            await Promise.all(insertPromises);

            await refreshSessionAndOnboarding();
            navigate('/personalize', { replace: true });
          } catch (e) {
            console.error('[Wedora] Automagic onboarding failed during signup:', e);
            // Fallback: Send to standard onboarding page in rare failure mode
            await refreshSessionAndOnboarding();
            navigate('/onboarding', { replace: true }); 
          }
        } else {
          // Vendor
          await refreshSessionAndOnboarding();
          navigate('/vendor/dashboard', { replace: true });
        }
      } else {
        setError(result.error || 'Failed to sign up');
      }
    } catch(err) {
      setError('An error occurred');
    } finally {
      if(!error) setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-x-hidden overflow-y-auto bg-white">
      <PublicNav />
      {/* Premium Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-blush to-ivory -z-10" />
      <div className="fixed -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl -z-10" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl -z-10" />

      <div className="relative w-full max-w-[440px] animate-fade-in-up mt-8">
        
        {/* Progress Display */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'w-6 bg-rose-gold' : 'bg-gray-200'}`} />
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'w-6 bg-rose-gold' : 'bg-gray-200'}`} />
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {step} of 2</span>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl p-8 relative overflow-hidden">
          
          {/* Internal Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/5 rounded-full blur-3xl -z-10 mix-blend-multiply" />
          
          {step === 1 ? (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-gold to-plum mb-2">Welcome to Wedora</h1>
                <p className="text-sm text-gray-500 max-w-[280px] mx-auto">Plan your dream wedding or grow your wedding business</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setRole('couple')}
                  className={`w-full flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-300 ease-out group ${
                    role === 'couple' 
                      ? 'border-rose-400 bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-pink-500/30 scale-[1.02]' 
                      : 'border-gray-100 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center transition-colors ${role === 'couple' ? 'bg-white/20 text-white shadow-inner' : 'bg-gray-100 text-gray-400 group-hover:bg-rose-100 group-hover:text-rose-500'}`}>
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className={`font-bold ${role === 'couple' ? 'text-white' : 'text-gray-700'}`}>Couple</div>
                    <div className={`text-xs mt-1 ${role === 'couple' ? 'text-rose-50' : 'text-gray-500'}`}>Plan your wedding</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`w-full flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-300 ease-out group ${
                    role === 'vendor' 
                      ? 'border-violet-500 bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/30 scale-[1.02]' 
                      : 'border-gray-100 bg-white hover:border-violet-300 hover:bg-violet-50/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center transition-colors ${role === 'vendor' ? 'bg-white/20 text-white shadow-inner' : 'bg-gray-100 text-gray-400 group-hover:bg-violet-100 group-hover:text-violet-600'}`}>
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className={`font-bold ${role === 'vendor' ? 'text-white' : 'text-gray-700'}`}>Vendor</div>
                    <div className={`text-xs mt-1 ${role === 'vendor' ? 'text-violet-50' : 'text-gray-500'}`}>Grow your business</div>
                  </div>
                </button>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group bg-gray-900 hover:bg-black shadow-lg shadow-gray-900/20"
              >
                Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400 font-medium">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signInWithGoogle(role)}
                className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <button 
                type="button" 
                onClick={prevStep}
                className="absolute top-8 left-8 p-1 text-gray-400 hover:text-gray-800 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center mb-6 pt-1">
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  {role === 'couple' ? 'Couple Details' : 'Business Details'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">Let's set up your account</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50/80 border border-red-100 text-sm text-red-600 animate-fade-in flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {role === 'couple' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Partner 1's Name"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="relative">
                          <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" value={form.partner2} onChange={e => setForm({ ...form, partner2: e.target.value })}
                            placeholder="Partner 2's Name"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="date" value={form.weddingDate} onChange={e => setForm({ ...form, weddingDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white text-gray-600"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                      />
                    </div>
                    
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                        placeholder="Business Name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                          className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white text-gray-600"
                        >
                          {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                        </select>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                          placeholder="City"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="WhatsApp Number"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                      />
                    </div>
                  </>
                )}

                <hr className="my-2 border-gray-100" />

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="Email Address"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white ${role === 'couple' ? 'focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20' : 'focus:border-plum focus:ring-2 focus:ring-plum/20'}`}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Password (Min 6)"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white ${role === 'couple' ? 'focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20' : 'focus:border-plum focus:ring-2 focus:ring-plum/20'}`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 mt-2 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                    role === 'vendor' ? 'bg-gradient-to-r from-plum to-purple-800' : 'bg-gradient-to-r from-rose-gold to-plum'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-400 font-medium">OR</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => signInWithGoogle(role)}
                  className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-center text-sm text-gray-500 pt-2">
                  Already have an account?{' '}
                  <Link to="/login" className={`font-semibold hover:underline ${role === 'couple' ? 'text-rose-gold' : 'text-plum'}`}>Log In</Link>
                </p>
              </form>
            </div>
          )}

        </div>

        {/* Trust Badges - outside the card */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500 max-w-sm mx-auto">
            {['Free to join', 'No hidden charges', 'Secure signup', 'Trusted Platform'].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 font-medium">
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                </div>
                {badge}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 text-xs text-gray-400">
            Trusted by couples and wedding vendors across India
          </div>
        </div>

      </div>
      
      {/* How It Works Section placed beneath the signup flow to build confidence */}
      <div className="w-full mt-24 mb-10 overflow-hidden rounded-3xl border border-gray-100 shadow-sm relative z-0">
        <HowItWorks />
      </div>

    </div>
  );
}
