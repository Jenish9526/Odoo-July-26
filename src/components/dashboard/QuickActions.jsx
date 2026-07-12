import React from 'react';
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  PlusIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';

const QuickActions = ({ onRefresh, onAddWidget, onExportCSV, onOpenSettings }) => {
  const actionsList = [
    {
      label: 'Refresh Console',
      icon: ArrowPathIcon,
      onClick: onRefresh,
      colorClass: 'text-brand-violet hover:bg-brand-violet/10 hover:border-brand-violet/30 border-gray-200 dark:border-dark-border',
    },
    {
      label: 'Add Module',
      icon: PlusIcon,
      onClick: onAddWidget,
      colorClass: 'text-brand-cyan hover:bg-brand-cyan/10 hover:border-brand-cyan/30 border-gray-200 dark:border-dark-border',
    },
    {
      label: 'Download PDF',
      icon: ArrowDownTrayIcon,
      onClick: () => alert('Generating PDF analytics report... Download ready!'),
      colorClass: 'text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/30 border-gray-200 dark:border-dark-border',
    },
    {
      label: 'Export CSV',
      icon: DocumentArrowDownIcon,
      onClick: onExportCSV,
      colorClass: 'text-brand-emerald hover:bg-brand-emerald/10 hover:border-brand-emerald/30 border-gray-200 dark:border-dark-border',
    },
    {
      label: 'System Config',
      icon: Cog6ToothIcon,
      onClick: onOpenSettings,
      colorClass: 'text-gray-500 hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-dark-bg/25 dark:hover:border-dark-border/60 border-gray-200 dark:border-dark-border',
    },
  ];

  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans flex flex-col justify-between h-full transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
            Console Quick Actions
          </span>
          <span className="text-[9px] font-mono text-gray-400 dark:text-dark-muted">Operator Console</span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {actionsList.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={action.onClick}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-200 group gap-1.5 ${action.colorClass}`}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-bold tracking-tight select-none">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
