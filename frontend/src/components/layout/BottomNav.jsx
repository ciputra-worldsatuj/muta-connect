import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  QrCode,
  Users,
  Vote,
  FileText,
  UserCheck,
  MoreHorizontal
} from 'lucide-react';

/**
 * Mobile Bottom Navigation
 * Sesuai dengan spesifikasi IA Section 10:
 * - Petugas: Scan QR, Check-in Manual, Beranda
 * - Admin & Panitia: Beranda, Peserta, Kendali, Laporan, Menu Lainnya
 */

export function BottomNav({ currentPath, onOpenDrawer }) {
  const { currentUser } = useApp();
  const role = currentUser.role;

  // Navigasi Petugas HP (3 Tab)
  if (role === 'petugas') {
    const tabs = [
      { title: 'Scan QR', path: '/registrasi/scan', icon: QrCode },
      { title: 'Manual', path: '/registrasi/manual', icon: UserCheck },
      { title: 'Beranda', path: '/beranda', icon: LayoutDashboard },
    ];

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-card border-t border-surface-border flex justify-around py-2 shadow-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = currentPath === tab.path;
          return (
            <a
              key={tab.title}
              href={`#${tab.path}`}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                active ? 'text-brand-primary' : 'text-content-muted hover:text-content-main'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-brand-accent' : ''}`} />
              <span>{tab.title}</span>
            </a>
          );
        })}
      </nav>
    );
  }

  // Navigasi Admin & Panitia HP (4 Tab + Menu Lainnya)
  const tabs = [
    { title: 'Beranda', path: '/beranda', icon: LayoutDashboard },
    { title: 'Peserta', path: '/panitia/peserta', icon: Users },
    { title: 'Kendali', path: '/panitia/voting', icon: Vote },
    { title: 'Laporan', path: '/laporan', icon: FileText },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-card border-t border-surface-border flex justify-around py-2 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = currentPath.startsWith(tab.path);
        return (
          <a
            key={tab.title}
            href={`#${tab.path}`}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              active ? 'text-brand-primary' : 'text-content-muted hover:text-content-main'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-brand-accent' : ''}`} />
            <span>{tab.title}</span>
          </a>
        );
      })}

      <button
        type="button"
        onClick={onOpenDrawer}
        className="flex flex-col items-center gap-1 text-[11px] font-semibold text-content-muted hover:text-content-main"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span>Menu</span>
      </button>
    </nav>
  );
}
