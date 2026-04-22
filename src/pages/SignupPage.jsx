import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Building2, MapPin, Phone, Heart, Store } from 'lucide-react';
import PublicNav from '../components/layout/PublicNav';
import { VENDOR_CATEGORIES } from '../data/templates';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, refreshSessionAndOnboarding } = useAuth();

  const [role, setRole] = useState('couple');
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    businessName: '',
    category: 'venue',
    city: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Please enter your name');
    if (!form.email.trim()) return setError('Please enter your email');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

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
        await refreshSessionAndOnboarding();
        if (role === 'vendor') {
          navigate('/vendor/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-white">
      <PublicNav />
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blush to-ivory" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in-up mt-16">
        {/* Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Create Your Account</h1>
            <p className="text-sm text-gray-500">Join Wedora and start your journey</p>
          </div>

          <div className="flex p-1 mb-6 rounded-xl bg-gray-100/50 border border-gray-200 backdrop-blur-sm relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out`}
              style={{ left: role === 'couple' ? '4px' : 'calc(50% + 0px)' }}
            />
            <button
              type="button"
              onClick={() => setRole('couple')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors relative z-10 ${
                role === 'couple' ? 'text-rose-gold' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className="w-4 h-4" /> I'm a Couple
            </button>
            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors relative z-10 ${
                role === 'vendor' ? 'text-plum' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Store className="w-4 h-4" /> I'm a Vendor
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                  required
                />
              </div>
            </div>

            {role === 'vendor' && (
              <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={e => setForm({ ...form, businessName: e.target.value })}
                    placeholder="e.g. Dream Weddings"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                    required={role === 'vendor'}
                  />
                </div>
              </div>
            )}

            {role === 'vendor' && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDuration: '0.4s' }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                  >
                    {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                      required={role === 'vendor'}
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'vendor' && (
              <div className="animate-fade-in" style={{ animationDuration: '0.5s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="10 digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                    required={role === 'vendor'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white/80"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                role === 'vendor' ? 'bg-gradient-to-r from-plum to-purple-600' : 'bg-gradient-to-r from-rose-gold to-plum'
              }`}
            >
              {loading ? (
                <span className="animate-pulse-soft">Creating Account...</span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-rose-gold hover:underline">Log In</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
