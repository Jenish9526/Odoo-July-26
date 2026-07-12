import React, { useState } from 'react';
import {
  RiCarLine,
  RiCheckDoubleLine,
  RiToolsLine,
  RiSteering2Line,
  RiCompass3Line,
  RiTimeLine,
  RiPercentLine,
  RiFilter3Line,
  RiRefreshLine,
  RiArrowRightUpLine,
  RiArrowRightDownLine
} from 'react-icons/ri';

// Simulated database records for Latest Trips Table
const latestTripsData = [
  { id: 'TRIP-904', vehicle: 'Ford Transit Cargo', driver: 'Marcus Vance', type: 'Van', region: 'North', status: 'In Progress', time: '10:15 AM' },
  { id: 'TRIP-903', vehicle: 'Tesla Model Y', driver: 'Elena Rostova', type: 'Electric', region: 'East', status: 'Completed', time: '09:30 AM' },
  { id: 'TRIP-902', vehicle: 'Chevrolet Silverado', driver: 'John Callahan', type: 'Truck', region: 'West', status: 'Delayed', time: '08:45 AM' },
  { id: 'TRIP-901', vehicle: 'Toyota Corolla', driver: 'Sophia Martinez', type: 'Hybrid', region: 'South', status: 'Completed', time: '07:15 AM' },
  { id: 'TRIP-900', vehicle: 'Rivian R1T', driver: 'Alex Chen', type: 'Electric', region: 'North', status: 'Scheduled', time: '11:30 AM' },
  { id: 'TRIP-899', vehicle: 'Honda Odyssey', driver: 'David Miller', type: 'Van', region: 'West', status: 'Completed', time: 'Yesterday' },
  { id: 'TRIP-898', vehicle: 'Freightliner Box', driver: 'Frank Thompson', type: 'Truck', region: 'East', status: 'In Progress', time: 'Yesterday' },
];

const STATUS_CLASSES = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  Delayed: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40',
  Scheduled: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
};

