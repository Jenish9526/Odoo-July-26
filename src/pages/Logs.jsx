import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CommandLineIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

const defaultLogs = [
  { time: '16:40:02', level: 'INFO', service: 'AUTH-NODE', message: 'User john@dashboard.com successfully signed in. Token generated.' },
  { time: '16:40:15', level: 'WARN', service: 'DB-REPLICA', message: 'High CPU query lock detected in sub-cluster ap-south-1. Delaying write commit.' },
  { time: '16:40:34', level: 'ERROR', service: 'BILLING-API', message: 'Stripe webhook request failed. Signature validation mismatch, returned 401 Unauthorized.' },
  { time: '16:41:02', level: 'INFO', service: 'GATEWAY', message: 'API Route GET /api/v1/telemetry completed in 142ms. Client IP: 127.0.0.1.' },
  { time: '16:41:22', level: 'EMERGENCY', service: 'DOCKER-NODE', message: 'Cluster worker crash. Container instance node-us-east-1 terminated abruptly. Auto-respawning...' },
  { time: '16:41:35', level: 'INFO', service: 'GATEWAY', message: 'Route POST /api/v1/user/update completed in 98ms.' },
];

const Logs = () => {
  const [logs, setLogs] = useState(defaultLogs);
  const [filter, setFilter] = useState('ALL');
  const [isLive, setIsLive] = useState(true);
  const terminalEndRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isLive) return;

    // Simulate logs stream insertion
    const timer = setInterval(() => {
      const services = ['GATEWAY', 'AUTH-NODE', 'DB-REPLICA', 'WEBSOCKETS', 'DOCKER-NODE'];
      const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'];
      const messages = {
        INFO: [
          'Handshake successful. WebSocket connection initialized on port 8080.',
          'Database vacuum process finished cleanly on replica node 3.',
          'Client credentials successfully verified via secure IAM cluster.',
          'Telemetry metrics compiled and pushed to secondary cluster.',
        ],
        WARN: [
          'Disk usage on master database cluster crossed 82%. Consider storage expansion.',
          'Gateway throughput limits reached for client CLI developer group.',
          'Docker daemon CPU usage spiked at 90.2% on node ap-01.',
        ],
        ERROR: [
          'Failed to resolve hostname cluster-service-discovery.dns.local.',
          'Connection reset by peer at WebSocket proxy handler v1.2.',
          'API authentication token expired. Verification status rejected.',
        ],
      };

      const selectedLevel = levels[Math.floor(Math.random() * levels.length)];
      const selectedService = services[Math.floor(Math.random() * services.length)];
      const messageList = messages[selectedLevel];
      const selectedMessage = messageList[Math.floor(Math.random() * messageList.length)];
      
      const newLog = {
        time: new Date().toTimeString().split(' ')[0],
        level: selectedLevel,
        service: selectedService,
        message: selectedMessage,
      };

      setLogs((prev) => [...prev, newLog].slice(-100)); // Cap logs history length at 100 for safety
    }, 2800);

    return () => clearInterval(timer);
  }, [isLive]);

  // Keep terminal scrolled to bottom when live feed is active
  useEffect(() => {
    if (isLive) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLive]);

  const handleClear = () => {
    setLogs([]);
    showToast('Telemetry console logs cleared.', 'info');
  };

  const getLogLevelStyle = (level) => {
    switch (level) {
      case 'EMERGENCY':
        return 'text-brand-rose bg-brand-rose/15 border-brand-rose/30 font-extrabold animate-pulse';
      case 'ERROR':
        return 'text-brand-rose bg-brand-rose/10 border-brand-rose/20 font-bold';
      case 'WARN':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20 font-bold';
      case 'INFO':
      default:
        return 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20';
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    if (filter === 'ERRORS') return log.level === 'ERROR' || log.level === 'EMERGENCY';
    return log.level === filter;
  });

  return (
    <div className="space-y-6 font-sans w-full flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 dark:border-dark-border/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            Live Cluster Telemetry Logs
          </h2>
          <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
            Simulated live diagnostics terminal stream.
          </p>
        </div>

        {/* Live Stream control */}
        <button
          onClick={() => setIsLive(!isLive)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all select-none ${
            isLive
              ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20 shadow-sm'
              : 'bg-gray-50 dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-brand-emerald animate-pulse' : 'bg-gray-400'}`} />
          {isLive ? 'LIVE FEED CONNECTED' : 'PAUSED'}
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 select-none">
        {/* Filters List */}
        <div className="flex gap-1 bg-gray-50 dark:bg-dark-bg p-0.5 rounded-lg border border-gray-150 dark:border-dark-border text-[9px] font-bold">
          {['ALL', 'INFO', 'WARN', 'ERRORS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2 py-1 rounded-md capitalize transition-all ${
                filter === cat
                  ? 'bg-white dark:bg-dark-card text-brand-violet dark:text-white shadow-sm'
                  : 'text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terminal buttons */}
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => setIsLive(!isLive)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-card transition-all"
          >
            {isLive ? (
              <>
                <PauseIcon className="h-4 w-4" /> Pause Stream
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" /> Resume Stream
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-rose/25 text-brand-rose bg-brand-rose/5 hover:bg-brand-rose/10 transition-all"
          >
            <TrashIcon className="h-4 w-4" /> Clear Logs
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 bg-gray-950 text-gray-300 rounded-xl border border-gray-900 shadow-2xl p-4 font-mono text-[11px] leading-relaxed flex flex-col relative min-h-[400px]">
        {/* Terminal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-900/60 text-gray-500 mb-3 select-none">
          <div className="flex items-center gap-2">
            <CommandLineIcon className="h-4.5 w-4.5 text-brand-violet" />
            <span>antigravity-core@analytics-terminal:~</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-rose/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald/30"></span>
          </div>
        </div>

        {/* Logs Feed */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin max-h-[50vh]">
          {filteredLogs.map((log, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
              <span className="text-gray-600 shrink-0 font-bold">[{log.time}]</span>
              <span className={`px-1.5 py-0.5 rounded border text-[9px] uppercase font-bold tracking-wider leading-none shrink-0 ${getLogLevelStyle(log.level)}`}>
                {log.level}
              </span>
              <span className="text-brand-violet dark:text-brand-cyan shrink-0 font-bold">[{log.service}]</span>
              <span className="text-gray-300 break-all">{log.message}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center py-20 text-gray-600 font-bold select-none">
              Console: No active log traces loaded.
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Logs;
