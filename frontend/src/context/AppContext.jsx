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
  const loadInitialUser = () => {
    try {
      const stored = sessionStorage.getItem('muta_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role) return parsed;
      }
    } catch (e) {}
    return {
      id: 'u-admin-1',
      name: 'Administrator PPPSRS',
      username: 'admin',
      role: 'admin', // 'admin' | 'panitia' | 'petugas'
      isAuthenticated: true
    };
  };

  const [currentUser, setCurrentUser] = useState(loadInitialUser);

  const [currentTenant] = useState(SINGLE_TENANT);

  const loadInitialSessions = () => {
    try {
      const raw = localStorage.getItem('muta_connect_db_v3');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessions && parsed.sessions.length > 0) {
          return parsed.sessions;
        }
      }
    } catch (e) {}
    return [
      { id: 's-2026-muta', tenantId: 't-cw1', judul: 'MUTA Tahun Buku 2026', title: 'MUTA Tahun Buku 2026', type: 'MUTA', status: 'Draft', kode_publik: 'CW2026' },
      { id: 's-2026-ruta', tenantId: 't-cw1', judul: 'RUTA Luar Biasa Pembahasan Lift', title: 'RUTA Luar Biasa Pembahasan Lift', type: 'RUTA', status: 'Draft', kode_publik: 'CW2026-LIFT' },
    ];
  };

  const [sessions, setSessions] = useState(loadInitialSessions);
  const [currentSessionId, setCurrentSessionId] = useState('s-2026-muta');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const refreshSessions = () => {
    try {
      const raw = localStorage.getItem('muta_connect_db_v3');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessions) {
          setSessions([...parsed.sessions]);
        }
      }
    } catch (e) {}
  };

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
    try {
      sessionStorage.removeItem('muta_current_user');
    } catch (e) {}
    window.location.hash = '#/login';
  };

  const login = (role = 'admin', name = null, username = null) => {
    const userObj = {
      id: 'u-' + (username || role),
      name: name || (role === 'admin' ? 'Administrator PPPSRS' : role === 'panitia' ? 'Panitia Pelaksana' : 'Petugas Meja Registrasi'),
      username: username || role,
      role: role,
      isAuthenticated: true
    };
    setCurrentUser(userObj);
    try {
      sessionStorage.setItem('muta_current_user', JSON.stringify(userObj));
    } catch (e) {}
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
      refreshSessions,
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
