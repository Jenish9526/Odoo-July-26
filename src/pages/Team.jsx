import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  CurrencyDollarIcon,
  NewspaperIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

// Mock Data
const initialUsers = [
  { id: 1, name: 'Sujal Patel', email: 'ps48952324@gmail.com', role: 'Owner', status: 'Active', lastLogin: 'Just now' },
  { id: 2, name: 'John Doe', email: 'john@dashboard.com', role: 'Administrator', status: 'Active', lastLogin: '3 mins ago' },
  { id: 3, name: 'Sarah Connor', email: 'sarah@skynet.org', role: 'Developer', status: 'Active', lastLogin: '1 hour ago' },
  { id: 4, name: 'Kyle Reese', email: 'kyle@resistance.net', role: 'Operator', status: 'Suspended', lastLogin: '2 days ago' },
  { id: 5, name: 'Miles Dyson', email: 'miles@cyberdyne.com', role: 'Developer', status: 'Invited', lastLogin: 'Never' },
  { id: 6, name: 'Marcus Wright', email: 'marcus@project-angel.com', role: 'Operator', status: 'Active', lastLogin: '12h ago' },
  { id: 7, name: 'Kate Brewster', email: 'kate@t-base.org', role: 'Developer', status: 'Active', lastLogin: '4 days ago' },
];

const initialCryptos = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 94204.50, marketCap: 1850000000000, change: 2.41, volume: 45000000000 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3485.20, marketCap: 418000000000, change: 1.85, volume: 19000000000 },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 142.75, marketCap: 65000000000, change: -4.12, volume: 4200000000 },
  { id: 'bnb', name: 'BNB Coin', symbol: 'BNB', price: 584.10, marketCap: 89000000000, change: 0.95, volume: 1500000000 },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.485, marketCap: 17000000000, change: -1.25, volume: 580000000 },
  { id: 'xrp', name: 'Ripple', symbol: 'XRP', price: 0.59, marketCap: 33000000000, change: 0.12, volume: 920000000 },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', price: 6.24, marketCap: 8900000000, change: -2.34, volume: 220000000 },
];

const initialNews = [
  { id: 1, title: 'Claude 3.7 Sonnet Released with Hybrid Thinking Mode', category: 'LLM Development', published: '2h ago', source: 'Anthropic News' },
  { id: 2, title: 'Llama 4 Ultra Achieves SOTA Benchmarks on Math and Coding', category: 'Open Source', published: '5h ago', source: 'Meta AI Blog' },
  { id: 3, title: 'Nvidia Rubin Architecture Details Leaked Ahead of Schedule', category: 'GPU Hardware', published: '12h ago', source: 'Hardware Luxx' },
  { id: 4, title: 'Google Announces TPU v6 Clusters with Liquid Cooling Units', category: 'Cloud Infrastructure', published: '1d ago', source: 'Google Cloud' },
  { id: 5, title: 'OpenAI DevCon 2026 Keynote schedule published online', category: 'AI Ecosystem', published: '2d ago', source: 'OpenAI Developer' },
  { id: 6, title: 'Rust-based Web Framework Axum releases stable v1.0 version', category: 'Web Development', published: '3d ago', source: 'Rust Feed' },
];

