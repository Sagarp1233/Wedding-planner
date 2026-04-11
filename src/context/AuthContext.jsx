import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const ONBOARDING_FETCH_MS = 8000;

async function fetchIsOnboarded(userId) {
  try {
    const query = supabase
      .from('weddings')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const { data, error } = await Promise.race([
      query,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('onboarding-fetch-timeout')), ONBOARDING_FETCH_MS)
      ),
    ]);

    if (error) return false;
    return !!data;
  } catch (e) {
    if (e?.message === 'onboarding-fetch-timeout') {
      console.warn('[Wedora] Onboarding check timed out; treating as not onboarded for this request.');
    }
    return false;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  /** Session is known from Supabase (getSession / auth listener). Watchdog should use this, not full bootstrap. */
  const [authReady, setAuthReady] = useState(false);
  const [onboardingResolved, setOnboardingResolved] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const loading = !authReady || (!!currentUser && !onboardingResolved);

  useEffect(() => {
    let alive = true;
    let subscription = null;

    const finishNoUser = () => {
      if (!alive) return;
      setIsOnboarded(false);
      setOnboardingResolved(true);
    };

    const applyOnboardingForUser = async (userId) => {
      if (!alive) return;
      setOnboardingResolved(false);
      const ok = await fetchIsOnboarded(userId);
      if (!alive) return;
      setIsOnboarded(ok);
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
        // End "stuck app" watchdog ASAP — do not wait for Postgres
        setAuthReady(true);
        if (session?.user) {
          await applyOnboardingForUser(session.user.id);
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
        await applyOnboardingForUser(session.user.id);
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
  }, []);

  async function refreshSessionAndOnboarding() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session refresh error:', error);
      setCurrentUser(null);
      setIsOnboarded(false);
      setOnboardingResolved(true);
      setAuthReady(true);
      return;
    }
    setCurrentUser(session?.user ?? null);
    setAuthReady(true);
    if (session?.user) {
      setOnboardingResolved(false);
      setIsOnboarded(await fetchIsOnboarded(session.user.id));
      setOnboardingResolved(true);
    } else {
      setIsOnboarded(false);
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
    await supabase.auth.signOut();
  }

  function markOnboarded() {
    setIsOnboarded(true);
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
      isAdmin: currentUser?.email === 'admin@wedora.in' || currentUser?.user_metadata?.role === 'admin'
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
