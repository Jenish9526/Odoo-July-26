import React, { useState } from 'react';
import {
  RiRouteLine, RiSendPlane2Line, RiCheckboxCircleLine, RiCloseCircleLine,
  RiFileTextLine, RiCompass3Line, RiAlertLine, RiRefreshLine,
  RiCarLine, RiUser3Line, RiMapPinLine, RiGasStationLine, RiMoneyDollarCircleLine
} from 'react-icons/ri';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { useFleet } from '../../context/FleetContext';

const availableVehicles = [
  { id:'VAN-05',   name:'Ford Transit VAN-05',       capacity:800,   type:'Van'          },
  { id:'TRUCK-02', name:'Hino Cargo TRUCK-02',       capacity:5000,  type:'Truck'        },
  { id:'VAN-09',   name:'Mercedes Sprinter VAN-09',  capacity:1000,  type:'Van'          },
  { id:'SEMI-11',  name:'Peterbilt SEMI-11',         capacity:22000, type:'Semi-Trailer' },
];

const availableDrivers = [
  { id:'alex',   name:'Alex Chen',       license:'Class A CDL', rating:'95%' },
  { id:'marcus', name:'Marcus Vance',    license:'Class A CDL', rating:'98%' },
  { id:'sophia', name:'Sophia Martinez', license:'Class C',     rating:'91%' },
  { id:'david',  name:'David Miller',    license:'Class C',     rating:'92%' },
];

const weeklyData = [{name:'Mon',Trips:12},{name:'Tue',Trips:18},{name:'Wed',Trips:15},{name:'Thu',Trips:22},{name:'Fri',Trips:18},{name:'Sat',Trips:10},{name:'Sun',Trips:14}];
const etaData    = [{name:'<30m',Count:8},{name:'30-60m',Count:14},{name:'1-2h',Count:6},{name:'>2h',Count:3}];

const BADGE = {
  Dispatched: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  Draft:      'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
  Cancelled:  'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40',
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
};

