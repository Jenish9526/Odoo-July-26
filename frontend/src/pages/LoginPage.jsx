import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdminPanelSettings,
  MdOutlineRoute,
  MdLocalShipping,
  MdRocketLaunch,
} from 'react-icons/md';
import {
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiShieldCheckLine,
} from 'react-icons/ri';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROLES = [
  {
    role: 'Administrator',
    email: 'admin@transitops.com',
    password: 'TransitOps@2026',
    color: '#6366f1',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    Icon: MdAdminPanelSettings,
    iconColor: 'text-indigo-400',
    desc: 'Full system access',
  },
  {
    role: 'Dispatcher',
    email: 'dispatcher@transitops.com',
    password: 'Dispatch@123',
    color: '#0ea5e9',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    Icon: MdOutlineRoute,
    iconColor: 'text-sky-400',
    desc: 'Trip & route control',
  },
  {
    role: 'Driver',
    email: 'driver@transitops.com',
    password: 'Driver@123',
    color: '#22c55e',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Icon: MdLocalShipping,
    iconColor: 'text-emerald-400',
    desc: 'Trip assignments',
  },
];

// Animated floating particle canvas
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animId;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(148,163,184,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function LoginPage() {
  const navigate = useNavigate();


  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState(ROLES[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRoleSelect = (r) => {
    setActiveRole(r);
    setEmail(r.email);
    setPassword(r.password);
    setErrors({});
    setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess(true);
        setTimeout(() => {
          const role = data.user.role;
          if (role === 'Driver') navigate('/driver-dashboard');
          else if (role === 'Dispatcher') navigate('/dispatcher-dashboard');
          else navigate('/dashboard');
        }, 800);
      } else {
        setServerError(data.message || 'Invalid credentials');
      }
    } catch {
      setServerError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2';
  const inputClass = (field) =>
    `${inputBase} ${errors[field]
      ? 'border-red-500/60 focus:ring-red-500/30'
      : 'border-white/10 focus:border-sky-500/60 focus:ring-sky-500/20'
    }`;

  return (
    /* Login page is always dark-themed — background forced regardless of system theme */
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">

      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
        />
      </div>

      {/* Particle network */}
      <ParticleCanvas />



      {/* ── Branding (top-left) ── */}
      <div className="absolute top-5 left-6 z-50 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
          <RiShieldCheckLine size={18} className="text-white" />
        </div>
        <span className="font-extrabold text-lg text-white tracking-tight">TransitOps</span>
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/30 mb-4">
              <MdRocketLaunch size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your operations dashboard</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Quick role login</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${activeRole.role === r.role
                    ? 'border-white/20 bg-white/10 shadow-lg'
                    : 'border-white/5 bg-white/3 hover:bg-white/8 hover:border-white/10'
                    }`}
                >
                  {activeRole.role === r.role && (
                    <div
                      className="absolute inset-0 rounded-2xl opacity-15 blur-sm"
                      style={{ background: `radial-gradient(circle, ${r.color}, transparent)` }}
                    />
                  )}
                  {/* React Icon instead of emoji */}
                  <r.Icon
                    size={22}
                    className={`relative z-10 ${activeRole.role === r.role ? r.iconColor : 'text-slate-500'}`}
                  />
                  <span
                    className={`relative z-10 text-[10px] font-bold leading-tight ${activeRole.role === r.role ? 'text-white' : 'text-slate-500'
                      }`}
                  >
                    {r.role}
                  </span>
                  {activeRole.role === r.role && (
                    <span className={`relative z-10 text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${r.badge}`}>
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600">or enter manually</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Alerts */}
          {serverError && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              <RiAlertLine size={15} className="mt-0.5 flex-shrink-0" />
              {serverError}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <RiCheckboxCircleLine size={15} className="flex-shrink-0" />
              Login successful! Redirecting…
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Email Address</label>
              <div className="relative">
                <RiMailLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
                  placeholder="name@transitops.com"
                  className={`${inputClass('email')} pl-9`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <RiLockPasswordLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: null })); }}
                  placeholder="Enter your password"
                  className={`${inputClass('password')} pl-9 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[11px] mt-1">{errors.password}</p>}
            </div>

            {/* Remember me toggle */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 border border-white/10 rounded-full peer-checked:bg-sky-500 transition-all duration-200" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-4 shadow-sm" />
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors select-none">
                  Remember me
                </span>
              </label>
              <button type="button" className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg cursor-pointer mt-2 ${loading || success
                ? 'opacity-60 cursor-not-allowed bg-sky-600'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:shadow-sky-500/25 hover:scale-[1.01] active:scale-[0.99]'
                }`}
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : success ? (
                <>
                  <RiCheckboxCircleLine size={17} />
                  <span>Authenticated!</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <RiArrowRightLine size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[11px] text-slate-600 mt-6">
            © 2026 TransitOps · Secured with 256-bit SSL encryption
          </p>

        </div>
      </div>
    </div>
  );
}
