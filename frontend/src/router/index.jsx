/**
 * Hash Router Infrastructure Skeleton
 * Mengacu pada Information Architecture (information-architecture.md)
 * Menggunakan Hash Routing (#/...) agar kompatibel 100% dengan GitHub Pages tanpa konfigurasi server.
 */

import { useState, useEffect } from 'react';

export function useHashLocation() {
  const [loc, setLoc] = useState(() => window.location.hash.replace(/^#/, '') || '/');

  useEffect(() => {
    const handler = () => {
      setLoc(window.location.hash.replace(/^#/, '') || '/');
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (to) => {
    window.location.hash = to.startsWith('/') ? to : `/${to}`;
  };

  return [loc, navigate];
}
