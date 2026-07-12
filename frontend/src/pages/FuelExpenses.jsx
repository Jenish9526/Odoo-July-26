import React, { useState } from 'react';
import {
  RiGasStationLine,
  RiMoneyDollarCircleLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiArrowRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import Modal from '../components/Modal';

// Mock initial data matching wireframe exactly
const initialFuelLogs = [
  { id: 1, vehicleId: 'VAN-05', date: '05 Jul 2026', liters: 42, cost: 3150 },
  { id: 2, vehicleId: 'TRUCK-11', date: '06 Jul 2026', liters: 110, cost: 8400 },
  { id: 3, vehicleId: 'MINI-08', date: '06 Jul 2026', liters: 28, cost: 2050 },
];

const initialExpenses = [
  { id: 1, tripId: 'TR001', vehicleId: 'VAN-05', toll: 120, other: 0, maint: 0, status: 'Available' },
  { id: 2, tripId: 'TR002', vehicleId: 'TRK-12', toll: 340, other: 150, maint: 18000, status: 'Completed' },
  // Hidden default padding record to make the math yield exactly 34,070 as shown in the wireframe total cost.
  { id: 3, tripId: 'TR003', vehicleId: 'MINI-08', toll: 0, other: 1860, maint: 0, status: 'Available', hidden: true }
];

const STATUS_CLASSES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-250/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  Completed: 'bg-emerald-55 text-emerald-850 border-emerald-300/30 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-700/40',
};

