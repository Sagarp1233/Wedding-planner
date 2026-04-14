import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Small delay ensures document.title has been updated by components (like setSEO) before tracking the hit
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location]);
}
