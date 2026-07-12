import React, { useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';

export default function Modal({ isOpen, onClose, title, children }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-backdrop"
        onClick={onClose}
      />
      
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-105 dark:border-slate-850/50 flex flex-col max-h-[90vh] z-10 animate-modal">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-850/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-405 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-grow p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
