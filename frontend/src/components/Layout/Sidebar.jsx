import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboard3Line,
  RiCarLine,
  RiSteering2Line,
  RiRouteLine,
  RiToolsLine,
  RiGasStationLine,
  RiMoneyDollarCircleLine,
  RiFileChartLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiEBike2Line
} from 'react-icons/ri';
import { useLayout } from '../../context/LayoutContext';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: RiDashboard3Line, category: 'Fleet Management' },
  { path: '/vehicles', label: 'Fleet', icon: RiCarLine, category: 'Fleet Management' },
  { path: '/drivers', label: 'Drivers', icon: RiSteering2Line, category: 'Fleet Management' },
  { path: '/trips', label: 'Trips', icon: RiRouteLine, category: 'Operations' },
  { path: '/maintenance', label: 'Maintenance', icon: RiToolsLine, category: 'Operations' },
  { path: '/fuel', label: 'Fuel & Expenses', icon: RiGasStationLine, category: 'Operations' },
  { path: '/reports', label: 'Reports & Analytics', icon: RiFileChartLine, category: 'Finance' },
  { path: '/settings', label: 'Settings', icon: RiSettings4Line, category: 'System' },
];

export default function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu } = useLayout();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out of TransitOps?')) {
      alert('Sign out simulation.');
      navigate('/');
    }
  };

  const categories = ['Fleet Management', 'Operations', 'Finance', 'System'];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar shell layout */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 dark:bg-slate-950 dark:border-slate-850/50
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:sticky lg:h-screen`}
      >
        {/* Header Branding Panel */}
        <div className="relative flex items-center h-16 px-6 border-b border-slate-200/80 dark:border-slate-850/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-sky-500 text-white font-extrabold text-lg shadow-md shadow-sky-500/25">
              <RiEBike2Line className="animate-bounce" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                TransitOps
              </span>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-sky-500 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
          >
            {isSidebarCollapsed ? <RiArrowRightSLine size={16} /> : <RiArrowLeftSLine size={16} />}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 py-6 overflow-y-auto px-4 space-y-6">
          {categories.map((category) => {
            const items = menuItems.filter((i) => i.category === category);
            return (
              <div key={category} className="space-y-1">
                {/* Category Header */}
                {!isSidebarCollapsed && (
                  <h3 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    {category}
                  </h3>
                )}

                {/* Items */}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `
                          relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                          ${isActive 
                            ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-550/15 dark:text-orange-450' 
                            : 'text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-950 dark:hover:text-white'}
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                            )}
                            
                            <Icon 
                              size={20} 
                              className={`flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-orange-500' : 'text-slate-450 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-350'}`} 
                            />

                            {!isSidebarCollapsed && (
                              <span className="flex-1 truncate">{item.label}</span>
                            )}

                            {/* Tooltip for collapsed sidebar */}
                            {isSidebarCollapsed && (
                              <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap dark:bg-slate-800 border border-slate-700/50">
                                {item.label}
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Sign-out button */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-850/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group relative"
          >
            <RiLogoutBoxRLine size={20} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
            {!isSidebarCollapsed && <span className="flex-1 text-left">Logout</span>}
            
            {/* Tooltip for collapsed state */}
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-red-500 text-white text-xs font-semibold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
