import { useState } from 'react';
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const FilterPanel = ({ onFilterChange, categories = [], statuses = [] }) => {
  const [dateRange, setDateRange] = useState('7d');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [rangeVal, setRangeVal] = useState(500);

  const handleReset = () => {
    setDateRange('7d');
    setCategory('all');
    setStatus('all');
    setRangeVal(500);
    if (onFilterChange) {
      onFilterChange({ dateRange: '7d', category: 'all', status: 'all', rangeVal: 500 });
    }
  };

  const handleApply = (updates) => {
    if (onFilterChange) {
      onFilterChange({ dateRange, category, status, rangeVal, ...updates });
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans transition-colors duration-200">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4 select-none">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-4.5 w-4.5 text-brand-violet" />
          <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Workspace Filters
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-brand-rose uppercase transition-colors"
        >
          <ArrowPathIcon className="h-3 w-3" />
          Reset Filters
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
        {/* Date range picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-dark-muted">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              handleApply({ dateRange: e.target.value });
            }}
            className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-dark-muted">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleApply({ category: e.target.value });
            }}
            className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status buttons */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-dark-muted">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleApply({ status: e.target.value });
            }}
            className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors"
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Threshold Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline select-none">
            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-dark-muted">
              Threshold Limit
            </label>
            <span className="text-[10px] font-mono text-brand-violet dark:text-brand-cyan">
              {rangeVal} ms
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={rangeVal}
            onChange={(e) => {
              setRangeVal(Number(e.target.value));
              handleApply({ rangeVal: Number(e.target.value) });
            }}
            className="h-2 bg-gray-100 dark:bg-dark-bg rounded-lg appearance-none cursor-pointer accent-brand-violet border border-gray-200 dark:border-dark-border"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
