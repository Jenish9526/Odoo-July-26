import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

const stockList = [
  { symbol: 'NVDA', name: 'Nvidia Corp', price: '$124.50', change: '+4.82%', isUp: true },
  { symbol: 'AAPL', name: 'Apple Inc', price: '$224.20', change: '+1.15%', isUp: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: '$178.60', change: '-0.45%', isUp: false },
  { symbol: 'TSLA', name: 'Tesla Inc', price: '$182.10', change: '-2.85%', isUp: false },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: '$420.50', change: '+0.85%', isUp: true },
];

const StockWidget = () => {
  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans flex flex-col justify-between h-full min-h-[220px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
            Stock Equities
          </span>
          <span className="text-[9px] font-mono text-gray-400 dark:text-dark-muted">NASDAQ Markets</span>
        </div>

        {/* List */}
        <div className="space-y-3">
          {stockList.map((stock) => (
            <div key={stock.symbol} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border flex items-center justify-center font-bold text-[10px] text-gray-900 dark:text-white shrink-0">
                  {stock.symbol[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white leading-none">{stock.symbol}</h4>
                  <span className="text-[10px] text-gray-400 dark:text-dark-muted">{stock.name}</span>
                </div>
              </div>

              {/* Price / Change */}
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-white leading-none">{stock.price}</div>
                <div className={`text-[10px] font-bold mt-0.5 flex items-center gap-0.5 justify-end ${
                  stock.isUp ? 'text-brand-emerald' : 'text-brand-rose'
                }`}>
                  {stock.isUp ? (
                    <ArrowUpIcon className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 shrink-0" />
                  )}
                  {stock.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockWidget;
