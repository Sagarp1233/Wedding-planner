import { useState } from 'react';
import Modal from './Modal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Users, Link as LinkIcon, Check, Copy, AlertCircle } from 'lucide-react';

export default function InviteModal({ isOpen, onClose }) {
  const { activeWeddingId, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function generateLink() {
    setError('');
    setLoading(true);
    try {
      // Create invite expiring in 7 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error } = await supabase
        .from('wedding_invites')
        .insert({
          wedding_id: activeWeddingId,
          created_by: currentUser.id,
          role: 'partner',
          expires_at: expiresAt.toISOString()
        })
        .select('token')
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/invite/${data.token}`;
      setInviteLink(link);
    } catch (err) {
      console.error('Error generating invite:', err);
      setError('Failed to generate invite link. Are you the owner?');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Partner or Family">
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-rose-gold/10 to-plum/5 border border-rose-gold/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Collaborative Planning</h3>
            <p className="text-xs text-gray-500 mt-0.5">Invite others to edit your wedding plan in real-time.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm flex gap-2 items-center">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {!inviteLink ? (
          <button
            onClick={generateLink}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Invite Link'}
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in-up">
            <label className="text-xs font-semibold text-gray-700">Your secure invite link (valid for 7 days)</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 outline-none"
                />
              </div>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-rose-gold/10 hover:text-rose-gold text-gray-600 transition-colors"
                title="Copy Link"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Anyone with this link will be able to join and edit this wedding plan.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
