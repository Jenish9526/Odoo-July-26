import React, { useState } from 'react';
import {
  RiCarLine, RiCheckDoubleLine, RiToolsLine, RiSteering2Line,
  RiCompass3Line, RiTimeLine, RiRefreshLine, RiAlertLine,
  RiEyeLine, RiEditLine, RiMoneyDollarCircleLine, RiGasStationLine,
  RiFileChartLine
} from 'react-icons/ri';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { useFleet } from '../../context/FleetContext';

const CHART_COLORS = ['#2563EB', '#F59E0B', '#22C55E', '#EF4444', '#8B5CF6', '#EC4899'];

const STATUS_CLASSES = {
  Draft:      'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
  Dispatched: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40',
  Cancelled:  'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40',
};

const tripsData   = [{name:'Mon',Trips:12},{name:'Tue',Trips:18},{name:'Wed',Trips:15},{name:'Thu',Trips:22},{name:'Fri',Trips:18},{name:'Sat',Trips:10},{name:'Sun',Trips:14}];
const fuelChart   = [{name:'Mon',Liters:450},{name:'Tue',Liters:580},{name:'Wed',Liters:510},{name:'Thu',Liters:630},{name:'Fri',Liters:590},{name:'Sat',Liters:320},{name:'Sun',Liters:380}];
const revenueData = [{name:'Apr',Revenue:95000,Expense:48000},{name:'May',Revenue:108000,Expense:52000},{name:'Jun',Revenue:115000,Expense:55000},{name:'Jul',Revenue:125000,Expense:59000}];
const maintCost   = [{name:'Truck-11',Cost:18000},{name:'Mini-03',Cost:1800},{name:'Van-05',Cost:2100},{name:'Truck-08',Cost:4500},{name:'Bus-02',Cost:3900}];

const vehicleTypes  = ['All','Truck','Van','Semi-Trailer','Hybrid'];
const statusOptions = ['All','Dispatched','Completed','Draft','Cancelled'];
const regionOptions = ['All','North','East','South','West'];

