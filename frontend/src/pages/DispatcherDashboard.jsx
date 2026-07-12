import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Route, Car, Users, RefreshCw, Plus, ChevronRight,
    AlertTriangle, CheckCircle2, Clock, Zap, MapPin, Filter
} from 'lucide-react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleDashboardShell from '../components/Layout/RoleDashboardShell';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const STATUS_BADGE = {
    Draft: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
    Scheduled: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    Dispatched: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
    'In Progress': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    Delayed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    Cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-700/10 dark:text-red-500 dark:border-red-700/25',
};

const STATUS_DOT = {
    'In Progress': 'bg-orange-400 animate-pulse',
    Delayed: 'bg-red-400 animate-pulse',
    Dispatched: 'bg-sky-400',
    Scheduled: 'bg-blue-400',
    Completed: 'bg-emerald-400',
    Draft: 'bg-slate-400',
};

const ALL_FILTERS = ['All', 'In Progress', 'Dispatched', 'Scheduled', 'Delayed', 'Completed'];

function StatPill({ label, value, accent }) {
    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center ${accent}`}>
            <p className="text-xl font-black">{value ?? '--'}</p>
            <p className="text-[11px] font-semibold opacity-70 mt-0.5">{label}</p>
        </div>
    );
}

function DispatcherContent() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [stats, setStats] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const [tStats, vRes, dRes, tAll] = await Promise.all([
                fetch(`${API}/api/trips/stats`, { headers: auth() }),
                fetch(`${API}/api/vehicles?status=Available&limit=30`, { headers: auth() }),
                fetch(`${API}/api/drivers?status=Available&limit=30`, { headers: auth() }),
                fetch(`${API}/api/trips?limit=100`, { headers: auth() }),
            ]);
            if (tStats.status === 401) { localStorage.clear(); window.location.href = '/login'; return; }
            const [sj, vj, dj, tj] = await Promise.all([tStats.json(), vRes.json(), dRes.json(), tAll.json()]);
            if (sj.success) setStats(sj.stats);
            if (vj.success) setVehicles(vj.data);
            if (dj.success) setDrivers(dj.data);
            if (tj.success) setTrips(tj.data);
        } catch { setError('Cannot connect to server'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = filter === 'All' ? trips : trips.filter(t => t.status === filter);

    // Bar chart: trips by region
    const regionChart = ['North', 'East', 'South', 'West'].map(r => ({
        region: r,
        Count: trips.filter(t => t.region === r).length,
    }));

    return (
        <div className="space-y-8">

            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-sky-500 dark:text-sky-400 uppercase tracking-wide">Dispatch Control Centre 📡</p>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Trip Operations</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={() => navigate('/trips')} className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-md shadow-sky-500/20">
                        <Plus size={13} /> New Trip
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
                    <AlertTriangle size={16} /> {error}
                </div>
            )}

            {/* Stats pills */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <StatPill label="Total" value={stats?.total} accent="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/8 text-slate-900 dark:text-white" />
                <StatPill label="In Progress" value={stats?.onTrip} accent="bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400" />
                <StatPill label="Dispatched" value={stats?.dispatched} accent="bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400" />
                <StatPill label="Completed" value={stats?.completed} accent="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400" />
                <StatPill label="Delayed" value={stats?.delayed} accent="bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400" />
                <StatPill label="Draft" value={stats?.draft} accent="bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20 text-slate-600 dark:text-slate-400" />
            </div>

            {/* Resources + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Available vehicles */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Available Vehicles</p>
                            <p className="text-xs text-slate-400 mt-0.5">Ready to dispatch now</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            {vehicles.length} Free
                        </span>
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                        {loading && [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />)}
                        {!loading && vehicles.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No vehicles available</p>}
                        {vehicles.map(v => (
                            <div key={v._id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/3 hover:bg-slate-100 dark:hover:bg-white/6 transition-all">
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{v.vehicleName}</p>
                                    <p className="text-[11px] text-slate-400">{v.registrationNumber} · {v.type}</p>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available drivers */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Available Drivers</p>
                            <p className="text-xs text-slate-400 mt-0.5">On standby for assignment</p>
                        </div>
                        <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-2.5 py-0.5 rounded-full">
                            {drivers.length} Ready
                        </span>
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {loading && [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />)}
                        {!loading && drivers.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No drivers available</p>}
                        {drivers.map(d => (
                            <div key={d._id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/3 hover:bg-slate-100 dark:hover:bg-white/6 transition-all">
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{d.driverName}</p>
                                    <p className="text-[11px] text-slate-400">{d.licenseCategory} · Score {d.safetyScore}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-12 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${d.safetyScore}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trips by region bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Trips by Region</p>
                    <p className="text-xs text-slate-400 mb-4">Geographic distribution</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={regionChart} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
                            <XAxis dataKey="region" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                            <Bar dataKey="Count" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={36} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Full trips table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">All Trips</p>
                        <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {trips.length} shown</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {ALL_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${filter === f
                                        ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/20'
                                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                                    }`}
                            >{f}</button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-100 dark:border-white/8">
                                <th className="pb-3 text-left font-semibold">Trip ID</th>
                                <th className="pb-3 text-left font-semibold">Vehicle</th>
                                <th className="pb-3 text-left font-semibold">Driver</th>
                                <th className="pb-3 text-left font-semibold">Type</th>
                                <th className="pb-3 text-left font-semibold">Region</th>
                                <th className="pb-3 text-left font-semibold">Departure</th>
                                <th className="pb-3 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/4">
                            {loading && (
                                <tr><td colSpan={7} className="py-10 text-center text-slate-400">
                                    <RefreshCw size={16} className="animate-spin inline mr-2" />Loading...
                                </td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={7} className="py-10 text-center text-slate-400">No trips found</td></tr>
                            )}
                            {filtered.map(t => (
                                <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-all">
                                    <td className="py-3 font-bold text-sky-600 dark:text-sky-400">{t.tripId}</td>
                                    <td className="py-3 text-slate-700 dark:text-slate-300">{t.vehicle?.registrationNumber || t.vehicleId || '—'}</td>
                                    <td className="py-3 text-slate-700 dark:text-slate-300">{t.driver || t.driverName}</td>
                                    <td className="py-3 text-slate-500 dark:text-slate-400">{t.type}</td>
                                    <td className="py-3 text-slate-500 dark:text-slate-400">{t.region}</td>
                                    <td className="py-3 text-slate-400">{t.departure ? new Date(t.departure).toLocaleDateString() : '—'}</td>
                                    <td className="py-3">
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[t.status] || STATUS_BADGE.Draft}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status] || STATUS_DOT.Draft}`} />
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default function DispatcherDashboard() {
    return (
        <ProtectedRoute allowedRoles={['Dispatcher', 'Administrator', 'Fleet Manager']}>
            <RoleDashboardShell roleName="Dispatcher">
                <DispatcherContent />
            </RoleDashboardShell>
        </ProtectedRoute>
    );
}
