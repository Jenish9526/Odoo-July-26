import React, { useState } from 'react';
import {
  RiCompass3Line, RiCheckboxCircleLine, RiTimeLine, RiShieldCheckLine,
  RiMapPinLine, RiCarLine, RiCalendarLine, RiGasStationLine,
  RiArrowRightLine, RiAlertLine, RiRouteLine, RiCloseLine, RiCheckLine
} from 'react-icons/ri';
import {
  ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { useFleet } from '../../context/FleetContext';

const MY_DRIVER = 'Marcus Vance';
const MY_VEHICLE = 'VAN-05';

const weeklyMiles = [
  {name:'Mon',km:85},{name:'Tue',km:120},{name:'Wed',km:95},
  {name:'Thu',km:140},{name:'Fri',km:110},{name:'Sat',km:60},{name:'Sun',km:75},
];
const safetyData = [{ name:'Safety Score', value:95, fill:'#22C55E' }];

const STATUS_CLASSES = {
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  Dispatched: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  Draft:      'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
  Cancelled:  'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40',
};

export default function DriverDashboard() {
  const { trips, fuelLogs, expenses, endTrip, addFuelLog, addExpense } = useFleet();
  const [activeTab, setActiveTab] = useState('trips');
  const [showModal, setShowModal] = useState(false);
  const [endingTripId, setEndingTripId] = useState(null);
  const [fuel, setFuel] = useState({ liters: '', cost: '' });
  const [exp,  setExp]  = useState({ toll: '', other: '', maint: '' });

  const myTrips    = trips.filter(t => t.driver === MY_DRIVER);
  const myFuelLogs = fuelLogs.filter(f => f.driver === MY_DRIVER);
  const activeTrip = myTrips.find(t => t.status === 'Dispatched');

  const completedCount  = myTrips.filter(t => t.status === 'Completed').length;
  const scheduledCount  = myTrips.filter(t => t.status === 'Draft').length;
  const totalKm         = weeklyMiles.reduce((s, d) => s + d.km, 0);

  const handleEndTrip = (tripId) => {
    setEndingTripId(tripId);
    setShowModal(true);
  };

  const handleSubmitPostTrip = () => {
    endTrip(endingTripId);
    if (fuel.liters && fuel.cost) {
      addFuelLog({
        tripId: endingTripId, vehicleId: MY_VEHICLE, driver: MY_DRIVER,
        date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
        liters: Number(fuel.liters), cost: Number(fuel.cost),
      });
    }
    if (exp.toll || exp.other || exp.maint) {
      addExpense({
        tripId: endingTripId, vehicleId: MY_VEHICLE, driver: MY_DRIVER,
        date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
        toll: Number(exp.toll) || 0, other: Number(exp.other) || 0, maint: Number(exp.maint) || 0,
      });
    }
    setShowModal(false);
    setFuel({ liters: '', cost: '' });
    setExp({ toll: '', other: '', maint: '' });
    setEndingTripId(null);
  };

  return (
    <div className="space-y-6 animate-slide-in-top">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 m-0">Driver Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Your personal trip schedule, safety record, and fuel activity.</p>
        </div>
        {activeTrip && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800/40 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 text-xs font-semibold">
            <RiCompass3Line className="animate-pulse" />
            <span>Trip In Progress</span>
          </div>
        )}
      </div>

      {/* Driver Profile Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-2xl font-black shadow-lg shadow-sky-500/30">M</div>
          <div>
            <h2 className="text-lg font-black m-0">Marcus Vance</h2>
            <span className="text-xs text-slate-400 block">DL-284902A • Class A CDL</span>
            <span className="text-xs text-slate-400 block mt-0.5">Expires: Oct 15, 2028</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 sm:ml-auto text-center">
          {[
            ['Total Trips', myTrips.length, 'text-sky-400'],
            ['Completed',   completedCount, 'text-emerald-400'],
            ['Safety Score','95%',          'text-emerald-400'],
            ['Km This Week',`${totalKm}`,   'text-orange-400'],
          ].map(([lbl,val,c]) => (
            <div key={lbl}>
              <span className={`text-xl font-black block ${c}`}>{val}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Trips Completed', value:completedCount,       sub:'All time',       Icon:RiCheckboxCircleLine, color:'text-emerald-500' },
          { label:'Drafts/Scheduled',value:scheduledCount,       sub:'Upcoming trips', Icon:RiCalendarLine,       color:'text-sky-500'     },
          { label:'On Route',        value:activeTrip ? 1 : 0,   sub:'Active now',     Icon:RiCompass3Line,       color:'text-blue-500'    },
          { label:'Safety Score',    value:'95%',                 sub:'Excellent',      Icon:RiShieldCheckLine,    color:'text-emerald-500' },
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

      {/* Active Trip Card */}
      {activeTrip && (
        <div className="p-6 rounded-2xl bg-white border-2 border-sky-200 dark:border-sky-800/40 shadow-md dark:bg-slate-950 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Active Trip — {activeTrip.id}</h2>
            </div>
            <button
              onClick={() => handleEndTrip(activeTrip.id)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer border-none"
            >
              End Trip
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
            <RiMapPinLine className="text-slate-400" />
            <span>{activeTrip.source}</span>
            <RiArrowRightLine className="text-slate-400" />
            <span>{activeTrip.destination}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div><span className="text-[10px] font-bold text-slate-400 uppercase block">Vehicle</span><span className="font-bold text-slate-700 dark:text-slate-300">{activeTrip.vehicle}</span></div>
            <div><span className="text-[10px] font-bold text-slate-400 uppercase block">Distance</span><span className="font-bold text-slate-700 dark:text-slate-300">{activeTrip.distance}</span></div>
            <div><span className="text-[10px] font-bold text-slate-400 uppercase block">ETA</span><span className="font-bold text-slate-700 dark:text-slate-300">{activeTrip.eta}</span></div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Route Progress</span><span className="text-sky-500 font-bold">{activeTrip.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{width:`${activeTrip.progress}%`}} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs dark:bg-slate-950 dark:border-slate-800/50">
        <div className="flex border-b border-slate-100 dark:border-slate-800/50">
          {[['trips','My Trips',RiRouteLine],['fuel','Fuel Logs',RiGasStationLine]].map(([key,lbl,Icon]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold transition-colors cursor-pointer border-none
                ${activeTab === key ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 bg-sky-50/50 dark:bg-sky-950/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>
              <Icon size={15} />{lbl}
            </button>
          ))}
        </div>

        {activeTab === 'trips' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                  {['Trip ID','Route','Vehicle','Date','Distance','Duration','Status'].map(h => <th key={h} className="px-5 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {myTrips.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-sky-500">{t.id}</td>
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">{t.source} → {t.destination}</td>
                    <td className="px-5 py-3 text-slate-500">{t.vehicle}</td>
                    <td className="px-5 py-3 text-slate-500">{t.date}</td>
                    <td className="px-5 py-3 font-semibold">{t.distance}</td>
                    <td className="px-5 py-3 text-slate-500">{t.duration}</td>
                    <td className="px-5 py-3"><span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${STATUS_CLASSES[t.status]||''}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'fuel' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                  {['Date','Vehicle','Liters','Cost'].map(h => <th key={h} className="px-5 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {myFuelLogs.map((f,i) => (
                  <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-5 py-3 text-slate-500">{f.date}</td>
                    <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-100">{f.vehicleId}</td>
                    <td className="px-5 py-3 font-semibold">{f.liters} L</td>
                    <td className="px-5 py-3 font-bold text-orange-500">₹{f.cost.toLocaleString()}</td>
                  </tr>
                ))}
                {myFuelLogs.length === 0 && (
                  <tr><td colSpan="4" className="px-5 py-6 text-center text-slate-400">No fuel logs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Weekly KM Chart + Safety */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Weekly Distance (km)</span>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyMiles}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9}/>
                <YAxis stroke="#94a3b8" fontSize={9}/>
                <Tooltip contentStyle={{background:'#0f172a',border:'none',fontSize:'9px'}}/>
                <Area type="monotone" dataKey="km" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.12}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-4">
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Safety & Compliance</h2>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={safetyData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f1f5f9' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs flex-1">
              {[
                {label:'Safety Score',    value:'95 / 100', color:'text-emerald-500'},
                {label:'Trips This Month',value:myTrips.length, color:'text-sky-500'},
                {label:'License Status',  value:'Valid',    color:'text-emerald-500'},
                {label:'Expiry Date',     value:'Oct 2028', color:'text-slate-500'},
              ].map((r,i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-slate-900 last:border-0">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/10 flex items-start gap-2.5 text-xs">
            <RiAlertLine size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-slate-600 dark:text-slate-400 m-0">License renewal due in <span className="font-bold text-amber-600 dark:text-amber-400">Oct 2028</span>. Ensure renewal is processed 30 days before expiry.</p>
          </div>
        </div>
      </div>

      {/* Post-Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Post-Trip Report</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Log fuel and expenses before closing trip {endingTripId}.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white bg-transparent border-none cursor-pointer">
                <RiCloseLine size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Fuel Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <RiGasStationLine size={12} /> Fuel Log (optional)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">Liters</label>
                    <input type="number" placeholder="e.g. 42" value={fuel.liters} onChange={e => setFuel(p => ({...p, liters: e.target.value}))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">Cost (₹)</label>
                    <input type="number" placeholder="e.g. 3150" value={fuel.cost} onChange={e => setFuel(p => ({...p, cost: e.target.value}))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                  </div>
                </div>
              </div>

              {/* Expense Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <RiCarLine size={12} /> Expenses (optional)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[['Toll (₹)','toll'],['Other (₹)','other'],['Maint (₹)','maint']].map(([lbl,key]) => (
                    <div key={key}>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{lbl}</label>
                      <input type="number" placeholder="0" value={exp[key]} onChange={e => setExp(p => ({...p, [key]: e.target.value}))}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 rounded-xl transition-all cursor-pointer border-none">
                Cancel
              </button>
              <button onClick={handleSubmitPostTrip} className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer border-none">
                <RiCheckLine size={14} /> Complete Trip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
