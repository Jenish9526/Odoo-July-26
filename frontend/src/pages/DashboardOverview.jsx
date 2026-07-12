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
  RiArrowRightDownLine,
  RiAlertLine,
  RiCalendarLine,
  RiEyeLine,
  RiEditLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

// Mock options
const vehicleTypes = ['All', 'Electric', 'Truck', 'Van', 'Hybrid'];
const statusOptions = ['All', 'On Trip', 'Completed', 'Delayed', 'Scheduled', 'Draft', 'Cancelled'];
const regionOptions = ['All', 'North', 'East', 'South', 'West'];

// Recharts colors
const CHART_COLORS = ['#2563EB', '#F59E0B', '#22C55E', '#EF4444', '#8B5CF6', '#EC4899'];

// Simulated database records for Latest Trips Table
const latestTripsData = [
  { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex J.', status: 'Completed', eta: 'Done', type: 'Van', region: 'North' },
  { id: 'TR002', vehicle: 'TRK-12', driver: 'Elena R.', status: 'On Trip', eta: '10:45 AM', type: 'Truck', region: 'East' },
  { id: 'TR003', vehicle: 'MINI-03', driver: 'John C.', status: 'Dispatched', eta: '11:15 AM', type: 'Van', region: 'West' },
  { id: 'TR004', vehicle: 'TRUCK-11', driver: 'Marcus V.', status: 'Draft', eta: 'Awaiting dispatch', type: 'Truck', region: 'North' },
  { id: 'TR005', vehicle: 'SEMI-11', driver: 'David M.', status: 'Cancelled', eta: '--', type: 'Hybrid', region: 'South' },
];

const STATUS_CLASSES = {
  Draft: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
  Dispatched: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  'On Trip': 'bg-orange-50 text-orange-700 border-orange-250/30 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-250/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  Cancelled: 'bg-red-50 text-red-700 border-red-250/30 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40',
};

// Recharts data sets
const tripsOverviewData = [
  { name: 'Mon', Trips: 12 },
  { name: 'Tue', Trips: 18 },
  { name: 'Wed', Trips: 15 },
  { name: 'Thu', Trips: 22 },
  { name: 'Fri', Trips: 18 },
  { name: 'Sat', Trips: 10 },
  { name: 'Sun', Trips: 14 },
];

const vehicleUsageData = [
  { name: 'Heavy Truck', Usage: 85 },
  { name: 'Delivery Van', Usage: 92 },
  { name: 'Passenger Bus', Usage: 64 },
  { name: 'Fuel Tanker', Usage: 78 },
];

const fuelConsumptionData = [
  { name: 'Mon', Liters: 450 },
  { name: 'Tue', Liters: 580 },
  { name: 'Wed', Liters: 510 },
  { name: 'Thu', Liters: 630 },
  { name: 'Fri', Liters: 590 },
  { name: 'Sat', Liters: 320 },
  { name: 'Sun', Liters: 380 },
];

const maintCostData = [
  { name: 'Truck-11', Cost: 18000 },
  { name: 'Mini-03', Cost: 1800 },
  { name: 'Van-05', Cost: 2100 },
  { name: 'Truck-08', Cost: 4500 },
  { name: 'Bus-02', Cost: 3900 },
];

export default function DashboardOverview() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  
  const [appliedFilters, setAppliedFilters] = useState({
    type: 'All',
    status: 'All',
    region: 'All'
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      type: selectedType,
      status: selectedStatus,
      region: selectedRegion
    });
  };

  const handleResetFilters = () => {
    setSelectedType('All');
    setSelectedStatus('All');
    setSelectedRegion('All');
    setAppliedFilters({
      type: 'All',
      status: 'All',
      region: 'All'
    });
  };

  const filteredTrips = latestTripsData.filter((trip) => {
    const matchesType = appliedFilters.type === 'All' || trip.type === appliedFilters.type;
    const matchesStatus = appliedFilters.status === 'All' || trip.status === appliedFilters.status;
    const matchesRegion = appliedFilters.region === 'All' || trip.region === appliedFilters.region;
    return matchesType && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Welcome Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-805 dark:text-slate-100 m-0">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor fleet operations, vehicles, drivers, trips, and transport performance in real time.
          </p>
        </div>
        
        {/* Refresh Ticker */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 text-xs font-semibold">
          <RiRefreshLine className="animate-spin text-orange-500" />
          <span>Live Sync Active</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Vehicle Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer dark:text-slate-300"
            >
              {vehicleTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer dark:text-slate-300"
            >
              {statusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer dark:text-slate-300"
            >
              {regionOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer transition-all border-none"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* KPI Section (7 Premium Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        {/* Card 1: Active Vehicles */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Vehicles</span>
          <span className="text-2xl font-black text-slate-805 dark:text-white block">53</span>
          <div className="flex items-center justify-between text-xs text-sky-500">
            <span className="font-semibold">In service</span>
            <RiCarLine size={16} />
          </div>
        </div>

        {/* Card 2: Available Vehicles */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform border-l-2 border-l-emerald-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available</span>
          <span className="text-2xl font-black text-emerald-500 block">42</span>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Ready dispatch</span>
            <RiCheckDoubleLine size={16} />
          </div>
        </div>

        {/* Card 3: Vehicles In Maintenance */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform border-l-2 border-l-orange-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Shop</span>
          <span className="text-2xl font-black text-orange-500 block">05</span>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Servicing logs</span>
            <RiToolsLine size={16} />
          </div>
        </div>

        {/* Card 4: Active Trips */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Trips</span>
          <span className="text-2xl font-black text-sky-505 block">18</span>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>GPS Tracking</span>
            <RiCompass3Line size={16} className="text-sky-500" />
          </div>
        </div>

        {/* Card 5: Pending Trips */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
          <span className="text-2xl font-black text-slate-805 dark:text-white block">09</span>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Next dispatcher</span>
            <RiTimeLine size={16} />
          </div>
        </div>

        {/* Card 6: Drivers On Duty */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drivers Duty</span>
          <span className="text-2xl font-black text-emerald-500 block">26</span>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Safety certified</span>
            <RiSteering2Line size={16} />
          </div>
        </div>

        {/* Card 7: Fleet Utilization (Circular Progress Indicator) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 flex items-center justify-between h-28 hover:scale-[1.02] transition-transform">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Utilization</span>
            <span className="text-2xl font-black text-orange-505 block mt-1">81%</span>
          </div>
          {/* Circular Loader */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-800" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="81 100" />
            </svg>
            <span className="absolute text-[8px] font-bold text-slate-500">81%</span>
          </div>
        </div>

      </div>

      {/* Main Content Split: Recent Trips Table (Left) & Vehicle Status Progress Bars (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Panel: Recent Trips */}
        <div className="xl:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Recent Dispatched Trips</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Live routing logs and ETA details.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                  <th className="px-4 py-3">Trip ID</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">ETA</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-450 font-medium">
                      No matching trips found.
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map(trip => (
                    <tr key={trip.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-sky-500">{trip.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-850 dark:text-slate-100">{trip.vehicle}</td>
                      <td className="px-4 py-3 font-medium">{trip.driver}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${STATUS_CLASSES[trip.status] || ''}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-450">{trip.eta}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1 rounded text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer">
                            <RiEyeLine size={13} />
                          </button>
                          <button className="p-1 rounded text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer">
                            <RiEditLine size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
            </table>
          </div>
        </div>

        {/* Right Panel: Vehicle Status Composition */}
        <div className="xl:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Vehicle Status Composition</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Availability and maintenance ratios.</p>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            {/* Available */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-600 dark:text-slate-300">Available</span>
                <span className="text-emerald-500">50% (25 Units)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[50%]" />
              </div>
            </div>

            {/* On Trip */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-600 dark:text-slate-300">On Trip</span>
                <span className="text-sky-505">30% (15 Units)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full w-[30%]" />
              </div>
            </div>

            {/* In Shop */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-600 dark:text-slate-300">In Shop</span>
                <span className="text-orange-500">15% (7 Units)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full w-[15%]" />
              </div>
            </div>

            {/* Retired */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-600 dark:text-slate-300">Retired</span>
                <span className="text-slate-450">5% (3 Units)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full w-[5%]" />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Second Row Charts: Line, Bar, Area, Donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Chart 1: Trips Overview Line Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Daily Trips Overview</span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tripsOverviewData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} />
                <YAxis stroke="#94a3b8" fontSize={8} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
                <Line type="monotone" dataKey="Trips" stroke="#2563EB" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vehicle Usage Bar Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Vehicle Usage Ratios (%)</span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleUsageData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} />
                <YAxis stroke="#94a3b8" fontSize={8} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
                <Bar dataKey="Usage" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Fuel Consumption Area Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Fuel Consumed (Liters)</span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} />
                <YAxis stroke="#94a3b8" fontSize={8} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
                <Area type="monotone" dataKey="Liters" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Maintenance Cost Donut Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block">Service Cost Breakdown</span>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maintCostData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="Cost"
                >
                  {maintCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Activities (Left) & Live Alerts (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Activities Timeline */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Recent Activities Timeline</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time audit updates across dispatch operations.</p>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Act 1 */}
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-slate-400 w-16 pt-0.5">10:15 AM</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Vehicle VAN-05 dispatched</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Route assigned to Operator Alex J.</span>
              </div>
            </div>

            {/* Act 2 */}
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-slate-400 w-16 pt-0.5">09:30 AM</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Maintenance completed for Truck-11</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Full transmission audit completed. Cost ₹18,000.</span>
              </div>
            </div>

            {/* Act 3 */}
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-slate-400 w-16 pt-0.5">08:45 AM</span>
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Fuel log added for Mini-03</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Refill transaction of 42L verified.</span>
              </div>
            </div>

            {/* Act 4 */}
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-slate-400 w-16 pt-0.5">Yesterday</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Driver Alex J. completed trip TR001</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Completed with no delays.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Alerts */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50">
            <h2 className="text-sm font-black text-slate-805 dark:text-slate-100 m-0">Live Active Alerts</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Critical notifications requiring dispatcher action.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Alert 1 */}
            <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-colors flex items-start gap-2.5">
              <RiAlertLine size={16} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-red-505 block">Maintenance Due</span>
                <span className="text-[10px] text-slate-450 block mt-0.5">Semi-11 odometer exceeds 120k threshold.</span>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="p-3.5 rounded-xl border border-orange-500/10 bg-orange-500/5 hover:bg-orange-500/10 transition-colors flex items-start gap-2.5">
              <RiAlertLine size={16} className="text-orange-505 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-orange-505 block">License Expiry</span>
                <span className="text-[10px] text-slate-450 block mt-0.5">Driver Alex J. license renewals due in 12 days.</span>
              </div>
            </div>

            {/* Alert 3 */}
            <div className="p-3.5 rounded-xl border border-sky-505/10 bg-sky-500/5 hover:bg-sky-505/10 transition-colors flex items-start gap-2.5">
              <RiAlertLine size={16} className="text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sky-505 block">Pending Dispatch</span>
                <span className="text-[10px] text-slate-450 block mt-0.5">Trip TR006 holds weight allocation compliance checks.</span>
              </div>
            </div>

            {/* Alert 4 */}
            <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-colors flex items-start gap-2.5">
              <RiAlertLine size={16} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-red-505 block">Fuel Budget Exceeded</span>
                <span className="text-[10px] text-slate-450 block mt-0.5">Refueling costs for TRUCK-11 exceeds week quota limit.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
