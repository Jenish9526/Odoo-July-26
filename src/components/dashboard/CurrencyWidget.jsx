import { useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const ratesDb = {
  USD: [
    { code: 'EUR', name: 'Euro', rate: 0.93, symbol: '€', change: '-0.15%', isUp: false },
    { code: 'GBP', name: 'British Pound', rate: 0.79, symbol: '£', change: '+0.12%', isUp: true },
    { code: 'JPY', name: 'Japanese Yen', rate: 159.45, symbol: '¥', change: '+0.54%', isUp: true },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.37, symbol: '$', change: '-0.08%', isUp: false },
    { code: 'INR', name: 'Indian Rupee', rate: 83.52, symbol: '₹', change: '+0.05%', isUp: true },
  ],
  EUR: [
    { code: 'USD', name: 'US Dollar', rate: 1.08, symbol: '$', change: '+0.15%', isUp: true },
    { code: 'GBP', name: 'British Pound', rate: 0.85, symbol: '£', change: '+0.27%', isUp: true },
    { code: 'JPY', name: 'Japanese Yen', rate: 171.45, symbol: '¥', change: '+0.69%', isUp: true },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.47, symbol: '$', change: '+0.07%', isUp: true },
    { code: 'INR', name: 'Indian Rupee', rate: 89.81, symbol: '₹', change: '+0.20%', isUp: true },
  ],
};

const CurrencyWidget = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const rates = ratesDb[baseCurrency];

  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans flex flex-col justify-between h-full min-h-[220px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <CurrencyDollarIcon className="h-4.5 w-4.5 text-brand-violet" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
              Exchange Rates
            </span>
          </div>
          
          {/* Base Selector Toggle */}
          <div className="flex gap-1 bg-gray-50 dark:bg-dark-bg p-0.5 rounded-lg border border-gray-100 dark:border-dark-border select-none">
            {Object.keys(ratesDb).map((base) => (
              <button
                key={base}
                onClick={() => setBaseCurrency(base)}
                className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                  baseCurrency === base
                    ? 'bg-white dark:bg-dark-card text-brand-violet dark:text-white shadow-sm'
                    : 'text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {base}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Conversion Grid */}
        <div className="space-y-3">
          {rates.map((item) => (
            <div key={item.code} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border flex items-center justify-center font-bold text-[10px] text-gray-500 dark:text-dark-muted shrink-0">
                  {item.symbol}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white leading-none">{item.code}</h4>
                  <span className="text-[10px] text-gray-400 dark:text-dark-muted">{item.name}</span>
                </div>
              </div>

              {/* Conversion Factor */}
              <div className="text-right">
                <div className="font-mono font-bold text-gray-900 dark:text-white leading-none">
                  1 {baseCurrency} = {item.rate} {item.code}
                </div>
                <div className={`text-[9px] font-bold mt-0.5 font-mono ${item.isUp ? 'text-brand-emerald' : 'text-brand-rose'}`}>
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyWidget;
