'use client';
import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
const EVENT = 'themechange';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/** The theme in effect: a saved choice (applied to <html> before paint by the layout script), else the system setting. */
function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  if (t === 'light' || t === 'dark') return t;
  return matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const mq = matchMedia(DARK_QUERY);
  mq.addEventListener('change', onChange);
  window.addEventListener(EVENT, onChange);
  return () => { mq.removeEventListener('change', onChange); window.removeEventListener(EVENT, onChange); };
}

export function ThemeToggle() {
  // null on the server, so the first render matches the static HTML.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  function toggle() {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
