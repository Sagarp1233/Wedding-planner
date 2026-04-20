import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { performVersionCheck } from './utils/versionCheck.js'
import './index.css'

// ─── Version check: runs BEFORE React mounts ───
// If a new deployment is detected, this clears stale state and reloads.
// The reload happens synchronously, so React never renders stale code.
performVersionCheck();
// ─── Recovery Interceptor ───
// Supabase aggressively removes hash fragments upon client init. We catch it here.
if (typeof window !== 'undefined' && window.location.href.includes('type=recovery')) {
  sessionStorage.setItem('wedora_recovering_password', 'true');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>,
)
