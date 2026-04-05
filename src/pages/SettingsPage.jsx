import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatINR, formatDate } from '../utils/helpers';
import { Save, RotateCcw, Heart, MapPin, Calendar, Wallet, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { onMenuClick } = useOutletContext();
  const { state, dispatch, resetAll } = useApp();
  const { currentUser } = useAuth();
  const { wedding } = state;

  const [form, setForm] = useState({
    partner1: wedding.partner1,
    partner2: wedding.partner2,
    weddingDate: wedding.weddingDate,
    location: wedding.location,
    totalBudget: wedding.totalBudget,
  });

  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_WEDDING',
      payload: {
        partner1: form.partner1,
        partner2: form.partner2,
        weddingDate: form.weddingDate,
        location: form.location,
        totalBudget: Number(form.totalBudget) || 0,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    resetAll();
    setShowReset(false);
    window.location.reload();
  }

  return (
    <>
      <TopBar title="Settings" subtitle="Manage your wedding details" onMenuClick={onMenuClick} />

      <div className="max-w-2xl animate-fade-in-up">
        {/* Wedding Details Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900">Wedding Details</h3>
              <p className="text-sm text-gray-500">Update your wedding information</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-gold" />
                  Partner 1
                </label>
                <input
                  value={form.partner1}
                  onChange={e => setForm({ ...form, partner1: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                  placeholder="e.g. Priya"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-gold" />
                  Partner 2
                </label>
                <input
                  value={form.partner2}
                  onChange={e => setForm({ ...form, partner2: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                  placeholder="e.g. Rahul"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-gold" />
                Wedding Date
              </label>
              <input
                type="date"
                value={form.weddingDate}
                onChange={e => setForm({ ...form, weddingDate: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-gold" />
                Location
              </label>
              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
                placeholder="e.g. Udaipur, Rajasthan"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Wallet className="w-3.5 h-3.5 text-rose-gold" />
                Total Budget (₹)
              </label>
              <input
                type="number"
                value={form.totalBudget}
                onChange={e => setForm({ ...form, totalBudget: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Currently: {formatINR(wedding.totalBudget)}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>

              {saved && (
                <span className="text-sm font-medium text-emerald-600 animate-fade-in flex items-center gap-1">
                  ✓ Saved successfully
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Data Management Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900">Data Management</h3>
              <p className="text-sm text-gray-500">Reset or manage your app data</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-50/80 border border-red-100 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Danger Zone</p>
                <p className="text-xs text-red-600 mt-1">
                  Resetting will permanently delete all your wedding data.
                  You will need to go through onboarding again. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowReset(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Data
          </button>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>WedPlanner v2.0 — Built with React, TailwindCSS & Recharts</p>
          <p className="mt-1">Logged in as: {currentUser?.email || 'Unknown'}</p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal isOpen={showReset} onClose={() => setShowReset(false)} title="Reset All Data?" size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            This will delete all your wedding data, budget entries, guest list, tasks, and events.
            The app will be restored to its default state with sample data.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowReset(false)}
              className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
