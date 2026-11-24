import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Breadcrumbs } from './Breadcrumbs';

/**
 * AppLayout - Layout Utama Aplikasi Internal
 * Mengintegrasikan Topbar, Sidebar (desktop), Mobile Drawer, Breadcrumb & BottomNav (HP)
 */

export function AppLayout({ currentPath, route, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMobileMenuOpen={isMobileMenuOpen}
        currentPath={currentPath}
      />

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar currentPath={currentPath} />
        </div>

        {/* Mobile Sidebar Drawer Modal */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-50 flex">
              <Sidebar 
                currentPath={currentPath} 
                isMobile={true} 
                onCloseMobile={() => setIsMobileMenuOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          <Breadcrumbs route={route} />
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        currentPath={currentPath} 
        onOpenDrawer={() => setIsMobileMenuOpen(true)} 
      />
    </div>
  );
}
