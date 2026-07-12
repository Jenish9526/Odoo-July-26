import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { LayoutProvider } from '../../context/LayoutContext';

export default function DashboardLayout() {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        
        {/* Navigation Sidebar Panel (Left) */}
        <Sidebar />

        {/* Outer Page Shell & Inner Layout Areas */}
        <div className="flex-grow flex flex-col min-w-0 min-h-screen">
          
          {/* Main Top Navigation */}
          <Navbar />

          {/* Primary Viewport */}
          <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
