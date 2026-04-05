import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
      if (session?.user) {
        checkOnboardedStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setCurrentUser(session?.user || null);
      if (session?.user) {
        await checkOnboardedStatus(session.user.id);
      } else {
        setIsOnboarded(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkOnboardedStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      setIsOnboarded(!!data);
    } catch (e) {
      setIsOnboarded(false);
    } finally {
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
      isAuthenticated: !!currentUser,
      isOnboarded,
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
