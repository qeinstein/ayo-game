/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Single, coherent warm-charcoal system
        ink: '#0c0a08',        // page background (single source of truth)
        panel: '#16130f',      // card / surface
        panel2: '#1e1914',     // elevated surface / hover
        line: '#292420',       // hairline borders
        wood: {
          board: '#3a281b',    // carved board tone (also referenced in 3D scene)
          rim: '#4c3626',      // pit rim
          brass: '#caa96b',    // primary accent — champagne brass
          brassSoft: '#e7cd97',
          deep: '#8a6f43',
        },
        jade: '#34d399',       // Player 1 marker
        gold: '#f5c563',       // Player 2 marker
        clay: '#fb7185',       // danger / disallowed
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.9)',
        glow: '0 0 0 1px rgba(202,169,107,0.25), 0 12px 30px -12px rgba(202,169,107,0.25)',
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
