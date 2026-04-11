import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { WedoraLogoCentered } from '../../components/branding/WedoraLogo';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(form.email.trim(), form.password);
    if (!result.success) {
      setError(result.error || 'Unable to login.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Wait for auth context role hydration
      if (isAdmin || form.email.trim().toLowerCase() === 'admin@wedora.in') {
        navigate('/admin', { replace: true });
      } else {
        setError('This account is not authorized for admin access.');
      }
      setLoading(false);
    }, 450);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-white via-blush to-ivory">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <WedoraLogoCentered to="/" className="scale-90" />
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Access Wedora content management panel</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : <>Sign in <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Not an admin? <Link to="/login" className="text-rose-gold font-medium hover:underline">Go to user login</Link>
        </p>
      </div>
    </div>
  );
}
