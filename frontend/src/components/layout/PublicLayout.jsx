import React from 'react';

/**
 * PublicLayout - Layar Publik Pemilih HP
 * Mengacu pada IA Section 10 & Design System Section 1:
 * - Tanpa menu internal (gangguan visual minimal)
 * - Target sentuh besar, satu tugas per layar
 */

export function PublicLayout({ route, children }) {
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans">
      <header className="bg-surface-card border-b border-surface-border py-3 px-4 shadow-sm text-center">
        <div className="font-bold text-brand-primary text-sm tracking-tight">
          MUTA <span className="text-brand-accent">Connect</span>
        </div>
        <div className="text-[11px] text-content-muted">Bilik Suara Pemilih Online</div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full flex flex-col justify-center">
        {children}
      </main>

      <footer className="py-3 text-center text-[10px] text-content-muted">
        Hak Suara Rahasia & Terlindungi Sesuai AD/ART PPPSRS
      </footer>
    </div>
  );
}
