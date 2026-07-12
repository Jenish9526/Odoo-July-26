import React, { useState, useEffect } from 'react';

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Van', 'Electric', 'Hybrid', 'Minivan'];
const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

export default function VehicleForm({ vehicle, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    vehicleName: '',
    model: '',
    type: 'Sedan',
    capacity: '',
    odometer: '',
    acquisitionCost: '',
    status: 'Available',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber || '',
        vehicleName: vehicle.vehicleName || '',
        model: vehicle.model || '',
        type: vehicle.type || 'Sedan',
        capacity: vehicle.capacity || '',
        odometer: vehicle.odometer || '',
        acquisitionCost: vehicle.acquisitionCost || '',
        status: vehicle.status || 'Available',
      });
    }
  }, [vehicle]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration Number is required';
    } else if (!/^[A-Z0-9-]{3,10}$/i.test(formData.registrationNumber.trim())) {
      newErrors.registrationNumber = 'Must be 3-10 alphanumeric characters (or dash)';
    }

    if (!formData.vehicleName.trim()) {
      newErrors.vehicleName = 'Vehicle Name is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.capacity.toString().trim()) {
      newErrors.capacity = 'Capacity is required';
    }

    if (!formData.odometer.toString().trim()) {
      newErrors.odometer = 'Odometer is required';
    } else if (Number(formData.odometer) < 0) {
      newErrors.odometer = 'Odometer cannot be negative';
    }

    if (!formData.acquisitionCost.toString().trim()) {
      newErrors.acquisitionCost = 'Acquisition Cost is required';
    } else if (Number(formData.acquisitionCost) < 0) {
      newErrors.acquisitionCost = 'Cost cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        odometer: Number(formData.odometer),
        acquisitionCost: Number(formData.acquisitionCost),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 2-column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Registration Number */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Registration Number</label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="e.g. TX-9482-B"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.registrationNumber 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-950/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.registrationNumber && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.registrationNumber}</span>
          )}
        </div>

        {/* Vehicle Name */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle Name</label>
          <input
            type="text"
            name="vehicleName"
            value={formData.vehicleName}
            onChange={handleChange}
            placeholder="e.g. Ford Transit"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.vehicleName 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-950/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.vehicleName && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.vehicleName}</span>
          )}
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Model / Year</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. 2024 Cargo Van"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.model 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-950/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.model && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.model}</span>
          )}
        </div>

        {/* Vehicle Type */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all bg-white dark:bg-slate-900/60 dark:text-white cursor-pointer"
          >
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Capacity */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Capacity (Seats/Cargo Weight)</label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="e.g. 7 Seats or 1500 kg"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.capacity 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-950/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.capacity && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.capacity}</span>
          )}
        </div>

        {/* Odometer */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Odometer Reading (mi/km)</label>
          <input
            type="number"
            name="odometer"
            value={formData.odometer}
            onChange={handleChange}
            placeholder="e.g. 48200"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.odometer 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-950/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.odometer && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.odometer}</span>
          )}
        </div>

        {/* Acquisition Cost */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Acquisition Cost ($)</label>
          <input
            type="number"
            name="acquisitionCost"
            value={formData.acquisitionCost}
            onChange={handleChange}
            placeholder="e.g. 38500"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.acquisitionCost 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-950/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.acquisitionCost && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.acquisitionCost}</span>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Operational Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all bg-white dark:bg-slate-900/60 dark:text-white cursor-pointer"
          >
            {VEHICLE_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850/50">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/10 cursor-pointer"
        >
          {vehicle ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}
