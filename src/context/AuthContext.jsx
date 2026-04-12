import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const ONBOARDING_FETCH_MS = 8000;
const ACTIVE_WEDDING_KEY = 'wedora_active_wedding';

// Plan limits
const FREE_PLAN_LIMIT = 1;
const PRO_PLAN_LIMIT = 5;

async function fetchUserWeddings(userId) {
  try {
    const query = supabase
      .from('weddings')
      .select('id, partner1, partner2, wedding_date, location, total_budget, updated_at, created_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false, nullsFirst: false });

    const { data, error } = await Promise.race([
      query,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('weddings-fetch-timeout')), ONBOARDING_FETCH_MS)
      ),
    ]);

    if (error) {
      console.error('[Wedora] Failed to fetch weddings:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    if (e?.message === 'weddings-fetch-timeout') {
      console.warn('[Wedora] Wedding list fetch timed out.');
    }
    return [];
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [onboardingResolved, setOnboardingResolved] = useState(false);

  // Multi-plan state
  const [weddings, setWeddings] = useState([]);
  const [activeWeddingId, setActiveWeddingIdState] = useState(() => {
    try { return localStorage.getItem(ACTIVE_WEDDING_KEY) || null; } catch { return null; }
  });

  const isOnboarded = weddings.length > 0;
  const loading = !authReady || (!!currentUser && !onboardingResolved);

  // Persist active wedding ID to localStorage
  const setActiveWeddingId = useCallback((id) => {
    setActiveWeddingIdState(id);
    try {
      if (id) localStorage.setItem(ACTIVE_WEDDING_KEY, id);
      else localStorage.removeItem(ACTIVE_WEDDING_KEY);
    } catch { /* storage unavailable */ }
  }, []);

  // Check if the user can create more weddings (plan limits)
  const isPro = currentUser?.email === 'admin@wedora.in' || currentUser?.user_metadata?.role === 'admin' || currentUser?.user_metadata?.plan === 'pro';
  const maxWeddings = isPro ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
  const canCreateWedding = weddings.length < maxWeddings;

  useEffect(() => {
    let alive = true;
    let subscription = null;

    const finishNoUser = () => {
      if (!alive) return;
      setWeddings([]);
      setOnboardingResolved(true);
    };

    const loadWeddingsForUser = async (userId) => {
      if (!alive) return;
      setOnboardingResolved(false);
      const list = await fetchUserWeddings(userId);
      if (!alive) return;
      setWeddings(list);

      // Auto-select: if stored active ID is still valid, keep it; otherwise pick first
      const storedId = (() => { try { return localStorage.getItem(ACTIVE_WEDDING_KEY); } catch { return null; } })();
      if (storedId && list.some(w => w.id === storedId)) {
        setActiveWeddingIdState(storedId);
      } else if (list.length > 0) {
        setActiveWeddingId(list[0].id);
      } else {
        setActiveWeddingId(null);
      }

      setOnboardingResolved(true);
    };

    (async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!alive) return;
        if (error) {
          console.error('Auth Session Error:', error);
          setCurrentUser(null);
          setAuthReady(true);
          finishNoUser();
          return;
        }
        setCurrentUser(session?.user ?? null);
        setAuthReady(true);
        if (session?.user) {
          await loadWeddingsForUser(session.user.id);
        } else {
          finishNoUser();
        }
      } catch (err) {
        console.error('Critical Auth Crash:', err);
        if (!alive) return;
        setCurrentUser(null);
        setAuthReady(true);
        finishNoUser();
      }

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'INITIAL_SESSION') return;

        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setCurrentUser(session?.user ?? null);
          return;
        }

        setCurrentUser(session?.user ?? null);
        if (!session?.user) {
          finishNoUser();
          return;
        }
        await loadWeddingsForUser(session.user.id);
      });
      subscription = sub;
    })();

    const failsafe = window.setTimeout(() => {
      if (!alive) return;
      setAuthReady((ready) => {
        if (ready) return ready;
        console.warn('[Wedora] Auth bootstrap timed out; continuing without session.');
        return true;
      });
    }, 12000);

    return () => {
      alive = false;
      window.clearTimeout(failsafe);
      subscription?.unsubscribe();
    };
  }, [setActiveWeddingId]);

  // Refresh weddings list (e.g., after deleting a wedding)
  const refreshWeddings = useCallback(async () => {
    if (!currentUser) return;
    const list = await fetchUserWeddings(currentUser.id);
    setWeddings(list);

    // Re-validate active wedding ID
    if (activeWeddingId && !list.some(w => w.id === activeWeddingId)) {
      // Active wedding was deleted — pick next one or clear
      if (list.length > 0) {
        setActiveWeddingId(list[0].id);
      } else {
        setActiveWeddingId(null);
      }
    }
  }, [currentUser, activeWeddingId, setActiveWeddingId]);

  // Optimistically add a wedding to the local list (no async fetch needed)
  // This avoids the race condition where navigate() fires before setWeddings() commits.
  const addWeddingToList = useCallback((weddingRow) => {
    setWeddings(prev => [weddingRow, ...prev]);
  }, []);

  async function refreshSessionAndOnboarding() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session refresh error:', error);
      setCurrentUser(null);
      setWeddings([]);
      setOnboardingResolved(true);
      setAuthReady(true);
      return;
    }
    setCurrentUser(session?.user ?? null);
    setAuthReady(true);
    if (session?.user) {
      setOnboardingResolved(false);
      const list = await fetchUserWeddings(session.user.id);
      setWeddings(list);
      setOnboardingResolved(true);
    } else {
      setWeddings([]);
      setOnboardingResolved(true);
    }
  }

  async function signup(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  }

  async function logout() {
    setActiveWeddingId(null);
    await supabase.auth.signOut();
  }

  function markOnboarded() {
    // No-op now — addWeddingToList handles optimistic state update
    // Kept for backward compatibility with any callers
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      authReady,
      signup,
      login,
      logout,
      markOnboarded,
      refreshSessionAndOnboarding,
      refreshWeddings,
      isAuthenticated: !!currentUser,
      isOnboarded,
      isAdmin: currentUser?.email === 'admin@wedora.in' || currentUser?.user_metadata?.role === 'admin',
      // Multi-plan
      weddings,
      activeWeddingId,
      setActiveWeddingId,
      addWeddingToList,
      canCreateWedding,
      maxWeddings,
      isPro,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