const Team = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const { showToast } = useToast();

  // Reset page and search on tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch('');
    setFilterRole('all');
    setSortField('');
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAction = (user, action) => {
    showToast(`Operator action [${action}] triggered for user ${user.name}`, 'info');
  };

  // Sort and filter utilities
  const processedData = useMemo(() => {
    setPage(1); // auto reset page when query/filters update
    
    if (activeTab === 'users') {
      let result = [...initialUsers];
      if (search) {
        result = result.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filterRole !== 'all') {
        result = result.filter((u) => u.role === filterRole || u.status === filterRole);
      }
      if (sortField) {
        result.sort((a, b) => {
          const valA = a[sortField].toLowerCase();
          const valB = b[sortField].toLowerCase();
          if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    }

    if (activeTab === 'crypto') {
      let result = [...initialCryptos];
      if (search) {
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.symbol.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (sortField) {
        result.sort((a, b) => {
          const valA = a[sortField];
          const valB = b[sortField];
          if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    }

    if (activeTab === 'news') {
      let result = [...initialNews];
      if (search) {
        result = result.filter(
          (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.category.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (sortField) {
        result.sort((a, b) => {
          const valA = a[sortField].toLowerCase();
          const valB = b[sortField].toLowerCase();
          if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    }

    return [];
  }, [activeTab, search, filterRole, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(processedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page]);

  return (
    <div className="space-y-6 font-sans w-full">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 dark:border-dark-border/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            Node Database Records
          </h2>
          <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
            Query and filter registry telemetry databases.
          </p>
        </div>

        {/* Tab List */}
        <div className="flex gap-1 bg-gray-50 dark:bg-dark-bg p-0.5 rounded-lg border border-gray-150 dark:border-dark-border select-none text-[10px] font-bold">
          <button
            onClick={() => handleTabChange('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'users'
                ? 'bg-white dark:bg-dark-card text-brand-violet dark:text-white shadow-sm'
                : 'text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <UsersIcon className="h-3.5 w-3.5" />
            Users
          </button>
          <button
            onClick={() => handleTabChange('crypto')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'crypto'
                ? 'bg-white dark:bg-dark-card text-brand-violet dark:text-white shadow-sm'
                : 'text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <CurrencyDollarIcon className="h-3.5 w-3.5" />
            Cryptocurrency
          </button>
          <button
            onClick={() => handleTabChange('news')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'news'
                ? 'bg-white dark:bg-dark-card text-brand-violet dark:text-white shadow-sm'
                : 'text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <NewspaperIcon className="h-3.5 w-3.5" />
            AI News Feed
          </button>
        </div>
      </div>

      {/* Control bar - Search and filter panels */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between font-sans">
        <div className="relative w-full sm:max-w-xs text-xs font-semibold">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-dark-muted pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab === 'users' ? 'users...' : activeTab === 'crypto' ? 'coins...' : 'headlines...'}`}
            className="w-full bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-lg py-2 pl-9 pr-4 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-violet transition-colors"
          />
        </div>

        {activeTab === 'users' && (
          <div className="flex items-center gap-2 text-xs font-semibold select-none w-full sm:w-auto">
            <span className="text-gray-400 dark:text-dark-muted text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">Filter roles</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-lg py-1.5 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors w-full sm:w-auto"
            >
              <option value="all">All Roles & Statuses</option>
              <option value="Owner">Owner</option>
              <option value="Administrator">Administrator</option>
              <option value="Developer">Developer</option>
              <option value="Operator">Operator</option>
              <option value="Active">Status: Active</option>
              <option value="Suspended">Status: Suspended</option>
              <option value="Invited">Status: Invited</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Table Card wrapper */}
      <div className="glass-card rounded-xl border-glow overflow-hidden relative shadow-sm dark:shadow-glass">
        <div className="overflow-x-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'users' && (
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-gray-50/50 dark:bg-dark-bg/40 text-gray-400 dark:text-dark-muted uppercase font-bold text-[9px] border-b border-gray-150 dark:border-dark-border/40 select-none tracking-wider">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('role')}>
                        <span className="flex items-center gap-1">Role <ArrowsUpDownIcon className="h-3 w-3" /></span>
                      </th>
                      <th className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('status')}>
                        <span className="flex items-center gap-1">Status <ArrowsUpDownIcon className="h-3 w-3" /></span>
                      </th>
                      <th className="py-3 px-4">Last Sync</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-dark-border/30">
                    {paginatedData.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/40 dark:hover:bg-dark-bg/10 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center font-bold text-xs text-brand-violet">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white leading-none">{user.name}</h4>
                            <span className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5 block">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{user.role}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded border uppercase leading-none ${
                            user.status === 'Active'
                              ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20'
                              : user.status === 'Suspended'
                              ? 'bg-brand-rose/10 text-brand-rose border-brand-rose/20'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-gray-400 dark:text-dark-muted">{user.lastLogin}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex gap-1.5">
                            <button onClick={() => handleAction(user, 'Edit')} className="text-[10px] font-bold text-brand-violet hover:underline">Edit</button>
                            <span className="text-gray-200 dark:text-dark-border">|</span>
                            <button onClick={() => handleAction(user, 'Suspend')} className="text-[10px] font-bold text-brand-rose hover:underline">Suspend</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400 dark:text-dark-muted font-medium">No matching user registries found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'crypto' && (
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-gray-50/50 dark:bg-dark-bg/40 text-gray-400 dark:text-dark-muted uppercase font-bold text-[9px] border-b border-gray-150 dark:border-dark-border/40 select-none tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Coin Asset</th>
                      <th className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('price')}>
                        <span className="flex items-center gap-1">Price <ArrowsUpDownIcon className="h-3 w-3" /></span>
                      </th>
                      <th className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('marketCap')}>
                        <span className="flex items-center gap-1">Market Cap <ArrowsUpDownIcon className="h-3 w-3" /></span>
                      </th>
                      <th className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('change')}>
                        <span className="flex items-center gap-1">24h Change <ArrowsUpDownIcon className="h-3 w-3" /></span>
                      </th>
                      <th className="py-3 px-4 text-right">24h Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-dark-border/30">
                    {paginatedData.map((coin) => (
                      <tr key={coin.id} className="hover:bg-gray-50/40 dark:hover:bg-dark-bg/10 transition-colors font-mono">
                        <td className="py-3 px-4 flex items-center gap-2.5 font-sans">
                          <div className="w-8 h-8 rounded-md bg-gray-50 dark:bg-dark-bg border border-gray-150 dark:border-dark-border flex items-center justify-center font-bold text-[10px] text-gray-900 dark:text-white shrink-0">
                            {coin.symbol}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white leading-none">{coin.name}</h4>
                            <span className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5 block">{coin.symbol}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-700 dark:text-gray-300">
                          ${coin.price > 100 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : coin.price}
                        </td>
                        <td className="py-3 px-4 text-gray-400 dark:text-dark-muted">${(coin.marketCap / 1e9).toFixed(2)}B</td>
                        <td className={`py-3 px-4 font-bold ${coin.change > 0 ? 'text-brand-emerald' : 'text-brand-rose'}`}>
                          {coin.change > 0 ? '+' : ''}{coin.change}%
                        </td>
                        <td className="py-3 px-4 text-right text-gray-400 dark:text-dark-muted">${(coin.volume / 1e9).toFixed(2)}B</td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400 dark:text-dark-muted font-medium">No matching token indexes found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'news' && (
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-gray-50/50 dark:bg-dark-bg/40 text-gray-400 dark:text-dark-muted uppercase font-bold text-[9px] border-b border-gray-150 dark:border-dark-border/40 select-none tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Headline Title</th>
                      <th className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('category')}>
                        <span className="flex items-center gap-1">Category <ArrowsUpDownIcon className="h-3 w-3" /></span>
                      </th>
                      <th className="py-3 px-4">Source Hub</th>
                      <th className="py-3 px-4 text-right">Published</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-dark-border/30">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/40 dark:hover:bg-dark-bg/10 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900 dark:text-white max-w-sm truncate">{item.title}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded border border-brand-violet/20 text-brand-violet bg-brand-violet/10 uppercase leading-none">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-500 dark:text-dark-muted">{item.source}</td>
                        <td className="py-3 px-4 text-right font-mono text-[10px] text-gray-400 dark:text-dark-muted">{item.published}</td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-400 dark:text-dark-muted font-medium">No matching tech news logs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Reusable Pagination footer bar */}
        <div className="bg-gray-50/50 dark:bg-dark-bg/30 border-t border-gray-100 dark:border-dark-border/40 px-4 py-3 flex items-center justify-between select-none">
          <span className="text-[10px] text-gray-400 dark:text-dark-muted font-mono leading-none">
            Showing Page {page} of {totalPages} ({processedData.length} records found)
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1 rounded border border-gray-200 dark:border-dark-border text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 transition-all"
            >
              <ChevronLeftIcon className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1 rounded border border-gray-200 dark:border-dark-border text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 transition-all"
            >
              <ChevronRightIcon className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
