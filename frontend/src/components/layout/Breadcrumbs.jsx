import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component
 * Mengacu pada Information Architecture (IA Section 13):
 * - Tampil pada layar internal dengan kedalaman 2 tingkat atau lebih
 * - Format: Tenant > Sidang > Modul > Halaman
 * - Contoh: PPPSRSKC Ciputra World 1 > MUTA 2026 > Agenda dan Soal > Soal 3
 */

export function Breadcrumbs({ route }) {
  const { currentTenant, currentSession } = useApp();

  // Aturan IA Section 13: Tidak tampil di Beranda, Scan QR, Proyektor, Voting Pemilih
  const excludedPaths = ['/beranda', '/registrasi/scan', '/proyektor/kehadiran', '/proyektor/voting'];
  if (excludedPaths.includes(route.path) || route.path.startsWith('/vote/')) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-content-muted mb-4 overflow-x-auto whitespace-nowrap py-1">
      <span className="font-medium text-content-muted">
        {currentTenant?.name || 'Tenant'}
      </span>
      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-surface-border" />
      <span className="font-medium text-content-muted">
        {currentSession?.title || 'Sidang'}
      </span>
      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-surface-border" />
      <span className="font-semibold text-brand-primary">
        {route.title}
      </span>
    </nav>
  );
}
