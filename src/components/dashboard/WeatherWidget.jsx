import { SunIcon } from '@heroicons/react/24/outline';

const WeatherWidget = () => {
  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans flex flex-col justify-between h-full min-h-[220px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
            Weather Signal
          </span>
          <span className="text-[10px] text-brand-cyan font-mono font-semibold uppercase bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
            Pacific
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none">San Francisco</h3>
            <span className="text-xs text-gray-400 dark:text-dark-muted mt-1 block">Clear sky</span>
          </div>
          <SunIcon className="h-10 w-10 text-amber-400 animate-spin [animation-duration:20s]" />
        </div>
      </div>

      <div className="mt-6 flex justify-between items-end">
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none tracking-tight">
          68°F
        </div>
        
        <div className="flex gap-4 text-[10px] text-gray-500 dark:text-dark-muted font-mono leading-none">
          <div className="flex flex-col gap-1 items-end">
            <span>Humidity</span>
            <span className="text-gray-900 dark:text-white font-bold">54%</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span>Wind speed</span>
            <span className="text-gray-900 dark:text-white font-bold">12 mph</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
