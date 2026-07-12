import React, { useState, useEffect } from 'react';

const LICENSE_CATEGORIES = ['Class A CDL', 'Class B CDL', 'Class C', 'Motorcycle', 'Standard Passenger'];
const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended'];

export default function DriverForm({ driver, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    driverName: '',
    licenseNumber: '',
    licenseCategory: 'Class A CDL',
    expiryDate: '',
    phone: '',
    safetyScore: '',
    status: 'Available',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (driver) {
      setFormData({
        driverName: driver.driverName || '',
        licenseNumber: driver.licenseNumber || '',
        licenseCategory: driver.licenseCategory || 'Class A CDL',
        expiryDate: driver.expiryDate || '',
        phone: driver.phone || '',
        safetyScore: driver.safetyScore !== undefined ? driver.safetyScore : '',
        status: driver.status || 'Available',
      });
    }
  }, [driver]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.driverName.trim()) {
      newErrors.driverName = 'Driver Name is required';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License Number is required';
    } else if (!/^[A-Z0-9-]{5,15}$/i.test(formData.licenseNumber.trim())) {
      newErrors.licenseNumber = 'Must be 5-15 alphanumeric characters';
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry Date is required';
    } else {
      const expiry = new Date(formData.expiryDate);
      const today = new Date();
      if (expiry < today && formData.status !== 'Suspended') {
        newErrors.expiryDate = 'License is expired. Status should be Suspended';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.safetyScore === '') {
      newErrors.safetyScore = 'Safety Score is required';
    } else {
      const score = Number(formData.safetyScore);
      if (isNaN(score) || score < 0 || score > 100) {
        newErrors.safetyScore = 'Safety Score must be between 0 and 100';
      }
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
        safetyScore: Number(formData.safetyScore),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Driver Name */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Driver Name</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.driverName 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-955/10' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.driverName && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.driverName}</span>
          )}
        </div>

        {/* License Number */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            placeholder="e.g. DL-1029384"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.licenseNumber 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-955/10' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.licenseNumber && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.licenseNumber}</span>
          )}
        </div>

        {/* License Category */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">License Category</label>
          <select
            name="licenseCategory"
            value={formData.licenseCategory}
            onChange={handleChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all bg-white dark:bg-slate-900/60 dark:text-white cursor-pointer"
          >
            {LICENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">License Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all dark:color-scheme-dark
              ${errors.expiryDate 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-955/10' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.expiryDate && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.expiryDate}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Contact Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1-555-0198"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.phone 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-955/10' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.phone && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.phone}</span>
          )}
        </div>

        {/* Safety Score */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Safety Rating Score (0-100)</label>
          <input
            type="number"
            name="safetyScore"
            value={formData.safetyScore}
            onChange={handleChange}
            placeholder="e.g. 95"
            min="0"
            max="100"
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all
              ${errors.safetyScore 
                ? 'border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500 dark:bg-red-955/10' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
          />
          {errors.safetyScore && (
            <span className="text-[10px] text-red-500 mt-1 font-medium">{errors.safetyScore}</span>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Driver Shift Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all bg-white dark:bg-slate-900/60 dark:text-white cursor-pointer"
          >
            {DRIVER_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Action Buttons */}
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
          {driver ? 'Save Changes' : 'Add Operator'}
        </button>
      </div>
    </form>
  );
}
