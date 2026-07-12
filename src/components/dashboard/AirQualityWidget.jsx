import { AdjustmentsHorizontalIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const AirQualityWidget = () => {
  // AQI Level details
  const aqiValue = 42;
  const status = 'Good';
  const colorClass = 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20';
  const advice = 'Air quality is satisfactory, and air pollution poses little or no risk.';

  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans flex flex-col justify-between h-full min-h-[220px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <AdjustmentsHorizontalIcon className="h-4.5 w-4.5 text-brand-emerald" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
              Air Quality Index (AQI)
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-400 dark:text-dark-muted">EPA Standard</span>
        </div>

        {/* Large Meter Grid */}
        <div className="flex items-center gap-4 mt-2">
          {/* Circular Indicator */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            {/* SVG circle track and indicator */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100 dark:text-dark-border"
                strokeWidth="3"
                stroke="currentColor"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-emerald"
                strokeWidth="3.2"
                strokeDasharray="42, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-gray-900 dark:text-white leading-none block">{aqiValue}</span>
              <span className="text-[8px] text-gray-400 dark:text-dark-muted uppercase font-bold tracking-wider">AQI</span>
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 border rounded uppercase ${colorClass}`}>
              {status}
            </span>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1.5">PM2.5 Concentration</h4>
            <p className="text-[10px] text-gray-500 dark:text-dark-muted mt-0.5 leading-snug">
              Current PM2.5 levels: 10.2 µg/m³
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-border/40 flex items-start gap-2">
        <InformationCircleIcon className="h-4 w-4 text-brand-emerald shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-500 dark:text-dark-muted leading-relaxed">
          {advice}
        </p>
      </div>
    </div>
  );
};

export default AirQualityWidget;
