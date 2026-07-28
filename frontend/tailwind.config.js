/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Clean, minimal light system
        ink: '#f6f7f5',        // page background (single source of truth)
        panel: '#ffffff',      // card / surface
        panel2: '#f3f4f1',     // subtle elevated surface / hover fill
        line: '#e7e8e3',       // hairline borders
        wood: {
          board: '#6b4423',    // carved board tone (also referenced in 3D scene)
          rim: '#835530',      // pit rim
          brass: '#b45309',    // primary accent — warm bronze/amber
          brassSoft: '#fef3e2',// soft accent tint (backgrounds)
          brassHover: '#92400e',
          deep: '#78350f',
        },
        jade: '#0d9488',       // Player 1 marker
        gold: '#d97706',       // Player 2 marker
        clay: '#e11d48',       // danger / disallowed
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,23,42,0.04), 0 14px 34px -18px rgba(15,23,42,0.16)',
        glow: '0 8px 22px -10px rgba(180,83,9,0.5)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
