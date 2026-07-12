import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiSearchLine,
  RiSunLine,
  RiMoonLine,
  RiNotification3Line,
  RiMenu2Line,
  RiArrowDownSLine,
  RiUser3Line,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiEBike2Line
} from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import { useLayout } from '../../context/LayoutContext';

const notificationsData = [
  { id: 1, text: 'Route Alert: Vehicle CA-9481 delayed by traffic', time: '12m ago', read: false },
  { id: 2, text: 'Maintenance Due: Ford Transit requires service check', time: '2h ago', read: false },
  { id: 3, text: 'Fuel Invoice Uploaded: Dept Operations', time: '1d ago', read: true },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleMobileMenu } = useLayout();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(notificationsData);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out of TransitOps?')) {
      alert('Sign out simulation.');
      navigate('/');
    }
  };

  // Keyboard shortcut Ctrl+K
  const searchInputRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 glass-panel border-b border-slate-200/80 dark:border-slate-850/30 transition-all duration-300">
      
      {/* Mobile Drawer Hamburger and Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileMenu}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <RiMenu2Line size={22} />
        </button>

        {/* Mobile branding logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <RiEBike2Line className="text-sky-500 text-2xl animate-pulse" />
          <span className="font-extrabold text-lg bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            TransitOps
          </span>
        </div>
      </div>

      {/* Global Command Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
        <div className={`flex items-center w-full gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200
          ${searchFocused 
            ? 'border-sky-500/80 ring-2 ring-sky-500/10 bg-white dark:bg-slate-950' 
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/50 dark:hover:bg-slate-900'}`}
        >
          <RiSearchLine className={`text-lg transition-colors ${searchFocused ? 'text-sky-500' : 'text-slate-450'}`} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search assets, driver rosters, trip schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-800 placeholder-slate-400 dark:text-slate-200 dark:placeholder-slate-500"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Action panel triggers */}
      <div className="flex items-center gap-3">
        
        {/* Toggle Theme Toggle Switch */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-850 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-all cursor-pointer"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <RiSunLine size={20} className="animate-spin-slow" /> : <RiMoonLine size={20} />}
        </button>

        {/* Notifications Tray */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white relative cursor-pointer
              ${showNotifications ? 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white' : ''}`}
          >
            <RiNotification3Line size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-500 px-1 text-[9px] font-extrabold text-white trip-pulse-active">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Tray */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xl dark:border-slate-800/80 dark:bg-slate-950 animate-slide-in-top">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-850">
                <span className="font-bold text-sm text-slate-850 dark:text-slate-100">Alert Center</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-4">All alerts resolved.</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`flex flex-col p-2.5 rounded-lg text-xs transition-colors
                        ${n.read ? 'bg-transparent text-slate-500 dark:text-slate-400' : 'bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-medium'}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="leading-relaxed">{n.text}</p>
                        {!n.read && <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 flex-shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <span className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

        {/* User Profile avatar info */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group cursor-pointer"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Sarah Jenkins"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/20 group-hover:ring-sky-500/40 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full dark:border-slate-950" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Sarah Jenkins</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Fleet Supervisor</p>
            </div>
            <RiArrowDownSLine size={16} className={`text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile options list */}
          {showProfile && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-slate-200/80 bg-white p-2 shadow-xl dark:border-slate-800/80 dark:bg-slate-950 animate-slide-in-top">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-850 mb-1">
                <span className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Logged In As</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-150 block truncate">sarah.j@transitops.com</span>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => { setShowProfile(false); navigate('/profile'); }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-350 dark:hover:bg-slate-900/60 dark:hover:text-white transition-all cursor-pointer"
                >
                  <RiUser3Line size={18} className="text-slate-450" />
                  <span>Fleet Settings</span>
                </button>
                <button
                  onClick={() => { setShowProfile(false); navigate('/settings'); }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-350 dark:hover:bg-slate-900/60 dark:hover:text-white transition-all cursor-pointer"
                >
                  <RiSettings4Line size={18} className="text-slate-450" />
                  <span>Roster Config</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 mt-1 pt-1">
                <button
                  onClick={() => { setShowProfile(false); handleLogout(); }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-semibold cursor-pointer"
                >
                  <RiLogoutBoxRLine size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
