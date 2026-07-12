/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#05070f',       // Deep rich dark space background
          card: '#0d111d',     // Sleek card background
          border: '#1f293d',   // Border highlight
          text: '#f3f4f6',     // Light grey text
          muted: '#9ca3af',    // Muted grey text
        },
        brand: {
          violet: '#8b5cf6',   // Neon violet
          violetHover: '#7c3aed',
          cyan: '#06b6d4',     // Electric cyan
          cyanHover: '#0891b2',
          emerald: '#10b981',  // Emerald success
          rose: '#f43f5e',     // Rose warning/error
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-violet': '0 0 15px rgba(139, 92, 246, 0.25)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.25)',
      },
      backgroundImage: {
        'gradient-dark': 'radial-gradient(ellipse at top, #0f172a, #05070f)',
        'gradient-button': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
      }
    },
  },
  plugins: [],
}
