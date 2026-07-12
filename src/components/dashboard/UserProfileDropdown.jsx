import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, Cog8ToothIcon, CreditCardIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

import { Link } from 'react-router-dom';

const UserProfileDropdown = () => {
  const { user, logoutMock } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9.5 h-9.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-bg/50 transition-colors focus:outline-none shadow-sm"
      >
        <div className="w-7.5 h-7.5 rounded-md bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center text-white text-xs font-bold font-sans">
          {getInitials(user?.name)}
        </div>
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-lg dark:shadow-glass overflow-hidden z-50 font-sans"
          >
            {/* User credentials summary */}
            <div className="p-4 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/20">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Mock User'}</h4>
              <p className="text-[10px] text-gray-400 dark:text-dark-muted truncate mt-0.5">{user?.email || 'user@company.com'}</p>
              <div className="mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-semibold bg-brand-violet/10 text-brand-violet border border-brand-violet/20 uppercase tracking-wider">
                Administrator
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-1.5 space-y-0.5">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-all"
              >
                <UserIcon className="h-4 w-4 text-gray-400" /> My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-all"
              >
                <Cog8ToothIcon className="h-4 w-4 text-gray-400" /> Settings
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert('Billing module coming soon!');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-all text-left"
              >
                <CreditCardIcon className="h-4 w-4 text-gray-400" /> Subscriptions
              </button>
            </div>

            {/* Sign Out */}
            <div className="p-1.5 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/20">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logoutMock();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-brand-rose hover:bg-brand-rose/10 rounded-lg transition-all"
              >
                <ArrowLeftStartOnRectangleIcon className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
