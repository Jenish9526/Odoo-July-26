import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Clock, CheckCircle2, Calendar, RefreshCw,
    AlertTriangle, Phone, Gauge, Navigation, TrendingUp,
    Shield, Star, ChevronRight
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip
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
};

// Demo performance trend (past 7 weeks)
const PERF_DATA = [
    { week: 'W1', Score: 84 }, { week: 'W2', Score: 86 }, { week: 'W3', Score: 83 },
    { week: 'W4', Score: 89 }, { week: 'W5', Score: 91 }, { week: 'W6', Score: 88 },
    { week: 'W7', Score: 92 },
];

function StatCard({ icon: Icon, label, value, accent }) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl border ${accent}`}>
            <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} strokeWidth={1.8} />
            </div>
            <div>
                <p className="text-lg font-black leading-none">{value}</p>
                <p className="text-[11px] font-semibold opacity-70 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

function ProgressBar({ value, color }) {
    return (
        <div className="w-full bg-slate-100 dark:bg-white/8 rounded-full h-2 overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

function DriverContent() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/trips?limit=100`, { headers: auth() });
            if (res.status === 401) { localStorage.clear(); window.location.href = '/login'; return; }
            const json = await res.json();
            if (json.success) setTrips(json.data);
            else setError('Failed to load trips');
        } catch { setError('Cannot connect to server'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const active = trips.filter(t => ['In Progress', 'Dispatched'].includes(t.status));
    const upcoming = trips.filter(t => ['Scheduled', 'Draft'].includes(t.status));
    const completed = trips.filter(t => t.status === 'Completed');

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="space-y-8">

            {/* Hero welcome */}
            <div className="bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-400/20 dark:border-emerald-500/20 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">{greeting} 👋</p>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{user.name || 'Driver'}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-5">
                            <div className="flex items-center gap-2 bg-white/70 dark:bg-white/8 border border-slate-200 dark:border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-white">
                                <CheckCircle2 size={13} className="text-emerald-500" />
                                {completed.length} Completed
                            </div>
                            <div className="flex items-center gap-2 bg-white/70 dark:bg-white/8 border border-slate-200 dark:border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-white">
                                <Calendar size={13} className="text-blue-500" />
                                {upcoming.length} Upcoming
                            </div>
                            <div className="flex items-center gap-2 bg-white/70 dark:bg-white/8 border border-slate-200 dark:border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-white">
                                <Navigation size={13} className="text-orange-500" />
                                {active.length} Active
                            </div>
                        </div>
                    </div>

                    {/* Safety score ring */}
                    <div className="flex flex-col items-center sm:items-end gap-2">
                        <div className="relative w-24 h-24">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="10" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10"
                                    strokeDasharray="251.3" strokeDashoffset={251.3 * (1 - 0.92)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                                <p className="text-xl font-black text-slate-900 dark:text-white">92</p>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase">Safety</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">Excellent rating</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
                    <AlertTriangle size={16} /> {error}
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={Navigation} label="Active Trips" value={active.length} accent="bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400" />
                <StatCard icon={CheckCircle2} label="Completed" value={completed.length} accent="bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" />
                <StatCard icon={Calendar} label="Upcoming" value={upcoming.length} accent="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400" />
                <StatCard icon={Gauge} label="Total Jobs" value={trips.length} accent="bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-500/10 dark:border-slate-500/20 dark:text-slate-400" />
            </div>

            {/* Active trips */}
            {(active.length > 0 || loading) && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Active Assignments</p>
                    </div>
                    <div className="space-y-4">
                        {loading && <div className="h-40 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl animate-pulse" />}
                        {active.map(t => (
                            <div key={t._id} className="bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-6 shadow-sm dark:shadow-none">
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{t.tripId}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{t.type} · {t.region} Region</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${STATUS_BADGE[t.status]}`}>{t.status}</span>
                                </div>

                                {/* Vehicle info */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <div className="bg-slate-50 dark:bg-white/3 rounded-xl p-3">
                                        <p className="text-[10px] text-slate-400 mb-1 font-semibold uppercase">Vehicle</p>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                                            {t.vehicle?.vehicleName || t.vehicle?.registrationNumber || '—'}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/3 rounded-xl p-3">
                                        <p className="text-[10px] text-slate-400 mb-1 font-semibold uppercase">Departure</p>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                                            {t.departure ? new Date(t.departure).toLocaleDateString() : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Trip Progress</span>
                                        <span className="font-bold text-orange-600 dark:text-orange-400">{t.progress ?? 50}%</span>
                                    </div>
                                    <ProgressBar value={t.progress ?? 50} color="bg-gradient-to-r from-orange-400 to-amber-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Performance chart + upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance trend */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Safety Score Trend</p>
                    <p className="text-xs text-slate-400 mb-4">Last 7 weeks · Personal performance</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={PERF_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
                            <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[75, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                            <Area type="monotone" dataKey="Score" stroke="#10b981" strokeWidth={2.5} fill="url(#gScore)" dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Upcoming trips */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upcoming Assignments</p>
                    <p className="text-xs text-slate-400 mb-4">Scheduled for dispatch</p>
                    {loading && <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />)}</div>}
                    {!loading && upcoming.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <Calendar size={32} className="mb-2 opacity-30" />
                            <p className="text-xs">No upcoming assignments</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        {upcoming.map(t => (
                            <div key={t._id} className="flex items-center justify-between px-3 py-3 rounded-xl bg-slate-50 dark:bg-white/3 hover:bg-slate-100 dark:hover:bg-white/6 transition-all">
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t.tripId}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{t.type} · {t.region} · {t.departure ? new Date(t.departure).toLocaleDateString() : '—'}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[t.status]}`}>{t.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Completed history */}
            {completed.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Completed Jobs</p>
                    <p className="text-xs text-slate-400 mb-4">Your trip history</p>
                    <div className="space-y-1.5">
                        {completed.map(t => (
                            <div key={t._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/3 transition-all">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{t.tripId}</p>
                                        <p className="text-[11px] text-slate-400">{t.type} · {t.region} · {t.departure ? new Date(t.departure).toLocaleDateString() : ''}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Done</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Emergency banner */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone size={19} className="text-red-500 dark:text-red-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-red-700 dark:text-red-300">Emergency Dispatch Line</p>
                    <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">Available 24 / 7 · +1 (555) 000-TOPS</p>
                </div>
                <div className="ml-auto">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                </div>
            </div>

        </div>
    );
}

export default function DriverDashboard() {
    return (
        <ProtectedRoute allowedRoles={['Driver', 'Administrator']}>
            <RoleDashboardShell roleName="Driver">
                <DriverContent />
            </RoleDashboardShell>
        </ProtectedRoute>
    );
}
