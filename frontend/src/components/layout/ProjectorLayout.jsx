import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, ArrowLeft, Radio } from 'lucide-react';

/**
 * ProjectorLayout - Shell Layar Proyektor
 * Mengacu pada Design System (design-system.md Section 4.1 & 5)
 * - Tema Gelap (#0B1220 latar, #131C2E kartu, #93B4FF teks utama, #2DD4BF aksen)
 * - Jam WIB dan titik live berkedip (IA Section 6)
 * - Fullscreen toggle & tombol kembali tersembunyi/minimal
 */

export function ProjectorLayout({ currentPath, route, children }) {
  const [timeStr, setTimeStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark-bg text-content-dark-main font-sans flex flex-col selection:bg-brand-dark-accent selection:text-surface-dark-bg dark">
      {/* Header Proyektor Bersih & Fungsional */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-surface-dark-border bg-surface-dark-card/50">
        <div className="flex items-center gap-3">
          <a
            href="#/beranda"
            className="p-1.5 rounded-lg bg-surface-dark-card text-content-dark-muted hover:text-content-dark-main transition-colors"
            title="Kembali ke Aplikasi Utama"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success-dark animate-pulse shadow-[0_0_8px_#4ADE80]" />
            <span className="text-xs uppercase font-bold text-status-success-dark tracking-wider">LIVE</span>
          </div>
          <span className="text-xs text-content-dark-muted">|</span>
          <span className="text-xs font-semibold text-content-dark-muted uppercase tracking-wider">
            {route.title}
          </span>
        </div>

        {/* Tab Switcher & Jam WIB */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-surface-dark-card p-1 rounded-lg text-xs">
            <a
              href="#/proyektor/kehadiran"
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                currentPath === '/proyektor/kehadiran'
                  ? 'bg-brand-primary text-white'
                  : 'text-content-dark-muted hover:text-content-dark-main'
              }`}
            >
              Kehadiran
            </a>
            <a
              href="#/proyektor/voting"
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                currentPath === '/proyektor/voting'
                  ? 'bg-brand-primary text-white'
                  : 'text-content-dark-muted hover:text-content-dark-main'
              }`}
            >
              Voting
            </a>
          </div>

          <div className="font-mono text-sm font-bold text-brand-dark-accent tabular-nums bg-surface-dark-card px-3 py-1.5 rounded-lg border border-surface-dark-border">
            {timeStr}
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-surface-dark-card text-content-dark-muted hover:text-content-dark-main hover:bg-surface-dark-border transition-colors"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Konten Proyektor */}
      <main className="flex-1 p-6 md:p-10 flex flex-col">
        {children}
      </main>
    </div>
  );
}
