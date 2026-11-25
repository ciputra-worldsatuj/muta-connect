import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  QrCode,
  SlidersHorizontal,
  FileSpreadsheet,
  History,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Vote,
  Camera,
  ClipboardList
} from 'lucide-react';

/**
 * Sidebar Navigasi Desktop & Mobile Drawer
 * Menyesuaikan menu berdasarkan Peran (Admin, Panitia, Petugas) sesuai IA Section 3
 */

export function Sidebar({ currentPath, isMobile = false, onCloseMobile }) {
  const { currentUser, sidebarCollapsed, setSidebarCollapsed, currentSession } = useApp();
  const currentSidangId = currentSession?.id || 's-2026-muta';

  // Definisi Item Menu IA Section 3
  const menuItems = [
    {
      title: 'Beranda',
      icon: LayoutDashboard,
      path: '/beranda',
      roles: ['admin', 'panitia', 'petugas']
    },
    {
      title: 'Anggota',
      icon: Users,
      path: '/anggota',
      roles: ['admin', 'panitia'],
      subItems: [
        { title: 'Daftar Anggota', path: '/anggota', roles: ['admin', 'panitia'] },
        { title: 'Tambah Anggota', path: '/anggota/baru', roles: ['admin'] },
        { title: 'Impor CSV', path: '/anggota/impor', roles: ['admin'] }
      ]
    },
    {
      title: 'Sidang & Agenda',
      icon: Calendar,
      path: '/sidang',
      roles: ['admin', 'panitia'],
      subItems: [
        { title: 'Daftar Sidang', path: '/sidang', roles: ['admin', 'panitia'] },
        { title: 'Agenda & Soal', path: `/sidang/${currentSidangId}/agenda`, roles: ['admin', 'panitia'] },
        { title: 'Undangan & QR', path: `/sidang/${currentSidangId}/undangan`, roles: ['admin'] },
        { title: 'Kelola Kuasa', path: `/sidang/${currentSidangId}/kuasa`, roles: ['admin'] }
      ]
    },
    {
      title: 'Registrasi Meja',
      icon: Camera,
      path: '/registrasi/scan',
      roles: ['admin', 'petugas'],
      subItems: [
        { title: 'Scan QR Check-in', path: '/registrasi/scan', roles: ['admin', 'petugas'] },
        { title: 'Check-in Manual', path: '/registrasi/manual', roles: ['admin', 'petugas'] }
      ]
    },
    {
      title: 'Ruang Panitia',
      icon: SlidersHorizontal,
      path: '/panitia/sidang',
      roles: ['admin', 'panitia'],
      subItems: [
        { title: 'Kendali Sidang', path: '/panitia/sidang', roles: ['admin', 'panitia'] },
        { title: 'Kendali Voting', path: '/panitia/voting', roles: ['admin', 'panitia'] },
        { title: 'Daftar Peserta & Kick', path: '/panitia/peserta', roles: ['admin', 'panitia'] }
      ]
    },
    {
      title: 'Laporan & Berita Acara',
      icon: FileSpreadsheet,
      path: '/laporan',
      roles: ['admin', 'panitia'],
      subItems: [
        { title: 'Laporan Sidang', path: '/laporan', roles: ['admin', 'panitia'] },
        { title: 'Berita Acara', path: '/laporan/berita-acara', roles: ['admin', 'panitia'] }
      ]
    },
    {
      title: 'Riwayat Sidang',
      icon: History,
      path: '/riwayat',
      roles: ['admin', 'panitia']
    },
    {
      title: 'Log Aktivitas',
      icon: ShieldAlert,
      path: '/log',
      roles: ['admin', 'panitia']
    },
    {
      title: 'Pengaturan Sistem',
      icon: Settings,
      path: '/pengaturan/pengguna',
      roles: ['admin'],
      subItems: [
        { title: 'Pengguna & Akun', path: '/pengaturan/pengguna', roles: ['admin'] },
        { title: 'Parameter & Kuorum', path: '/pengaturan/parameter', roles: ['admin'] }
      ]
    }
  ];

  // Filter menu berdasarkan peran pengguna
  const accessibleMenus = menuItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const isSubItemActive = (subPath) => {
    if (currentPath === subPath) return true;
    if (subPath.includes('/agenda') && currentPath.includes('/agenda')) return true;
    if (subPath.includes('/undangan') && currentPath.includes('/undangan')) return true;
    if (subPath.includes('/kuasa') && currentPath.includes('/kuasa')) return true;
    return false;
  };

  const getBasePrefix = (path) => {
    const parts = path.split('/').filter(Boolean);
    return parts.length > 0 ? `/${parts[0]}` : path;
  };

  const isItemActive = (item) => {
    if (item.subItems) {
      const hasActiveSub = item.subItems.some(sub => isSubItemActive(sub.path));
      if (hasActiveSub) return true;
      const prefix = getBasePrefix(item.path);
      if (prefix && prefix !== '/' && currentPath.startsWith(prefix)) {
        return true;
      }
    }
    if (item.path === '/beranda') return currentPath === '/beranda';
    return currentPath === item.path || currentPath.startsWith(item.path + '/');
  };

  return (
    <aside
      className={`
        ${isMobile ? 'w-64' : sidebarCollapsed ? 'w-16' : 'w-64'}
        transition-all duration-200 bg-surface-card border-r border-surface-border flex flex-col shrink-0
      `}
    >
      {/* Tombol Collapse Desktop */}
      {!isMobile && (
        <div className="p-2 flex justify-end border-b border-surface-border">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-md text-content-muted hover:text-content-main hover:bg-surface-bg"
            title={sidebarCollapsed ? "Perluas Sidebar" : "Persempit Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Navigasi Utama */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {accessibleMenus.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          return (
            <div key={item.title} className="space-y-1">
              <a
                href={`#${item.path}`}
                onClick={() => isMobile && onCloseMobile && onCloseMobile()}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors
                  ${active 
                    ? 'bg-brand-primary text-white shadow-sm' 
                    : 'text-content-muted hover:text-content-main hover:bg-surface-bg'
                  }
                `}
                title={sidebarCollapsed ? item.title : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-brand-accent'}`} />
                {(!sidebarCollapsed || isMobile) && (
                  <span className="truncate">{item.title}</span>
                )}
              </a>

              {/* Sub items saat active & tidak collapsed */}
              {item.subItems && active && (!sidebarCollapsed || isMobile) && (
                <div className="ml-7 pl-2 border-l border-surface-border space-y-1 py-1">
                  {item.subItems
                    .filter(sub => sub.roles.includes(currentUser.role))
                    .map(sub => {
                      const subActive = isSubItemActive(sub.path);
                      return (
                        <a
                          key={sub.title}
                          href={`#${sub.path}`}
                          onClick={() => isMobile && onCloseMobile && onCloseMobile()}
                          className={`
                            block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors
                            ${subActive 
                              ? 'text-brand-primary font-bold bg-blue-50 border-r-2 border-brand-primary' 
                              : 'text-content-muted hover:text-content-main hover:bg-surface-bg'
                            }
                          `}
                        >
                          {sub.title}
                        </a>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Informasi Peran Aktif di Bawah Sidebar */}
      {(!sidebarCollapsed || isMobile) && (
        <div className="p-3 border-t border-surface-border bg-surface-bg text-xs">
          <div className="text-[10px] uppercase font-bold text-content-muted tracking-wider">Peran Aktif</div>
          <div className="font-semibold text-brand-primary truncate">{currentUser.name}</div>
          <div className="text-[11px] text-brand-accent font-medium uppercase tracking-tight">[{currentUser.role}]</div>
        </div>
      )}
    </aside>
  );
}
