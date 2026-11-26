import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

/**
 * SkeletonPage - Komponen Kerangka Halaman Standar
 * Mengacu pada Design System (design-system.md) & batasan Fase 2:
 * - Menampilkan ID Layar (S-01 s/d S-31)
 * - Menampilkan Peran yang diizinkan sesuai Permission Matrix (IA Section 7)
 * - Menyediakan placeholder visual dengan warna & border Design System
 */

export function SkeletonPage({ 
  screenId, 
  title, 
  subtitle, 
  roles = [], 
  actionButtonText, 
  children 
}) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              {roles.map(r => (
                <span key={r} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-bg text-content-muted border border-surface-border uppercase">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-content-main tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-content-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {actionButtonText && (
          <button 
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm transition-colors self-start sm:self-auto"
          >
            {actionButtonText}
          </button>
        )}
      </div>

      {/* Main Skeleton Placeholder */}
      {children || (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 bg-surface-card rounded-xl border border-surface-border shadow-sm space-y-4">
            <div className="h-5 bg-surface-bg rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-surface-bg rounded w-full animate-pulse" />
              <div className="h-4 bg-surface-bg rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-surface-bg rounded w-4/6 animate-pulse" />
            </div>
            <div className="pt-4 border-t border-surface-border flex items-center gap-2 text-xs text-content-muted">
              <Info className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Kerangka rute siap untuk implementasi logika fungsional Fase 3.</span>
            </div>
          </div>

          <div className="p-6 bg-surface-card rounded-xl border border-surface-border shadow-sm space-y-3">
            <div className="h-4 bg-surface-bg rounded w-1/2 animate-pulse" />
            <div className="h-24 bg-surface-bg rounded-lg animate-pulse" />
            <div className="h-3 bg-surface-bg rounded w-2/3 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
