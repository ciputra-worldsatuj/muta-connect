import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  CalendarDays, 
  Tv2, 
  LogOut, 
  UserCheck, 
  Menu, 
  X
} from 'lucide-react';

export function Navbar({ onToggleMobileMenu, isMobileMenuOpen, currentPath }) {
  const { 
    currentUser, 
    switchRole, 
    logout, 
    currentTenant,
    sessions,
    currentSession,
    setCurrentSessionId 
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-surface-card border-b border-surface-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-md text-content-muted hover:text-content-main hover:bg-surface-bg focus:ring-2 focus:ring-brand-accent"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <a href="#/beranda" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white font-black text-lg tracking-wider shadow-sm group-hover:bg-brand-primary-hover transition-colors">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-content-main leading-tight tracking-tight">
                  MUTA <span className="text-brand-accent font-semibold">Connect</span>
                </span>
                <span className="text-[10px] text-content-muted font-medium">Sistem Sidang PPPSRS</span>
              </div>
            </a>
          </div>

          {/* Konteks Single Tenant & Sidang (Revisi 2: Single Tenant Tetap) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Badge Single Tenant: PPPSRSKC CIPUTRA WORLD 1 JAKARTA */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-primary shadow-2xs">
              <Building2 className="w-4 h-4 text-brand-accent shrink-0" />
              <span>{currentTenant?.name || 'PPPSRSKC CIPUTRA WORLD 1 JAKARTA'}</span>
            </div>

            {/* Pemilih Sidang */}
            <div className="flex items-center gap-1.5 bg-surface-bg border border-surface-border px-3 py-1.5 rounded-lg text-xs">
              <CalendarDays className="w-4 h-4 text-brand-primary" />
              <select
                value={currentSession?.id}
                onChange={(e) => setCurrentSessionId(e.target.value)}
                className="bg-transparent font-medium text-content-main focus:outline-none cursor-pointer max-w-[200px] truncate"
                aria-label="Pilih Sidang Aktif"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Aksi Cepat, Role Switcher Simulator & Profil */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tombol Buka Tab Proyektor */}
            <a
              href="#/proyektor/kehadiran"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-surface-dark-bg text-brand-dark-primary hover:bg-surface-dark-card border border-surface-dark-border transition-colors shadow-sm"
              title="Buka Layar Proyektor (Tab Terpisah)"
            >
              <Tv2 className="w-4 h-4 text-brand-dark-accent" />
              <span className="hidden sm:inline">Proyektor</span>
            </a>

            {/* Role Switcher Simulator */}
            <div className="flex items-center bg-surface-bg border border-surface-border rounded-lg p-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-content-muted ml-1 mr-1 hidden sm:inline" />
              <select
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value)}
                className="bg-transparent font-semibold text-brand-primary uppercase text-[11px] focus:outline-none cursor-pointer"
                title="Ganti Peran Uji Coba"
              >
                <option value="admin">Admin</option>
                <option value="panitia">Panitia</option>
                <option value="petugas">Petugas</option>
              </select>
            </div>

            {/* Tombol Keluar */}
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-content-muted hover:text-status-danger hover:bg-red-50 transition-colors"
              title="Keluar Akun"
              aria-label="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
