import React, { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GlobalSearchModal from './GlobalSearchModal';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-xs sm:max-w-sm font-sans cursor-pointer select-none"
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-muted">
          <MagnifyingGlassIcon className="h-4.5 w-4.5" />
        </div>
        <div className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-1.5 pl-9 pr-12 text-xs text-gray-400 dark:text-dark-muted font-sans text-left transition-colors duration-200 hover:border-gray-300 dark:hover:border-dark-border/80">
          Search telemetry node...
        </div>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center gap-0.5 h-4.5 select-none px-1.5 font-mono text-[9px] font-semibold text-gray-400 dark:text-dark-muted bg-gray-50 dark:bg-dark-bg/60 border border-gray-200 dark:border-dark-border rounded shadow-sm">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      <GlobalSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SearchBar;
