import React from 'react';
import {
  RiSettings2Line,
  RiCalendarLine,
  RiUser3Line,
  RiPinDistanceLine,
  RiCoinLine,
  RiInformationLine,
  RiCheckDoubleLine
} from 'react-icons/ri';

const STATUS_CLASSES = {
  Available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  'On Trip': 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  'In Shop': 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  Retired: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

export default function VehicleDetailsModal({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="space-y-6">
      
      {/* Header Info Banner */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-sky-500 uppercase">
            {vehicle.registrationNumber}
          </span>
          <h1 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 m-0 mt-1">
            {vehicle.vehicleName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Model: {vehicle.model} • Type: {vehicle.type}
          </p>
        </div>

        {/* Status Badge */}
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${STATUS_CLASSES[vehicle.status] || 'bg-slate-100'}`}>
          {vehicle.status}
        </span>
      </div>

      {/* Core Specs Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Capacity */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiUser3Line className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Capacity</span>
            <span className="text-xs font-semibold text-slate-750 dark:text-slate-200">{vehicle.capacity}</span>
          </div>
        </div>

        {/* Odometer */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiPinDistanceLine className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Odometer</span>
            <span className="text-xs font-semibold text-slate-750 dark:text-slate-200">{vehicle.odometer.toLocaleString()} km</span>
          </div>
        </div>

        {/* Cost */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiCoinLine className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Acquisition Cost</span>
            <span className="text-xs font-semibold text-slate-750 dark:text-slate-200">${vehicle.acquisitionCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
          <RiSettings2Line className="text-slate-400 text-lg flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Classification</span>
            <span className="text-xs font-semibold text-slate-750 dark:text-slate-200">{vehicle.type}</span>
          </div>
        </div>

      </div>

      {/* Maintenance & Tracking Widgets (Enterprise Details) */}
      <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/20 dark:border-sky-950/40 dark:bg-sky-950/10 space-y-3">
        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
          <RiInformationLine size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Fleet Management Insights</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-650 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <RiCalendarLine className="text-slate-400" />
            <span>Next Service: Oct 14, 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RiCheckDoubleLine className="text-slate-400" />
            <span>Safety Rating: Excellent</span>
          </div>
        </div>
      </div>

      {/* Actions */}
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
