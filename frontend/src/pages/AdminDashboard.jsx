import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Car, Users, Route, Wrench, TrendingUp, TrendingDown,
    RefreshCw, ChevronRight, Fuel, DollarSign, Activity,
    MapPin, Clock, AlertTriangle, CheckCircle2, Circle,
    BarChart3, PieChart as PieIcon, Zap
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleDashboardShell from '../components/Layout/RoleDashboardShell';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const WEEKLY = [
    { day: 'Mon', Trips: 14, Revenue: 9100, Fuel: 2300 },
    { day: 'Tue', Trips: 22, Revenue: 14300, Fuel: 3800 },
    { day: 'Wed', Trips: 18, Revenue: 11700, Fuel: 2900 },
    { day: 'Thu', Trips: 27, Revenue: 17550, Fuel: 4200 },
    { day: 'Fri', Trips: 32, Revenue: 20800, Fuel: 5100 },
    { day: 'Sat', Trips: 19, Revenue: 12350, Fuel: 3100 },
    { day: 'Sun', Trips: 11, Revenue: 7150, Fuel: 1800 },
];

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#94a3b8'];

const STATUS_BADGE = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    'In Progress': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    Scheduled: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    Delayed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    Draft: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
};

function KpiCard({ icon: Icon, label, value, sub, trend, color }) {
    const positive = trend >= 0;
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md dark:hover:border-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={18} strokeWidth={1.8} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                        {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
                {sub && <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">{sub}</p>}
            </div>
        </div>
    );
}

function SectionHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

function ChartCard({ children, className = '' }) {
    return (
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl p-6 ${className}`}>
            {children}
        </div>
    );
}

function AdminDashboardContent() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/dashboard`, { headers: auth() });
            if (res.status === 401) { localStorage.clear(); window.location.href = '/login'; return; }
            const json = await res.json();
            if (json.success) setData(json.dashboard);
            else setError('Failed to load dashboard data');
        } catch { setError('Cannot connect to server'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const pieData = data ? [
        { name: 'Available', value: data.vehicleComposition.available.count },
        { name: 'On Trip', value: data.vehicleComposition.onTrip.count },
        { name: 'In Shop', value: data.vehicleComposition.inShop.count },
        { name: 'Retired', value: data.vehicleComposition.retired.count },
    ] : [];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="space-y-8">

            {/* ── Welcome bar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">{greeting} 👋</p>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                        {user.name?.split(' ')[0] || 'Admin'}'s Command Centre
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={load}
                    className="self-start sm:self-auto flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* ── Error state ── */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
                    <AlertTriangle size={16} />
                    {error}
                </div>
            )}

            {/* ── KPI Grid ── */}
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-slate-100 dark:bg-slate-900 rounded-2xl h-32 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard icon={Car} label="Total Vehicles" value={data?.kpi.activeVehicles ?? 0} sub="Registered fleet" color="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400" trend={4} />
                    <KpiCard icon={CheckCircle2} label="Available" value={data?.kpi.availableVehicles ?? 0} sub="Ready to dispatch" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" trend={2} />
                    <KpiCard icon={Route} label="Active Trips" value={data?.kpi.activeTrips ?? 0} sub="Currently on road" color="bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400" trend={12} />
                    <KpiCard icon={Wrench} label="In Maintenance" value={data?.kpi.inShopVehicles ?? 0} sub="Under service" color="bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400" trend={-1} />
                    <KpiCard icon={Users} label="Drivers On Duty" value={data?.kpi.driversOnDuty ?? 0} sub="Active operators" color="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400" trend={6} />
                    <KpiCard icon={Clock} label="Pending Trips" value={data?.kpi.pendingTrips ?? 0} sub="Awaiting dispatch" color="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400" />
                    <KpiCard icon={Activity} label="Fleet Utilization" value={`${data?.kpi.utilization ?? 0}%`} sub="Active vs total" color="bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400" trend={3} />
                    <KpiCard icon={Fuel} label="Fuel Cost" value={`$${(data?.charts.fuelStats?.totalCost || 0).toFixed(0)}`} sub={`${(data?.charts.fuelStats?.totalLiters || 0).toFixed(0)} L consumed`} color="bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400" trend={-8} />
                </div>
            )}

            {/* ── Charts Row 1 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard className="lg:col-span-2">
                    <SectionHeader title="Weekly Activity" subtitle="Trips dispatched and revenue generated" />
                    <ResponsiveContainer width="100%" height={230}>
                        <AreaChart data={WEEKLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gTrips" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
                            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'var(--tw-prose-body, #1e293b)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                                wrapperStyle={{ outline: 'none' }}
                            />
                            <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }} />
                            <Area type="monotone" dataKey="Trips" stroke="#6366f1" strokeWidth={2} fill="url(#gTrips)" dot={false} activeDot={{ r: 4 }} />
                            <Area type="monotone" dataKey="Revenue" stroke="#22c55e" strokeWidth={2} fill="url(#gRev)" dot={false} activeDot={{ r: 4 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard>
                    <SectionHeader title="Fleet Status" subtitle="Current vehicle allocation" />
                    {!loading && (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" strokeWidth={0}>
                                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {pieData.map((d, i) => (
                                    <div key={d.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{d.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1 bg-slate-100 dark:bg-white/8 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${(d.value / (data?.kpi.activeVehicles || 1)) * 100}%`, background: PIE_COLORS[i] }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white w-4 text-right">{d.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </ChartCard>
            </div>

            {/* ── Charts Row 2 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard>
                    <SectionHeader title="Maintenance Costs" subtitle="Top 5 vehicles by cost" />
                    <ResponsiveContainer width="100%" height={190}>
                        <BarChart data={data?.charts.maintByVehicle || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                            <Bar dataKey="Cost" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Recent Trips */}
                <ChartCard>
                    <SectionHeader
                        title="Recent Trips"
                        subtitle="Latest dispatched assignments"
                        action={
                            <button onClick={() => navigate('/trips')} className="flex items-center gap-1 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:underline">
                                View all <ChevronRight size={12} />
                            </button>
                        }
                    />
                    <div className="space-y-1">
                        {loading && [...Array(5)].map((_, i) => <div key={i} className="h-11 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />)}
                        {!loading && (data?.recentTrips || []).slice(0, 5).map((t) => (
                            <div key={t._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/3 transition-all">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.tripId} · {t.source} → {t.destination}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{t.driverName} · {t.vehicleId}</p>
                                </div>
                                <span className={`ml-3 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_BADGE[t.status] || STATUS_BADGE.Draft}`}>
                                    {t.status}
                                </span>
                            </div>
                        ))}
                        {!loading && (!data?.recentTrips?.length) && (
                            <p className="text-center text-slate-400 text-xs py-6">No trips found</p>
                        )}
                    </div>
                </ChartCard>
            </div>

            {/* ── Quick navigation ── */}
            <div>
                <SectionHeader title="Quick Access" subtitle="Jump to management modules" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Fleet Management', path: '/vehicles', emoji: '🚗', from: 'from-sky-500/20', to: 'to-sky-600/10', border: 'border-sky-400/20' },
                        { label: 'Driver Management', path: '/drivers', emoji: '👨‍✈️', from: 'from-violet-500/20', to: 'to-violet-600/10', border: 'border-violet-400/20' },
                        { label: 'Trip Dispatcher', path: '/trips', emoji: '🗺️', from: 'from-orange-500/20', to: 'to-orange-600/10', border: 'border-orange-400/20' },
                        { label: 'Reports & Analytics', path: '/reports', emoji: '📊', from: 'from-emerald-500/20', to: 'to-emerald-600/10', border: 'border-emerald-400/20' },
                    ].map((n) => (
                        <button
                            key={n.path}
                            onClick={() => navigate(n.path)}
                            className={`flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br ${n.from} ${n.to} border ${n.border} hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer text-left`}
                        >
                            <span className="text-2xl">{n.emoji}</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white leading-snug">{n.label}</span>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default function AdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={['Administrator', 'Fleet Manager', 'Safety Officer', 'Financial Analyst']}>
            <RoleDashboardShell roleName="Administrator">
                <AdminDashboardContent />
            </RoleDashboardShell>
        </ProtectedRoute>
    );
}
