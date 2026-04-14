export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    // Fallback for local development or tracking blockers
    console.debug(`[Analytics (Mock)] Event: ${eventName}`, params);
  }
}
