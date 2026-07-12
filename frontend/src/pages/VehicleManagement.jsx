import React, { useState } from 'react';
import {
  RiSearchLine,
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCarLine,
  RiCheckDoubleLine,
  RiCompass3Line,
  RiToolsLine,
  RiCloseCircleLine
} from 'react-icons/ri';
import Modal from '../components/Modal';
import VehicleForm from '../components/VehicleForm';
import VehicleDetailsModal from '../components/VehicleDetailsModal';

const initialVehicles = [
  { id: 1, registrationNumber: 'TX-2938-A', vehicleName: 'Ford Transit Cargo', model: '2023 Transit 250', type: 'Van', capacity: '1,500 kg cargo', odometer: 42300, acquisitionCost: 46000, status: 'Available' },
  { id: 2, registrationNumber: 'CA-9481-X', vehicleName: 'Tesla Model Y', model: '2024 Long Range', type: 'Electric', capacity: '5 Passengers', odometer: 12400, acquisitionCost: 52000, status: 'On Trip' },
  { id: 3, registrationNumber: 'NY-8842-M', vehicleName: 'Chevrolet Silverado', model: '2022 Custom', type: 'Truck', capacity: '2,200 kg cargo', odometer: 68100, acquisitionCost: 39500, status: 'In Shop' },
  { id: 4, registrationNumber: 'FL-7321-K', vehicleName: 'Toyota Corolla', model: '2023 LE Hybrid', type: 'Hybrid', capacity: '5 Passengers', odometer: 28900, acquisitionCost: 24500, status: 'Available' },
  { id: 5, registrationNumber: 'IL-5930-P', vehicleName: 'Freightliner M2', model: '2021 Box Truck', type: 'Truck', capacity: '7,500 kg cargo', odometer: 148000, acquisitionCost: 89000, status: 'Retired' },
  { id: 6, registrationNumber: 'NV-2019-S', vehicleName: 'Rivian R1T', model: '2023 Adventure', type: 'Electric', capacity: '5 Passengers', odometer: 18500, acquisitionCost: 73000, status: 'On Trip' },
  { id: 7, registrationNumber: 'TX-1049-D', vehicleName: 'Honda Odyssey', model: '2022 EX-L', type: 'Minivan', capacity: '8 Passengers', odometer: 35100, acquisitionCost: 37200, status: 'Available' },
];

const STATUS_CLASSES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-250/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  'On Trip': 'bg-blue-50 text-blue-700 border-blue-250/30 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  'In Shop': 'bg-amber-50 text-amber-700 border-amber-250/30 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40',
  Retired: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-450 dark:border-slate-800',
};