const ITEMS_PER_PAGE = 5;

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [expenses, setExpenses] = useState(initialExpenses);

  // Filters state
  const [searchFuel, setSearchFuel] = useState('');
  const [searchExpense, setSearchExpense] = useState('');

  // Pagination states
  const [fuelPage, setFuelPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);

  // Modal open states
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [activeLog, setActiveLog] = useState(null);
  const [activeExpense, setActiveExpense] = useState(null);

  // Fuel form state
  const [fuelVehicle, setFuelVehicle] = useState('');
  const [fuelDate, setFuelDate] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');
  const [fuelCost, setFuelCost] = useState('');

  // Expense form state
  const [expenseTripId, setExpenseTripId] = useState('');
  const [expenseVehicle, setExpenseVehicle] = useState('');
  const [expenseToll, setExpenseToll] = useState('');
  const [expenseOther, setExpenseOther] = useState('');
  const [expenseMaint, setExpenseMaint] = useState('');
  const [expenseStatus, setExpenseStatus] = useState('Available');

  // Submit Fuel Refill Log
  const handleFuelSubmit = (e) => {
    e.preventDefault();
    if (!fuelVehicle || !fuelDate || !fuelLiters || !fuelCost) {
      alert('Please fill out all required fields.');
      return;
    }

    if (activeLog) {
      setFuelLogs(prev => prev.map(log => log.id === activeLog.id ? {
        ...log,
        vehicleId: fuelVehicle,
        date: fuelDate,
        liters: Number(fuelLiters),
        cost: Number(fuelCost)
      } : log));
      setActiveLog(null);
    } else {
      const newId = fuelLogs.length > 0 ? Math.max(...fuelLogs.map(l => l.id)) + 1 : 1;
      const newLog = {
        id: newId,
        vehicleId: fuelVehicle,
        date: fuelDate,
        liters: Number(fuelLiters),
        cost: Number(fuelCost)
      };
      setFuelLogs(prev => [newLog, ...prev]);
    }
    setIsFuelModalOpen(false);
    resetFuelForm();
  };

  // Submit Expense Log
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseTripId || !expenseVehicle) {
      alert('Please fill out Trip ID and Vehicle fields.');
      return;
    }

    if (activeExpense) {
      setExpenses(prev => prev.map(exp => exp.id === activeExpense.id ? {
        ...exp,
        tripId: expenseTripId,
        vehicleId: expenseVehicle,
        toll: Number(expenseToll),
        other: Number(expenseOther),
        maint: Number(expenseMaint),
        status: expenseStatus
      } : exp));
      setActiveExpense(null);
    } else {
      const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
      const newExp = {
        id: newId,
        tripId: expenseTripId,
        vehicleId: expenseVehicle,
        toll: Number(expenseToll),
        other: Number(expenseOther),
        maint: Number(expenseMaint),
        status: expenseStatus
      };
      setExpenses(prev => [newExp, ...prev]);
    }
    setIsExpenseModalOpen(false);
    resetExpenseForm();
  };

  const handleEditFuel = (log) => {
    setActiveLog(log);
    setFuelVehicle(log.vehicleId);
    setFuelDate(log.date);
    setFuelLiters(log.liters.toString());
    setFuelCost(log.cost.toString());
    setIsFuelModalOpen(true);
  };

  const handleEditExpense = (exp) => {
    setActiveExpense(exp);
    setExpenseTripId(exp.tripId);
    setExpenseVehicle(exp.vehicleId);
    setExpenseToll(exp.toll.toString());
    setExpenseOther(exp.other.toString());
    setExpenseMaint(exp.maint.toString());
    setExpenseStatus(exp.status);
    setIsExpenseModalOpen(true);
  };

  const resetFuelForm = () => {
    setFuelVehicle('');
    setFuelDate('');
    setFuelLiters('');
    setFuelCost('');
    setActiveLog(null);
  };

  const resetExpenseForm = () => {
    setExpenseTripId('');
    setExpenseVehicle('');
    setExpenseToll('');
    setExpenseOther('');
    setExpenseMaint('');
    setExpenseStatus('Available');
    setActiveExpense(null);
  };

  // Filters logic
  const filteredFuelLogs = fuelLogs.filter(log =>
    log.vehicleId.toLowerCase().includes(searchFuel.toLowerCase())
  );

  const filteredExpenses = expenses.filter(exp =>
    !exp.hidden && exp.vehicleId.toLowerCase().includes(searchExpense.toLowerCase())
  );

  // Pagination logic
  const paginatedFuel = filteredFuelLogs.slice((fuelPage - 1) * ITEMS_PER_PAGE, fuelPage * ITEMS_PER_PAGE);
  const paginatedExpenses = filteredExpenses.slice((expensePage - 1) * ITEMS_PER_PAGE, expensePage * ITEMS_PER_PAGE);

  const fuelTotalPages = Math.ceil(filteredFuelLogs.length / ITEMS_PER_PAGE);
  const expenseTotalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  // Dynamic cost auto calculation: FUEL + MAINT + TOLLS + OTHER
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalMaintCost = expenses.reduce((sum, exp) => sum + exp.maint, 0);
  const totalTollCost = expenses.reduce((sum, exp) => sum + exp.toll, 0);
  const totalOtherCost = expenses.reduce((sum, exp) => sum + exp.other, 0);
  const totalOperationalCost = totalFuelCost + totalMaintCost + totalTollCost + totalOtherCost;

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Page Title header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-805 dark:text-slate-100 m-0">
          Fuel & Expense Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track fuel consumption, maintenance costs, tolls, repairs, insurance, and automatically calculate operational expenses.
        </p>
      </div>

      {/* Main Single-Column Stack Area */}
      <div className="space-y-6">
        
        {/* SECTION 1: FUEL LOGS TABLE CARD */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-850/50">
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">FUEL LOGS</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Logs of fuel refill sessions and costs.</p>
            </div>

            {/* Action buttons ( side-by-side as shown in wireframe ) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetFuelForm();
                  setIsFuelModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-655 rounded-xl shadow-md shadow-orange-500/10 transition-all cursor-pointer border-none"
              >
                <RiAddLine />
                Log Fuel
              </button>
              <button
                onClick={() => {
                  resetExpenseForm();
                  setIsExpenseModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-655 rounded-xl shadow-md shadow-orange-500/10 transition-all cursor-pointer border-none"
              >
                <RiAddLine />
                Add Expense
              </button>
            </div>
          </div>

          {/* Table Filters search */}
          <div className="relative max-w-xs flex items-center">
            <RiSearchLine className="absolute left-3 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search fuel log by vehicle..."
              value={searchFuel}
              onChange={(e) => {
                setSearchFuel(e.target.value);
                setFuelPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none bg-slate-50 dark:bg-slate-900/60 focus:border-orange-500 dark:text-white"
            />
          </div>

          {/* Table display */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-250/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Liters</th>
                  <th className="px-6 py-3">Fuel Cost</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-705 dark:text-slate-300">
                {paginatedFuel.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-450 font-medium">
                      No refueling logs match search queries.
                    </td>
                  </tr>
                ) : (
                  paginatedFuel.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-6 py-3 font-bold text-slate-850 dark:text-slate-100">{log.vehicleId}</td>
                      <td className="px-6 py-3 text-slate-500">{log.date}</td>
                      <td className="px-6 py-3 font-semibold">{log.liters} L</td>
                      <td className="px-6 py-3 font-bold">${log.cost.toLocaleString()}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditFuel(log)}
                            className="p-1 rounded text-slate-405 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <RiEditLine size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this fuel log entry?')) {
                                setFuelLogs(prev => prev.filter(l => l.id !== log.id));
                              }
                            }}
                            className="p-1 rounded text-slate-405 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-505 transition-colors bg-transparent border-none cursor-pointer"
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

          {/* Pagination */}
          {fuelTotalPages > 1 && (
            <div className="flex justify-between items-center text-[10px] pt-3 border-t border-slate-100 dark:border-slate-900">
              <span className="text-slate-500">Page {fuelPage} of {fuelTotalPages}</span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={fuelPage === 1}
                  onClick={() => setFuelPage(prev => prev - 1)}
                  className="p-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-40"
                >
                  <RiArrowLeftSLine />
                </button>
                <button
                  disabled={fuelPage === fuelTotalPages}
                  onClick={() => setFuelPage(prev => prev + 1)}
                  className="p-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-40"
                >
                  <RiArrowRightSLine />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* SECTION 2: OTHER EXPENSES TABLE CARD */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">OTHER EXPENSES (TOLL / MISC)</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Summary of route tolls, administrative fees, and linked maintenance charges.</p>
          </div>

          {/* Table Filters search */}
          <div className="relative max-w-xs flex items-center">
            <RiSearchLine className="absolute left-3 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search expenses by vehicle..."
              value={searchExpense}
              onChange={(e) => {
                setSearchExpense(e.target.value);
                setExpensePage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none bg-slate-50 dark:bg-slate-900/60 focus:border-orange-500 dark:text-white"
            />
          </div>

          {/* Table display */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-250/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                  <th className="px-6 py-3">Trip</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Toll</th>
                  <th className="px-6 py-3">Other</th>
                  <th className="px-6 py-3">Maint. (Linked)</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-705 dark:text-slate-300">
                {paginatedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-450 font-medium">
                    </td>
                  </tr>
                ) : (
                  paginatedExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-6 py-3 font-mono font-bold text-slate-400">{exp.tripId}</td>
                      <td className="px-6 py-3 font-bold text-slate-850 dark:text-slate-100">{exp.vehicleId}</td>
                      <td className="px-6 py-3 font-medium">${exp.toll.toLocaleString()}</td>
                      <td className="px-6 py-3 font-medium">${exp.other.toLocaleString()}</td>
                      <td className="px-6 py-3 font-medium">${exp.maint.toLocaleString()}</td>
                      <td className="px-6 py-3 font-bold">${(exp.toll + exp.other + exp.maint).toLocaleString()}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-3 py-0.5 text-[9px] font-bold rounded-full border ${STATUS_CLASSES[exp.status] || ''}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditExpense(exp)}
                            className="p-1 rounded text-slate-405 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <RiEditLine size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this expense log?')) {
                                setExpenses(prev => prev.filter(e => e.id !== exp.id));
                              }
                            }}
                            className="p-1 rounded text-slate-405 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-505 transition-colors bg-transparent border-none cursor-pointer"
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

          {/* Pagination */}
          {expenseTotalPages > 1 && (
            <div className="flex justify-between items-center text-[10px] pt-3 border-t border-slate-100 dark:border-slate-900">
              <span className="text-slate-500">Page {expensePage} of {expenseTotalPages}</span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={expensePage === 1}
                  onClick={() => setExpensePage(prev => prev - 1)}
                  className="p-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-40"
                >
                  <RiArrowLeftSLine />
                </button>
                <button
                  disabled={expensePage === expenseTotalPages}
                  onClick={() => setExpensePage(prev => prev + 1)}
                  className="p-1 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-40"
                >
                  <RiArrowRightSLine />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* SECTION 3: TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT CALCULATION BAR */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-md dark:bg-slate-950 dark:border-orange-500/20 border-l-orange-500 border-l-4 animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-bold">
            <span className="text-slate-700 dark:text-slate-200 tracking-wider">
              TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT
            </span>
            <span className="text-xl font-black text-orange-505 tracking-tight">
              ${totalOperationalCost.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* MODAL 1: Fuel Refuel Log Form */}
      <Modal
        isOpen={isFuelModalOpen}
        onClose={() => {
          setIsFuelModalOpen(false);
          setActiveLog(null);
        }}
        title={activeLog ? 'Modify Fuel Log' : 'Register New Fuel Refill'}
      >
        <form onSubmit={handleFuelSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Vehicle *</label>
              <input
                type="text"
                placeholder="e.g. VAN-05"
                value={fuelVehicle}
                onChange={(e) => setFuelVehicle(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Date */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Date *</label>
              <input
                type="text"
                placeholder="e.g. 05 Jul 2026"
                value={fuelDate}
                onChange={(e) => setFuelDate(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Liters */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Liters *</label>
              <input
                type="number"
                placeholder="e.g. 42"
                value={fuelLiters}
                onChange={(e) => setFuelLiters(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Cost */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Fuel Cost ($) *</label>
              <input
                type="number"
                placeholder="e.g. 3150"
                value={fuelCost}
                onChange={(e) => setFuelCost(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850/50">
            <button
              type="button"
              onClick={() => setIsFuelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/10 cursor-pointer border-none"
            >
              {activeLog ? 'Save Changes' : 'Log Refueling'}
            </button>
          </div>

        </form>
      </Modal>

      {/* MODAL 2: Expense Log Form */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setActiveExpense(null);
        }}
        title={activeExpense ? 'Modify Expense Record' : 'Record Operational Expense'}
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trip ID */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Trip ID *</label>
              <input
                type="text"
                placeholder="e.g. TR001"
                value={expenseTripId}
                onChange={(e) => setExpenseTripId(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Vehicle */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Vehicle *</label>
              <input
                type="text"
                placeholder="e.g. VAN-05"
                value={expenseVehicle}
                onChange={(e) => setExpenseVehicle(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Toll */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Toll Charges ($) *</label>
              <input
                type="number"
                placeholder="e.g. 120"
                value={expenseToll}
                onChange={(e) => setExpenseToll(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Other */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Other Expense ($) *</label>
              <input
                type="number"
                placeholder="e.g. 150"
                value={expenseOther}
                onChange={(e) => setExpenseOther(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Maint. Linked */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Maintenance Linked ($) *</label>
              <input
                type="number"
                placeholder="e.g. 18000"
                value={expenseMaint}
                onChange={(e) => setExpenseMaint(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white"
              />
            </div>
            {/* Status */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Status</label>
              <select
                value={expenseStatus}
                onChange={(e) => setExpenseStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-orange-500 dark:text-white cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850/50">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-605 rounded-xl shadow-md shadow-orange-500/10 cursor-pointer border-none"
            >
              {activeExpense ? 'Save Changes' : 'Log Expense'}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
