import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const ONBOARDING_FETCH_MS = 8000;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [onboardingResolved, setOnboardingResolved] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  // DB-driven state
  const [weddings, setWeddings] = useState([]);
  const [appConfig, setAppConfig] = useState({ free_plan_limit: 1, pro_plan_limit: 5 });
  const [profile, setProfile] = useState(null);

  const activeWeddingId = profile?.active_wedding_id || null;
  const isOnboarded = profile?.is_onboarded || false;
  // If we are recovering password, we bypass the normal loading holdup and force routing 
  const loading = !authReady || (!!currentUser && !onboardingResolved && !isRecoveringPassword);

  // Helper method: persist active wedding ID directly to DB via users table
  const setActiveWeddingId = useCallback(async (id) => {
    setProfile(prev => prev ? { ...prev, active_wedding_id: id } : null);
    if (currentUser) {
      // Async update in background
      await supabase.from('users').update({ active_wedding_id: id }).eq('id', currentUser.id);
    }
  }, [currentUser]);

  const markOnboarded = useCallback(async (weddingId) => {
    setProfile(prev => prev ? { ...prev, is_onboarded: true, active_wedding_id: weddingId } : null);
    if (currentUser) {
      await supabase.from('users').update({ is_onboarded: true, active_wedding_id: weddingId }).eq('id', currentUser.id);
    }
  }, [currentUser]);

  const isPro = profile?.plan === 'pro' || currentUser?.email === 'admin@wedora.in' || currentUser?.user_metadata?.role === 'admin';
  const isAdmin = currentUser?.email === 'admin@wedora.in' || currentUser?.user_metadata?.role === 'admin';
  const maxWeddings = isPro ? appConfig.pro_plan_limit : appConfig.free_plan_limit;
  const canCreateWedding = weddings.length < maxWeddings;

  // Add wedding optimistically
  const addWeddingToList = useCallback((weddingRow) => {
    setWeddings(prev => [weddingRow, ...prev]);
  }, []);

  async function fetchUserWeddings(userId) {
    try {
      // Primary: fetch weddings the user owns
      const ownedQuery = supabase
        .from('weddings')
        .select('id, partner1, partner2, wedding_date, location, total_budget, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false, nullsFirst: false });

      const { data: ownedData, error: ownedError } = await Promise.race([
        ownedQuery,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('weddings-fetch-timeout')), ONBOARDING_FETCH_MS)
        ),
      ]);

      if (ownedError) {
        console.error('[Wedora] Failed to fetch owned weddings:', ownedError);
      }

      // Secondary: fetch weddings the user collaborates on
      let collabData = [];
      try {
        const { data: collabLinks } = await supabase
          .from('collaborators')
          .select('wedding_id')
          .eq('user_id', userId);

        if (collabLinks && collabLinks.length > 0) {
          const collabIds = collabLinks.map(c => c.wedding_id);
          const { data } = await supabase
            .from('weddings')
            .select('id, partner1, partner2, wedding_date, location, total_budget, created_at')
            .in('id', collabIds)
            .order('created_at', { ascending: false, nullsFirst: false });
          collabData = data || [];
        }
      } catch (e) {
        // collaborators table might not exist yet – silently skip
        console.warn('[Wedora] Collaborator fetch skipped:', e.message);
      }

      // Merge and deduplicate
      const allWeddings = [...(ownedData || [])];
      const ownedIds = new Set(allWeddings.map(w => w.id));
      for (const cw of collabData) {
        if (!ownedIds.has(cw.id)) allWeddings.push(cw);
      }
      return allWeddings;
    } catch (e) {
      if (e?.message === 'weddings-fetch-timeout') {
        console.warn('[Wedora] Wedding list fetch timed out.');
      }
      return [];
    }
  }

  // Reloads all user data: config, profile, weddings
  const loadUserData = async (userId, aliveTracker) => {
    if (!aliveTracker.alive) return;
    setOnboardingResolved(false);

    try {
      // Execute fetches in parallel
      const [configRes, profileRes, weddingsRes] = await Promise.all([
        supabase.from('app_config').select('*').eq('id', 1).single(),
        supabase.from('users').select('*').eq('id', userId).single(),
        fetchUserWeddings(userId)
      ]);

      if (!aliveTracker.alive) return;

      if (configRes.data) {
        setAppConfig({
          free_plan_limit: configRes.data.free_plan_limit,
          pro_plan_limit: configRes.data.pro_plan_limit
        });
      }

      const userProfile = profileRes.data || { is_onboarded: false, active_wedding_id: null, plan: 'free' };
      setProfile(userProfile);
      setWeddings(weddingsRes);

      // Auto-fix active wedding ID if it's missing but we have weddings
      if (!userProfile.active_wedding_id && weddingsRes.length > 0) {
        const firstId = weddingsRes[0].id;
        setProfile(prev => ({ ...prev, active_wedding_id: firstId }));
        supabase.from('users').update({ active_wedding_id: firstId }).eq('id', userId);
      }

    } catch (err) {
      console.error('[Wedora] Load user data error:', err);
    }

    setOnboardingResolved(true);
  };

  useEffect(() => {
    const aliveTracker = { alive: true };
    let subscription = null;

    const finishNoUser = () => {
      if (!aliveTracker.alive) return;
      setWeddings([]);
      setProfile(null);
      setOnboardingResolved(true);
    };

    (async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!aliveTracker.alive) return;
        
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
          await loadUserData(session.user.id, aliveTracker);
        } else {
          finishNoUser();
        }
      } catch (err) {
        console.error('Critical Auth Crash:', err);
        if (!aliveTracker.alive) return;
        setCurrentUser(null);
        setAuthReady(true);
        finishNoUser();
      }

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'INITIAL_SESSION') return;

        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveringPassword(true);
        }

        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setCurrentUser(session?.user ?? null);
          return;
        }

        setCurrentUser(session?.user ?? null);
        if (!session?.user) {
          finishNoUser();
          return;
        }
        await loadUserData(session.user.id, aliveTracker);
      });
      subscription = sub;
    })();

    const failsafe = window.setTimeout(() => {
      if (!aliveTracker.alive) return;
      setAuthReady((ready) => {
        if (ready) return ready;
        console.warn('[Wedora] Auth bootstrap timed out; continuing without session.');
        return true;
      });
    }, 12000);

    return () => {
      aliveTracker.alive = false;
      if (subscription) subscription.unsubscribe();
      clearTimeout(failsafe);
    };
  }, []);

  async function refreshSessionAndOnboarding() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      setCurrentUser(null);
      setWeddings([]);
      setProfile(null);
      setOnboardingResolved(true);
      setAuthReady(true);
      return;
    }
    setCurrentUser(session?.user ?? null);
    setAuthReady(true);
    if (session?.user) {
      await loadUserData(session.user.id, { alive: true });
    } else {
      setWeddings([]);
      setProfile(null);
      setOnboardingResolved(true);
    }
  }

  async function signup(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) return { success: false, error: error.message };

    // Trigger onboarding email in the background
    // (We don't await this so it doesn't block the user flow)
    fetch('/api/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    }).catch(err => console.error('[Wedora] Failed to trigger welcome email', err));

    return { success: true, user: data.user };
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  }

  async function logout() {
    setProfile(null);
    await supabase.auth.signOut();
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
      isAuthenticated: !!currentUser,
      isOnboarded,
      isAdmin: currentUser?.email === 'admin@wedora.in' || currentUser?.user_metadata?.role === 'admin',
      isRecoveringPassword,
      setIsRecoveringPassword,
      // Multi-plan
      weddings,
      activeWeddingId,
      setActiveWeddingId,
      addWeddingToList,
      canCreateWedding,
      maxWeddings,
      isPro,
      appConfig,
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
