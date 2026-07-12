import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  Squares2X2Icon,
  ChartBarIcon,
  CommandLineIcon,
  BellIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Import subcomponents
import SearchBar from '../components/dashboard/SearchBar';
import Breadcrumbs from '../components/dashboard/Breadcrumbs';
import NotificationsDropdown from '../components/dashboard/NotificationsDropdown';
import UserProfileDropdown from '../components/dashboard/UserProfileDropdown';
import ThemeToggle from '../components/common/ThemeToggle';

const sidebarLinks = [
  { name: 'Overview', path: '/', icon: Squares2X2Icon },
  { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
  { name: 'Node Cluster', path: '/nodes', icon: CpuChipIcon },
  { name: 'Live Logs', path: '/logs', icon: CommandLineIcon },
  { name: 'Team Access', path: '/team', icon: UsersIcon },
  { name: 'System Settings', path: '/settings', icon: Cog6ToothIcon },
];

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const getActiveTitle = () => {
    const active = sidebarLinks.find((link) => link.path === location.pathname);
    return active ? active.name : 'Console';
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border py-5 px-4 font-sans select-none transition-colors duration-200">
      {/* Sidebar Header Brand */}
      <div className="flex items-center gap-3 mb-8 px-2 overflow-hidden h-9">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-md dark:shadow-neon-violet shrink-0">
          <span className="text-white font-bold text-xs tracking-wider">AG</span>
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col truncate"
          >
            <span className="text-xs font-extrabold text-gray-900 dark:text-white leading-none">Antigravity</span>
            <span className="text-[9px] text-brand-violet font-mono tracking-widest uppercase mt-0.5">Telemetry</span>
          </motion.div>
        )}
      </div>

      {/* Navigation list */}
      <nav className="space-y-1.5 flex-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.path === '/nodes' ? '/' : link.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive
                ? 'bg-gray-100 dark:bg-dark-bg/60 text-brand-violet dark:text-white border-l-2 border-brand-violet'
                : 'text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-bg/25'
                }`}
              title={isCollapsed ? link.name : undefined}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-violet' : 'text-gray-400 dark:text-dark-muted'}`} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {link.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button (Desktop only) */}
      <div className="hidden md:block pt-3 border-t border-gray-100 dark:border-dark-border">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-dark-bg/40 hover:bg-gray-100 dark:hover:bg-dark-bg/85 transition-all"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4.5 w-4.5" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold">
              <ChevronLeftIcon className="h-4.5 w-4.5" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex text-gray-900 dark:text-dark-text relative transition-colors duration-200">
      {/* Techno Grid Background (Linear style) */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0"></div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.25, type: 'tween' }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-20 overflow-hidden"
      >
        {renderSidebarContent()}
      </motion.aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            {/* Dark backing overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobile}
              className="absolute inset-0 bg-black"
            ></motion.div>

            {/* Sidebar window */}
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, type: 'tween' }}
              className="absolute top-0 bottom-0 left-0 w-64 shadow-2xl"
            >
              {renderSidebarContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Right Core Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen z-10 relative">
        {/* Master Header Navbar */}
        <header className="sticky top-0 w-full h-16 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-md border-b border-gray-200 dark:border-dark-border px-6 flex items-center justify-between z-30 transition-colors duration-200">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger menu */}
            <button
              onClick={toggleMobile}
              className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-card"
            >
              {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>

            {/* Breadcrumb Indicators */}
            <Breadcrumbs />
          </div>

          {/* Navigation Widgets */}
          <div className="flex items-center gap-3">
            <SearchBar />
            <ThemeToggle />
            <NotificationsDropdown />
            <UserProfileDropdown />
          </div>
        </header>

        {/* Viewport dashboard container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>

          {/* Footer Component */}
          <footer className="mt-12 border-t border-gray-200 dark:border-dark-border pt-6 pb-2 text-[10px] text-gray-400 dark:text-dark-muted font-mono flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span>&copy; {new Date().getFullYear()} Antigravity Inc.</span>
              <span className="hidden sm:inline-block border-l border-gray-200 dark:border-dark-border pl-4">v1.2.4-stable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
              <span>All nodes online (eu-west, us-east, ap-south)</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
