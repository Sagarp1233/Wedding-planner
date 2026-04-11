import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const onboardCheckSeq = useRef(0);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Auth Session Error:", error);
        setLoading(false);
        return;
      }
      setCurrentUser(session?.user || null);
      if (session?.user) {
        checkOnboardedStatus(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error("Critical Auth Crash:", err);
      // Failsafe so the app doesn't spin forever
      setLoading(false);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setCurrentUser(session?.user || null);
      if (session?.user) {
        // Token refresh keeps the same onboarding; only (re)verify on sign-in / initial session
        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          return;
        }
        setLoading(true);
        await checkOnboardedStatus(session.user.id);
      } else {
        setIsOnboarded(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkOnboardedStatus(userId) {
    const seq = ++onboardCheckSeq.current;
    try {
      const { data } = await supabase
        .from('weddings')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (seq !== onboardCheckSeq.current) return;
      setIsOnboarded(!!data);
    } catch (e) {
      if (seq !== onboardCheckSeq.current) return;
      setIsOnboarded(false);
    } finally {
      if (seq === onboardCheckSeq.current) {
        setLoading(false);
      }
    }
  }

  /** Call after sign-in/sign-up so route guards see session + onboarding before navigate() */
  async function refreshSessionAndOnboarding() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session refresh error:', error);
      setLoading(false);
      return;
    }
    setCurrentUser(session?.user || null);
    if (session?.user) {
      setLoading(true);
      await checkOnboardedStatus(session.user.id);
    } else {
      setIsOnboarded(false);
      setLoading(false);
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
