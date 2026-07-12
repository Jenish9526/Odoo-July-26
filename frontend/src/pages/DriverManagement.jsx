import React, { useState } from 'react';
import {
  RiSearchLine,
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSteering2Line,
  RiCheckDoubleLine,
  RiCompass3Line,
  RiCloseCircleLine
} from 'react-icons/ri';
import Modal from '../components/Modal';
import DriverForm from '../components/DriverForm';
import DriverDetailsModal from '../components/DriverDetailsModal';

const initialDrivers = [
  { id: 1, driverName: 'Marcus Vance', licenseNumber: 'DL-284902A', licenseCategory: 'Class A CDL', expiryDate: '2028-10-15', phone: '+1-555-0198', safetyScore: 98, status: 'Available' },
  { id: 2, driverName: 'Elena Rostova', licenseNumber: 'DL-901842X', licenseCategory: 'Standard Passenger', expiryDate: '2029-04-20', phone: '+1-555-0122', safetyScore: 95, status: 'On Trip' },
  { id: 3, driverName: 'John Callahan', licenseNumber: 'DL-192842M', licenseCategory: 'Class B CDL', expiryDate: '2027-08-11', phone: '+1-555-0155', safetyScore: 82, status: 'Off Duty' },
  { id: 4, driverName: 'Sophia Martinez', licenseNumber: 'DL-102938K', licenseCategory: 'Class C', expiryDate: '2028-12-05', phone: '+1-555-0188', safetyScore: 91, status: 'Available' },
  { id: 5, driverName: 'Alex Chen', licenseNumber: 'DL-829104P', licenseCategory: 'Class B CDL', expiryDate: '2025-06-18', phone: '+1-555-0144', safetyScore: 54, status: 'Suspended' },
  { id: 6, driverName: 'Frank Thompson', licenseNumber: 'DL-449102T', licenseCategory: 'Class A CDL', expiryDate: '2028-09-30', phone: '+1-555-0133', safetyScore: 88, status: 'On Trip' },
  { id: 7, driverName: 'David Miller', licenseNumber: 'DL-773012S', licenseCategory: 'Class C', expiryDate: '2027-02-14', phone: '+1-555-0100', safetyScore: 92, status: 'Available' },
];

const STATUS_CLASSES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-250/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  'On Trip': 'bg-blue-50 text-blue-700 border-blue-250/30 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  'Off Duty': 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-450 dark:border-slate-800',
  Suspended: 'bg-red-50 text-red-700 border-red-250/30 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40',
};

const ITEMS_PER_PAGE = 5;

