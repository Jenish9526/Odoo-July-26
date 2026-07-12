import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Car, 
  User, 
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LogisticsIllustration from '../components/LogisticsIllustration';

// Seed demo credentials per role for quick login demonstration
const demoCredentials = {
  Administrator: { email: 'admin@transitops.com', password: 'adminpassword' },
  Dispatcher: { email: 'dispatch@transitops.com', password: 'dispatchpassword' },
  Driver: { email: 'driver@transitops.com', password: 'driverpassword' }
};

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState('Administrator');
  const [email, setEmail] = useState(demoCredentials.Administrator.email);
  const [password, setPassword] = useState(demoCredentials.Administrator.password);
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle role badge toggle
  const handleRoleChange = (role) => {
    setActiveRole(role);
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    setErrors({});
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulate API network latency
      setTimeout(() => {
        const selectedCreds = demoCredentials[activeRole];
        
        if (email === selectedCreds.email && password === selectedCreds.password) {
          setLoading(false);
          // Redirect to main command center dashboard
          navigate('/dashboard');
        } else {
          setLoading(false);
          setServerError('Invalid credentials. Please verify your email and password.');
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* Light/Dark mode floating switcher */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-sky-500 shadow-sm backdrop-blur-xs transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-500 animate-spin-slow" /> : <Moon size={18} />}
        </button>
      </div>

      {/* LEFT SIDE PANEL: Logistics Illustration & Info (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-12 bg-slate-900 text-white relative">
        {/* Branding header info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-500 text-white font-extrabold text-lg shadow-md shadow-sky-500/25">
            T
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            TransitOps
          </span>
        </div>

        {/* Live Vector SVG Illustration */}
        <div className="flex-1 flex items-center justify-center py-6">
          <LogisticsIllustration />
        </div>

        {/* Description Text Panel */}
        <div className="space-y-4 max-w-lg">
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            Smart Transport Operations Platform
          </span>
          <h2 className="text-3xl font-black tracking-tight leading-tight mt-2">
            Integrated fleet intelligence at your fingertips.
          </h2>
          <p className="text-sm text-slate-450 leading-relaxed">
            Manage Vehicles, Drivers, Trips, Maintenance schedules, and operational Expenses from a single unified workspace.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE PANEL: Translucent Credentials Card */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 md:p-20 lg:p-12 xl:p-16">
        
        {/* Mobile branding header */}
        <div className="flex items-center gap-2.5 lg:hidden mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500 text-white font-black text-sm">
            T
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            TransitOps
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto space-y-8">
          
          {/* Headline Text */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select your organization role below to access the platform.
            </p>
          </div>

          {/* Role badge selector tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40">
            {Object.keys(demoCredentials).map((role) => {
              const isActive = activeRole === role;
              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1
                    ${isActive 
                      ? 'bg-white dark:bg-slate-950 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/60 dark:border-slate-850' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                >
                  {role === 'Administrator' && <ShieldCheck size={14} />}
                  {role === 'Dispatcher' && <User size={14} />}
                  {role === 'Driver' && <Car size={14} />}
                  <span>{role}</span>
                </button>
              );
            })}
          </div>

          {/* Form Card (Glassmorphism design) */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-850/50 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-xl space-y-6">
            
            {/* Server side authentication errors */}
            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-xs text-red-655 dark:text-red-400 font-semibold animate-shake">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className={`absolute left-3 w-4 h-4 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    placeholder="name@transitops.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 text-sm border rounded-xl outline-none focus:ring-1 focus:ring-sky-500 transition-all bg-white dark:bg-slate-900/60 dark:text-white
                      ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-sky-500'}`}
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.email}</span>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
                  <a href="#forgot" className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock className={`absolute left-3 w-4 h-4 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-xl outline-none focus:ring-1 focus:ring-sky-500 transition-all bg-white dark:bg-slate-900/60 dark:text-white
                      ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-sky-500'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-650 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.password}</span>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:bg-slate-900 dark:border-slate-800"
                />
                <label htmlFor="remember" className="text-xs text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                  Remember my session on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-md shadow-sky-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>
          </div>
          
        </div>

        {/* Footer section */}
        <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>© 2026 TransitOps. All rights reserved.</span>
          <span className="font-medium text-[10px]">Secure 256-bit SSL encrypted.</span>
        </div>

      </div>

    </div>
  );
}
