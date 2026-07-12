import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/20/solid';

const StatCard = ({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  sparklineData = [],
  lastUpdated,
}) => {
  const isUp = trend === 'up';
  
  // Format sparkline data for Recharts
  const chartData = sparklineData.map((val, idx) => ({ id: idx, value: val }));
  
  const accentColor = isUp ? '#10b981' : '#f43f5e'; // Emerald or Rose

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow overflow-hidden relative flex flex-col justify-between min-h-[160px] transition-colors duration-200"
    >
      <div>
        {/* Header Title & Icon */}
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted font-sans uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border text-brand-violet shrink-0 transition-colors duration-200">
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}
        </div>

        {/* Value and Percentage Indicator */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
            {value}
          </span>
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isUp
                  ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20'
                  : 'bg-brand-rose/10 text-brand-rose border border-brand-rose/20'
              }`}
            >
              {isUp ? (
                <ArrowUpRightIcon className="h-3 w-3 shrink-0" />
              ) : (
                <ArrowDownRightIcon className="h-3 w-3 shrink-0" />
              )}
              {change}
            </span>
          )}
        </div>
      </div>

      {/* Sparkline & Time footer */}
      <div className="mt-4 flex flex-col gap-2">
        {chartData.length > 0 && (
          <div className="h-9 w-full overflow-hidden opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={accentColor}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#grad-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-[9px] text-gray-400 dark:text-dark-muted font-mono">
            Updated {lastUpdated}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
