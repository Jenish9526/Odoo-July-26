import React, { createContext, useContext, useState } from 'react';

const FleetContext = createContext(null);

const initialTrips = [
  { id:'TR001', source:'Gandhinagar', destination:'Ahmedabad', vehicle:'VAN-05',   driver:'Marcus Vance', status:'Dispatched', progress:65, eta:'45 min', date:'Jul 13, 2026', distance:'32 km', duration:'45 min', type:'Van',   region:'North' },
  { id:'TR002', source:'Vatva',       destination:'Sanand',    vehicle:'TRUCK-02', driver:'Alex Chen',    status:'Dispatched', progress:30, eta:'1h 20m', date:'Jul 13, 2026', distance:'28 km', duration:'40 min', type:'Truck', region:'East'  },
  { id:'TR003', source:'Naroda',      destination:'Bavla',     vehicle:'VAN-09',   driver:'Sophia M.',    status:'Draft',      progress:0,  eta:'TBD',    date:'Jul 14, 2026', distance:'45 km', duration:'1h 10m',type:'Van',   region:'West'  },
  { id:'TR004', source:'Mansa',       destination:'Kalol',     vehicle:'SEMI-11',  driver:'John C.',      status:'Cancelled',  progress:0,  eta:'--',     date:'Jul 12, 2026', distance:'18 km', duration:'25 min', type:'Truck', region:'South' },
  { id:'TR005', source:'Surat',       destination:'Baroda',    vehicle:'VAN-05',   driver:'Marcus Vance', status:'Completed',  progress:100,eta:'Done',   date:'Jul 11, 2026', distance:'90 km', duration:'1h 30m',type:'Van',   region:'South' },
];

const initialFuelLogs = [
  { id:1, tripId:'TR005', vehicleId:'VAN-05',   driver:'Marcus Vance', date:'Jul 11, 2026', liters:42,  cost:3150 },
  { id:2, tripId:'TR002', vehicleId:'TRUCK-02', driver:'Alex Chen',    date:'Jul 10, 2026', liters:110, cost:8400 },
];

const initialExpenses = [
  { id:1, tripId:'TR005', vehicleId:'VAN-05',   driver:'Marcus Vance', toll:120, other:0,   maint:0,     total:120,  date:'Jul 11, 2026' },
  { id:2, tripId:'TR002', vehicleId:'TRUCK-02', driver:'Alex Chen',    toll:340, other:150, maint:18000, total:18490,date:'Jul 10, 2026' },
];

export function FleetProvider({ children }) {
  const [trips,    setTrips]    = useState(initialTrips);
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [expenses, setExpenses] = useState(initialExpenses);

  // Driver ends their trip
  const endTrip = (tripId) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, status: 'Completed', progress: 100, eta: 'Done' } : t
    ));
  };

  // Driver adds fuel log after trip
  const addFuelLog = (log) => {
    setFuelLogs(prev => [{ id: Date.now(), ...log }, ...prev]);
  };

  // Driver adds expense after trip
  const addExpense = (exp) => {
    const total = (Number(exp.toll) || 0) + (Number(exp.other) || 0) + (Number(exp.maint) || 0);
    setExpenses(prev => [{ id: Date.now(), ...exp, total }, ...prev]);
  };

  // Dispatcher creates new trip
  const createTrip = (trip) => {
    const newId = `TR${String(trips.length + 1).padStart(3, '0')}`;
    setTrips(prev => [{ id: newId, progress: 5, eta: '45 min', ...trip }, ...prev]);
    return newId;
  };

  // Dispatcher saves draft
  const saveDraft = (trip) => {
    const newId = `TR${String(trips.length + 1).padStart(3, '0')}`;
    setTrips(prev => [{ id: newId, status: 'Draft', progress: 0, eta: 'TBD', ...trip }, ...prev]);
  };

  return (
    <FleetContext.Provider value={{ trips, fuelLogs, expenses, endTrip, addFuelLog, addExpense, createTrip, saveDraft }}>
      {children}
    </FleetContext.Provider>
  );
}

export const useFleet = () => useContext(FleetContext);