export default function DriverManagement() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeDriver, setActiveDriver] = useState(null);

  // Delete Driver
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this operator from the system database?')) {
      setDrivers(prev => prev.filter(d => d.id !== id));
      const updatedTotal = drivers.length - 1;
      const totalPages = Math.ceil(updatedTotal / ITEMS_PER_PAGE);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(totalPages);
      }
    }
  };

  // Add / Edit form submissions
  const handleFormSubmit = (formData) => {
    if (activeDriver) {
      setDrivers(prev => prev.map(d => d.id === activeDriver.id ? { ...d, ...formData } : d));
    } else {
      const newId = drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
      setDrivers(prev => [...prev, { id: newId, ...formData }]);
    }
    setIsFormModalOpen(false);
    setActiveDriver(null);
  };

  // Filters logic
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = 
      d.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);

    const matchesCategory = selectedCategory === 'All' || d.licenseCategory === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDrivers = filteredDrivers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // KPI Metrics
  const totalCount = drivers.length;
  const availableCount = drivers.filter(d => d.status === 'Available').length;
  const onTripCount = drivers.filter(d => d.status === 'On Trip').length;
  const suspendedCount = drivers.filter(d => d.status === 'Suspended').length;

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            Operator & Driver Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track operator shifts, verify licensing expiration dates, and monitor safety scores.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveDriver(null);
            setIsFormModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <RiAddLine size={18} />
          Add New Operator
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Drivers */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Roster</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-1 block">{totalCount} Drivers</span>
          </div>
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-955/20 dark:text-sky-400">
            <RiSteering2Line size={20} />
          </div>
        </div>

        {/* Available */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{availableCount} Drivers</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-500 dark:bg-emerald-955/20 dark:text-emerald-450">
            <RiCheckDoubleLine size={20} />
          </div>
        </div>

        {/* On Trip */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">On Shift / Trip</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">{onTripCount} Drivers</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-955/20 dark:text-blue-400">
            <RiCompass3Line size={20} />
          </div>
        </div>

        {/* Suspended */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suspended</span>
            <span className="text-xl sm:text-2xl font-black text-red-650 dark:text-red-500 mt-1 block">{suspendedCount} Drivers</span>
          </div>
          <div className="p-2.5 rounded-lg bg-red-50 text-red-500 dark:bg-red-955/20 dark:text-red-400">
            <RiCloseCircleLine size={20} />
          </div>
        </div>

      </div>

      {/* Filter and Search queries */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
        
        {/* Search */}
        <div className="relative w-full md:max-w-sm flex items-center">
          <RiSearchLine className="absolute left-3 text-slate-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search by operator name, DL, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50/50 dark:bg-slate-900/60 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* License Category filter */}
          <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <span className="text-xs font-bold text-slate-400 uppercase">License:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer dark:text-slate-350"
            >
              <option value="All">All Licenses</option>
              <option value="Class A CDL">Class A CDL</option>
              <option value="Class B CDL">Class B CDL</option>
              <option value="Class C">Class C</option>
              <option value="Standard Passenger">Standard Passenger</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer dark:text-slate-350"
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

      </div>

      {/* Roster Data grid */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
        
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-xs font-bold uppercase">
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">License Number</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Safety Index</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
              {paginatedDrivers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-450 font-medium">
                    No operator profiles found matching the filters.
                  </td>
                </tr>
              ) : (
                paginatedDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-100">{d.driverName}</td>
                    <td className="px-6 py-4 font-mono font-bold text-xs text-sky-650 dark:text-sky-400">{d.licenseNumber}</td>
                    <td className="px-6 py-4 text-xs">{d.licenseCategory}</td>
                    <td className="px-6 py-4 text-xs font-medium">{d.expiryDate}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{d.phone}</td>
                    <td className="px-6 py-4 font-black">
                      <span className={`${d.safetyScore >= 90 ? 'text-emerald-500' : d.safetyScore >= 80 ? 'text-blue-500' : 'text-red-500'}`}>
                        {d.safetyScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full border ${STATUS_CLASSES[d.status] || ''}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveDriver(d);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905 hover:text-slate-800 dark:hover:text-white transition-colors"
                          title="View Details"
                        >
                          <RiEyeLine size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setActiveDriver(d);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905 hover:text-sky-500 transition-colors"
                          title="Edit Driver"
                        >
                          <RiEditLine size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-650 transition-colors"
                          title="Delete Driver"
                        >
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden p-4 divide-y divide-slate-150/60 dark:divide-slate-850/50">
          {paginatedDrivers.length === 0 ? (
            <p className="text-center py-8 text-slate-450 text-sm font-medium">
              No operator profiles found matching the filters.
            </p>
          ) : (
            paginatedDrivers.map((d) => (
              <div key={d.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{d.driverName}</h3>
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">{d.licenseNumber} • {d.licenseCategory}</span>
                  </div>
                  
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${STATUS_CLASSES[d.status] || ''}`}>
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-650 dark:text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-900">
                  <div className="col-span-2">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Phone Contact</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{d.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Safety Score</span>
                    <span className={`font-black ${d.safetyScore >= 90 ? 'text-emerald-500' : d.safetyScore >= 80 ? 'text-blue-500' : 'text-red-500'}`}>
                      {d.safetyScore}%
                    </span>
                  </div>
                </div>

                {/* Mobile actions row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-900">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Expires: {d.expiryDate}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveDriver(d);
                        setIsDetailsModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-900 transition-colors"
                    >
                      <RiEyeLine size={14} />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setActiveDriver(d);
                        setIsFormModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors"
                    >
                      <RiEditLine size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 rounded-lg border border-red-100 dark:border-red-950/30 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <RiDeleteBinLine size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Footer / Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-700 dark:text-slate-300">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min(startIndex + ITEMS_PER_PAGE, filteredDrivers.length)}</span> of{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">{filteredDrivers.length}</span> operator entries
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-450 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <RiArrowLeftSLine size={16} />
              </button>
              <span className="font-bold text-slate-700 dark:text-slate-300 px-1 text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-450 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <RiArrowRightSLine size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setActiveDriver(null);
        }}
        title={activeDriver ? 'Modify Operator Profile' : 'Register New Fleet Operator'}
      >
        <DriverForm
          driver={activeDriver}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setActiveDriver(null);
          }}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setActiveDriver(null);
        }}
        title="Fleet Operator Details & Safety Records"
      >
        <DriverDetailsModal
          driver={activeDriver}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setActiveDriver(null);
          }}
        />
      </Modal>

    </div>
  );
}
