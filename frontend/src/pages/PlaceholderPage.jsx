import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  RiSteering2Line,
  RiRouteLine,
  RiToolsLine,
  RiGasStationLine,
  RiMoneyDollarCircleLine,
  RiFileChartLine,
  RiSettings4Line,
  RiCompass3Line,
  RiUserHeartLine,
  RiMoneyDollarBoxLine,
  RiDashboard3Line
} from 'react-icons/ri';

// Dynamic page configurations
const configMap = {
  '/drivers': {
    title: 'Driver Roster & Profiles',
    desc: 'Monitor active operators, check licensing status, and trace safety metrics.',
    icon: RiSteering2Line,
    color: 'text-sky-500 bg-sky-500/10',
    stats: [
      { label: 'Active Drivers', val: '19 operators', change: 'On active shifts', trend: 'text-emerald-500' },
      { label: 'Safety Index Avg', val: '98.2 / 100', change: 'Excellent rating', trend: 'text-emerald-500' },
      { label: 'Shift Coverage', val: '94%', change: 'FY2026 Target met', trend: 'text-emerald-500' },
    ]
  },
  '/trips': {
    title: 'Dispatch & Route Logs',
    desc: 'Verify route compliance, arrival estimates, and trip anomalies.',
    icon: RiRouteLine,
    color: 'text-blue-500 bg-blue-500/10',
    stats: [
      { label: 'Completed Today', val: '128 Trips', change: '↑ 12% vs yesterday', trend: 'text-emerald-500' },
      { label: 'On-Time Performance', val: '96.4%', change: 'Excellent index', trend: 'text-emerald-500' },
      { label: 'Delayed Routes', val: '2 anomalies', change: 'Resolving in progress', trend: 'text-amber-500' },
    ]
  },
  '/maintenance': {
    title: 'Fleet Service & Maintenance',
    desc: 'Review scheduled oil changes, tire rotations, and active repair shop operations.',
    icon: RiToolsLine,
    color: 'text-amber-500 bg-amber-500/10',
    stats: [
      { label: 'Vehicles In Shop', val: '6 units', change: 'Scheduled audits', trend: 'text-slate-500' },
      { label: 'Resolved (This Week)', val: '9 units', change: 'Average duration 4.5h', trend: 'text-emerald-500' },
      { label: 'Compliance Index', val: '100%', stroke: 'No outstanding flags', trend: 'text-emerald-500' },
    ]
  },
  '/fuel': {
    title: 'Fuel Efficiency & Records',
    desc: 'Track fuel fill-ups, average mileage efficiency, and carbon emissions.',
    icon: RiGasStationLine,
    color: 'text-red-500 bg-red-500/10',
    stats: [
      { label: 'Fuel Consumed', val: '4,280 Liters', change: 'Weekly consumption', trend: 'text-red-500' },
      { label: 'Fuel Efficiency', val: '12.4 km / L', change: 'Standard fleet avg', trend: 'text-emerald-500' },
      { label: 'Weekly Fuel Cost', val: '$6,845.20', change: '↓ 4.5% from last week', trend: 'text-emerald-500' },
    ]
  },
  '/expenses': {
    title: 'Financial Expense ledger',
    desc: 'Track toll costs, parts replacement invoices, and insurance audits.',
    icon: RiMoneyDollarCircleLine,
    color: 'text-purple-500 bg-purple-500/10',
    stats: [
      { label: 'Tolls & Charges', val: '$1,405.00', change: 'Weekly total', trend: 'text-slate-500' },
      { label: 'Maintenance Cost', val: '$12,480.00', change: 'Under monthly budget', trend: 'text-emerald-500' },
      { label: 'Misc Logistics', val: '$890.00', change: 'Approved claims', trend: 'text-emerald-500' },
    ]
  },
  '/reports': {
    title: 'Operations & Audit Disclosures',
    desc: 'Exportable spreadsheets and PDF documentation for stakeholders.',
    icon: RiFileChartLine,
    color: 'text-indigo-500 bg-indigo-500/10',
    stats: [
      { label: 'Reports Available', val: '8 Logs', change: 'August drafts compiled', trend: 'text-emerald-500' },
      { label: 'Audit Trail', val: 'Synchronized', change: 'Deloitte platform link', trend: 'text-emerald-500' },
      { label: 'MSCI Fleet Score', val: 'AAA Rating', change: 'Upgraded from AA', trend: 'text-emerald-500' },
    ]
  },
  '/settings': {
    title: 'Roster & Rerouting Configs',
    desc: 'Manage API integrations, webhook links, and dispatch safety values.',
    icon: RiSettings4Line,
    color: 'text-slate-500 bg-slate-500/10',
    stats: [
      { label: 'Webhook Pipelines', val: '4 Active', change: 'JSON data stream sync', trend: 'text-emerald-500' },
      { label: 'MFA Status', val: 'Active (SSO)', change: 'Azure AD validation', trend: 'text-emerald-500' },
      { label: 'Telemetry Frequency', val: '3 seconds', change: 'Real-time feed', trend: 'text-emerald-500' },
    ]
  }
};

export default function PlaceholderPage() {
  const location = useLocation();
  const path = location.pathname;
  const config = configMap[path] || configMap['/drivers'];
  const PageIcon = config.icon;

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Title Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-950 dark:border-slate-850/50 shadow-xs">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${config.color} flex-shrink-0 mt-0.5`}>
            <PageIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 m-0">
              {config.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {config.desc}
            </p>
          </div>
        </div>

        <button className="px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/15 cursor-pointer">
          Module Configuration
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.stats.map((stat, index) => (
          <div 
            key={index} 
            className="p-6 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-950 dark:border-slate-850/50 shadow-xs hover:border-slate-350 dark:hover:border-slate-700 transition-colors"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {stat.label}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-white block mt-2">
              {stat.val}
            </span>
            <span className={`text-xs font-semibold ${stat.trend} block mt-3`}>
              {stat.change || stat.stroke}
            </span>
          </div>
        ))}
      </div>

      {/* Design mock container */}
      <div className="p-8 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-950 dark:border-slate-850/50 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <RiCompass3Line className="text-sky-500 text-lg" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 m-0">
            Interactive Operational Viewport
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-3">
            <RiDashboard3Line size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-255">
            Module telemetry grids go here
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1 leading-relaxed">
            The active client route is <code className="text-sky-600 dark:text-sky-400 bg-sky-500/5 px-1.5 py-0.5 rounded font-mono font-bold text-xs">{path}</code>. Data nodes are synced and ready for deployment.
          </p>
        </div>
      </div>

    </div>
  );
}