export default function DashboardOverview() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Filter Table Data
  const filteredTrips = latestTripsData.filter((trip) => {
    const matchesType = selectedType === 'All' || trip.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || trip.status === selectedStatus;
    const matchesRegion = selectedRegion === 'All' || trip.region === selectedRegion;
    return matchesType && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-8 animate-slide-in-top">
      
      {/* Welcome Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 m-0">
            Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, routing indicators, and maintenance alerts for TransitOps.
          </p>
        </div>
        
        {/* Refresh Ticker */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 text-xs font-semibold">
          <RiRefreshLine className="animate-spin text-sky-500" />
          <span>Live Sync Active</span>
        </div>
      </div>

      {/* KPI Cards Row (7 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
        
        {/* Active Vehicles */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
          <span className="text-xl font-black text-slate-800 dark:text-white">42 / 50</span>
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
            <span className="font-bold">84.0%</span>
            <RiCarLine size={16} className="text-slate-350 dark:text-slate-500" />
          </div>
        </div>

        {/* Available Vehicles */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">28 Units</span>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Ready for dispatch</span>
            <RiCheckDoubleLine size={16} className="text-emerald-500" />
          </div>
        </div>

        {/* Vehicles in Maintenance */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Maintenance</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-500">6 Units</span>
          <div className="flex items-center justify-between text-[10px] text-slate-450">
            <span>Scheduled audits</span>
            <RiToolsLine size={16} className="text-amber-550" />
          </div>
        </div>

        {/* Drivers On Duty */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Duty</span>
          <span className="text-xl font-black text-slate-800 dark:text-white">19 / 24</span>
          <div className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400">
            <span className="font-bold">79.2%</span>
            <RiSteering2Line size={16} className="text-slate-350 dark:text-slate-500" />
          </div>
        </div>

        {/* Active Trips */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Trips</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">14 Routes</span>
          <div className="flex items-center justify-between text-[10px] text-slate-450">
            <span>Transmitting GPS</span>
            <RiCompass3Line size={16} className="text-blue-500" />
          </div>
        </div>

        {/* Pending Trips */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
          <span className="text-xl font-black text-slate-800 dark:text-white">5 Shifts</span>
          <div className="flex items-center justify-between text-[10px] text-slate-450">
            <span>Awaiting driver login</span>
            <RiTimeLine size={16} className="text-slate-400" />
          </div>
        </div>

        {/* Fleet Utilization % */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Utilization</span>
          <span className="text-xl font-black text-sky-600 dark:text-sky-400">84.0%</span>
          <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            <div className="flex items-center gap-0.5">
              <RiArrowRightUpLine />
              <span>+3.2%</span>
            </div>
            <RiPercentLine size={16} className="text-sky-500" />
          </div>
        </div>

      </div>

      {/* High Fidelity Interactive SVG Charts (4 Charts) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Chart 1: Trips Overview (Area Chart) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trips Overview (Weekly Volume)</h3>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total: 480 Trips</span>
          </div>

          <div className="relative h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="70" x2="480" y2="70" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="120" x2="480" y2="120" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />

              {/* Area path */}
              <path
                d="M 50 170 L 100 130 L 160 110 L 220 140 L 280 80 L 340 90 L 410 40 L 480 60 L 480 170 Z"
                fill="url(#areaGradient)"
              />
              
              {/* Line path */}
              <path
                d="M 50 170 L 100 130 L 160 110 L 220 140 L 280 80 L 340 90 L 410 40 L 480 60"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              <circle cx="100" cy="130" r="4.5" fill="#0284c7" className="cursor-pointer hover:r-6 transition-all" title="Mon: 45 trips" />
              <circle cx="160" cy="110" r="4.5" fill="#0284c7" className="cursor-pointer hover:r-6 transition-all" title="Tue: 60 trips" />
              <circle cx="220" cy="140" r="4.5" fill="#0284c7" className="cursor-pointer hover:r-6 transition-all" title="Wed: 35 trips" />
              <circle cx="280" cy="80" r="4.5" fill="#0284c7" className="cursor-pointer hover:r-6 transition-all" title="Thu: 82 trips" />
              <circle cx="340" cy="90" r="4.5" fill="#0284c7" className="cursor-pointer hover:r-6 transition-all" title="Fri: 75 trips" />
              <circle cx="410" cy="40" r="4.5" fill="#0284c7" className="cursor-pointer hover:r-6 transition-all" title="Sat: 110 trips" />
              <circle cx="480" cy="60" r="4.5" fill="#0284c7" className="cursor-pointer hover:r-6 transition-all" title="Sun: 95 trips" />

              {/* X Axis Labels */}
              <text x="50" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Sun</text>
              <text x="100" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Mon</text>
              <text x="160" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Tue</text>
              <text x="220" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wed</text>
              <text x="280" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Thu</text>
              <text x="340" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Fri</text>
              <text x="410" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Sat</text>
              <text x="480" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Vehicle Status (Donut Chart) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Status Composition</h3>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-64">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="2.5" className="dark:stroke-slate-800" />
                
                {/* Available Ring (Green) - 50% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="50 100" strokeDashoffset="0" />
                
                {/* On Trip Ring (Blue) - 30% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="30 100" strokeDashoffset="-50" />
                
                {/* In Shop Ring (Amber) - 15% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="15 100" strokeDashoffset="-80" />
                
                {/* Retired Ring (Slate) - 5% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="5 100" strokeDashoffset="-95" />
              </svg>
              {/* Inner Label */}
              <div className="absolute text-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white">50</span>
                <span className="text-[10px] text-slate-450 block font-bold uppercase">Total Units</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Available: 25 (50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-sky-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">On Active Trip: 15 (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">In Shop: 7 (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Retired: 3 (5%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Fuel Consumption (Line Chart) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fuel Consumption (x100 Liters)</h3>
            <span className="text-xs font-bold text-red-500 flex items-center gap-0.5">
              <RiArrowRightDownLine />
              <span>-4.5% efficiency</span>
            </span>
          </div>

          <div className="relative h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="70" x2="480" y2="70" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="120" x2="480" y2="120" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />

              {/* Line path */}
              <path
                d="M 50 140 L 120 120 L 190 150 L 260 90 L 330 70 L 400 110 L 480 80"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points */}
              <circle cx="120" cy="120" r="4.5" fill="#ef4444" />
              <circle cx="190" cy="150" r="4.5" fill="#ef4444" />
              <circle cx="260" cy="90" r="4.5" fill="#ef4444" />
              <circle cx="330" cy="70" r="4.5" fill="#ef4444" />
              <circle cx="400" cy="110" r="4.5" fill="#ef4444" />
              <circle cx="480" cy="80" r="4.5" fill="#ef4444" />

              {/* X Axis Labels */}
              <text x="50" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wk 1</text>
              <text x="120" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wk 2</text>
              <text x="190" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wk 3</text>
              <text x="260" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wk 4</text>
              <text x="330" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wk 5</text>
              <text x="400" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wk 6</text>
              <text x="480" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Wk 7</text>
            </svg>
          </div>
        </div>

        {/* Chart 4: Maintenance Cost (Bar Chart) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance Cost Breakdown ($)</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <RiArrowRightUpLine />
              <span>Under budget</span>
            </span>
          </div>

          <div className="relative h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="70" x2="480" y2="70" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="120" x2="480" y2="120" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />
              <line x1="50" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-slate-800" />

              {/* Vertical Bars */}
              {/* Bar 1: Apr ($14k) */}
              <rect x="75" y="60" width="28" height="110" fill="#a855f7" rx="4" />
              {/* Bar 2: May ($18k) */}
              <rect x="155" y="30" width="28" height="140" fill="#a855f7" rx="4" />
              {/* Bar 3: Jun ($12k) */}
              <rect x="235" y="80" width="28" height="90" fill="#a855f7" rx="4" />
              {/* Bar 4: Jul ($9k) */}
              <rect x="315" y="110" width="28" height="60" fill="#a855f7" rx="4" />
              {/* Bar 5: Aug ($15k) */}
              <rect x="395" y="50" width="28" height="120" fill="#a855f7" rx="4" />

              {/* Axis Labels */}
              <text x="89" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Apr</text>
              <text x="169" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">May</text>
              <text x="249" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Jun</text>
              <text x="329" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Jul</text>
              <text x="409" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle">Aug</text>
            </svg>
          </div>
        </div>

      </div>

      {/* Latest Trips Table Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
        
        {/* Table Title and Filters Header */}
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-850/50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-2">
            <RiCompass3Line className="text-sky-500 text-lg" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 m-0">
              Latest Operations Trips Log
            </h2>
          </div>

          {/* Core Table Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter by Type */}
            <div className="flex items-center gap-1.5 flex-grow sm:flex-grow-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Electric">Electric</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 flex-grow sm:flex-grow-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            {/* Filter by Region */}
            <div className="flex items-center gap-1.5 flex-grow sm:flex-grow-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
              >
                <option value="All">All Regions</option>
                <option value="North">North</option>
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-xs font-bold uppercase">
                <th className="px-6 py-4">Trip ID</th>
                <th className="px-6 py-4">Vehicle Name</th>
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Departure</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-450 font-medium">
                    No matching trip logs found.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-sky-600 dark:text-sky-400">{trip.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{trip.vehicle}</td>
                    <td className="px-6 py-4 font-medium">{trip.driver}</td>
                    <td className="px-6 py-4 text-xs">{trip.type}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{trip.region}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{trip.time}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full border ${STATUS_CLASSES[trip.status] || ''}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Collapse Cards */}
        <div className="block lg:hidden p-4 divide-y divide-slate-150/60 dark:divide-slate-800">
          {filteredTrips.length === 0 ? (
            <p className="text-center py-8 text-slate-450 text-sm font-medium">
              No matching trip logs found.
            </p>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 block">{trip.id}</span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">{trip.vehicle}</h3>
                    <p className="text-xs text-slate-500">Driver: {trip.driver} • {trip.type}</p>
                  </div>
                  
                  <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${STATUS_CLASSES[trip.status] || ''}`}>
                    {trip.status}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>Region: <strong className="text-slate-700 dark:text-slate-350">{trip.region}</strong></span>
                  <span>Departure: <strong>{trip.time}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