export default function DispatcherDashboard() {
  const { trips, fuelLogs, expenses, createTrip, saveDraft } = useFleet();

  const [source, setSource]           = useState('');
  const [destination, setDestination] = useState('');
  const [selVehicle, setSelVehicle]   = useState(null);
  const [selDriver, setSelDriver]     = useState(null);
  const [cargo, setCargo]             = useState('');
  const [notes, setNotes]             = useState('');

  const weightNum    = cargo ? Number(cargo) : 0;
  const isOverweight = selVehicle && weightNum > selVehicle.capacity;
  const isValid      = source.trim() && destination.trim() && selVehicle && selDriver && cargo && !isOverweight;

  const resetForm = () => {
    setSource(''); setDestination(''); setSelVehicle(null); setSelDriver(null); setCargo(''); setNotes('');
  };

  const dispatch = (e) => {
    e.preventDefault();
    if (!isValid) return;
    createTrip({
      source, destination,
      vehicle: selVehicle.id,
      driver: selDriver.name,
      status: 'Dispatched',
      date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
      distance: 'N/A', duration: 'N/A', type: selVehicle.type, region: 'N/A',
    });
    resetForm();
  };

  const handleSaveDraft = () => {
    saveDraft({
      source: source || 'Unspecified',
      destination: destination || 'Unspecified',
      vehicle: selVehicle?.id || 'N/A',
      driver: selDriver?.name || 'Awaiting Driver',
      date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
      distance: 'N/A', duration: 'N/A', type: selVehicle?.type || 'N/A', region: 'N/A',
    });
    resetForm();
  };

  const activeCount    = trips.filter(t => t.status === 'Dispatched').length;
  const draftCount     = trips.filter(t => t.status === 'Draft').length;
  const completedCount = trips.filter(t => t.status === 'Completed').length;
  const cancelledCount = trips.filter(t => t.status === 'Cancelled').length;

  // Fuel/expense summaries for completed trips
  const getFuelForTrip    = (id) => fuelLogs.find(f => f.tripId === id);
  const getExpenseForTrip = (id) => expenses.find(e => e.tripId === id);

  return (
    <div className="space-y-6 animate-slide-in-top">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 m-0">Dispatcher Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Manage vehicle dispatches, monitor live routes, and track trip lifecycle.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 text-xs font-semibold">
          <RiRefreshLine className="animate-spin text-sky-500" />
          <span>Live Dispatch Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Active Dispatches', value:activeCount,    sub:'On route now',      Icon:RiSendPlane2Line,     color:'text-sky-500'     },
          { label:'Draft Trips',       value:draftCount,     sub:'Awaiting dispatch', Icon:RiFileTextLine,       color:'text-slate-400'   },
          { label:'Completed',         value:completedCount, sub:'Trips closed',      Icon:RiCheckboxCircleLine, color:'text-emerald-500' },
          { label:'Cancelled',         value:cancelledCount, sub:'Aborted routes',    Icon:RiCloseCircleLine,    color:'text-red-500'     },
        ].map((k,i) => (
          <div key={i} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{k.label}</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">{k.value}</span>
              <span className="text-[10px] text-slate-400">{k.sub}</span>
            </div>
            <div className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 ${k.color}`}>
              <k.Icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Form + Live Board */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* Dispatch Form */}
        <div className="xl:col-span-6 p-6 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xl backdrop-blur-md dark:bg-slate-950/40 dark:border-slate-800/50 space-y-5">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Create New Dispatch</h2>
          <form onSubmit={dispatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['Source Hub','text',source,setSource,'e.g. Gandhinagar'],['Destination','text',destination,setDestination,'e.g. Ahmedabad']].map(([lbl,type,val,setter,ph]) => (
                <div key={lbl} className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{lbl}</label>
                  <div className="relative flex items-center">
                    <RiMapPinLine className="absolute left-3 text-slate-400" />
                    <input type={type} placeholder={ph} value={val} onChange={e => setter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                  </div>
                </div>
              ))}

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle</label>
                <div className="relative flex items-center">
                  <RiCarLine className="absolute left-3 text-slate-400" />
                  <select value={selVehicle?.id || ''} onChange={e => setSelVehicle(availableVehicles.find(v => v.id === e.target.value) || null)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all cursor-pointer">
                    <option value="">Select Vehicle</option>
                    {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.capacity}kg)</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Driver</label>
                <div className="relative flex items-center">
                  <RiUser3Line className="absolute left-3 text-slate-400" />
                  <select value={selDriver?.id || ''} onChange={e => setSelDriver(availableDrivers.find(d => d.id === e.target.value) || null)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all cursor-pointer">
                    <option value="">Select Driver</option>
                    {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name} — {d.rating}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cargo Weight (kg)</label>
                <input type="number" placeholder="e.g. 500" value={cargo} onChange={e => setCargo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Operational Notes</label>
              <textarea placeholder="Include dispatch notes..." value={notes} onChange={e => setNotes(e.target.value)} rows="2"
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
            </div>

            {selVehicle && (
              isOverweight
                ? <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 dark:border-red-950/40 dark:bg-red-950/10 flex items-center gap-2 text-xs">
                    <RiAlertLine className="text-red-500 flex-shrink-0" />
                    <span className="text-red-600 dark:text-red-400 font-semibold">Cargo exceeds vehicle capacity of {selVehicle.capacity}kg — dispatch blocked.</span>
                  </div>
                : <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-950/40 dark:bg-emerald-950/10 flex items-center gap-2 text-xs">
                    <RiCheckboxCircleLine className="text-emerald-500 flex-shrink-0" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Vehicle payload compliant. Ready to dispatch.</span>
                  </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
              <button type="button" onClick={handleSaveDraft} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 rounded-xl transition-all cursor-pointer border-none">Save Draft</button>
              <button type="submit" disabled={!isValid} className="px-5 py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none">Dispatch Trip</button>
            </div>
          </form>
        </div>

        {/* Live Dispatch Board */}
        <div className="xl:col-span-6 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest m-0">Live Dispatch Board</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full dark:bg-slate-900 dark:text-slate-400">{trips.length} routes</span>
          </div>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {trips.map(t => {
              const tripFuel = getFuelForTrip(t.id);
              const tripExp  = getExpenseForTrip(t.id);
              return (
                <div key={t.id} className="p-4 rounded-xl border border-slate-150/60 bg-slate-50/20 dark:border-slate-800/60 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider block">{t.id}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">{t.source} → {t.destination}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${BADGE[t.status]||''}`}>{t.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-900">
                    <div><span className="text-[9px] font-bold uppercase text-slate-400 block">Vehicle</span><span className="font-bold text-slate-700 dark:text-slate-300">{t.vehicle}</span></div>
                    <div><span className="text-[9px] font-bold uppercase text-slate-400 block">Driver</span><span className="font-bold text-slate-700 dark:text-slate-300">{t.driver}</span></div>
                  </div>
                  {t.status === 'Dispatched' && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Progress: {t.progress}%</span>
                        <span className="text-sky-500 font-bold">ETA: {t.eta}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{width:`${t.progress}%`}} />
                      </div>
                    </div>
                  )}
                  {t.status === 'Completed' && (tripFuel || tripExp) && (
                    <div className="flex flex-wrap gap-3 pt-1 border-t border-slate-100 dark:border-slate-900 text-[10px]">
                      {tripFuel && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <RiGasStationLine size={11} /> {tripFuel.liters}L · ₹{tripFuel.cost.toLocaleString()}
                        </span>
                      )}
                      {tripExp && (
                        <span className="flex items-center gap-1 text-orange-500 font-bold">
                          <RiMoneyDollarCircleLine size={11} /> ₹{tripExp.total.toLocaleString()} expenses
                        </span>
                      )}
                    </div>
                  )}
                  {t.status === 'Cancelled' && <p className="text-[10px] text-red-500 italic">⚠ Route cancelled.</p>}
                  {t.status === 'Draft'     && <p className="text-[10px] text-amber-500 font-medium">⏱ Awaiting dispatch confirmation.</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Weekly Trip Volume</span>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9}/>
                <YAxis stroke="#94a3b8" fontSize={9}/>
                <Tooltip contentStyle={{background:'#0f172a',border:'none',fontSize:'9px'}}/>
                <Area type="monotone" dataKey="Trips" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.12}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">ETA Distribution</span>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={etaData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9}/>
                <YAxis stroke="#94a3b8" fontSize={9}/>
                <Tooltip contentStyle={{background:'#0f172a',border:'none',fontSize:'9px'}}/>
                <Bar dataKey="Count" fill="#F59E0B" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Post-trip protocol */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Post-Trip Resolution Protocol</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          {[['1. Complete Trip','Arrived at Target'],['2. Odometer Audit','Sync log values'],['3. Log Fuel','Fill-up metrics'],['4. Record Expenses','Tolls & repairs'],['5. Release Vehicle','Available for route'],['6. Release Driver','Next shift schedule']].map(([lbl,desc],i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">{lbl}</span>
              <span className="text-[9px] text-slate-400 block">{desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
