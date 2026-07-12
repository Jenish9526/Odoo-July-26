import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  HashtagIcon,
  GlobeAmericasIcon,
  CurrencyDollarIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';

const mockDb = {
  cities: [
    { id: 'c1', title: 'San Francisco', sub: 'USA · Telemetry Cluster west-02', cat: 'cities' },
    { id: 'c2', title: 'New York', sub: 'USA · Telemetry Cluster east-01', cat: 'cities' },
    { id: 'c3', title: 'London', sub: 'UK · Telemetry Cluster central-01', cat: 'cities' },
    { id: 'c4', title: 'Tokyo', sub: 'Japan · Telemetry Cluster ap-01', cat: 'cities' },
    { id: 'c5', title: 'Mumbai', sub: 'India · Telemetry Cluster south-01', cat: 'cities' },
  ],
  cryptocurrencies: [
    { id: 'cr1', title: 'Bitcoin (BTC)', sub: '$94,204.50 · +2.41%', cat: 'cryptocurrency' },
    { id: 'cr2', title: 'Ethereum (ETH)', sub: '$3,485.20 · +1.85%', cat: 'cryptocurrency' },
    { id: 'cr3', title: 'Solana (SOL)', sub: '$142.75 · -4.12%', cat: 'cryptocurrency' },
    { id: 'cr4', title: 'Cardano (ADA)', sub: '$0.485 · -1.25%', cat: 'cryptocurrency' },
    { id: 'cr5', title: 'BNB', sub: '$584.10 · +0.95%', cat: 'cryptocurrency' },
  ],
  stocks: [
    { id: 's1', title: 'Nvidia Corp (NVDA)', sub: '$124.50 · +4.82%', cat: 'stocks' },
    { id: 's2', title: 'Apple Inc (AAPL)', sub: '$224.20 · +1.15%', cat: 'stocks' },
    { id: 's3', title: 'Google LLC (GOOGL)', sub: '$178.60 · -0.45%', cat: 'stocks' },
    { id: 's4', title: 'Tesla Inc (TSLA)', sub: '$182.10 · -2.85%', cat: 'stocks' },
    { id: 's5', title: 'Microsoft (MSFT)', sub: '$420.50 · +0.85%', cat: 'stocks' },
  ],
  news: [
    { id: 'n1', title: 'Claude 3.7 Sonnet Hybrid Thinking', sub: 'LLM Development', cat: 'news' },
    { id: 'n2', title: 'Llama 4 Ultra Benchmark Details', sub: 'Open Source Models', cat: 'news' },
    { id: 'n3', title: 'Nvidia Rubin Hardware Leak details', sub: 'Next-gen GPUs', cat: 'news' },
  ],
};

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('search_history');
    return saved ? JSON.parse(saved) : ['Nvidia', 'Bitcoin', 'San Francisco'];
  });
  const inputRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(delay);
  }, [query]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = (item) => {
    // Add to history
    const val = item.title || item;
    const cleanVal = typeof val === 'string' ? val.split(' (')[0] : val;
    
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== cleanVal.toLowerCase());
      const updated = [cleanVal, ...filtered].slice(0, 5);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });

    showToast(`Redirecting to ${cleanVal} stats telemetry...`, 'success');
    onClose();
  };

  const handleClearHistory = (e) => {
    e.stopPropagation();
    setHistory([]);
    localStorage.removeItem('search_history');
    showToast('Search history cleared', 'info');
  };

  const getResults = () => {
    if (!query) return [];
    
    const term = query.toLowerCase();
    const results = [];

    Object.keys(mockDb).forEach((cat) => {
      if (activeCategory !== 'all' && activeCategory !== cat) return;
      
      mockDb[cat].forEach((item) => {
        if (
          item.title.toLowerCase().includes(term) ||
          item.sub.toLowerCase().includes(term)
        ) {
          results.push(item);
        }
      });
    });

    return results;
  };

  const results = getResults();
  const hasResults = results.length > 0;

  const getCatIcon = (cat) => {
    switch (cat) {
      case 'cities': return <GlobeAmericasIcon className="h-4 w-4 text-brand-cyan" />;
      case 'cryptocurrency': return <CurrencyDollarIcon className="h-4 w-4 text-brand-emerald" />;
      case 'stocks': return <HashtagIcon className="h-4 w-4 text-amber-500" />;
      case 'news': return <NewspaperIcon className="h-4 w-4 text-brand-violet" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 font-sans select-none">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] z-10"
          >
            {/* Header Input bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-dark-border/40">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-dark-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Cities, Cryptocurrencies, Stocks, News..."
                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md border border-gray-200 dark:border-dark-border text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-all shrink-0"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Content box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                /* Loading State */
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="h-6 w-6 border-2 border-brand-violet border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 dark:text-dark-muted">Searching registry databases...</span>
                </div>
              ) : query ? (
                /* Search Results */
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-dark-muted uppercase font-bold tracking-wider">
                    <span>Search Results ({results.length})</span>
                    {/* Categories filters in results */}
                    <div className="flex gap-1.5 font-sans font-semibold text-[9px] uppercase leading-none">
                      {['all', 'cities', 'cryptocurrency', 'stocks', 'news'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-1.5 py-0.5 rounded border capitalize transition-all ${
                            activeCategory === cat
                              ? 'bg-brand-violet text-white border-brand-violet'
                              : 'text-gray-400 dark:text-dark-muted border-gray-200 dark:border-dark-border hover:text-gray-600 dark:hover:text-gray-300'
                          }`}
                        >
                          {cat === 'cryptocurrency' ? 'Crypto' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    {hasResults ? (
                      results.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-dark-bg/20 transition-all duration-150 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border group-hover:border-brand-violet/20 transition-all">
                              {getCatIcon(item.cat)}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                                {item.title}
                              </h4>
                              <span className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5 block">
                                {item.sub}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] text-brand-violet opacity-0 group-hover:opacity-100 font-bold uppercase transition-opacity">
                            View Metric &rarr;
                          </span>
                        </div>
                      ))
                    ) : (
                      /* Empty State */
                      <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                        <MagnifyingGlassIcon className="h-8 w-8 text-gray-300 dark:text-dark-border animate-pulse" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1">No matching traces found</h4>
                        <p className="text-[10px] text-gray-400 dark:text-dark-muted max-w-xs leading-relaxed">
                          Your query did not match any active cluster registries, tickers, or headlines.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Recent Searches & Suggestions */
                <div className="space-y-4">
                  {history.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-dark-muted uppercase font-bold tracking-wider">
                        <span>Recent Searches</span>
                        <button
                          onClick={handleClearHistory}
                          className="text-[9px] hover:text-brand-rose transition-colors uppercase font-bold"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {history.map((hist, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelect({ title: hist })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border hover:border-brand-violet/30 hover:bg-gray-50 dark:hover:bg-dark-bg/25 text-xs text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white font-medium transition-all"
                          >
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>{hist}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 dark:text-dark-muted uppercase font-bold tracking-wider block">
                      Search Suggestions
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { title: 'San Francisco', desc: 'west-02 cluster' },
                        { title: 'Bitcoin (BTC)', desc: 'USD rate updates' },
                        { title: 'Nvidia Corp (NVDA)', desc: 'NASDAQ equity status' },
                        { title: 'Claude 3.7 Sonnet', desc: 'Tech headlines' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelect(item)}
                          className="p-2.5 rounded-lg border border-gray-150 dark:border-dark-border/40 hover:border-brand-violet/20 hover:bg-gray-50 dark:hover:bg-dark-bg/20 transition-all cursor-pointer flex flex-col gap-0.5 group"
                        >
                          <span className="font-bold text-gray-900 dark:text-white group-hover:text-brand-violet dark:group-hover:text-brand-cyan transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[9px] text-gray-400 dark:text-dark-muted">
                            {item.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer keyboard shortcuts */}
            <div className="bg-gray-50 dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border/40 px-4 py-2 flex items-center justify-between text-[10px] text-gray-400 dark:text-dark-muted font-mono leading-none">
              <div className="flex gap-3">
                <span><kbd className="bg-gray-200 dark:bg-dark-card border rounded px-1 text-[8px] font-bold">Esc</kbd> Close</span>
                <span><kbd className="bg-gray-200 dark:bg-dark-card border rounded px-1 text-[8px] font-bold">↵</kbd> Select</span>
              </div>
              <span>Antigravity Global Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearchModal;
