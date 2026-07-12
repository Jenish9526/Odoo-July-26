import React, { useState, useEffect, useRef } from 'react';
import {
  RiFileTextLine,
  RiSendPlane2Line,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiArrowRightLine,
  RiInformationLine,
  RiAlertFill,
  RiCheckDoubleFill,
  RiSearchLine,
  RiCompass3Line,
  RiUser3Line,
  RiCarLine,
  RiScalesLine,
  RiMapPinLine,
  RiTimerLine
} from 'react-icons/ri';

// Available fleet mock database (with capacities in kg)
const availableVehicles = [
  { id: 'Van-05', name: 'Ford Transit Van-05', capacity: 800, type: 'Van' },
  { id: 'Truck-02', name: 'Hino Cargo Truck-02', capacity: 5000, type: 'Truck' },
  { id: 'Tanker-01', name: 'Volvo Fuel Tanker-01', capacity: 12000, type: 'Tanker' },
  { id: 'Van-09', name: 'Mercedes Sprinter Van-09', capacity: 1000, type: 'Van' },
  { id: 'Semi-11', name: 'Peterbilt Semi-11', capacity: 22000, type: 'Semi-Trailer' },
];

const availableDrivers = [
  { id: 'Alex', name: 'Alex Chen', license: 'Class A CDL', rating: '95%' },
  { id: 'Marcus', name: 'Marcus Vance', license: 'Class A CDL', rating: '98%' },
  { id: 'Sophia', name: 'Sophia Martinez', license: 'Class C', rating: '91%' },
  { id: 'John', name: 'John Callahan', license: 'Class B CDL', rating: '82%' },
  { id: 'David', name: 'David Miller', license: 'Class C', rating: '92%' },
];

const initialTrips = [
  { id: 'TR001', source: 'Gandhinagar', destination: 'Ahmedabad', vehicleId: 'Van-05', driverName: 'Alex Chen', status: 'Dispatched', eta: '45 min', progress: 65, notes: 'Priority delivery' },
  { id: 'TR004', source: 'Vatva', destination: 'Sanand', vehicleId: 'Truck-02', driverName: 'Awaiting Driver', status: 'Draft', eta: 'TBD', progress: 0, notes: 'Morning batch transfer' },
  { id: 'TR006', source: 'Mansa', destination: 'Kalol', vehicleId: 'Tanker-01', driverName: 'John Callahan', status: 'Cancelled', eta: '--', progress: 0, notes: 'Vehicle sent to Maintenance' },
];

