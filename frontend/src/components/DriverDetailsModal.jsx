import React from 'react';
import {
  RiUser3Line,
  RiFileList3Line,
  RiCalendarEventLine,
  RiPhoneLine,
  RiShieldCheckLine,
  RiRouteLine,
  RiAlertLine
} from 'react-icons/ri';

const STATUS_CLASSES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-250/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  'On Trip': 'bg-blue-50 text-blue-700 border-blue-250/30 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  'Off Duty': 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-450 dark:border-slate-800',
  Suspended: 'bg-red-50 text-red-700 border-red-250/30 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40',
};

export default function DriverDetailsModal({ driver, onClose }) {
  if (!driver) return null;

  return (
    <div className="space-y-6">
      
      {/* Driver Header Banner */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-650 flex-shrink-0 text-xl font-bold border border-slate-200 dark:border-slate-800">
            {driver.driverName.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 m-0">
              {driver.driverName}
            </h1>
            <p className="text-xs text-slate-450 mt-0.5">
              Contact: {driver.phone}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${STATUS_CLASSES[driver.status] || ''}`}>
          {driver.status}
        </span>
      </div>

      {/* Roster Specifications Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* License Number */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiFileList3Line className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">License Number</span>
            <span className="text-xs font-mono font-bold text-slate-750 dark:text-slate-200">{driver.licenseNumber}</span>
          </div>
        </div>

        {/* License Category */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiUser3Line className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Category Class</span>
            <span className="text-xs font-semibold text-slate-750 dark:text-slate-200">{driver.licenseCategory}</span>
          </div>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiCalendarEventLine className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Expiry Date</span>
            <span className="text-xs font-semibold text-slate-750 dark:text-slate-200">{driver.expiryDate}</span>
          </div>
        </div>

        {/* Safety Score */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiShieldCheckLine className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Safety Rating</span>
            <span className={`text-xs font-black ${driver.safetyScore >= 90 ? 'text-emerald-500' : driver.safetyScore >= 80 ? 'text-blue-500' : 'text-red-500'}`}>
              {driver.safetyScore} / 100
            </span>
          </div>
        </div>

      </div>

      {/* Driver safety dashboard */}
      <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/20 dark:border-sky-950/40 dark:bg-sky-950/10 space-y-3">
        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
          <RiShieldCheckLine size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Operator Safety Analysis</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-650 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <RiRouteLine className="text-slate-405" />
            <span>Active Vehicle: TX-2938-A</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RiAlertLine className="text-slate-405" />
            <span>Active Warnings: 0 flags</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-850/50">
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-bold text-slate-700 bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
        >
          Close Detail View
        </button>
      </div>

    </div>
  );
}
