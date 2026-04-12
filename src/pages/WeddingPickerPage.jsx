import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatINR, getDaysUntil } from '../utils/helpers';
import { Heart, Plus, Trash2, MapPin, Calendar, Wallet, ChevronRight, Crown, Sparkles } from 'lucide-react';

export default function WeddingPickerPage() {
  const navigate = useNavigate();
  const { weddings, activeWeddingId, setActiveWeddingId, refreshSessionAndOnboarding, canCreateWedding, maxWeddings, isPro, currentUser } = useAuth();
  const [deleting, setDeleting] = useState(null);

  function handleSelect(weddingId) {
    setActiveWeddingId(weddingId);
    navigate('/dashboard');
  }

  async function handleDelete(wedding) {
    if (!window.confirm(`Delete "${wedding.partner1} & ${wedding.partner2}" and ALL its data? This cannot be undone.`)) return;
    setDeleting(wedding.id);
    try {
      await supabase.from('weddings').delete().eq('id', wedding.id);
      await refreshSessionAndOnboarding();
    } catch (e) {
      console.error('Failed to delete wedding:', e);
    } finally {
      setDeleting(null);
    }
  }

  function handleCreate() {
    if (!canCreateWedding) return;
    navigate('/onboarding');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blush to-ivory" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-rose-gold/10 to-plum/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-gold/10 to-amber-200/10 blur-3xl" />

      <div className="relative w-full max-w-2xl animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/20">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">Wedora</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
            Your Wedding Plans
          </h1>
          <p className="text-sm text-gray-500">
            {weddings.length === 0
              ? 'Create your first wedding plan to get started!'
              : `Select a plan to continue, or create a new one.`}
          </p>
          {/* Plan badge */}
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            {isPro ? (
              <><Crown className="w-3 h-3 text-amber-500" /> Pro Plan — {weddings.length}/{maxWeddings} plans</>
            ) : (
              <><Sparkles className="w-3 h-3 text-rose-gold" /> Free Plan — {weddings.length}/{maxWeddings} plan{maxWeddings > 1 ? 's' : ''}</>
            )}
          </div>
        </div>

        {/* Wedding Cards */}
        <div className="space-y-3 mb-6">
          {weddings.map((w, idx) => {
            const daysLeft = getDaysUntil(w.wedding_date);
            const isActive = w.id === activeWeddingId;

            return (
              <div
                key={w.id}
                className={`glass-card-hover p-5 cursor-pointer transition-all animate-fade-in-up ${
                  isActive ? 'ring-2 ring-rose-gold/40 shadow-lg shadow-rose-gold/10' : ''
                }`}
                style={{ animationDelay: `${idx * 80}ms` }}
                onClick={() => handleSelect(w.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-gold/15 to-plum/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-rose-gold" fill="currentColor" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-serif font-bold text-gray-900 truncate">
                        {w.partner1 || 'Partner 1'} <span className="text-rose-gold">&</span> {w.partner2 || 'Partner 2'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                        {w.wedding_date && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 text-rose-gold" />
                            {new Date(w.wedding_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {daysLeft > 0 && <span className="text-rose-gold font-semibold">({daysLeft}d)</span>}
                          </span>
                        )}
                        {w.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" /> {w.location}
                          </span>
                        )}
                        {w.total_budget > 0 && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Wallet className="w-3 h-3" /> {formatINR(w.total_budget)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {isActive && (
                      <span className="text-xs font-semibold text-rose-gold bg-rose-gold/10 px-2 py-0.5 rounded-full">Active</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(w); }}
                      disabled={deleting === w.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Delete this plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Button */}
        {canCreateWedding ? (
          <button
            onClick={handleCreate}
            className="w-full glass-card p-5 flex items-center justify-center gap-3 text-sm font-semibold text-rose-gold hover:bg-rose-gold/5 transition-all group border-2 border-dashed border-rose-gold/20 hover:border-rose-gold/40 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-white" />
            </div>
            Plan a New Wedding
          </button>
        ) : (
          <div className="w-full glass-card p-6 border-2 border-dashed border-amber-200 rounded-2xl text-center bg-gradient-to-r from-amber-50/50 to-orange-50/30">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-200/50">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Upgrade to Wedora Pro</p>
            <p className="text-xs text-gray-500 mb-4">
              Free plan allows {maxWeddings} wedding plan. Upgrade to Pro for up to 5 plans, priority support, and more!
            </p>
            <a
              href="mailto:support@wedora.in?subject=Upgrade%20to%20Pro&body=Hi%2C%20I%20would%20like%20to%20upgrade%20my%20Wedora%20account%20to%20Pro."
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-200/50 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Crown className="w-4 h-4" /> Contact Us to Upgrade
            </a>
            <p className="text-[10px] text-gray-400 mt-2">Or email support@wedora.in</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-300 mt-6">
          Wedora v2.0 — Logged in as {currentUser?.email || 'User'}
        </p>
      </div>
    </div>
  );
}
