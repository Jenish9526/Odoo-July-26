import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Shared top-bar + layout shell for the 3 standalone role dashboards.
 * Provides: theme toggle, user badge, logout, full-dashboard link, and page body.
 */
export default function RoleDashboardShell({ children, accentColor, roleName, roleIcon, navItems = [] }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const accent = {
        Administrator: {
            badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25 dark:bg-indigo-500/15 dark:text-indigo-300',
            dot: 'bg-indigo-500',
            logoRing: 'shadow-indigo-500/30',
            logo: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        },
        Dispatcher: {
            badge: 'bg-sky-500/15 text-sky-400 border-sky-500/25 dark:bg-sky-500/15 dark:text-sky-300',
            dot: 'bg-sky-500',
            logoRing: 'shadow-sky-500/30',
            logo: 'bg-gradient-to-br from-sky-500 to-blue-600',
        },
        Driver: {
            badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300',
            dot: 'bg-emerald-500',
            logoRing: 'shadow-emerald-500/30',
            logo: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        },
    }[roleName] || {
        badge: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
        dot: 'bg-slate-500',
        logoRing: 'shadow-slate-500/30',
        logo: 'bg-slate-700',
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

            {/* ── Sticky header ── */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/90 border-b border-slate-200 dark:border-white/8 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${accent.logo} flex items-center justify-center font-black text-white text-sm shadow-lg ${accent.logoRing}`}>
                            T
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">TransitOps</p>
                            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{roleName} Dashboard</p>
                        </div>
                    </div>

                    {/* Nav items (optional) */}
                    {navItems.length > 0 && (
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((n) => (
                                <button
                                    key={n.label}
                                    onClick={() => navigate(n.path)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                >
                                    {n.icon && <n.icon size={13} />}
                                    {n.label}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        {/* User badge */}
                        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${accent.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} animate-pulse`} />
                            <span>{user.name?.split(' ')[0] || roleName}</span>
                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            title="Toggle theme"
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                        </button>

                        {/* Full dashboard link (admin only) */}
                        {(roleName === 'Administrator') && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                title="Full dashboard"
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-all"
                            >
                                <LayoutDashboard size={15} />
                            </button>
                        )}

                        {/* Logout */}
                        <button
                            onClick={logout}
                            title="Logout"
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Page body ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>
        </div>
    );
}
