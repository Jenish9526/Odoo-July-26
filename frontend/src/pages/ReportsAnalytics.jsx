import React, { useState, useEffect } from 'react';
import {
  RiFileChartLine,
  RiDownloadLine,
  RiPrinterLine,
  RiCalendarLine,
  RiGasStationLine,
  RiCarLine,
  RiWallet3Line,
  RiFundsLine,
  RiInformationLine,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiEyeLine,
  RiFileTextLine,
  RiSparklingLine,
  RiRestartLine
} from 'react-icons/ri';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Recharts colors
const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

// Mock ROI calculations initial data
const initialVehicleAnalytics = [
  { id: 1, name: 'Truck-11', type: 'Heavy Truck', region: 'North', trips: 48, fuel: 3100, maint: 18000, revenue: 45000, acquisition: 120000, status: 'Active' },
  { id: 2, name: 'Mini-03', type: 'Delivery Van', region: 'West', trips: 92, fuel: 1200, maint: 1800, revenue: 28000, acquisition: 35000, status: 'Active' },
  { id: 3, name: 'Van-05', type: 'Delivery Van', region: 'South', trips: 76, fuel: 1450, maint: 2100, revenue: 24000, acquisition: 38000, status: 'Active' },
  { id: 4, name: 'Truck-08', type: 'Heavy Truck', region: 'North', trips: 35, fuel: 2800, maint: 4500, revenue: 35000, acquisition: 110000, status: 'In Shop' },
  { id: 5, name: 'Bus-02', type: 'Passenger Bus', region: 'East', trips: 58, fuel: 2100, maint: 3900, revenue: 31000, acquisition: 75000, status: 'Active' },
];

const monthlyRevenueData = [
  { name: 'Jan', Revenue: 62000, Expense: 34000 },
  { name: 'Feb', Revenue: 75000, Expense: 38000 },
  { name: 'Mar', Revenue: 81000, Expense: 42000 },
  { name: 'Apr', Revenue: 95000, Expense: 48000 },
  { name: 'May', Revenue: 108000, Expense: 52000 },
  { name: 'Jun', Revenue: 115000, Expense: 55000 },
  { name: 'Jul', Revenue: 125000, Expense: 59000 },
];

const topCostData = [
  { name: 'Truck-11', Fuel: 13600, Maintenance: 18000, Total: 31600 },
  { name: 'Mini-03', Fuel: 3600, Maintenance: 1800, Total: 5400 },
  { name: 'Van-05', Fuel: 4350, Maintenance: 2100, Total: 6450 },
  { name: 'Truck-08', Fuel: 8400, Maintenance: 4500, Total: 12900 },
  { name: 'Bus-02', Fuel: 6300, Maintenance: 3900, Total: 10200 },
];

const utilizationTrend = [
  { name: 'Mon', Rate: 76 },
  { name: 'Tue', Rate: 79 },
  { name: 'Wed', Rate: 82 },
  { name: 'Thu', Rate: 80 },
  { name: 'Fri', Rate: 84 },
  { name: 'Sat', Rate: 78 },
  { name: 'Sun', Rate: 81 },
];

const dailyTripsData = [
  { name: 'Mon', Trips: 42 },
  { name: 'Tue', Trips: 48 },
  { name: 'Wed', Trips: 55 },
  { name: 'Thu', Trips: 51 },
  { name: 'Fri', Trips: 59 },
  { name: 'Sat', Trips: 34 },
  { name: 'Sun', Trips: 38 },
];

const maintCostData = [
  { name: 'Engine Repair', value: 12000 },
  { name: 'Tire Swap', value: 3500 },
  { name: 'Brakes Service', value: 2500 },
  { name: 'Electrical Logs', value: 1800 },
  { name: 'Oil & Lube', value: 900 },
];

const fuelCostDistribution = [
  { name: 'Heavy Truck', value: 24800 },
  { name: 'Delivery Van', value: 7100 },
  { name: 'Passenger Bus', value: 4170 },
];

const ITEMS_PER_PAGE = 5;

