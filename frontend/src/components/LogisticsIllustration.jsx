import React from 'react';

export default function LogisticsIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden rounded-l-3xl">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      
      {/* Grid line backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-10" />

      {/* Main SVG Container */}
      <svg className="w-full max-w-xl h-auto drop-shadow-2xl" viewBox="0 0 600 650" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Style block containing modular CSS animations */}
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0.5deg); }
            50% { transform: translateY(-8px) rotate(-0.5deg); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          @keyframes rotate-clockwise {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes rotate-counter {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes pulse-light {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.85; }
          }
          @keyframes pulse-glow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(249, 115, 22, 0.4)); }
            50% { filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.95)); }
          }
          @keyframes route-dash {
            to { stroke-dashoffset: -40; }
          }
          @keyframes signal-wave {
            0% { r: 5; opacity: 0.8; }
            100% { r: 35; opacity: 0; }
          }
          
          .animated-float-slow { animation: float-slow 6s ease-in-out infinite; transform-origin: center; }
          .animated-float-medium { animation: float-medium 4s ease-in-out infinite; transform-origin: center; }
          .rotate-slow-cw { animation: rotate-clockwise 25s linear infinite; transform-origin: 300px 320px; }
          .rotate-slow-ccw { animation: rotate-counter 20s linear infinite; transform-origin: 300px 320px; }
          .pulse-active { animation: pulse-light 2s ease-in-out infinite; }
          .glow-active { animation: pulse-glow 2s ease-in-out infinite; }
          .route-dash-active { animation: route-dash 1.8s linear infinite; }
          .signal-active { animation: signal-wave 2s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        `}</style>

        {/* GRADIENTS & SHADOWS */}
        <defs>
          <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="orangeGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="holoRing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. CENTRAL HOLOGRAM DASHBOARD (Background / Center)
           ======================================================== */}
        <g className="rotate-slow-cw">
          {/* Main concentric radar/dashboard rings */}
          <circle cx="300" cy="320" r="170" stroke="url(#holoRing)" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="300" cy="320" r="140" stroke="url(#blueGlow)" strokeWidth="2" opacity="0.3" />
          <circle cx="300" cy="320" r="110" stroke="url(#holoRing)" strokeWidth="1" strokeDasharray="30 10 5 10" />
        </g>
        <g className="rotate-slow-ccw">
          <circle cx="300" cy="320" r="150" stroke="url(#orangeGlow)" strokeWidth="1.5" strokeDasharray="80 20 40 20" opacity="0.4" />
          <circle cx="300" cy="320" r="90" stroke="url(#blueGlow)" strokeWidth="2" strokeDasharray="10 10" opacity="0.2" />
        </g>
        <circle cx="300" cy="320" r="60" fill="#2563EB" fillOpacity="0.03" stroke="#38bdf8" strokeWidth="0.5" opacity="0.3" />
        {/* Radar crosshairs */}
        <line x1="300" y1="130" x2="300" y2="510" stroke="#2563EB" strokeWidth="0.5" opacity="0.15" />
        <line x1="110" y1="320" x2="490" y2="320" stroke="#2563EB" strokeWidth="0.5" opacity="0.15" />

        {/* ========================================================
            2. HIGH LEVEL NETWORK ROUTING & CONNECTED GPS CHANNELS
           ======================================================== */}
        {/* Core GPS tracking line channels linking vehicles and nodes */}
        <g strokeLinecap="round">
          {/* Route 1: Warehouse -> Center -> Fuel Station */}
          <path d="M 120 230 Q 220 280 300 320 T 460 410" fill="none" stroke="#2563EB" strokeWidth="3" opacity="0.25" />
          <path d="M 120 230 Q 220 280 300 320 T 460 410" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 8" className="route-dash-active" />

          {/* Route 2: Garage -> Center -> Bus route */}
          <path d="M 130 460 Q 240 380 300 320 T 480 260" fill="none" stroke="#F97316" strokeWidth="3" opacity="0.25" />
          <path d="M 130 460 Q 240 380 300 320 T 480 260" fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="10 10" className="route-dash-active" />

          {/* Route 3: Top Satellite beam mapping */}
          <line x1="300" y1="60" x2="300" y2="320" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        </g>

        {/* ========================================================
            3. ISOMETRIC INFRASTRUCTURE NODES (Nodes around center)
           ======================================================== */}

        {/* NODE A: Warehouse Hub (Middle Left) */}
        <g transform="translate(45, 170)" className="animated-float-medium">
          {/* Node base glow */}
          <ellipse cx="65" cy="85" rx="55" ry="15" fill="#2563EB" fillOpacity="0.1" />
          {/* Isometric Building shape */}
          <polygon points="65,25 110,48 110,75 65,98 20,75 20,48" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
          <polygon points="65,25 110,48 65,70 20,48" fill="#334155" />
          {/* Loading bays */}
          <rect x="35" y="58" width="18" height="15" fill="#f97316" rx="1" opacity="0.8" />
          <rect x="75" y="58" width="18" height="15" fill="#2563EB" rx="1" opacity="0.8" />
          {/* Label */}
          <text x="65" y="112" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">WAREHOUSE</text>
        </g>

        {/* NODE B: Maintenance Garage (Bottom Left) */}
        <g transform="translate(55, 410)" className="animated-float-slow">
          <ellipse cx="65" cy="85" rx="50" ry="12" fill="#F97316" fillOpacity="0.08" />
          {/* Grid platform */}
          <polygon points="65,30 110,50 65,70 20,50" fill="#0f172a" stroke="#f97316" strokeWidth="1" />
          {/* Interactive Gear and Wrench Tool Icons */}
          <circle cx="65" cy="50" r="16" fill="#f97316" fillOpacity="0.1" stroke="#f97316" strokeWidth="1" />
          <path d="M 60 44 L 70 56 M 70 44 L 60 56" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          {/* Screwdriver and wrench overlap */}
          <circle cx="65" cy="50" r="3" fill="#ffffff" />
          <text x="65" y="105" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">GARAGE</text>
        </g>

        {/* NODE C: Fuel station & Analytics (Bottom Right) */}
        <g transform="translate(425, 410)" className="animated-float-medium">
          <ellipse cx="65" cy="85" rx="50" ry="12" fill="#2563EB" fillOpacity="0.08" />
          {/* Base Platform */}
          <polygon points="65,30 110,50 65,70 20,50" fill="#0f172a" stroke="#2563EB" strokeWidth="1" />
          {/* Gas pump vector outline & fuel stats */}
          <rect x="53" y="32" width="24" height="26" rx="2" fill="#2563EB" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1" />
          {/* Fuel analytics card */}
          <line x1="58" y1="38" x2="72" y2="38" stroke="#38bdf8" strokeWidth="2" />
          <line x1="58" y1="44" x2="68" y2="44" stroke="#f97316" strokeWidth="2" />
          <line x1="58" y1="50" x2="70" y2="50" stroke="#38bdf8" strokeWidth="2" />
          <text x="65" y="105" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">FUEL DEPOT</text>
        </g>

        {/* ========================================================
            4. 4 DETAILED FLEET VEHICLES (Floating on route paths)
           ======================================================== */}

        {/* VEHICLE 1: Modern Cargo Truck (Left Route) */}
        <g transform="translate(195, 230)" className="animated-float-slow">
          {/* Shadow */}
          <ellipse cx="45" cy="68" rx="35" ry="8" fill="#000000" opacity="0.4" />
          
          {/* Blue Container body */}
          <rect x="10" y="18" width="54" height="34" rx="3" fill="#2563EB" stroke="#38bdf8" strokeWidth="1" />
          {/* Orange trim detail line */}
          <line x1="10" y1="35" x2="64" y2="35" stroke="#F97316" strokeWidth="3" />
          {/* Cab (white/dark panels) */}
          <path d="M64 28 H82 L88 40 V52 H64 Z" fill="#ffffff" />
          <path d="M68 31 H79 L83 40 H68 Z" fill="#0f172a" />
          <rect x="64" y="44" width="24" height="8" fill="#f97316" rx="1" />
          {/* Wheels */}
          <circle cx="22" cy="58" r="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <circle cx="36" cy="58" r="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <circle cx="76" cy="58" r="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        </g>

        {/* VEHICLE 2: Orange Delivery Van (Center-Left Route) */}
        <g transform="translate(160, 345)" className="animated-float-medium">
          {/* Shadow */}
          <ellipse cx="40" cy="62" rx="30" ry="7" fill="#000000" opacity="0.4" />
          
          {/* Orange Van body */}
          <path d="M 10 25 C 10 21 13 18 17 18 H 65 L 75 32 L 75 52 C 75 54 73 56 71 56 H 14 C 12 56 10 54 10 52 Z" fill="#F97316" stroke="#ea580c" strokeWidth="1" />
          {/* Glass panels */}
          <path d="M 52 22 H 63 L 69 32 H 52 Z" fill="#0f172a" />
          {/* White corporate stripe */}
          <rect x="10" y="36" width="58" height="4" fill="#ffffff" />
          {/* Wheels */}
          <circle cx="24" cy="56" r="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <circle cx="62" cy="56" r="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        </g>

        {/* VEHICLE 3: Corporate Passenger Bus (Top-Right Route) */}
        <g transform="translate(350, 205)" className="animated-float-slow">
          {/* Shadow */}
          <ellipse cx="55" cy="68" rx="45" ry="9" fill="#000000" opacity="0.4" />
          
          {/* Bus body (White + Sky Blue stripes) */}
          <rect x="10" y="16" width="90" height="38" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="10" y="38" width="90" height="12" fill="#2563EB" />
          
          {/* Windows row */}
          <rect x="15" y="22" width="12" height="10" rx="1" fill="#0f172a" />
          <rect x="31" y="22" width="12" height="10" rx="1" fill="#0f172a" />
          <rect x="47" y="22" width="12" height="10" rx="1" fill="#0f172a" />
          <rect x="63" y="22" width="12" height="10" rx="1" fill="#0f172a" />
          <rect x="79" y="22" width="15" height="10" rx="1" fill="#0f172a" />

          {/* Wheels */}
          <circle cx="28" cy="58" r="6.5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <circle cx="82" cy="58" r="6.5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        </g>

        {/* VEHICLE 4: Heavy Fuel Tanker (Right Route) */}
        <g transform="translate(345, 335)" className="animated-float-medium">
          {/* Shadow */}
          <ellipse cx="50" cy="66" rx="40" ry="8" fill="#000000" opacity="0.4" />
          
          {/* Cylindrical metal tank (Grey + hazard indicators) */}
          <rect x="12" y="18" width="60" height="32" rx="12" fill="#64748b" stroke="#475569" strokeWidth="1" />
          {/* Hazard warning stripe */}
          <rect x="25" y="30" width="34" height="8" fill="#F97316" />
          
          {/* Cab */}
          <path d="M72 26 H88 L94 38 V48 H72 Z" fill="#ffffff" />
          <path d="M76 29 H85 L89 38 H76 Z" fill="#0f172a" />
          
          {/* Wheels */}
          <circle cx="24" cy="56" r="6.5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <circle cx="36" cy="56" r="6.5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <circle cx="82" cy="56" r="6.5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        </g>

        {/* ========================================================
            5. SATELLITE NODE & CLOUD SYNCHRONIZATION (Top Panel)
           ======================================================== */}
        {/* Satellite vector */}
        <g transform="translate(265, 30)" className="animated-float-medium">
          {/* Main dish */}
          <path d="M 15 35 Q 35 20 55 35 L 45 42 Q 35 32 25 42 Z" fill="#38bdf8" />
          <rect x="33" y="10" width="4" height="20" fill="#64748b" />
          {/* Solar wings */}
          <rect x="0" y="8" width="22" height="8" fill="#2563EB" rx="1" />
          <rect x="48" y="8" width="22" height="8" fill="#2563EB" rx="1" />
          
          {/* Transmitter source */}
          <circle cx="35" cy="42" r="3" fill="#F97316" />
          {/* Signal wave pulses */}
          <circle cx="35" cy="42" r="5" stroke="#38bdf8" strokeWidth="1" fill="none" className="signal-active" />
        </g>

        {/* Cloud Sync Icon (Top-Left area) */}
        <g transform="translate(100, 70)" className="animated-float-slow">
          {/* Base translucent cloud block */}
          <rect width="64" height="34" rx="12" fill="url(#holoRing)" stroke="#38bdf8" strokeWidth="1" />
          {/* Vector Cloud shapes */}
          <path d="M18 24 A6 6 0 0 1 24 18 A8 8 0 0 1 38 18 A6 6 0 0 1 44 24" fill="#38bdf8" opacity="0.3" />
          {/* Sync arrows */}
          <path d="M 28 22 A 4 4 0 0 1 34 22" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 36 26 A 4 4 0 0 1 30 26" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ========================================================
            6. HOLOGRAPHIC CHARTS & AUDIT SHIELD (Overlays)
           ======================================================== */}
        
        {/* Holographic Expense Card (Left overlay) */}
        <g transform="translate(55, 305)" className="animated-float-medium">
          {/* Card backdrop */}
          <rect width="70" height="45" rx="8" fill="url(#holoRing)" stroke="#38bdf8" strokeWidth="1" />
          {/* Mini bar graphs representing expense telemetry */}
          <rect x="12" y="25" width="8" height="12" fill="#f97316" rx="1" />
          <rect x="24" y="15" width="8" height="22" fill="#2563EB" rx="1" />
          <rect x="36" y="20" width="8" height="17" fill="#38bdf8" rx="1" />
          <rect x="48" y="10" width="8" height="27" fill="#f97316" rx="1" />
        </g>

        {/* Security Shield Node (Top center of the network) */}
        <g transform="translate(282, 110)" className="animated-float-slow">
          {/* Shield Badge */}
          <path d="M18 2 C18 2 10 5 10 10 V20 C10 25 18 30 18 30 C18 30 26 25 26 20 V10 C26 5 18 2 18 2 Z" fill="#2563EB" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Tick inside */}
          <path d="M15 15 L17 17 L21 13" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Fleet Manager screen layout card (Top Right overlay) */}
        <g transform="translate(445, 95)" className="animated-float-slow">
          <rect width="80" height="50" rx="8" fill="url(#holoRing)" stroke="#38bdf8" strokeWidth="1" />
          {/* Profile circle */}
          <circle cx="22" cy="25" r="10" fill="#2563EB" />
          <circle cx="22" cy="22" r="4" fill="#ffffff" />
          <path d="M16 31 C16 28 18 27 22 27 C26 27 28 28 28 31" stroke="#ffffff" strokeWidth="1" />
          
          {/* Telemetry charts list */}
          <line x1="38" y1="20" x2="70" y2="20" stroke="#f97316" strokeWidth="2.5" />
          <line x1="38" y1="28" x2="60" y2="28" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="38" y1="36" x2="65" y2="36" stroke="#94a3b8" strokeWidth="2" />
        </g>

        {/* ========================================================
            7. GPS GLOWING PINS & CONNECTED DRIVER BADGES
           ======================================================== */}
        
        {/* Driver Node 1 (Connected to Cargo Truck) */}
        <g transform="translate(230, 185)">
          <line x1="10" y1="10" x2="20" y2="45" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
          <circle cx="10" cy="10" r="12" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
          {/* Avatar details */}
          <circle cx="10" cy="8" r="3" fill="#ffffff" />
          <path d="M6 14 C6 11 8 11 10 11 C12 11 14 11 14 14" stroke="#ffffff" strokeWidth="1" />
        </g>

        {/* Driver Node 2 (Connected to Bus) */}
        <g transform="translate(435, 175)">
          <line x1="10" y1="10" x2="-10" y2="35" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
          <circle cx="10" cy="10" r="12" fill="#2563EB" stroke="#ffffff" strokeWidth="1" />
          {/* Avatar details */}
          <circle cx="10" cy="8" r="3" fill="#ffffff" />
          <path d="M6 14 C6 11 8 11 10 11 C12 11 14 11 14 14" stroke="#ffffff" strokeWidth="1" />
        </g>

        {/* Glowing GPS Pins */}
        {/* Location Pin 1 (Warehouse) */}
        <g transform="translate(135, 150)" className="glow-active">
          <path d="M6 0 C2.68 0 0 2.68 0 6 C0 10.5 6 16.8 6 16.8 C6 16.8 12 10.5 12 6 C12 2.68 9.32 0 6 0 Z" fill="#F97316" />
          <circle cx="6" cy="6" r="2.5" fill="#ffffff" />
        </g>

        {/* Location Pin 2 (Garage) */}
        <g transform="translate(145, 395)" className="glow-active">
          <path d="M6 0 C2.68 0 0 2.68 0 6 C0 10.5 6 16.8 6 16.8 C6 16.8 12 10.5 12 6 C12 2.68 9.32 0 6 0 Z" fill="#2563EB" />
          <circle cx="6" cy="6" r="2.5" fill="#ffffff" />
        </g>

        {/* Location Pin 3 (Fuel) */}
        <g transform="translate(415, 395)" className="glow-active">
          <path d="M6 0 C2.68 0 0 2.68 0 6 C0 10.5 6 16.8 6 16.8 C6 16.8 12 10.5 12 6 C12 2.68 9.32 0 6 0 Z" fill="#F97316" />
          <circle cx="6" cy="6" r="2.5" fill="#ffffff" />
        </g>

      </svg>
    </div>
  );
}
