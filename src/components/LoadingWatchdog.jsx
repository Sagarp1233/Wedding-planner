import { useEffect, useRef, useState } from 'react';
import { clearAllCaches } from '../utils/versionCheck';

/**
 * Loading Watchdog — detects infinite loading states.
 * 
 * If the app is still in a loading state after TIMEOUT_MS,
 * it shows a recovery UI and auto-reloads (with loop protection).
 */

const TIMEOUT_MS = 6000; // 6 seconds
const RELOAD_KEY = 'wedora_watchdog_reload';
const RELOAD_COOLDOWN_MS = 30000; // Don't auto-reload more than once per 30s

export default function LoadingWatchdog({ children, isLoading }) {
  const [isStuck, setIsStuck] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      // Start the watchdog timer
      timerRef.current = setTimeout(() => {
        setIsStuck(true);

        // Auto-reload if we haven't already recently
        const lastReload = localStorage.getItem(RELOAD_KEY);
        const now = Date.now();

        if (!lastReload || (now - parseInt(lastReload, 10)) > RELOAD_COOLDOWN_MS) {
          console.warn('[Wedora] Loading watchdog triggered — auto-reloading...');
          localStorage.setItem(RELOAD_KEY, now.toString());
          
          // Clear caches then reload
          clearAllCaches().finally(() => {
            window.location.reload();
          });
        } else {
          console.warn('[Wedora] Loading watchdog: already reloaded recently, showing manual option.');
        }
      }, TIMEOUT_MS);
    } else {
      // Loading finished — clear watchdog
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsStuck(false);

      // Clean up reload key on successful load
      try { localStorage.removeItem(RELOAD_KEY); } catch (_) {}
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoading]);

  // If stuck and auto-reload didn't help, show manual recovery
  if (isStuck) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fff7ed 50%, #fefce8 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '24px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}>
          {/* Spinner */}
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #fecdd3',
            borderTop: '3px solid #e11d48',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }} />

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '8px',
          }}>
            Taking longer than usual...
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            The app is having trouble loading. This can happen after an update. 
            Try refreshing below.
          </p>

          <button
            onClick={async () => {
              // Full nuclear option
              const keysToRemove = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('wedora_') || key.startsWith('sb-'))) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach(k => localStorage.removeItem(k));
              await clearAllCaches();
              window.location.href = '/';
            }}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be185d)',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(225,29,72,0.35)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Refresh Now
          </button>
        </div>
      </div>
    );
  }

  return children;
}