export default function ReportsAnalytics() {
  const [analytics, setAnalytics] = useState(initialVehicleAnalytics);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // ROI calculation utility
  const calculateROI = (veh) => {
    const revenue = veh.revenue;
    const fuelCost = veh.fuel * 3.5; // average cost estimate
    const maintCost = veh.maint;
    const roi = ((revenue - fuelCost - maintCost) / veh.acquisition) * 100;
    return roi.toFixed(1);
  };

  // Fuel efficiency calculation
  const calculateEfficiency = (veh) => {
    return (veh.trips * 12.4 / (veh.fuel / 45)).toFixed(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setRegionFilter('All');
    setTypeFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  // Filter application
  const filteredAnalytics = analytics.filter(veh => {
    const matchesSearch = veh.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'All' || veh.region === regionFilter;
    const matchesType = typeFilter === 'All' || veh.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || veh.status === statusFilter;
    return matchesSearch && matchesRegion && matchesType && matchesStatus;
  });

  const paginatedData = filteredAnalytics.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredAnalytics.length / ITEMS_PER_PAGE);

  // Trigger file print / export simulation
  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Successfully generated and exported analytical report in ${format} format!`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-805 dark:text-slate-100 m-0">
            Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze fleet performance, operational costs, vehicle utilization, and business insights with interactive dashboards.
          </p>
        </div>

        {/* Top Navbar Action Controllers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850/50 rounded-xl text-xs text-slate-500">
            <RiCalendarLine />
            <span>Jul 01, 2026 - Jul 12, 2026</span>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleExport('CSV')}
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-850/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <RiDownloadLine />
              CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-850/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <RiFileTextLine />
              PDF
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-850/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <RiPrinterLine />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Fuel Efficiency */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 hover:translate-y-[-2px] transition-transform space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fuel Efficiency</span>
              <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">8.4 km/L</span>
            </div>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <RiGasStationLine size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
            <span>+7.2%</span>
            <span className="text-slate-400 font-medium">vs last month</span>
          </div>
        </div>

        {/* KPI 2: Fleet Utilization */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 hover:translate-y-[-2px] transition-transform space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fleet Utilization</span>
              <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">81%</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <RiCarLine size={18} />
            </div>
          </div>
          {/* Blue progress loader */}
          <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '81%' }}
              transition={{ duration: 1 }}
              className="bg-blue-550 h-full rounded-full"
            />
          </div>
        </div>

        {/* KPI 3: Operational Cost */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 hover:translate-y-[-2px] transition-transform space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Cost</span>
              <span className="text-2xl font-black text-orange-500 mt-1 block">₹34,070</span>
            </div>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-550">
              <RiWallet3Line size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
            <span>-2.4%</span>
            <span className="text-slate-400 font-medium">cost optimization</span>
          </div>
        </div>

        {/* KPI 4: Vehicle ROI */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 hover:translate-y-[-2px] transition-transform space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle ROI</span>
              <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">14.2%</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <RiFundsLine size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
            <span>+1.8%</span>
            <span className="text-slate-400 font-medium">fleet profit margin</span>
          </div>
        </div>

      </div>

      {/* ROI Information Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-850/50 flex items-start sm:items-center gap-3">
        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
          <RiInformationLine size={16} />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-750 dark:text-slate-200">Vehicle ROI Formula Indicator:</span>{' '}
          Vehicle ROI = (Revenue − Fuel Cost − Maintenance Cost) ÷ Vehicle Acquisition Cost. Values are computed dynamically inside our analytical summary matrix.
        </div>
      </div>

      {/* Main Analytics Row (Revenue Bar Chart & Costliest Vehicles Chart) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Side: Monthly Revenue Bar Chart */}
        <div className="xl:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Monthly Revenue & Expenses</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Jan - Jul operational billing cycles overview.</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Top Costliest Vehicles Horizontal Chart */}
        <div className="xl:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Top Costliest Vehicles</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Top asset expenses split by fuel and service costs.</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCostData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Fuel" stackId="a" fill="#38bdf8" />
                <Bar dataKey="Maintenance" stackId="a" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Second Row Charts: Fleet, Trips, Maintenance Donut, Fuel Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Chart 1: Fleet Utilization Trend (Line) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Fleet Utilization Trend</span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} />
                <YAxis stroke="#94a3b8" fontSize={8} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
                <Line type="monotone" dataKey="Rate" stroke="#2563EB" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Trips Area Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Daily Trips Volume</span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTripsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} />
                <YAxis stroke="#94a3b8" fontSize={8} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
                <Area type="monotone" dataKey="Trips" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Maintenance Cost (Donut) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block">Service Cost Shares</span>
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
                  dataKey="value"
                >
                  {maintCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Fuel Cost Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block">Fuel Cost Distribution</span>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fuelCostDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={55}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: '7px', fill: '#94a3b8' }}
                >
                  {fuelCostDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', fontSize: '9px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Insights glassmorphic cards panel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
        
        <div className="flex items-center gap-2 text-orange-500">
          <RiSparklingLine size={18} />
          <h2 className="text-xs font-bold uppercase tracking-widest m-0">AI Operational Insights</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/10 hover:border-blue-500/20 transition-colors">
            <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Fleet Utilization</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-250 mt-1">Fleet utilization increased by 12% following optimized dispatcher scheduling loops.</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors">
            <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Fuel Consumption</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-250 mt-1">Fuel efficiency improved by 7% due to newer van tires deployed in Q2.</p>
          </div>

          <div className="p-4 rounded-xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/10 hover:border-red-500/20 transition-colors">
            <p className="text-[10px] text-slate-455 uppercase font-bold tracking-wider">Maintenance Alerts</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-250 mt-1">Truck-11 generated the highest maintenance costs, reflecting a full transmission swap.</p>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/5 dark:bg-orange-950/20 border border-orange-500/10 hover:border-orange-500/20 transition-colors">
            <p className="text-[10px] text-slate-455 uppercase font-bold tracking-wider">ROI Analysis</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-250 mt-1">Mini-03 generated the highest ROI (70.6%) from consistent inner-city parcel routes.</p>
          </div>

        </div>

      </div>

      {/* FILTER PANEL & SUMMARY TABLE */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-850/50">
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Vehicle Performance Matrix</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Detailed operations table calculating yield indexes.</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-2 items-center">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[150px] flex items-center">
            <RiSearchLine className="absolute left-2.5 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search vehicle name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none bg-slate-50 dark:bg-slate-900 focus:border-orange-500 dark:text-white"
            />
          </div>

          {/* Region */}
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 dark:text-slate-300"
          >
            <option value="All">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 dark:text-slate-300"
          >
            <option value="All">All Vehicle Types</option>
            <option value="Heavy Truck">Heavy Truck</option>
            <option value="Delivery Van">Delivery Van</option>
            <option value="Passenger Bus">Passenger Bus</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Shop">In Shop</option>
          </select>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <RiRestartLine />
            Reset Filters
          </button>

        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-250/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                <th className="px-4 py-2.5">Vehicle</th>
                <th className="px-4 py-2.5 text-center">Trips</th>
                <th className="px-4 py-2.5">Fuel Used</th>
                <th className="px-4 py-2.5">Maintenance</th>
                <th className="px-4 py-2.5">Revenue</th>
                <th className="px-4 py-2.5">Op Cost</th>
                <th className="px-4 py-2.5">Efficiency</th>
                <th className="px-4 py-2.5 text-center">ROI</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-slate-450 font-medium">
                    No vehicle performance logs found.
                  </td>
                </tr>
              ) : (
                paginatedData.map(veh => (
                  <tr key={veh.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-4 py-2.5">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{veh.name}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{veh.type} • {veh.region}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center font-semibold">{veh.trips}</td>
                    <td className="px-4 py-2.5 text-slate-500">{veh.fuel} L</td>
                    <td className="px-4 py-2.5 font-semibold text-red-500">${veh.maint.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-500">${veh.revenue.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-bold">${(veh.fuel * 3.5 + veh.maint).toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-semibold text-sky-500">{calculateEfficiency(veh)} km/L</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${Number(calculateROI(veh)) > 15 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400'}`}>
                        {calculateROI(veh)}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${veh.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-250/30 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-250/30 dark:bg-red-950/20 dark:text-red-400'}`}>
                        {veh.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => alert(`Showing analytics drill down details for ${veh.name}`)}
                        className="p-1 rounded text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <RiEyeLine size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination control footer */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center text-[10px] pt-3 border-t border-slate-105 dark:border-slate-900">
            <span className="text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-40"
              >
                <RiArrowLeftSLine />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-40"
              >
                <RiArrowRightSLine />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
