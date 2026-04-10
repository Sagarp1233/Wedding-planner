/**
 * Version-based auto-reload system.
 * 
 * On app load, compares the stored version with the current build version.
 * If there's a mismatch (new deployment), it clears app-specific localStorage
 * keys and forces a clean reload — seamlessly, without user intervention.
 * 
 * A reload-loop guard ensures we never reload more than once per version.
 */

import { APP_VERSION } from '../version';

const STORAGE_KEY_VERSION = 'wedora_app_version';
const STORAGE_KEY_RELOAD_GUARD = 'wedora_reload_guard';

// App-specific localStorage key prefixes to clear on version mismatch
const APP_KEY_PREFIXES = [
  'wedora_',
  // Keep Supabase auth keys to avoid logging users out on refresh/deploy.
];

// Keys that should NEVER be cleared (user preferences etc.)
const PROTECTED_KEYS = [
  // Add any keys you want to persist across versions
];

/**
 * Clears app-related localStorage keys, preserving unrelated data.
 */
function clearAppStorage() {
  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (PROTECTED_KEYS.includes(key)) continue;

    const shouldClear = APP_KEY_PREFIXES.some(prefix => key.startsWith(prefix));
    if (shouldClear) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Silently ignore — storage might be locked in some edge cases
    }
  });
}

/**
 * Detects and repairs corrupted localStorage entries.
 * Returns true if corruption was found and cleaned.
 */
function detectAndRepairCorruption() {
  let wasCorrupted = false;

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key) continue;

    try {
      const value = localStorage.getItem(key);
      // Check for obviously corrupted values
      if (value === 'undefined' || value === '[object Object]') {
        localStorage.removeItem(key);
        wasCorrupted = true;
      }
    } catch (e) {
      // If we can't even read it, remove it
      try {
        localStorage.removeItem(key);
        wasCorrupted = true;
      } catch (_) {
        // Nothing we can do
      }
    }
  }

  return wasCorrupted;
}

/**
 * Main version check. Call this BEFORE React renders.
 * If a version mismatch is detected, it clears stale data and reloads.
 * The function is synchronous and will call location.reload() if needed.
 */
export function performVersionCheck() {
  try {
    // Step 1: Detect and repair any corrupted localStorage
    detectAndRepairCorruption();

    const storedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
    const reloadGuard = localStorage.getItem(STORAGE_KEY_RELOAD_GUARD);

    // If version matches, nothing to do
    if (storedVersion === APP_VERSION) {
      // Clean up reload guard if present (successful load after reload)
      if (reloadGuard) {
        localStorage.removeItem(STORAGE_KEY_RELOAD_GUARD);
      }
      return;
    }

    // Version mismatch detected!
    console.info(
      `[Wedora] Version mismatch: stored="${storedVersion}" current="${APP_VERSION}". Updating...`
    );

    // Step 2: Check reload guard to prevent infinite reload loops
    if (reloadGuard === APP_VERSION) {
      // We already reloaded for this version, don't loop
      console.warn('[Wedora] Reload guard active — skipping reload to prevent loop.');
      localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
      localStorage.removeItem(STORAGE_KEY_RELOAD_GUARD);
      return;
    }

    // Step 3: Clear stale app data
    clearAppStorage();

    // Step 4: Set the new version and reload guard
    localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
    localStorage.setItem(STORAGE_KEY_RELOAD_GUARD, APP_VERSION);

    // Step 5: Unregister any lingering service workers
    unregisterServiceWorkers();

    // Step 6: Force reload to fetch fresh assets
    window.location.reload();
  } catch (e) {
    // If localStorage is completely broken (quota exceeded, disabled, etc.),
    // just let the app continue — it's better than a white screen
    console.error('[Wedora] Version check failed:', e);
  }
}

/**
 * Unregister all service workers to prevent stale asset serving.
 */
function unregisterServiceWorkers() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.info('[Wedora] Unregistered service worker:', registration.scope);
      });
    }).catch(err => {
      console.warn('[Wedora] Failed to unregister service workers:', err);
    });
  }
}

/**
 * Clear all caches (Cache API) to force fresh asset downloads.
 */
export async function clearAllCaches() {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.info('[Wedora] Cleared all caches:', cacheNames);
    } catch (e) {
      console.warn('[Wedora] Failed to clear caches:', e);
    }
  }
}
