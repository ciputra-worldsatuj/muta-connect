import React, { createContext, useContext, useState } from 'react';

/**
 * AppContext - State Konteks Global MUTA Connect (Single Tenant: PPPSRSKC CIPUTRA WORLD 1 JAKARTA)
 * Mengacu pada instruksi user: Khusus untuk 1 tenant resmi saja.
 */

const AppContext = createContext(null);

const SINGLE_TENANT = {
  id: 't-cw1',
  name: 'PPPSRSKC CIPUTRA WORLD 1 JAKARTA',
  unitCount: 133,
  totalNpp: 100.0
};

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    id: 'u-admin-1',
    name: 'Administrator PPPSRS',
    username: 'admin',
    role: 'admin', // 'admin' | 'panitia' | 'petugas'
    isAuthenticated: true
  });

  const [currentTenant] = useState(SINGLE_TENANT);

  const [sessions] = useState([
    { id: 's-2026-muta', tenantId: 't-cw1', title: 'MUTA Tahun Buku 2026', type: 'MUTA', status: 'Draft', kode_publik: 'CW2026' },
    { id: 's-2026-ruta', tenantId: 't-cw1', title: 'RUTA Luar Biasa Pembahasan Lift', type: 'RUTA', status: 'Draft', kode_publik: 'CW2026-LIFT' },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('s-2026-muta');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      currentTenant,
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
