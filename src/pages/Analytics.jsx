import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  ComposedChart,
} from 'recharts';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import FilterPanel from '../components/dashboard/FilterPanel';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

// Mock Data
const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 24000 },
  { month: 'Feb', revenue: 52000, expenses: 28000 },
  { month: 'Mar', revenue: 61000, expenses: 31000 },
  { month: 'Apr', revenue: 58000, expenses: 29000 },
  { month: 'May', revenue: 71000, expenses: 35000 },
  { month: 'Jun', revenue: 84000, expenses: 40000 },
];

const usersData = [
  { name: 'Wk 1', users: 1200 },
  { name: 'Wk 2', users: 1900 },
  { name: 'Wk 3', users: 1500 },
  { name: 'Wk 4', users: 2400 },
  { name: 'Wk 5', users: 2900 },
  { name: 'Wk 6', users: 3400 },
];

const cryptoTrends = [
  { day: 'Mon', BTC: 91000, ETH: 3200, SOL: 130 },
  { day: 'Tue', BTC: 92400, ETH: 3310, SOL: 135 },
  { day: 'Wed', BTC: 91800, ETH: 3250, SOL: 128 },
  { day: 'Thu', BTC: 93100, ETH: 3400, SOL: 141 },
  { day: 'Fri', BTC: 94204, ETH: 3485, SOL: 142 },
];

const apiUsage = [
  { hr: '00:00', gateway: 4200, auth: 2100, billing: 800 },
  { hr: '04:00', gateway: 3100, auth: 1500, billing: 500 },
  { hr: '08:00', gateway: 7800, auth: 4900, billing: 1900 },
  { hr: '12:00', gateway: 9400, auth: 6200, billing: 2500 },
  { hr: '16:00', gateway: 8900, auth: 5800, billing: 2100 },
  { hr: '20:00', gateway: 6500, auth: 3800, billing: 1200 },
];

const pieData = [
  { name: 'Direct Gateway', value: 45 },
  { name: 'Cloud Proxy', value: 30 },
  { name: 'Partner REST API', value: 15 },
  { name: 'WebSockets CLI', value: 10 },
];

const PIE_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const radialData = [
  { name: 'AP-South-1', value: 98.4, fill: '#10b981' },
  { name: 'EU-West-1', value: 99.8, fill: '#8b5cf6' },
  { name: 'US-East-1', value: 95.2, fill: '#f59e0b' },
];

