import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BRAND } from '../../constants/branding';

/** OS dark mode — swap logo when you ship true dark UI; same asset until separate art exists. */
export function usePrefersDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mq.matches);
    const fn = (e) => setDark(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return dark;
}

/**
 * Main navbar mark: full horizontal logo on sm+, icon only on mobile.
 * @param {'light' | 'dark' | 'adaptive'} surface — adaptive uses prefers-color-scheme for light vs dark file
 */
export function WedoraNavMark({ to = '/', className = '', surface = 'light' }) {
  const prefersDark = usePrefersDarkMode();
  const horizontalSrc =
    surface === 'dark'
      ? BRAND.dark
      : surface === 'adaptive' && prefersDark
        ? BRAND.dark
        : BRAND.horizontal;

  return (
    <Link
      to={to}
      className={`flex items-center shrink-0 group outline-none focus-visible:ring-2 focus-visible:ring-rose-gold/40 rounded-lg ${className}`}
    >
      <img
        src={horizontalSrc}
        alt="Wedora"
        className="hidden sm:block h-11 w-auto max-w-[200px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
        height={44}
        loading="eager"
        decoding="async"
      />
      <img
        src={BRAND.icon}
        alt="Wedora"
        className="sm:hidden h-8 w-8 object-contain rounded-lg"
        width={32}
        height={32}
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}

/** Centered auth / marketing (larger horizontal mark). */
export function WedoraLogoCentered({ to = '/', className = '' }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Link to={to} className="inline-flex group outline-none focus-visible:ring-2 focus-visible:ring-rose-gold/40 rounded-xl">
        <img
          src={BRAND.horizontal}
          alt="Wedora"
          className="h-12 sm:h-14 w-auto max-w-[240px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          loading="eager"
          decoding="async"
        />
      </Link>
    </div>
  );
}

/** App sidebar: horizontal mark + partner subtitle (collapsed mobile uses same mark, scaled). */
export function WedoraSidebarBrand({ subtitle }) {
  return (
    <div className="flex flex-col gap-2">
      <img
        src={BRAND.horizontal}
        alt="Wedora"
        className="h-9 sm:h-10 w-auto max-w-[190px] object-contain object-left"
        loading="lazy"
        decoding="async"
      />
      {subtitle ? (
        <p className="text-xs text-gray-500 font-medium leading-snug line-clamp-2">{subtitle}</p>
      ) : null}
    </div>
  );
}

/** Text link style (blog minimal nav) — compact horizontal mark */
export function WedoraTextMark({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center ${className}`}>
      <img
        src={BRAND.horizontal}
        alt="Wedora"
        className="h-9 w-auto max-w-[140px] sm:max-w-[160px] object-contain"
        loading="lazy"
        decoding="async"
      />
    </Link>
  );
}

/** Dark backgrounds (hero strips, charcoal footer): use dark-variant file */
export function WedoraMarkOnDark({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex group ${className}`}>
      <img
        src={BRAND.dark}
        alt="Wedora"
        className="h-10 sm:h-11 w-auto max-w-[200px] object-contain opacity-95 group-hover:opacity-100 transition-opacity"
        loading="lazy"
        decoding="async"
      />
    </Link>
  );
}