export default function AdminDashboard() {
  const { trips, fuelLogs, expenses } = useFleet();

  const [selType,   setSelType]   = useState('All');
  const [selStatus, setSelStatus] = useState('All');
  const [selRegion, setSelRegion] = useState('All');
  const [applied,   setApplied]   = useState({ type:'All', status:'All', region:'All' });

  const filtered = trips.filter(t =>
    (applied.type   === 'All' || t.type   === applied.type)   &&
    (applied.status === 'All' || t.status === applied.status) &&
    (applied.region === 'All' || t.region === applied.region)
  );

  const reset = () => {
    setSelType('All'); setSelStatus('All'); setSelRegion('All');
    setApplied({ type:'All', status:'All', region:'All' });
  };

  // Derived KPIs from context
  const activeCount    = trips.filter(t => t.status === 'Dispatched').length;
  const completedCount = trips.filter(t => t.status === 'Completed').length;
  const draftCount     = trips.filter(t => t.status === 'Draft').length;
  const totalFuelCost  = fuelLogs.reduce((s, f) => s + f.cost, 0);
  const totalExpenses  = expenses.reduce((s, e) => s + e.total, 0);
  const totalFuelLiters= fuelLogs.reduce((s, f) => s + f.liters, 0);

  return (
    <div className="space-y-6 animate-slide-in-top">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 m-0">Administrator Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Full fleet oversight — vehicles, drivers, trips, finances, and system health.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 text-xs font-semibold">
          <RiRefreshLine className="animate-spin text-orange-500" />
          <span>Live Sync Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label:'Total Trips',     value:trips.length,                          sub:'All records',      Icon:RiFileChartLine,         color:'text-sky-500'     },
          { label:'Active Dispatches',value:activeCount,                          sub:'On route now',     Icon:RiCompass3Line,          color:'text-blue-500'    },
          { label:'Completed',       value:completedCount,                        sub:'Trips closed',     Icon:RiCheckDoubleLine,       color:'text-emerald-500' },
          { label:'Drafts',          value:draftCount,                            sub:'Pending dispatch', Icon:RiTimeLine,              color:'text-slate-400'   },
          { label:'Fuel Liters',     value:`${totalFuelLiters}L`,                 sub:'Total logged',     Icon:RiGasStationLine,        color:'text-green-500'   },
          { label:'Fuel Cost',       value:`₹${(totalFuelCost/1000).toFixed(1)}K`,sub:'Total spend',      Icon:RiMoneyDollarCircleLine, color:'text-orange-500'  },
          { label:'Expenses',        value:`₹${(totalExpenses/1000).toFixed(1)}K`,sub:'Tolls & maint',    Icon:RiToolsLine,             color:'text-red-500'     },
        ].map((k, i) => (
          <div key={i} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{k.label}</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white block">{k.value}</span>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{k.sub}</span>
              <k.Icon size={16} className={k.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {[['Vehicle Type', vehicleTypes, selType, setSelType], ['Status', statusOptions, selStatus, setSelStatus], ['Region', regionOptions, selRegion, setSelRegion]].map(([lbl, opts, val, setter]) => (
            <div key={lbl} className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{lbl}:</span>
              <select value={val} onChange={e => setter(e.target.value)} className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer dark:text-slate-300">
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer transition-colors bg-transparent">Reset</button>
          <button onClick={() => setApplied({ type:selType, status:selStatus, region:selRegion })} className="px-4 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer transition-all border-none">Apply</button>
        </div>
      </div>

      {/* Recent Trips + Vehicle Status */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">All Trips</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Live routing logs — {filtered.length} of {trips.length} shown.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                  {['Trip ID','Route','Vehicle','Driver','Status','ETA','Actions'].map(h => <th key={h} className={`px-4 py-3 ${h==='Actions'?'text-right':''}`}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan="7" className="text-center py-6 text-slate-400 font-medium">No matching trips found.</td></tr>
                  : filtered.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-sky-500">{t.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{t.source} → {t.destination}</td>
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{t.vehicle}</td>
                      <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{t.driver}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${STATUS_CLASSES[t.status]||''}`}>{t.status}</span></td>
                      <td className="px-4 py-3 font-semibold text-slate-400">{t.eta}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1 rounded text-slate-400 hover:text-orange-500 bg-transparent border-none cursor-pointer"><RiEyeLine size={13}/></button>
                          <button className="p-1 rounded text-slate-400 hover:text-orange-500 bg-transparent border-none cursor-pointer"><RiEditLine size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Fleet Summary</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Trip status breakdown.</p>
          </div>
          <div className="space-y-4 pt-2 text-xs">
            {[
              ['Dispatched', trips.filter(t=>t.status==='Dispatched').length, 'blue'],
              ['Completed',  trips.filter(t=>t.status==='Completed').length,  'emerald'],
              ['Draft',      trips.filter(t=>t.status==='Draft').length,      'amber'],
              ['Cancelled',  trips.filter(t=>t.status==='Cancelled').length,  'red'],
            ].map(([lbl, count, c]) => {
              const pct = trips.length ? Math.round((count / trips.length) * 100) : 0;
              return (
                <div key={lbl} className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600 dark:text-slate-300">{lbl}</span>
                    <span className={`text-${c}-500`}>{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className={`bg-${c}-500 h-full rounded-full transition-all duration-500`} style={{width:`${pct}%`}} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fuel & Expense Summary */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Financial Summary</span>
            {[
              ['Total Fuel Cost',  `₹${totalFuelCost.toLocaleString()}`,  'text-green-500',  RiGasStationLine],
              ['Total Expenses',   `₹${totalExpenses.toLocaleString()}`,  'text-orange-500', RiMoneyDollarCircleLine],
              ['Fuel Logs',        `${fuelLogs.length} entries`,          'text-sky-500',    RiFileChartLine],
            ].map(([lbl, val, c, Icon]) => (
              <div key={lbl} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 dark:border-slate-900 last:border-0">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Icon size={12} className={c} />{lbl}
                </div>
                <span className={`font-bold ${c}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title:'Daily Trips',       chart: <LineChart data={tripsData}><CartesianGrid strokeDasharray="3 3" opacity={0.1}/><XAxis dataKey="name" stroke="#94a3b8" fontSize={8}/><YAxis stroke="#94a3b8" fontSize={8}/><Tooltip contentStyle={{background:'#0f172a',border:'none',fontSize:'9px'}}/><Line type="monotone" dataKey="Trips" stroke="#2563EB" strokeWidth={2} dot={{r:2}}/></LineChart> },
          { title:'Fuel (Liters)',     chart: <AreaChart data={fuelChart}><CartesianGrid strokeDasharray="3 3" opacity={0.1}/><XAxis dataKey="name" stroke="#94a3b8" fontSize={8}/><YAxis stroke="#94a3b8" fontSize={8}/><Tooltip contentStyle={{background:'#0f172a',border:'none',fontSize:'9px'}}/><Area type="monotone" dataKey="Liters" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1}/></AreaChart> },
          { title:'Revenue vs Expense',chart: <BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" opacity={0.1}/><XAxis dataKey="name" stroke="#94a3b8" fontSize={8}/><YAxis stroke="#94a3b8" fontSize={8}/><Tooltip contentStyle={{background:'#0f172a',border:'none',fontSize:'9px'}}/><Bar dataKey="Revenue" fill="#2563EB" radius={[3,3,0,0]}/><Bar dataKey="Expense" fill="#F59E0B" radius={[3,3,0,0]}/></BarChart> },
          { title:'Service Cost',      chart: <PieChart><Pie data={maintCost} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="Cost">{maintCost.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{background:'#0f172a',border:'none',fontSize:'9px'}}/></PieChart> },
        ].map(({ title, chart }) => (
          <div key={title} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{title}</span>
            <div className="h-44"><ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer></div>
          </div>
        ))}
      </div>

      {/* Activities + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Recent Activities</h2>
          </div>
          <div className="space-y-4 text-xs">
            {[
              {time:'10:15 AM', dot:'bg-blue-500',    title:'Vehicle VAN-05 dispatched',          sub:'Route assigned to Marcus Vance.'},
              {time:'09:30 AM', dot:'bg-emerald-500', title:'Maintenance completed for Truck-11', sub:'Full transmission audit. Cost ₹18,000.'},
              {time:'08:45 AM', dot:'bg-orange-500',  title:'Fuel log added for VAN-05',          sub:'Refill transaction of 42L verified.'},
              {time:'Yesterday',dot:'bg-slate-500',   title:'Trip TR005 completed',               sub:'Marcus Vance — Surat to Baroda.'},
            ].map((a,i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-slate-400 w-16 pt-0.5">{a.time}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{a.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{a.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-800/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Live Active Alerts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {c:'red',    title:'Maintenance Due',      sub:'Semi-11 odometer exceeds 120k threshold.'},
              {c:'orange', title:'License Expiry',       sub:'Driver Alex Chen license due in 12 days.'},
              {c:'sky',    title:'Pending Dispatch',     sub:`${draftCount} trip(s) awaiting confirmation.`},
              {c:'red',    title:'Fuel Budget Exceeded', sub:'TRUCK-11 refueling exceeds week quota.'},
            ].map((a,i) => (
              <div key={i} className={`p-3.5 rounded-xl border border-${a.c}-500/10 bg-${a.c}-500/5 flex items-start gap-2.5`}>
                <RiAlertLine size={16} className={`text-${a.c}-500 shrink-0 mt-0.5 animate-pulse`} />
                <div>
                  <span className={`font-bold text-${a.c}-600 dark:text-${a.c}-400 block`}>{a.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{a.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
