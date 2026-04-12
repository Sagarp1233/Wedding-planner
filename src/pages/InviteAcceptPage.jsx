import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Heart, Loader2 } from 'lucide-react';

export default function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { currentUser, refreshSessionAndOnboarding } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function processInvite() {
      try {
        if (!currentUser) {
          // Store token and redirect to login
          sessionStorage.setItem('pendingInviteToken', token);
          navigate('/login');
          return;
        }

        setStatus('processing');
        
        // Execute the secure Postgres RPC function
        const { data, error } = await supabase.rpc('accept_wedding_invite', {
          invite_token: token
        });

        if (error) throw error;
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to accept invitation');
        }

        // Successfully joined
        setStatus('success');
        
        // Refresh the whole session context to grab the new wedding id automatically
        await refreshSessionAndOnboarding();
        
        // Redirect home
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      } catch (err) {
        console.error('Invite Error:', err);
        setStatus('error');
        setErrorMsg(err.message || 'Invalid or expired invite link.');
      }
    }

    processInvite();
  }, [token, currentUser, navigate, refreshSessionAndOnboarding]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white via-blush to-ivory">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-xl mx-auto mb-6">
          <Heart className="w-8 h-8 text-white animate-pulse" fill="currentColor" />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          {status === 'verifying' || status === 'processing' ? 'Joining Wedding...' : ''}
          {status === 'success' ? 'You are In!' : ''}
          {status === 'error' ? 'Invitation Failed' : ''}
        </h1>

        {status === 'verifying' || status === 'processing' ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-4">
             <Loader2 className="w-8 h-8 animate-spin text-rose-gold mb-4" />
             <p className="text-sm">Preparing your collaborative workspace.</p>
          </div>
        ) : null}

        {status === 'success' && (
          <p className="text-sm text-green-600 font-medium">
             Successfully joined the wedding plan. Redirecting you to the dashboard...
          </p>
        )}

        {status === 'error' && (
          <div className="mt-4">
            <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
              {errorMsg}
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-6 w-full py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:-translate-y-0.5 transition-all"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