export default function TripDispatcher() {
  const [trips, setTrips] = useState(initialTrips);
  
  // Form fields
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');
  const [estDuration, setEstDuration] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [notes, setNotes] = useState('');

  // Dropdown states
  const [searchVehicle, setSearchVehicle] = useState('');
  const [searchDriver, setSearchDriver] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [isDriverDropdownOpen, setIsDriverDropdownOpen] = useState(false);

  const vehicleDropdownRef = useRef(null);
  const driverDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target)) {
        setIsVehicleDropdownOpen(false);
      }
      if (driverDropdownRef.current && !driverDropdownRef.current.contains(event.target)) {
        setIsDriverDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validation metrics
  const weightNum = cargoWeight ? Number(cargoWeight) : 0;
  const isOverweight = selectedVehicle && weightNum > selectedVehicle.capacity;
  const weightExceededBy = selectedVehicle ? Math.max(0, weightNum - selectedVehicle.capacity) : 0;

  const isFormValid = 
    source.trim() !== '' &&
    destination.trim() !== '' &&
    selectedVehicle !== null &&
    selectedDriver !== null &&
    cargoWeight.trim() !== '' &&
    plannedDistance.trim() !== '' &&
    !isOverweight;

  // Dispatch Action
  const handleDispatch = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newId = `TR0${trips.length + 1}`;
    const newTrip = {
      id: newId,
      source,
      destination,
      vehicleId: selectedVehicle.id,
      driverName: selectedDriver.name,
      status: 'Dispatched',
      eta: estDuration ? `${estDuration} min` : '45 min',
      progress: 5,
      notes: notes || 'Dispatched from center log'
    };

    setTrips(prev => [newTrip, ...prev]);
    resetForm();
  };

  // Draft Action
  const handleSaveDraft = (e) => {
    e.preventDefault();
    const newId = `TR0${trips.length + 1}`;
    const newTrip = {
      id: newId,
      source: source || 'Unspecified Source',
      destination: destination || 'Unspecified Destination',
      vehicleId: selectedVehicle ? selectedVehicle.id : 'N/A',
      driverName: selectedDriver ? selectedDriver.name : 'Awaiting Driver',
      status: 'Draft',
      eta: 'TBD',
      progress: 0,
      notes: notes || 'Draft saved.'
    };

    setTrips(prev => [newTrip, ...prev]);
    resetForm();
  };

  const resetForm = () => {
    setSource('');
    setDestination('');
    setSelectedVehicle(null);
    setSelectedDriver(null);
    setCargoWeight('');
    setPlannedDistance('');
    setEstDuration('');
    setDepartureDate('');
    setNotes('');
    setSearchVehicle('');
    setSearchDriver('');
  };

  // Filter vehicles
  const filteredVehicles = availableVehicles.filter(v => 
    v.name.toLowerCase().includes(searchVehicle.toLowerCase()) ||
    v.id.toLowerCase().includes(searchVehicle.toLowerCase())
  );

  // Filter drivers
  const filteredDrivers = availableDrivers.filter(d => 
    d.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
    d.license.toLowerCase().includes(searchDriver.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 m-0">
          Trip Dispatcher
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage vehicle dispatches with real-time validation and lifecycle tracking.
        </p>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: Dispatch controls */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Trip Lifecycle stage panel */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trip Lifecycle Status</h2>
            
            <div className="relative flex justify-between items-center max-w-lg mx-auto py-2">
              {/* Connector Line Background */}
              <div className="absolute left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-850 -z-10 top-1/2 transform -translate-y-1/2" />
              
              {/* Stages */}
              {[
                { label: 'Draft', icon: RiFileTextLine, color: 'text-slate-500 border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-850' },
                { label: 'Dispatched', icon: RiSendPlane2Line, color: 'text-sky-500 border-sky-200 bg-sky-50/50 dark:bg-slate-950 dark:border-sky-950/40' },
                { label: 'Completed', icon: RiCheckboxCircleLine, color: 'text-slate-400 border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-850' },
                { label: 'Cancelled', icon: RiCloseCircleLine, color: 'text-slate-400 border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-850' },
              ].map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 z-10">
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm shadow-sm ${stage.color}`}>
                      <Icon />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase">{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Card (Glass card) */}
          <div className="p-6 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xl backdrop-blur-md dark:bg-slate-950/40 dark:border-slate-850/50 space-y-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Create New Dispatch</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Source */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Source Hub</label>
                  <div className="relative flex items-center">
                    <RiMapPinLine className="absolute left-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Gandhinagar"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Destination Target</label>
                  <div className="relative flex items-center">
                    <RiMapPinLine className="absolute left-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Ahmedabad"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Searchable Vehicle Select */}
                <div className="flex flex-col relative" ref={vehicleDropdownRef}>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Vehicle (Available Only)</label>
                  <button
                    type="button"
                    onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                    className="flex items-center justify-between px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white text-left cursor-pointer focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <span className="truncate">{selectedVehicle ? selectedVehicle.name : 'Select Available Vehicle'}</span>
                    <RiCarLine className="text-slate-400 flex-shrink-0 ml-2" />
                  </button>

                  {isVehicleDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl rounded-xl p-2 max-h-48 overflow-y-auto">
                      <div className="relative flex items-center mb-2 px-1">
                        <RiSearchLine className="absolute left-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search vehicle..."
                          value={searchVehicle}
                          onChange={(e) => setSearchVehicle(e.target.value)}
                          className="w-full pl-8 pr-2 py-1 text-xs border border-slate-150 dark:border-slate-800 rounded-lg outline-none bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-sky-500"
                        />
                      </div>
                      {filteredVehicles.map(v => (
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
                          <span className="font-bold text-[10px] text-orange-500">{v.capacity} kg max</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Searchable Driver Select */}
                <div className="flex flex-col relative" ref={driverDropdownRef}>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Driver (Available Only)</label>
                  <button
                    type="button"
                    onClick={() => setIsDriverDropdownOpen(!isDriverDropdownOpen)}
                    className="flex items-center justify-between px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white text-left cursor-pointer focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <span className="truncate">{selectedDriver ? selectedDriver.name : 'Select Available Driver'}</span>
                    <RiUser3Line className="text-slate-400 flex-shrink-0 ml-2" />
                  </button>

                  {isDriverDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl rounded-xl p-2 max-h-48 overflow-y-auto">
                      <div className="relative flex items-center mb-2 px-1">
                        <RiSearchLine className="absolute left-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search driver..."
                          value={searchDriver}
                          onChange={(e) => setSearchDriver(e.target.value)}
                          className="w-full pl-8 pr-2 py-1 text-xs border border-slate-150 dark:border-slate-800 rounded-lg outline-none bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-sky-500"
                        />
                      </div>
                      {filteredDrivers.map(d => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setSelectedDriver(d);
                            setIsDriverDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 flex justify-between items-center text-slate-700 dark:text-slate-350 cursor-pointer"
                        >
                          <span>{d.name} ({d.license})</span>
                          <span className="font-bold text-[10px] text-sky-500">{d.rating} index</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cargo Weight */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Cargo Weight (kg)</label>
                  <div className="relative flex items-center">
                    <RiScalesLine className="absolute left-3 text-slate-400" />
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Planned Distance */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Planned Distance (km)</label>
                  <div className="relative flex items-center">
                    <RiArrowRightLine className="absolute left-3 text-slate-400" />
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={plannedDistance}
                      onChange={(e) => setPlannedDistance(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Est Duration */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Estimated Duration (mins)</label>
                  <div className="relative flex items-center">
                    <RiTimerLine className="absolute left-3 text-slate-400" />
                    <input
                      type="number"
                      placeholder="e.g. 90"
                      value={estDuration}
                      onChange={(e) => setEstDuration(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Departure Date */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all dark:color-scheme-dark"
                  />
                </div>

              </div>

              {/* Notes */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-450 mb-1">Operational Notes</label>
                <textarea
                  placeholder="Include dispatch notes or comments..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>

              {/* REAL-TIME VALIDATION RESPONSE CARD */}
              <div className="pt-2">
                {selectedVehicle ? (
                  isOverweight ? (
                    // Capacity Exceeded
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 dark:border-red-950/40 dark:bg-red-950/10 flex items-start gap-3 shadow-md shadow-red-500/5 animate-pulse">
                      <RiAlertFill className="text-red-500 text-lg flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-extrabold text-red-750 dark:text-red-400 block uppercase">Dispatch Status: Blocked</span>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          Vehicle payload capacity is <span className="font-bold text-slate-700 dark:text-slate-200">{selectedVehicle.capacity} kg</span>. 
                          Cargo weight of <span className="font-bold text-slate-750 dark:text-slate-250">{cargoWeight} kg</span> exceeds limit by <span className="font-extrabold text-red-500">{weightExceededBy} kg</span>.
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Ready compliant
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-950/40 dark:bg-emerald-950/10 flex items-start gap-3 shadow-md shadow-emerald-500/5">
                      <RiCheckDoubleFill className="text-emerald-500 text-lg flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-extrabold text-emerald-705 dark:text-emerald-400 block uppercase">Dispatch Validation: Compliant</span>
                        <ul className="list-disc pl-4 text-slate-500 dark:text-slate-400 mt-1.5 space-y-0.5">
                          <li>Vehicle <span className="font-bold text-slate-700 dark:text-slate-200">{selectedVehicle.id}</span> matches payload specifications.</li>
                          {selectedDriver && <li>Driver <span className="font-bold text-slate-700 dark:text-slate-200">{selectedDriver.name}</span> available and assigned.</li>}
                          <li>Distance trajectory coordinates mapped successfully.</li>
                        </ul>
                      </div>
                    </div>
                  )
                ) : (
                  // General info state
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-900/10 flex items-start gap-3">
                    <RiInformationLine className="text-slate-400 text-lg flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                      Select a vehicle and input cargo metrics to verify load compliance calculations in real-time.
                    </p>
                  </div>
                )}
              </div>

              {/* Action commands */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850/50">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  Cancel Trip
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350 rounded-xl transition-all cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  onClick={handleDispatch}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Dispatch Trip
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* RIGHT COMPONENT: Live dispatch board */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Dispatch Board list */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850/50 pb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest m-0">Live Dispatch Board</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full dark:bg-slate-900 dark:text-slate-400">
                {trips.length} active routes
              </span>
            </div>

            {/* List */}
            <div className="space-y-4">
              {trips.map(trip => {
                let badgeClass = 'bg-slate-50 text-slate-650 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
                if (trip.status === 'Dispatched') badgeClass = 'bg-blue-50 text-blue-700 border-blue-200/40 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/40';
                if (trip.status === 'Cancelled') badgeClass = 'bg-red-50 text-red-700 border-red-200/40 dark:bg-red-950/20 dark:text-red-405 dark:border-red-900/40';

                return (
                  <div 
                    key={trip.id} 
                    className="p-4 rounded-xl border border-slate-150/60 bg-slate-50/20 dark:border-slate-850/60 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col gap-3"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider block">{trip.id}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">
                          {trip.source} → {trip.destination}
                        </span>
                      </div>
                      
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${badgeClass}`}>
                        {trip.status}
                      </span>
                    </div>

                    {/* Meta parameters */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-450 pt-2 border-t border-slate-100 dark:border-slate-900">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">Fleet Unit</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{trip.vehicleId}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">Operator</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{trip.driverName}</span>
                      </div>
                    </div>

                    {/* Progress tracking bar */}
                    {trip.status === 'Dispatched' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 dark:text-slate-500">Route Compliance: {trip.progress}%</span>
                          <span className="text-sky-500 font-bold">ETA: {trip.eta}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                            style={{ width: `${trip.progress}%` }} 
                          />
                        </div>
                      </div>
                    )}

                    {trip.status === 'Cancelled' && (
                      <p className="text-[10px] text-red-500 italic mt-1">
                        ⚠ Cancelled: {trip.notes}
                      </p>
                    )}

                    {trip.status === 'Draft' && (
                      <p className="text-[10px] text-amber-500 font-medium mt-1">
                        ⏱ Awaiting dispatch confirmation details.
                      </p>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM INFO: Roster lifecycle workflow banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Post-Trip Resolution Protocol</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          {[
            { label: '1. Complete Trip', desc: 'Arrived at Target' },
            { label: '2. Odometer Audits', desc: 'Sync log values' },
            { label: '3. Log Fuel', desc: 'Fill-up metrics' },
            { label: '4. Record Expenses', desc: 'Tolls & repair claims' },
            { label: '5. Release Vehicle', desc: 'Available for route' },
            { label: '6. Release Driver', desc: 'Next shift schedule' },
          ].map((step, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">{step.label}</span>
              <span className="text-[9px] text-slate-400 block">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