const comboData = [
  { day: 'Mon', logs: 4000, errors: 240, load: 38 },
  { day: 'Tue', logs: 4500, errors: 190, load: 42 },
  { day: 'Wed', logs: 5100, errors: 320, load: 50 },
  { day: 'Thu', logs: 4800, errors: 280, load: 45 },
  { day: 'Fri', logs: 6000, errors: 150, load: 58 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-dark-card/95 border border-gray-200 dark:border-dark-border p-3.5 rounded-xl shadow-lg font-sans text-xs">
        <p className="font-bold text-gray-900 dark:text-white mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((p, idx) => (
            <div key={idx} className="flex items-center gap-4 justify-between">
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-dark-muted font-medium">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </span>
              <span className="font-bold text-gray-900 dark:text-white font-mono">
                {typeof p.value === 'number' && p.value > 1000 ? p.value.toLocaleString() : p.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Trigger a loading skeleton simulation when filters change
  const handleFilterChange = (filters) => {
    setIsLoading(true);
    // Simulate API query update
    setTimeout(() => {
      setIsLoading(false);
      // Empty state simulator (if category is WS CLI for demo purposes)
      setIsEmpty(filters.category === 'WebSockets');
    }, 700);
  };

  return (
    <div className="space-y-6 font-sans w-full">
      {/* Header Greeting */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 dark:border-dark-border/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            System Analytics & Telemetry Charts
          </h2>
          <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
            Synchronized with node telemetry clusters.
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        categories={['API Gateway', 'Billing Services', 'Auth Node', 'WebSockets']}
        statuses={['Operational', 'Idle', 'Maintenance']}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardSkeleton />
          </motion.div>
        ) : isEmpty ? (
          /* Reusable Empty State */
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] border-glow"
          >
            <CircleStackIcon className="h-12 w-12 text-gray-300 dark:text-dark-border animate-pulse mb-3" />
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">No database logs matching category</h3>
            <p className="text-xs text-gray-400 dark:text-dark-muted max-w-sm mt-1 leading-relaxed">
              No historical data traces were detected for the requested WebSockets cluster in this date range. Try switching filters back to default.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="charts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Top Grid - Line & Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue line chart */}
              <div className="glass-card rounded-xl p-5 border-glow shadow-sm dark:shadow-glass flex flex-col justify-between min-h-[300px]">
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                    Revenue & Expenses (Stripe Cluster)
                  </span>
                </div>
                <div className="h-56 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ left: -15, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                      <XAxis dataKey="month" stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <YAxis stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Line type="monotone" name="Revenue ($)" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      <Line type="monotone" name="Expenses ($)" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Users Bar Chart */}
              <div className="glass-card rounded-xl p-5 border-glow shadow-sm dark:shadow-glass flex flex-col justify-between min-h-[300px]">
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                    Monthly User Registrations (Auth Cluster)
                  </span>
                </div>
                <div className="h-56 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usersData} margin={{ left: -15, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                      <XAxis dataKey="name" stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <YAxis stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Bar name="Registered Users" dataKey="users" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Middle Grid - Crypto Area & API usage area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cryptocurrency Area Chart */}
              <div className="glass-card rounded-xl p-5 border-glow shadow-sm dark:shadow-glass flex flex-col justify-between min-h-[300px]">
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                    Cryptocurrency Price Indexes
                  </span>
                </div>
                <div className="h-56 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cryptoTrends} margin={{ left: -10, right: 10 }}>
                      <defs>
                        <linearGradient id="grad-btc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                      <XAxis dataKey="day" stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <YAxis stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Area type="monotone" name="BTC Price ($)" dataKey="BTC" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#grad-btc)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* API Usage Area Chart */}
              <div className="glass-card rounded-xl p-5 border-glow shadow-sm dark:shadow-glass flex flex-col justify-between min-h-[300px]">
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                    API usage rate (Gateway Operations)
                  </span>
                </div>
                <div className="h-56 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={apiUsage} margin={{ left: -10, right: 10 }}>
                      <defs>
                        <linearGradient id="grad-gate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                      <XAxis dataKey="hr" stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <YAxis stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Area type="monotone" name="Gateway Hits" dataKey="gateway" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#grad-gate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Grid - Pie, Radial & Weekly Composed Combo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Traffic Pie Chart */}
              <div className="glass-card rounded-xl p-5 border-glow shadow-sm dark:shadow-glass flex flex-col justify-between min-h-[320px]">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                    Proxy Traffic Sources
                  </span>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center text-[10px] font-semibold text-gray-500 dark:text-dark-muted">
                  {pieData.map((d, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      {d.name} ({d.value}%)
                    </span>
                  ))}
                </div>
              </div>

              {/* Server Health Radial Chart */}
              <div className="glass-card rounded-xl p-5 border-glow shadow-sm dark:shadow-glass flex flex-col justify-between min-h-[320px]">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                    Node Cluster Uptime (%)
                  </span>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" barSize={10} data={radialData}>
                      <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: '#fff', fontSize: 8 }}
                        background
                        clockWise
                        dataKey="value"
                      />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1 text-[10px] font-semibold">
                  {radialData.map((d, i) => (
                    <div key={i} className="flex justify-between items-center text-gray-500 dark:text-dark-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.fill }} />
                        {d.name}
                      </span>
                      <span className="font-bold font-mono text-gray-900 dark:text-white">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Activity Composed Chart */}
              <div className="glass-card rounded-xl p-5 border-glow shadow-sm dark:shadow-glass flex flex-col justify-between min-h-[320px]">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                    Weekly Activity Logs vs Cluster Load
                  </span>
                </div>
                <div className="h-56 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={comboData} margin={{ left: -20, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                      <XAxis dataKey="day" stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <YAxis yAxisId="left" stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="rgba(128,128,128,0.4)" strokeWidth={0.5} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar yAxisId="left" name="System Logs" dataKey="logs" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={12} />
                      <Line yAxisId="right" name="Load limit (%)" dataKey="load" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analytics;
