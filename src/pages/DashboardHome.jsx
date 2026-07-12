import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  UsersIcon,
  CurrencyDollarIcon,
  CommandLineIcon,
  CpuChipIcon,
  CircleStackIcon,
  ServerIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';

// Import Custom components
import StatCard from '../components/dashboard/StatCard';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import CryptoWidget from '../components/dashboard/CryptoWidget';
import StockWidget from '../components/dashboard/StockWidget';
import AINewsWidget from '../components/dashboard/AINewsWidget';
import AirQualityWidget from '../components/dashboard/AirQualityWidget';
import CurrencyWidget from '../components/dashboard/CurrencyWidget';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import QuickActions from '../components/dashboard/QuickActions';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

const DashboardHome = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const activeWidgets = ['weather', 'crypto', 'stock', 'news', 'aqi', 'currency'];

  // Handle local simulation of refresh console dashboard
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  // Handle local simulation of adding widgets
  const handleAddWidget = () => {
    alert('Mock widget selector opened! Toggle custom integration settings below.');
  };

  // Handle CSV export simulation
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Metric,Value,Status\nTotal Users,84204,Active\nTotal Revenue,$1.24M,TargetMet";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `telemetry_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock static data array for 10 cards
  const metricsData = [
    {
      title: 'Total Users',
      value: '84,204',
      change: '+12.4%',
      trend: 'up',
      icon: UsersIcon,
      sparklineData: [20, 24, 30, 42, 55, 68, 72, 80, 84],
      lastUpdated: '12m ago',
    },
    {
      title: 'Active Users',
      value: '12,408',
      change: '+8.2%',
      trend: 'up',
      icon: UsersIcon,
      sparklineData: [5, 6, 8, 7, 9, 10, 11, 12, 12.4],
      lastUpdated: '12m ago',
    },
    {
      title: 'Total Revenue',
      value: '$1,248,500',
      change: '+18.5%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      sparklineData: [80, 88, 92, 101, 108, 112, 115, 120, 124.8],
      lastUpdated: '5m ago',
    },
    {
      title: 'Monthly Revenue',
      value: '$204,500',
      change: '-2.4%',
      trend: 'down',
      icon: CurrencyDollarIcon,
      sparklineData: [22, 21.5, 21, 21.8, 20.8, 20.6, 20.5, 20.4, 20.45],
      lastUpdated: '1h ago',
    },
    {
      title: 'API Requests',
      value: '14.2M',
      change: '+34.2%',
      trend: 'up',
      icon: CommandLineIcon,
      sparklineData: [4, 6, 8, 9, 10, 11.2, 12.8, 13.5, 14.2],
      lastUpdated: '3m ago',
    },
    {
      title: 'Server Status',
      value: '99.98%',
      change: '+0.02%',
      trend: 'up',
      icon: ServerIcon,
      sparklineData: [99.92, 99.95, 99.97, 99.98, 99.98, 99.99, 99.98, 99.98, 99.98],
      lastUpdated: 'Just now',
    },
    {
      title: 'CPU Usage',
      value: '42.5%',
      change: '-5.8%',
      trend: 'down',
      icon: CpuChipIcon,
      sparklineData: [68, 65, 58, 54, 48, 44, 43, 42.8, 42.5],
      lastUpdated: 'Just now',
    },
    {
      title: 'Memory Usage',
      value: '72.4%',
      change: '+1.2%',
      trend: 'up',
      icon: CircleStackIcon,
      sparklineData: [68, 69.2, 70.1, 71.4, 72.0, 72.2, 72.4, 72.3, 72.4],
      lastUpdated: '1m ago',
    },
    {
      title: 'Network Traffic',
      value: '4.2 Gbps',
      change: '+15.6%',
      trend: 'up',
      icon: SignalIcon,
      sparklineData: [2.8, 3.0, 3.4, 3.8, 4.0, 4.1, 4.2, 4.25, 4.2],
      lastUpdated: '1m ago',
    },
    {
      title: 'Active Sessions',
      value: '3,480',
      change: '-8.1%',
      trend: 'down',
      icon: SignalIcon,
      sparklineData: [4.2, 4.0, 3.8, 3.7, 3.65, 3.6, 3.55, 3.5, 3.48],
      lastUpdated: 'Just now',
    },
  ];

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isRefreshing ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <DashboardSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header Greeting */}
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 dark:border-dark-border/40 pb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                  Welcome back, {user?.name || 'Developer'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
                  The telemetry analytics clusters are fully synchronized.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-100 dark:border-dark-border/80 rounded-lg bg-white dark:bg-dark-card text-xs font-bold text-gray-500 dark:text-dark-muted shadow-sm select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                <span>Live telemetry active</span>
              </div>
            </div>

            {/* 10 Statistics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {metricsData.map((metric) => (
                <StatCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  trend={metric.trend}
                  icon={metric.icon}
                  sparklineData={metric.sparklineData}
                  lastUpdated={metric.lastUpdated}
                />
              ))}
            </div>

            {/* Widgets & Timeline Core Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Modules/Widgets Grid (Col-Span-2, holds 6 specialized widgets) */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeWidgets.includes('weather') && <WeatherWidget />}
                {activeWidgets.includes('crypto') && <CryptoWidget />}
                {activeWidgets.includes('stock') && <StockWidget />}
                {activeWidgets.includes('news') && <AINewsWidget />}
                {activeWidgets.includes('aqi') && <AirQualityWidget />}
                {activeWidgets.includes('currency') && <CurrencyWidget />}
              </div>

              {/* Right Sidebar - Timeline Actions & Operations */}
              <div className="space-y-6">
                <QuickActions
                  onRefresh={handleRefresh}
                  onAddWidget={handleAddWidget}
                  onExportCSV={handleExportCSV}
                  onOpenSettings={() => alert('Opening console settings modal...')}
                />
                
                <ActivityTimeline />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHome;
