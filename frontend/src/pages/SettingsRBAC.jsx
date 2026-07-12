import React, { useState } from 'react';
import {
  RiSettings4Line,
  RiShieldUserLine,
  RiCheckFill,
  RiCloseFill,
  RiArrowRightLine,
  RiMailLine,
  RiMessage2Line,
  RiAlarmWarningLine,
  RiShieldKeyholeLine,
  RiHistoryLine,
  RiLockLine,
  RiUserHeartLine,
  RiMapPinLine,
  RiGlobalLine,
  RiTimeLine
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

// Initial Roles Mock Matrix Data
const initialRoles = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full administrative override authority across all fleet management, dispatcher, finance, and system operations modules.',
    assignedUsers: ['Raven K.', 'Sujal M.', 'Developer Team'],
    permissions: {
      fleet: ['Read', 'Create', 'Update', 'Delete'],
      drivers: ['Read', 'Create', 'Update', 'Delete'],
      trips: ['Read', 'Create', 'Update', 'Delete', 'Approve', 'Assign'],
      maintenance: ['Read', 'Create', 'Update', 'Delete', 'Approve'],
      fuel: ['Read', 'Create', 'Update', 'Delete', 'Approve'],
      analytics: ['Read', 'Create', 'Update', 'Delete'],
      settings: ['Read', 'Create', 'Update', 'Delete']
    }
  },
  {
    id: 'dispatcher',
    name: 'Dispatcher',
    description: 'Coordinates active route scheduling, driver allocations, and manages live route optimization warnings.',
    assignedUsers: ['Alex J.', 'Emily W.'],
    permissions: {
      fleet: ['Read'],
      drivers: ['Read'],
      trips: ['Read', 'Create', 'Update', 'Assign'],
      maintenance: ['Read'],
      fuel: ['Read', 'Create'],
      analytics: ['Read'],
      settings: []
    }
  },
  {
    id: 'fleet_mgr',
    name: 'Fleet Manager',
    description: 'Manages physical assets records, checks safety index logs, and coordinates vehicle garage service flows.',
    assignedUsers: ['Dianne P.', 'Sarah K.'],
    permissions: {
      fleet: ['Read', 'Create', 'Update', 'Delete'],
      drivers: ['Read', 'Create', 'Update'],
      trips: ['Read'],
      maintenance: ['Read', 'Create', 'Update', 'Approve'],
      fuel: ['Read', 'Create', 'Update'],
      analytics: ['Read'],
      settings: []
    }
  },
  {
    id: 'safety',
    name: 'Safety Officer',
    description: 'Audits safety score records, checks driver compliance, license renewals, and speed limit violations reports.',
    assignedUsers: ['Michael B.'],
    permissions: {
      fleet: ['Read'],
      drivers: ['Read', 'Update'],
      trips: ['Read'],
      maintenance: ['Read'],
      fuel: [],
      analytics: ['Read'],
      settings: []
    }
  },
  {
    id: 'finance',
    name: 'Financial Analyst',
    description: 'Audits expense ledger invoices, fuels toll allocations, and checks operational total cost calculators.',
    assignedUsers: ['Grace L.', 'William H.'],
    permissions: {
      fleet: ['Read'],
      drivers: [],
      trips: ['Read'],
      maintenance: ['Read'],
      fuel: ['Read', 'Update', 'Approve'],
      analytics: ['Read'],
      settings: []
    }
  }
];

