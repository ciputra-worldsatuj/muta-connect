import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AppContext - State Konteks Shell & Konfigurasi Global
 * Mengacu pada Information Architecture (information-architecture.md)
 * Menyediakan konteks:
 * - Pengguna & Peran aktif (Admin, Panitia, Petugas Registrasi)
 * - Tenant aktif (multi-tenant PPPSRS)
 * - Sidang aktif (MUTA/RUTA)
 */

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Simulasi sesi pengguna untuk navigasi shell (FR-AUTH, Section 3 IA)
  const [currentUser, setCurrentUser] = useState({
    id: 'u-admin-1',
    name: 'Administrator PPPSRS',
    username: 'admin',
    role: 'admin', // 'admin' | 'panitia' | 'petugas'
    isAuthenticated: true
  });

  // Daftar tenant simulasi (FR-TEN)
  const [tenants] = useState([
    { id: 't-cw1', name: 'PPPSRSKC Ciputra World 1', unitCount: 133, nppTotal: 100 },
    { id: 't-cw2', name: 'PPPSRS Puncak Bukit Golf', unitCount: 95, nppTotal: 100 },
  ]);
  const [currentTenantId, setCurrentTenantId] = useState('t-cw1');

  // Daftar sidang simulasi (FR-AGD)
  const [sessions] = useState([
    { id: 's-2026-muta', tenantId: 't-cw1', title: 'MUTA Tahun Buku 2026', type: 'MUTA', status: 'Draft' },
    { id: 's-2026-ruta', tenantId: 't-cw1', title: 'RUTA Luar Biasa Pembahasan Lift', type: 'RUTA', status: 'Draft' },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('s-2026-muta');

  // Mode sidebar desktop (expand/collapse)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0];
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  const switchRole = (newRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'admin' ? 'Administrator PPPSRS' : newRole === 'panitia' ? 'Panitia Pelaksana' : 'Petugas Meja Registrasi'
    }));
  };

  const logout = () => {
    setCurrentUser(prev => ({ ...prev, isAuthenticated: false }));
    window.location.hash = '#/login';
  };

  const login = (role = 'admin') => {
    setCurrentUser({
      id: 'u-1',
      name: role === 'admin' ? 'Administrator PPPSRS' : role === 'panitia' ? 'Panitia Pelaksana' : 'Petugas Meja Registrasi',
      username: role,
      role: role,
      isAuthenticated: true
    });
    window.location.hash = '#/beranda';
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchRole,
      login,
      logout,
      tenants,
      currentTenant,
      setCurrentTenantId,
      sessions,
      currentSession,
      setCurrentSessionId,
      sidebarCollapsed,
      setSidebarCollapsed
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
