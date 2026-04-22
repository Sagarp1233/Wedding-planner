import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';
import PublicNav from '../components/layout/PublicNav';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, refreshSessionAndOnboarding } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!resetEmail.trim()) return setResetError('Please enter your email');
    setResetLoading(true);
    setResetError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      setResetError(err.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) return setError('Please enter your email');
    if (!form.password) return setError('Please enter your password');

    setLoading(true);
    try {
      const result = await login(form.email.trim(), form.password);
      if (result.success) {
        await refreshSessionAndOnboarding();
        
        const user = result.user;
        const role = user.user_metadata?.role;
        const isAdmin = user.email === 'admin@wedora.in' || role === 'admin';

        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else if (role === 'vendor') {
          navigate('/vendor/dashboard', { replace: true });
        } else {
          // Default couple redirection
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError(result.error || 'Failed to login');
      }
    } catch(err) {
      setError('An error occurred');
    } finally {
      if(!error) setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-white">
      <Helmet>
        <link rel="canonical" href="https://wedora.in/login" />
      </Helmet>
      <PublicNav />
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blush to-ivory" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in-up mt-16">
        {/* Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-500">Log in to continue planning your wedding</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
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
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={() => { setShowForgot(true); setResetEmail(form.email); }}
                className="text-xs font-medium text-rose-gold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse-soft">Logging In...</span>
              ) : (
                <>Log In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-rose-gold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-card p-7 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900">Reset Password</h3>
                <p className="text-xs text-gray-500">We'll send a recovery link to your email</p>
              </div>
            </div>

            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-7 h-7 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Check your inbox!</p>
                <p className="text-xs text-gray-500 mb-4">We've sent a password reset link to <strong>{resetEmail}</strong></p>
                <button
                  onClick={() => { setShowForgot(false); setResetSent(false); setResetEmail(''); }}
                  className="text-sm font-semibold text-rose-gold hover:underline"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {resetError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
                    {resetError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowForgot(false); setResetError(''); }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
