import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useRouter } from './router/Router';
import { ROUTE_LAYOUTS } from './router/routes';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectorLayout } from './components/layout/ProjectorLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { PageDispatcher } from './pages/PageDispatcher';

/**
 * Root Application Component
 * Mengacu pada Information Architecture (IA v1.0)
 * Mengatur:
 * 1. Penyedia Konteks (AppProvider)
 * 2. Hash Routing (useRouter)
 * 3. Seleksi Layout Shell berdasarkan tipe halaman:
 *    - ROUTE_LAYOUTS.APP (Navbar, Sidebar, BottomNav)
 *    - ROUTE_LAYOUTS.PROJECTOR (Layar proyektor fullscreen, dark theme)
 *    - ROUTE_LAYOUTS.PUBLIC (Bilik suara HP pemilih tanpa menu internal)
 *    - ROUTE_LAYOUTS.AUTH (Login & ganti password)
 */

function AppContent() {
  const { currentPath, route, params } = useRouter();
  const { currentUser } = useApp();

  // Pengarah otomatis jika belum login dan bukan rute publik
  const isAuthRoute = route.layout === ROUTE_LAYOUTS.AUTH;
  const isPublicRoute = route.layout === ROUTE_LAYOUTS.PUBLIC;
  
  if (!currentUser.isAuthenticated && !isAuthRoute && !isPublicRoute) {
    window.location.hash = '#/login';
  }

  // Pilih shell layout yang sesuai
  switch (route.layout) {
    case ROUTE_LAYOUTS.AUTH:
      return (
        <AuthLayout>
          <PageDispatcher route={route} params={params} />
        </AuthLayout>
      );

    case ROUTE_LAYOUTS.PROJECTOR:
      return (
        <ProjectorLayout currentPath={currentPath} route={route}>
          <PageDispatcher route={route} params={params} />
        </ProjectorLayout>
      );

    case ROUTE_LAYOUTS.PUBLIC:
      return (
        <PublicLayout route={route}>
          <PageDispatcher route={route} params={params} />
        </PublicLayout>
      );

    case ROUTE_LAYOUTS.APP:
    default:
      return (
        <AppLayout currentPath={currentPath} route={route}>
          <PageDispatcher route={route} params={params} />
        </AppLayout>
      );
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