const ITEMS_PER_PAGE = 5;

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this vehicle from the fleet registry?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      const updatedTotal = vehicles.length - 1;
      const totalPages = Math.ceil(updatedTotal / ITEMS_PER_PAGE);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(totalPages);
      }
    }
  };

  const handleFormSubmit = (formData) => {
    if (activeVehicle) {
      setVehicles(prev => prev.map(v => v.id === activeVehicle.id ? { ...v, ...formData } : v));
    } else {
      const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
      setVehicles(prev => [...prev, { id: newId, ...formData }]);
    }
    setIsFormModalOpen(false);
    setActiveVehicle(null);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All' || v.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || v.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalCount = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const onTripCount = vehicles.filter(v => v.status === 'On Trip').length;
  const inShopCount = vehicles.filter(v => v.status === 'In Shop').length;

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            Vehicle Fleet Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register, track, monitor, and update metrics for company transport units.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveVehicle(null);
            setIsFormModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <RiAddLine size={18} />
          Add New Vehicle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fleet</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-1 block">{totalCount} Units</span>
          </div>
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-955/20 dark:text-sky-400">
            <RiCarLine size={20} />
          </div>
        </div>

        {/* Available */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-650 dark:text-emerald-400 mt-1 block">{availableCount} Units</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-500 dark:bg-emerald-955/20 dark:text-emerald-400">
            <RiCheckDoubleLine size={20} />
          </div>
        </div>

        {/* On Trip */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">On Active Trip</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">{onTripCount} Units</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-955/20 dark:text-blue-400">
            <RiCompass3Line size={20} />
          </div>
        </div>

        {/* In Shop */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-950 dark:border-slate-850/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Service Shop</span>
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{inShopCount} Units</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-955/20 dark:text-amber-400">
            <RiToolsLine size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
        
        {/* Search */}
        <div className="relative w-full md:max-w-sm flex items-center">
          <RiSearchLine className="absolute left-3 text-slate-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, plate number, model..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50/50 dark:bg-slate-900/60 dark:text-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <span className="text-xs font-bold text-slate-400 uppercase">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer dark:text-slate-350"
            >
              <option value="All">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Status Filter */}
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
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Table view / Mobile card lists */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-xs font-bold uppercase">
                <th className="px-6 py-4">Reg Number</th>
                <th className="px-6 py-4">Vehicle Name</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Odometer</th>
                <th className="px-6 py-4">Acquisition Cost</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
              {paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-450 font-medium">
                    No vehicles found matching the filters.
                  </td>
                </tr>
              ) : (
                paginatedVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-sky-650 dark:text-sky-400">{v.registrationNumber}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{v.vehicleName}</td>
                    <td className="px-6 py-4 text-xs">{v.model}</td>
                    <td className="px-6 py-4 text-xs font-medium">{v.type}</td>
                    <td className="px-6 py-4 text-xs text-slate-550">{v.capacity}</td>
                    <td className="px-6 py-4 text-xs">{v.odometer.toLocaleString()} km</td>
                    <td className="px-6 py-4 text-xs font-semibold">${v.acquisitionCost.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full border ${STATUS_CLASSES[v.status] || 'bg-slate-100'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveVehicle(v);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905 hover:text-slate-800 dark:hover:text-white transition-colors"
                          title="View Details"
                        >
                          <RiEyeLine size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setActiveVehicle(v);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-905 hover:text-sky-500 transition-colors"
                          title="Edit Vehicle"
                        >
                          <RiEditLine size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-650 transition-colors"
                          title="Delete Vehicle"
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

        {/* Mobile Grid Card View (Collapsed Table) */}
        <div className="block lg:hidden p-4 divide-y divide-slate-150/60 dark:divide-slate-850/50">
          {paginatedVehicles.length === 0 ? (
            <p className="text-center py-8 text-slate-450 text-sm font-medium">
              No vehicles found matching the filters.
            </p>
          ) : (
            paginatedVehicles.map((v) => (
              <div key={v.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 block">{v.registrationNumber}</span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">{v.vehicleName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{v.model} • {v.type}</p>
                  </div>
                  
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${STATUS_CLASSES[v.status] || 'bg-slate-100'}`}>
                    {v.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-650 dark:text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-900">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Odometer</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{v.odometer.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Acquisition Cost</span>
                    <span className="font-bold text-slate-700 dark:text-slate-350">${v.acquisitionCost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Mobile actions row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-900">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Capacity: {v.capacity}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveVehicle(v);
                        setIsDetailsModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-900 transition-colors"
                    >
                      <RiEyeLine size={14} />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setActiveVehicle(v);
                        setIsFormModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors"
                    >
                      <RiEditLine size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 rounded-lg border border-red-100 dark:border-red-950/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
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
              <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min(startIndex + ITEMS_PER_PAGE, filteredVehicles.length)}</span> of{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">{filteredVehicles.length}</span> fleet entries
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
          setActiveVehicle(null);
        }}
        title={activeVehicle ? 'Modify Vehicle Fleet Info' : 'Register New Fleet Vehicle'}
      >
        <VehicleForm
          vehicle={activeVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setActiveVehicle(null);
          }}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setActiveVehicle(null);
        }}
        title="Fleet Vehicle Technical Details"
      >
        <VehicleDetailsModal
          vehicle={activeVehicle}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setActiveVehicle(null);
          }}
        />
      </Modal>

    </div>
  );
}
