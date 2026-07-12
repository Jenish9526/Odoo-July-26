import React, { useState, useEffect, useRef } from 'react';
import {
  RiToolsLine,
  RiSearchLine,
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiAlertFill,
  RiShieldCheckLine,
  RiUser3Line,
  RiCarLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiArrowRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';

// Available vehicles mock for select dropdown
const mockVehicles = [
  { id: 'Van-05', name: 'Ford Transit Van-05' },
  { id: 'Truck-02', name: 'Hino Cargo Truck-02' },
  { id: 'Tanker-01', name: 'Volvo Fuel Tanker-01' },
  { id: 'Van-09', name: 'Mercedes Sprinter Van-09' },
  { id: 'Semi-11', name: 'Peterbilt Semi-11' },
];

const mockMechanics = [
  { name: 'Bill Evans', id: 'M01' },
  { name: 'Dave Miller', id: 'M02' },
  { name: 'Chris Evans', id: 'M03' },
  { name: 'Marcus Vance', id: 'M04' },
  { name: 'Robert Downey', id: 'M05' },
];

const initialLogs = [
  { id: 1, vehicleId: 'Van-05', type: 'Oil Change', mechanic: 'Bill Evans', cost: 120, startDate: '2026-07-10', endDate: '2026-07-11', status: 'Completed' },
  { id: 2, vehicleId: 'Truck-02', type: 'Engine Repair', mechanic: 'Dave Miller', cost: 1850, startDate: '2026-07-12', endDate: '2026-07-15', status: 'In Shop' },
  { id: 3, vehicleId: 'Tanker-01', type: 'Brake Service', mechanic: 'Chris Evans', cost: 450, startDate: '2026-07-13', endDate: '2026-07-14', status: 'Scheduled' },
  { id: 4, vehicleId: 'Van-09', type: 'Tyre Replacement', mechanic: 'Marcus Vance', cost: 320, startDate: '2026-07-09', endDate: '2026-07-10', status: 'Completed' },
  { id: 5, vehicleId: 'Semi-11', type: 'General Service', mechanic: 'Robert Downey', cost: 890, startDate: '2026-07-08', endDate: '2026-07-11', status: 'Delayed' },
];

const MAINTENANCE_TYPES = [
  'Oil Change',
  'Brake Service',
  'Tyre Replacement',
  'Engine Repair',
  'Battery Replacement',
  'General Service'
];

const STATUS_BADGES = {
  'In Shop': 'bg-orange-50 text-orange-700 border-orange-250/30 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-250/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-250/30 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  Delayed: 'bg-red-50 text-red-700 border-red-250/30 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40',
};

const ITEMS_PER_PAGE = 5;

export default function VehicleMaintenance() {
  const [logs, setLogs] = useState(initialLogs);
  
  // Search & Filters state
  const [searchVehicle, setSearchVehicle] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMechanic, setFilterMechanic] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [type, setType] = useState('Oil Change');
  const [selectedMechanic, setSelectedMechanic] = useState(mockMechanics[0].name);
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('In Shop');
  const [editingId, setEditingId] = useState(null);

  // Vehicle searchable dropdown states
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVehicleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save/Update Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedVehicle || !startDate || !endDate || !cost) {
      alert('Please fill out all required fields.');
      return;
    }

    if (editingId) {
      setLogs(prev => prev.map(log => log.id === editingId ? {
        ...log,
        vehicleId: selectedVehicle.id,
        type,
        mechanic: selectedMechanic,
        cost: Number(cost),
        startDate,
        endDate,
        status
      } : log));
      setEditingId(null);
    } else {
      const newId = logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1;
      const newLog = {
        id: newId,
        vehicleId: selectedVehicle.id,
        type,
        mechanic: selectedMechanic,
        cost: Number(cost),
        startDate,
        endDate,
        status
      };
      setLogs(prev => [newLog, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (log) => {
    const matchedVehicle = mockVehicles.find(v => v.id === log.vehicleId);
    setSelectedVehicle(matchedVehicle || { id: log.vehicleId, name: log.vehicleId });
    setEditingId(log.id);
    setType(log.type);
    setSelectedMechanic(log.mechanic);
    setCost(log.cost.toString());
    setStartDate(log.startDate);
    setEndDate(log.endDate);
    setStatus(log.status);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this service record?')) {
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleComplete = (id) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, status: 'Completed' } : log));
  };

  const resetForm = () => {
    setSelectedVehicle(null);
    setIssueDescription('');
    setType('Oil Change');
    setSelectedMechanic(mockMechanics[0].name);
    setCost('');
    setStartDate('');
    setEndDate('');
    setStatus('In Shop');
    setEditingId(null);
    setDropdownSearch('');
  };

  // Filters logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.vehicleId.toLowerCase().includes(searchVehicle.toLowerCase());
    const matchesType = filterType === 'All' || log.type === filterType;
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    const matchesMechanic = filterMechanic === 'All' || log.mechanic === filterMechanic;
    return matchesSearch && matchesType && matchesStatus && matchesMechanic;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Summary Metrics
  const totalCost = logs.reduce((acc, log) => acc + log.cost, 0);
  const totalInShop = logs.filter(l => l.status === 'In Shop').length;
  const totalScheduled = logs.filter(l => l.status === 'Scheduled').length;
  const totalCompleted = logs.filter(l => l.status === 'Completed').length;

  const filteredDropdownVehicles = mockVehicles.filter(v =>
    v.name.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
    v.id.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 m-0">
          Vehicle Maintenance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage service records, maintenance schedules, and vehicle availability in real time.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Vehicles */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fleet</span>
          <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">50 Units</span>
        </div>

        {/* Vehicles in Shop */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicles In Shop</span>
          <span className="text-xl font-black text-orange-500 mt-1 block">{totalInShop} Units</span>
        </div>

        {/* Scheduled Today */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled</span>
          <span className="text-xl font-black text-blue-500 mt-1 block">{totalScheduled} Jobs</span>
        </div>

        {/* Completed Today */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span className="text-xl font-black text-emerald-500 mt-1 block">{totalCompleted} Jobs</span>
        </div>

        {/* Total Cost */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Maintenance Budget</span>
          <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">${totalCost.toLocaleString()}</span>
        </div>

      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Form + Workflow */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Glassmorphic Log form */}
          <div className="p-6 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xl backdrop-blur-md dark:bg-slate-950/40 dark:border-slate-850/50 space-y-4">
            <h2 className="text-xs font-bold text-slate-450 uppercase tracking-wider m-0">
              {editingId ? 'Modify Service Record' : 'Log Service Record'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Vehicle Searchable Dropdown */}
              <div className="flex flex-col relative" ref={dropdownRef}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Vehicle *</label>
                <button
                  type="button"
                  onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white text-left focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer"
                >
                  <span className="truncate">{selectedVehicle ? selectedVehicle.name : 'Select Vehicle'}</span>
                  <RiCarLine className="text-slate-400 ml-2" />
                </button>

                {isVehicleDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl rounded-xl p-2 max-h-48 overflow-y-auto">
                    <div className="relative flex items-center mb-2 px-1">
                      <RiSearchLine className="absolute left-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search vehicle..."
                        value={dropdownSearch}
                        onChange={(e) => setDropdownSearch(e.target.value)}
                        className="w-full pl-8 pr-2 py-1 text-xs border border-slate-150 dark:border-slate-800 rounded-lg outline-none bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-orange-500"
                      />
                    </div>
                    {filteredDropdownVehicles.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVehicle(v);
                          setIsVehicleDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 flex justify-between items-center text-slate-700 dark:text-slate-350 cursor-pointer"
                      >
                        <span>{v.name}</span>
                        <span className="font-bold text-[10px] text-slate-400">{v.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Maintenance Type */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Maintenance Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                >
                  {MAINTENANCE_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Mechanic Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Assigned Mechanic</label>
                <select
                  value={selectedMechanic}
                  onChange={(e) => setSelectedMechanic(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                >
                  {mockMechanics.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Issue Description */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Issue Description</label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows="2"
                  placeholder="Describe repair requirements..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Dates & Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 mb-1">Cost ($) *</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="Cost"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:color-scheme-dark"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:color-scheme-dark"
                  />
                </div>
              </div>

              {/* Status & Priority fields */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Log Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850/50">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                >
                  Save Maintenance
                </button>
              </div>

            </form>
          </div>

          {/* Workflow progress preview card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest m-0">Maintenance Workflow Loops</h3>
            
            <div className="space-y-4 text-xs">
              {/* Loop 1: In Shop */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-500">Available</span>
                  <RiArrowRightLine className="text-slate-400" />
                  <span className="font-bold text-orange-500">In Shop</span>
                </div>
                <span className="text-[10px] text-slate-400 italic">Maintenance Started</span>
              </div>

              {/* Loop 2: Completed */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-orange-500">In Shop</span>
                  <RiArrowRightLine className="text-slate-400" />
                  <span className="font-bold text-emerald-500">Available</span>
                </div>
                <span className="text-[10px] text-slate-400 italic">Maintenance Closed</span>
              </div>
            </div>

            {/* Warning Info Banner */}
            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 dark:border-orange-950/40 dark:bg-orange-950/10 flex items-start gap-3">
              <RiAlertFill className="text-orange-500 text-lg flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed m-0">
                Vehicles marked <strong className="text-slate-700 dark:text-slate-200">"In Shop"</strong> are automatically removed from Trip Dispatch selection routes until maintenance is completed.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Filters & Logs Table */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Table Filters header */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full sm:max-w-xs flex items-center">
                <RiSearchLine className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vehicle log..."
                  value={searchVehicle}
                  onChange={(e) => {
                    setSearchVehicle(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none bg-slate-50/50 dark:bg-slate-900/60 dark:text-white focus:border-orange-500"
                />
              </div>

              {/* Advanced select filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                
                {/* Service Type filter */}
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer dark:text-slate-350"
                >
                  <option value="All">All Types</option>
                  {MAINTENANCE_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer dark:text-slate-350"
                >
                  <option value="All">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>

              </div>

            </div>
          </div>

          {/* Table display */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Mechanic</th>
                    <th className="px-6 py-4">Cost</th>
                    <th className="px-6 py-4">Timeline</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-450 font-medium">
                        No service logs match the filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{log.vehicleId}</td>
                        <td className="px-6 py-4 font-medium">{log.type}</td>
                        <td className="px-6 py-4 text-slate-500">{log.mechanic}</td>
                        <td className="px-6 py-4 font-bold">${log.cost.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-500">
                          <div>{log.startDate}</div>
                          <div className="text-[10px] text-slate-400">to {log.endDate}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${STATUS_BADGES[log.status] || ''}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {log.status !== 'Completed' && (
                              <button
                                onClick={() => handleComplete(log.id)}
                                className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                                title="Complete Maintenance"
                              >
                                <RiCheckDoubleLine size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(log)}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905 hover:text-orange-500 transition-colors"
                              title="Edit Record"
                            >
                              <RiEditLine size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(log.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-500 transition-colors"
                              title="Delete Record"
                            >
                              <RiDeleteBinLine size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden p-4 divide-y divide-slate-150/60 dark:divide-slate-850/50">
              {paginatedLogs.length === 0 ? (
                <p className="text-center py-8 text-slate-455 text-xs font-medium">
                  No service logs match the filters.
                </p>
              ) : (
                paginatedLogs.map((log) => (
                  <div key={log.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{log.vehicleId}</h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{log.type} • {log.mechanic}</span>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${STATUS_BADGES[log.status] || ''}`}>
                        {log.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-slate-800 dark:text-white">${log.cost}</span>
                      <span className="text-[10px] text-slate-400">Timeline: {log.startDate} / {log.endDate}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-50 dark:border-slate-900">
                      {log.status !== 'Completed' && (
                        <button
                          onClick={() => handleComplete(log.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(log)}
                        className="px-2.5 py-1 text-[10px] border border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1 rounded-lg border border-red-100 dark:border-red-950/20 text-red-500 hover:bg-red-50"
                      >
                        <RiDeleteBinLine size={13} />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Showing <span className="font-bold text-slate-700 dark:text-slate-300">{startIndex + 1}</span> to{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)}</span> of{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{filteredLogs.length}</span> records
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-450 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <RiArrowLeftSLine size={15} />
                  </button>
                  <span className="font-bold text-slate-700 dark:text-slate-300 px-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-450 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <RiArrowRightSLine size={15} />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
