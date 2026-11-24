import React, { useState, useEffect, useMemo } from 'react';
import { ROUTES_CONFIG, ROUTE_LAYOUTS } from './routes';

/**
 * Hash Routing Parser & Matcher
 * Mendukung hash path seperti:
 * - #/beranda
 * - #/sidang/s-2026-muta/agenda
 * - #/vote/DEMO2026?t=t-cw1
 */

export function parseHash(hashStr) {
  const cleanHash = (hashStr || '').replace(/^#/, '').trim() || '/beranda';
  const [pathOnly, queryString] = cleanHash.split('?');
  
  const query = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    for (const [key, val] of searchParams.entries()) {
      query[key] = val;
    }
  }

  return {
    path: pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`,
    query
  };
}

export function matchRoute(currentPath, routes) {
  for (const route of routes) {
    const routeParts = route.path.split('/').filter(Boolean);
    const pathParts = currentPath.split('/').filter(Boolean);

    if (routeParts.length !== pathParts.length) {
      continue;
    }

    const params = {};
    let isMatch = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = decodeURIComponent(pathParts[i]);
      } else if (routeParts[i] !== pathParts[i]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return { route, params };
    }
  }

  return null;
}

export function useRouter() {
  const [location, setLocation] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setLocation(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (toPath, queryParams = {}) => {
    let cleanPath = toPath.startsWith('/') ? toPath : `/${toPath}`;
    const qs = new URLSearchParams(queryParams).toString();
    const targetHash = `#${cleanPath}${qs ? `?${qs}` : ''}`;
    if (window.location.hash === targetHash) {
      // Jika sama, paksa refresh hash
      setLocation(parseHash(targetHash));
    } else {
      window.location.hash = targetHash;
    }
  };

  const matched = useMemo(() => {
    const result = matchRoute(location.path, ROUTES_CONFIG);
    if (result) return result;

    // Fallback rute 404
    return {
      route: {
        path: location.path,
        screenId: '404',
        title: 'Halaman Tidak Ditemukan',
        layout: ROUTE_LAYOUTS.APP,
        roles: ['*']
      },
      params: {}
    };
  }, [location.path]);

  return {
    currentPath: location.path,
    query: location.query,
    route: matched.route,
    params: matched.params,
    navigate
  };
}