export default function SettingsRBAC() {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // General Settings States
  const [companyName, setCompanyName] = useState('TransitOps Global');
  const [companyAddress, setCompanyAddress] = useState('102 Logistics Blvd, Building 4, Texas, USA');
  const [orgEmail, setOrgEmail] = useState('ops@transitops.com');
  const [contactNo, setContactNo] = useState('+1 (555) 321-7890');
  const [currency, setCurrency] = useState('USD ($)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers');
  const [timezone, setTimezone] = useState('UTC-5 (EST)');
  const [language, setLanguage] = useState('English');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [defaultDashboard, setDefaultDashboard] = useState('Operational KPIs');
  const [theme, setTheme] = useState('Dark');

  // System Config Settings States
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [licenseAlerts, setLicenseAlerts] = useState(true);
  const [maintReminder, setMaintReminder] = useState(true);
  const [fuelAlerts, setFuelAlerts] = useState(false);
  const [backupSchedule, setBackupSchedule] = useState('Daily (02:00 UTC)');
  const [logoutTimer, setLogoutTimer] = useState('30 min');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Security Policies States
  const [minPassLength, setMinPassLength] = useState(8);
  const [passExpiry, setPassExpiry] = useState('90 Days');
  const [failedLoginLimit, setFailedLoginLimit] = useState(5);

  const handleGeneralSave = (e) => {
    e.preventDefault();
    alert('General organization preferences successfully saved!');
  };

  const handleGeneralReset = () => {
    setCompanyName('TransitOps Global');
    setCompanyAddress('102 Logistics Blvd, Building 4, Texas, USA');
    setOrgEmail('ops@transitops.com');
    setContactNo('+1 (555) 321-7890');
    setCurrency('USD ($)');
    setDistanceUnit('Kilometers');
    setTimezone('UTC-5 (EST)');
    setLanguage('English');
    setDateFormat('YYYY-MM-DD');
    setDefaultDashboard('Operational KPIs');
    setTheme('Dark');
  };

  // Helper check function
  const hasAccess = (permissionsList, action = 'Read') => {
    return permissionsList && permissionsList.includes(action);
  };

  const openRoleDrawer = (role) => {
    setSelectedRole(role);
    setIsDrawerOpen(true);
  };

  const handlePermissionSave = () => {
    alert(`Permissions schema updated for ${selectedRole.name}!`);
    setIsDrawerOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="space-y-6 animate-slide-in-top">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-805 dark:text-slate-100 m-0">
          Settings & Role-Based Access Control (RBAC)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage organization preferences, user roles, permissions, system configuration, and security settings.
        </p>
      </div>

      {/* Grid: General Settings (Left) & RBAC Permission Matrix (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: General Settings Card */}
        <div className="xl:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">General Settings</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Define corporate options, language localization, and branding defaults.</p>
          </div>

          <form onSubmit={handleGeneralSave} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-350">
            
            {/* Company Name */}
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 outline-none text-slate-800 dark:text-white"
              />
            </div>

            {/* Company Address */}
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1">Company Address</label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 outline-none text-slate-800 dark:text-white"
              />
            </div>

            {/* Email & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Organization Email</label>
                <input
                  type="email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 outline-none text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Currency & Distance Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none cursor-pointer"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="INR (₹)">INR (₹)</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Distance Unit</label>
                <select
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none cursor-pointer"
                >
                  <option value="Kilometers">Kilometers (km)</option>
                  <option value="Miles">Miles (mi)</option>
                </select>
              </div>
            </div>

            {/* Timezone & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Time Zone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none cursor-pointer"
                >
                  <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                  <option value="UTC+5:30 (IST)">UTC+5:30 (IST)</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="flex flex-col">
              <label className="font-bold text-slate-500 mb-1.5">Theme Preferences</label>
              <div className="grid grid-cols-3 gap-2">
                {['Light', 'Dark', 'System'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTheme(opt)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${theme === opt ? 'border-orange-500 bg-orange-500/10 text-orange-505 dark:text-orange-400' : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-850/50">
              <button
                type="button"
                onClick={handleGeneralReset}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/10 transition-all cursor-pointer border-none"
              >
                Save Changes
              </button>
            </div>

          </form>

        </div>

        {/* RIGHT PANEL: RBAC Permission Matrix Card */}
        <div className="xl:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 m-0">Role-Based Access Control (RBAC)</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Toggle system access permission scopes across key organization roles.</p>
            </div>
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
              <RiShieldUserLine size={18} />
            </div>
          </div>

          {/* Matrix table representation */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-slate-250/60 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase">
                  <th className="px-4 py-3">Role</th>
                  <th className="px-3 py-3 text-center">Fleet</th>
                  <th className="px-3 py-3 text-center">Drivers</th>
                  <th className="px-3 py-3 text-center">Trips</th>
                  <th className="px-3 py-3 text-center">Maint.</th>
                  <th className="px-3 py-3 text-center">Expenses</th>
                  <th className="px-3 py-3 text-center">Analytics</th>
                  <th className="px-3 py-3 text-center">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    onClick={() => openRoleDrawer(role)}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-bold text-slate-850 dark:text-slate-100 whitespace-nowrap">
                      {role.name}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {hasAccess(role.permissions.fleet) ? <RiCheckFill className="text-emerald-500 inline" size={16} /> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {hasAccess(role.permissions.drivers) ? <RiCheckFill className="text-emerald-500 inline" size={16} /> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {hasAccess(role.permissions.trips) ? <RiCheckFill className="text-emerald-500 inline" size={16} /> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {hasAccess(role.permissions.maintenance) ? <RiCheckFill className="text-emerald-500 inline" size={16} /> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {hasAccess(role.permissions.fuel) ? <RiCheckFill className="text-emerald-500 inline" size={16} /> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {hasAccess(role.permissions.analytics) ? <RiCheckFill className="text-emerald-500 inline" size={16} /> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {hasAccess(role.permissions.settings) ? <RiCheckFill className="text-emerald-500 inline" size={16} /> : <span className="text-slate-400">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl flex items-center gap-2">
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block">Note:</span>
            <span className="text-[10px] text-slate-450 block">Click on any role row to open the side panel drawer and customize its full permissions list.</span>
          </div>

        </div>

      </div>

      {/* Grid: Additional System Configurations & Security Settings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* System Config Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50 flex items-center gap-2">
            <RiMailLine size={16} className="text-orange-500" />
            <h3 className="text-sm font-black text-slate-805 dark:text-slate-100 m-0">Additional Configurations</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Toggle options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850/20 cursor-pointer">
                <div>
                  <span className="font-bold block">Email Notifications</span>
                  <span className="text-[9px] text-slate-450 block mt-0.5">Send route alerts & daily summaries.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850/20 cursor-pointer">
                <div>
                  <span className="font-bold block">SMS Dispatch Alerts</span>
                  <span className="text-[9px] text-slate-450 block mt-0.5">SMS updates sent to drivers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850/20 cursor-pointer">
                <div>
                  <span className="font-bold block">License Expiry warning</span>
                  <span className="text-[9px] text-slate-450 block mt-0.5">Alert 30 days before expiration.</span>
                </div>
                <input
                  type="checkbox"
                  checked={licenseAlerts}
                  onChange={(e) => setLicenseAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850/20 cursor-pointer">
                <div>
                  <span className="font-bold block">Maintenance Reminders</span>
                  <span className="text-[9px] text-slate-450 block mt-0.5">Auto schedule weekly reviews.</span>
                </div>
                <input
                  type="checkbox"
                  checked={maintReminder}
                  onChange={(e) => setMaintReminder(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </label>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Backup Schedule</label>
                <input
                  type="text"
                  value={backupSchedule}
                  onChange={(e) => setBackupSchedule(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Auto Logout Session Timer</label>
                <select
                  value={logoutTimer}
                  onChange={(e) => setLogoutTimer(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none cursor-pointer"
                >
                  <option value="15 min">15 minutes</option>
                  <option value="30 min">30 minutes</option>
                  <option value="60 min">1 hour</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Security Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-950 dark:border-slate-850/50 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850/50 flex items-center gap-2">
            <RiShieldKeyholeLine size={16} className="text-orange-500" />
            <h3 className="text-sm font-black text-slate-805 dark:text-slate-100 m-0">Security Policies</h3>
          </div>

          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-350">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Min Password Length</label>
                <input
                  type="number"
                  value={minPassLength}
                  onChange={(e) => setMinPassLength(Number(e.target.value))}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Password Expiry</label>
                <select
                  value={passExpiry}
                  onChange={(e) => setPassExpiry(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none cursor-pointer"
                >
                  <option value="30 Days">30 Days</option>
                  <option value="90 Days">90 Days</option>
                  <option value="Never">Never</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Failed Login Limit</label>
                <input
                  type="number"
                  value={failedLoginLimit}
                  onChange={(e) => setFailedLoginLimit(Number(e.target.value))}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 outline-none text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* MFA active session toggle */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850/20 flex justify-between items-center">
              <div>
                <span className="font-bold block">Enforce Two-Factor Authentication (MFA)</span>
                <span className="text-[9px] text-slate-450 block mt-0.5">Require TOTP authentication token for all dispatcher roles login.</span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${twoFactorEnabled ? 'bg-orange-500' : 'bg-slate-350 dark:bg-slate-800'}`}
              >
                <motion.div
                  layout
                  className="bg-white w-4 h-4 rounded-full shadow-md"
                  animate={{ x: twoFactorEnabled ? 16 : 0 }}
                />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ROLE DETAILS SIDE DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && selectedRole && (
          <>
            {/* Overlay backdrop */}
            <div
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-850 shadow-2xl z-50 p-6 flex flex-col justify-between"
            >
              
              <div className="space-y-6 overflow-y-auto pr-1">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850/50">
                  <div>
                    <span className="text-[9px] text-orange-500 uppercase font-black tracking-widest block">Role Profiles details</span>
                    <h3 className="text-base font-black text-slate-800 dark:text-white m-0 mt-0.5">{selectedRole.name}</h3>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-700 dark:hover:text-white border-none bg-transparent cursor-pointer"
                  >
                    <RiCloseFill size={20} />
                  </button>
                </div>

                {/* Description */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wide block text-[9px]">Description</span>
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                    {selectedRole.description}
                  </p>
                </div>

                {/* Assigned operators users */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wide block text-[9px]">Assigned Users ({selectedRole.assignedUsers.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRole.assignedUsers.map((user) => (
                      <span
                        key={user}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-850 text-slate-700 dark:text-slate-200 font-semibold"
                      >
                        {user}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Accessible Modules & Permissions detail */}
                <div className="space-y-3">
                  <span className="font-bold text-slate-400 uppercase tracking-wide block text-[9px]">Module Permissions Control Matrix</span>
                  
                  <div className="space-y-2">
                    {Object.keys(selectedRole.permissions).map((module) => {
                      const modPerms = selectedRole.permissions[module];
                      return (
                        <div
                          key={module}
                          className="p-3 rounded-xl border border-slate-100 dark:border-slate-850/40 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs"
                        >
                          <span className="font-bold capitalize text-slate-800 dark:text-slate-150">{module}</span>
                          
                          <div className="flex items-center gap-1">
                            {modPerms.length === 0 ? (
                              <span className="text-[10px] text-slate-450 italic">No access</span>
                            ) : (
                              modPerms.map((p) => (
                                <span
                                  key={p}
                                  className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/10"
                                >
                                  {p}
                                </span>
                              ))
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>

              {/* Actions footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850/50 flex items-center gap-3">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePermissionSave}
                  className="flex-1 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/10 transition-all cursor-pointer border-none"
                >
                  Save Changes
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
