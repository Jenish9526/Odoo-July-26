import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';

const cryptoList = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$94,204.50', change: '+2.41%', isUp: true, sparkline: 'M0,15 L20,12 L40,18 L60,8 L80,5 L100,2' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,485.20', change: '+1.85%', isUp: true, sparkline: 'M0,18 L20,15 L40,12 L60,10 L80,14 L100,5' },
  { symbol: 'SOL', name: 'Solana', price: '$142.75', change: '-4.12%', isUp: false, sparkline: 'M0,5 L20,12 L40,15 L60,8 L80,18 L100,22' },
  { symbol: 'BNB', name: 'BNB Coin', price: '$584.10', change: '+0.95%', isUp: true, sparkline: 'M0,15 L20,18 L40,12 L60,14 L80,10 L100,8' },
  { symbol: 'ADA', name: 'Cardano', price: '$0.485', change: '-1.25%', isUp: false, sparkline: 'M0,10 L20,8 L40,15 L60,12 L80,18 L100,20' },
];

const CryptoWidget = () => {
  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans flex flex-col justify-between h-full min-h-[220px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
            Cryptocurrency Tickers
          </span>
          <span className="text-[9px] font-mono text-gray-400 dark:text-dark-muted">USD Markets</span>
        </div>

        {/* List */}
        <div className="space-y-3">
          {cryptoList.map((coin) => (
            <div key={coin.symbol} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border flex items-center justify-center font-bold text-[10px] text-gray-900 dark:text-white shrink-0">
                  {coin.symbol[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white leading-none">{coin.symbol}</h4>
                  <span className="text-[10px] text-gray-400 dark:text-dark-muted">{coin.name}</span>
                </div>
              </div>

              {/* Sparkline chart */}
              <div className="w-20 h-6 hidden sm:block overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 30">
                  <path
                    d={coin.sparkline}
                    fill="none"
                    stroke={coin.isUp ? '#10b981' : '#f43f5e'}
                    strokeWidth={1.5}
                  />
                </svg>
              </div>

              {/* Price / Change */}
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-white leading-none">{coin.price}</div>
                <div className={`text-[10px] font-bold mt-0.5 flex items-center gap-0.5 justify-end ${
                  coin.isUp ? 'text-brand-emerald' : 'text-brand-rose'
                }`}>
                  {coin.isUp ? (
                    <ArrowTrendingUpIcon className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-3 w-3 shrink-0" />
                  )}
                  {coin.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoWidget;
