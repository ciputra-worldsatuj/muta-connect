import React from 'react';

/**
 * AuthLayout - Shell Autentikasi (Login & Ganti Password)
 * Mengacu pada IA Section 5 (S-01, S-02)
 */

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-brand-primary items-center justify-center text-white font-black text-2xl mb-3 shadow-md">
            M
          </div>
          <h1 className="text-2xl font-bold text-content-main tracking-tight">
            MUTA <span className="text-brand-accent">Connect</span>
          </h1>
          <p className="text-xs text-content-muted mt-1">
            Sistem Informasi Sidang Umum & Musyawarah PPPSRS
          </p>
        </div>

        <div className="bg-surface-card rounded-2xl border border-surface-border p-6 sm:p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
