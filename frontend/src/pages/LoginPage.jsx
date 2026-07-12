import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle,
  Sun, Moon, ChevronDown, ShieldCheck, User, Car
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { key: 'Administrator', label: 'Administrator', icon: ShieldCheck, email: 'admin@transitops.com',    password: 'adminpassword',    badge: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400' },
  { key: 'Dispatcher',    label: 'Dispatcher',    icon: User,         email: 'dispatch@transitops.com', password: 'dispatchpassword', badge: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400'             },
  { key: 'Driver',        label: 'Driver',        icon: Car,          email: 'driver@transitops.com',   password: 'driverpassword',   badge: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' },
];

/* ── Particle network canvas ─────────────────────────────────── */
function ParticleCanvas({ mouse, isDark }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    const COUNT = 72;
    particles.current = Array.from({ length: COUNT }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.35,
      vy:  (Math.random() - 0.5) * 0.35,
      r:   Math.random() * 1.8 + 0.8,
    }));

    const CONNECT_DIST  = 130;
    const MOUSE_DIST    = 160;
    const MOUSE_REPEL   = 0.012;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dotColor  = isDark ? '148,163,184' : '100,116,139';
      const lineColor = isDark ? '56,189,248'  : '14,165,233';

      particles.current.forEach((p) => {
        // Gentle mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST && d > 0) {
          p.vx += (dx / d) * MOUSE_REPEL;
          p.vy += (dy / d) * MOUSE_REPEL;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.9) { p.vx *= 0.9 / speed; p.vy *= 0.9 / speed; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},${isDark ? 0.55 : 0.45})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a  = particles.current[i];
          const b  = particles.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * (isDark ? 0.22 : 0.18);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }

      // Lines from mouse to nearby particles
      particles.current.forEach((p) => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST) {
          const alpha = (1 - d / MOUSE_DIST) * (isDark ? 0.55 : 0.4);
          ctx.beginPath();
          ctx.moveTo(mouse.current.x, mouse.current.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const { login }              = useAuth();
  const navigate               = useNavigate();

  const isDark = theme === 'dark';

  // Mouse position ref (no re-render on move)
  const mouse      = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Spotlight state (re-render only for spotlight position)
  const [spot, setSpot] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Card tilt
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    setSpot({ x: e.clientX, y: e.clientY });

    // Card parallax tilt
    if (cardRef.current) {
      const rect   = cardRef.current.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      setTilt({ rx: -dy * 5, ry: dx * 5 });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
  }, []);

  // Form state
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email,        setEmail]        = useState(ROLES[0].email);
  const [password,     setPassword]     = useState(ROLES[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(true);
  const [errors,       setErrors]       = useState({});
  const [loading,      setLoading]      = useState(false);
  const [serverError,  setServerError]  = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword(role.password);
    setErrors({});
    setServerError('');
    setDropdownOpen(false);
  };

  const validate = () => {
    const errs = {};
    if (!email.trim())                     errs.email    = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email    = 'Enter a valid email address';
    if (!password)                         errs.password = 'Password is required';
    else if (password.length < 6)         errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const RoleIcon = selectedRole.icon;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#070c12] transition-colors duration-500"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* ── Particle network ── */}
      <ParticleCanvas mouse={mouse} isDark={isDark} />

      {/* ── Mouse spotlight ── */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left:      spot.x,
          top:       spot.y,
          transform: 'translate(-50%, -50%)',
          width:     520,
          height:    520,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(14,165,233,0.04) 40%, transparent 70%)',
        }}
      />

      {/* ── Ambient corner glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-400/15 dark:bg-sky-500/8 blur-[90px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-400/12 dark:bg-orange-500/8 blur-[90px]" />
      </div>

      {/* ── Theme toggle ── */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all cursor-pointer"
        >
          {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
        </button>
      </div>

      {/* ── Login card ── */}
      <div className="relative z-10 w-full max-w-sm px-4 space-y-7">

        {/* Logo + heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-500/35 mx-auto ring-4 ring-sky-500/20">
            <span className="text-2xl font-black">T</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">TransitOps</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Sign in to your workspace</p>
          </div>
        </div>

        {/* Card with tilt */}
        <div
          ref={cardRef}
          style={{
            transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.6s ease' : 'transform 0.08s linear',
            willChange: 'transform',
          }}
          className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-2xl shadow-slate-300/40 dark:shadow-slate-950/80 p-7 space-y-5"
        >

          {serverError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Role</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg ${selectedRole.badge}`}>
                      <RoleIcon size={13} />
                    </span>
                    <span>{selectedRole.label}</span>
                  </div>
                  <ChevronDown size={15} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    {ROLES.map((role) => {
                      const Icon     = role.icon;
                      const isActive = selectedRole.key === role.key;
                      return (
                        <button
                          key={role.key}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer text-left
                            ${isActive
                              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg ${role.badge}`}>
                            <Icon size={13} />
                          </span>
                          <span className="font-medium">{role.label}</span>
                          {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Email</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  placeholder="you@transitops.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all bg-slate-50 dark:bg-slate-800/60 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                    ${errors.email
                      ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20'}`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                <a href="#forgot" className="text-[11px] font-semibold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.password ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border outline-none transition-all bg-slate-50 dark:bg-slate-800/60 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                    ${errors.password
                      ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-0 dark:bg-slate-800 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-xl transition-all shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <><span>Sign in</span><ArrowRight size={15} /></>
              }
            </button>

          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-600">
          © 2026 TransitOps · Secure 256-bit SSL
        </p>

      </div>
    </div>
  );
}
