import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, BoltIcon, ExclamationTriangleIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline';

const mockNotifications = [
  {
    id: 1,
    type: 'alert',
    title: 'AI model latency spike',
    description: 'Average latency crossed 120ms in cluster eu-west-1.',
    time: '3 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'info',
    title: 'Build upload completed',
    description: 'Webpack production assets uploaded to edge node servers.',
    time: '20 mins ago',
    unread: true,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Database connection rate',
    description: 'MongoDB database client pool crossed 85% capacity threshold.',
    time: '1 hour ago',
    unread: false,
  },
];

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return <BoltIcon className="h-4 w-4 text-brand-rose" />;
      case 'warning': return <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />;
      default: return <CheckIcon className="h-4 w-4 text-brand-emerald" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-bg/50 transition-colors text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white focus:outline-none shadow-sm"
      >
        <BellIcon className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-rose animate-pulse shadow-md"></span>
        )}
      </button>

      {/* Expanded container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-lg dark:shadow-glass overflow-hidden z-50 font-sans"
          >
            <div className="p-4 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-dark-bg/20">
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Alert Signals</h3>
                <p className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5">Real-time system telemetry</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-bold text-brand-violet hover:text-brand-violetHover transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-100 dark:divide-dark-border">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 flex gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-dark-bg/30 ${
                    n.unread ? 'bg-brand-violet/5 dark:bg-brand-violet/[0.02]' : ''
                  }`}
                >
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                        {n.title}
                      </h4>
                      <span className="text-[9px] text-gray-400 dark:text-dark-muted whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-muted leading-relaxed">{n.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-dark-border text-center bg-gray-50/50 dark:bg-dark-bg/20">
              <button className="text-xs font-bold text-gray-400 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;
