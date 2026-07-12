import { useState } from 'react';
import {
  Cog6ToothIcon,
  SunIcon,
  LanguageIcon,
  AdjustmentsVerticalIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const Settings = () => {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  // Settings State
  const [siteTitle, setSiteTitle] = useState('Antigravity Telemetry');
  const [timeout, setTimeoutVal] = useState(1500);
  const [language, setLanguage] = useState('en');
  const [density, setDensity] = useState('default');
  const [widgets, setWidgets] = useState({
    weather: true,
    crypto: true,
    stock: true,
    news: true,
    aqi: true,
    currency: true,
  });
  const [telemetryOptIn, setTelemetryOptIn] = useState(true);

  // Read current theme state from HTML body class list
  const [themeMode, setThemeMode] = useState(() => {
    return document.documentElement.classList.contains('light') ? 'light' : 'dark';
  });

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
    showToast(`Appearance theme updated to ${newTheme.toUpperCase()}`, 'info');
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings configuration updated successfully!', 'success');
    }, 1200);
  };

  const toggleWidget = (key) => {
    setWidgets((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast(`Dashboard widget visibility modified.`, 'info');
  };

  return (
    <div className="space-y-6 font-sans w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-dark-border/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            System Console Settings
          </h2>
          <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
            Configure telemetry behavior, layouts, and system-wide defaults.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Category Menu */}
        <div className="md:col-span-1 space-y-4 select-none">
          <div className="glass-card rounded-xl p-5 border-glow">
            <h3 className="text-xs font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider mb-3">
              Settings Directory
            </h3>
            <div className="space-y-1.5 text-xs font-semibold">
              <span className="flex items-center gap-2 p-2 rounded-lg bg-brand-violet/10 text-brand-violet border border-brand-violet/20 cursor-pointer">
                <Cog6ToothIcon className="h-4 w-4" /> General Parameters
              </span>
              <span className="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-bg/25 cursor-pointer">
                <SunIcon className="h-4 w-4" /> Appearance & Themes
              </span>
              <span className="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-bg/25 cursor-pointer">
                <LanguageIcon className="h-4 w-4" /> Languages & L10n
              </span>
              <span className="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-bg/25 cursor-pointer">
                <AdjustmentsVerticalIcon className="h-4 w-4" /> Widget Preferences
              </span>
              <span className="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-bg/25 cursor-pointer">
                <ShieldCheckIcon className="h-4 w-4" /> Security & Privacy
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Options Stack */}
        <div className="md:col-span-2 space-y-6">
          {/* General Param Form */}
          <div className="glass-card rounded-xl p-5 border-glow space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-dark-border/40 pb-3 mb-2 select-none">
              <Cog6ToothIcon className="h-4.5 w-4.5 text-brand-violet" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                General Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-dark-muted">Console Namespace</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors"
                />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-dark-muted">Default API Timeout (ms)</label>
                <input
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeoutVal(Number(e.target.value))}
                  className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Theme & Appearance options */}
          <div className="glass-card rounded-xl p-5 border-glow space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-dark-border/40 pb-3 mb-2 select-none">
              <SunIcon className="h-4.5 w-4.5 text-brand-cyan" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                Theme & Layout Density
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-dark-muted block select-none">Appearance Mode</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                      themeMode === 'dark'
                        ? 'bg-brand-violet/10 text-brand-violet border-brand-violet/30'
                        : 'border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg/25 text-gray-500'
                    }`}
                  >
                    Dark Mode
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                      themeMode === 'light'
                        ? 'bg-brand-violet/10 text-brand-violet border-brand-violet/30'
                        : 'border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg/25 text-gray-500'
                    }`}
                  >
                    Light Mode
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-dark-muted block select-none">Layout Density</span>
                <select
                  value={density}
                  onChange={(e) => setDensity(e.target.value)}
                  className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors w-full"
                >
                  <option value="default">Default Spacing</option>
                  <option value="cozy">Cozy Spacing</option>
                  <option value="compact">Compact Spacing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Languages Selector */}
          <div className="glass-card rounded-xl p-5 border-glow space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-dark-border/40 pb-3 mb-2 select-none">
              <LanguageIcon className="h-4.5 w-4.5 text-amber-500" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                Language & Localization
              </h4>
            </div>

            <div className="space-y-1.5 text-xs font-semibold">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-dark-muted select-none">Console Language</label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  showToast('Localization language toggled.', 'info');
                }}
                className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors w-full"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="ja">日本語 (JA)</option>
                <option value="de">Deutsch (DE)</option>
              </select>
            </div>
          </div>

          {/* Widget Visibilities */}
          <div className="glass-card rounded-xl p-5 border-glow space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-dark-border/40 pb-3 mb-2 select-none">
              <AdjustmentsVerticalIcon className="h-4.5 w-4.5 text-brand-emerald" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                Dashboard Widget Preferences
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold select-none">
              {Object.keys(widgets).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`w-${key}`}
                    checked={widgets[key]}
                    onChange={() => toggleWidget(key)}
                    className="h-4 w-4 rounded border-gray-200 text-brand-violet cursor-pointer"
                  />
                  <label htmlFor={`w-${key}`} className="capitalize text-gray-700 dark:text-gray-300 cursor-pointer">
                    {key} Module
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="glass-card rounded-xl p-5 border-glow space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-dark-border/40 pb-3 mb-2 select-none">
              <ShieldCheckIcon className="h-4.5 w-4.5 text-brand-rose" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                Telemetry Uptime Privacy Settings
              </h4>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <div>
                <span className="font-bold text-gray-900 dark:text-white leading-none block">Uptime Statistics Opt-In</span>
                <p className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5">Share anonymous diagnostics metrics with development servers.</p>
              </div>
              <button
                onClick={() => {
                  setTelemetryOptIn(!telemetryOptIn);
                  showToast('Telemetry collection status updated.', 'info');
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  telemetryOptIn ? 'bg-brand-violet' : 'bg-gray-200 dark:bg-dark-border'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    telemetryOptIn ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-3">
            <Button onClick={handleSave} loading={saving} className="px-6">
              Save Workspace Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
