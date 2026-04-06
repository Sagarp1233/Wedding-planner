import { Component } from 'react';
import { clearAllCaches } from '../utils/versionCheck';

/**
 * Global Error Boundary — catches unhandled React render errors.
 * 
 * Instead of showing a white screen, it offers the user a one-click
 * recovery that clears stale state and reloads the app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Wedora] Uncaught error in React tree:', error, errorInfo);
  }

  handleRecovery = async () => {
    try {
      // Clear app-specific localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('wedora_') || key.startsWith('sb-'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // Clear all caches
      await clearAllCaches();

      // Force hard reload
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fdf2f8  0%, #fff7ed 50%, #fefce8 100%)',
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
            {/* Heart icon */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #e11d48, #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(225,29,72,0.3)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '8px',
            }}>
              Something went wrong
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}>
              Don't worry — your wedding data is safe in the cloud.
              Click below to refresh and get back on track.
            </p>

            <button
              onClick={this.handleRecovery}
              style={{
                background: 'linear-gradient(135deg, #e11d48, #be185d)',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(225,29,72,0.35)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseOver={e => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 20px rgba(225,29,72,0.45)';
              }}
              onMouseOut={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px rgba(225,29,72,0.35)';
              }}
            >
              Refresh & Recover
            </button>

            {/* Error details (collapsed) */}
            {this.state.error && (
              <details style={{
                marginTop: '24px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#9ca3af',
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  Technical details
                </summary>
                <pre style={{
                  background: '#f9fafb',
                  padding: '12px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  maxHeight: '120px',
                  fontSize: '11px',
                  lineHeight: 1.5,
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
