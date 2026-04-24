import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';
import PublicNav from '../components/layout/PublicNav';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signInWithGoogle, refreshSessionAndOnboarding } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [role, setRole] = useState('couple'); // UI toggle only
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
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#faf8f7]">
      <Helmet>
        <link rel="canonical" href="https://wedora.in/login" />
      </Helmet>
      <PublicNav />
      
      {/* Background Enhancements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/30 to-ivory pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-rose-gold/10 to-plum/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-gold/10 to-amber-200/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-60 pointer-events-none"></div>

      <div className="relative w-full max-w-md animate-fade-in-up mt-16 sm:mt-24 z-10">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-rose-900/5 rounded-[2rem] p-6 sm:p-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-500">
              {role === 'couple' ? 'Log in to continue planning your wedding' : 'Log in to manage your wedding business'}
            </p>
          </div>

          <div className="flex bg-gray-100/80 p-1 rounded-xl mb-6 shadow-inner">
            <button
              onClick={() => setRole('couple')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === 'couple' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Couple
            </button>
            <button
              onClick={() => setRole('vendor')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === 'vendor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vendor Business
            </button>
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
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
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
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
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group bg-gray-900 hover:bg-black shadow-lg shadow-gray-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse-soft">Logging In...</span>
              ) : (
                <>Log In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle('couple')}
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

          <p className="text-center text-[13px] font-medium text-gray-500 mt-6 pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-rose-500 hover:text-rose-600 hover:underline transition-colors">Sign Up</Link>
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
