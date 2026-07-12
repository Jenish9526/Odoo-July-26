import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/common/ThemeToggle';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070f] flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-200">
      {/* Visual background ambient circles (Dark Mode exclusive) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-violet/5 blur-[120px] pointer-events-none hidden dark:block"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none hidden dark:block"></div>

      {/* Theme Toggle Anchor */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-md dark:shadow-neon-violet mb-4"
          >
            <span className="text-xl font-extrabold text-white tracking-widest font-sans">AG</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight font-sans text-center"
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-500 dark:text-dark-muted text-sm mt-1 text-center font-sans"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Card Component */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 shadow-sm dark:shadow-glass flex flex-col transition-colors duration-200"
        >
          {children}
        </motion.div>
        
        <div className="text-center text-xs text-gray-400 dark:text-dark-muted font-sans font-medium">
          &copy; {new Date().getFullYear()} Antigravity Systems. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
