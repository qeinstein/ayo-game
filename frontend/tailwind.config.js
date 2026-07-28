/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: '#0B0B0C',        // Deep matte charcoal
          panel: '#141416',     // Clean panel background
          elevated: '#1A1A1E',  // Subtle elevated card
          border: '#27272A',    // Muted border
        },
        wood: {
          dark: '#140E0A',
          board: '#231812',
          pit: '#0D0805',
          rim: '#3D2A20',
          accent: '#8C6F56',    // Muted warm cedar
          brass: '#C5A880',     // Subtle champagne gold
          muted: '#6B5B52',
        },
        accent: {
          primary: '#C5A880',   // Subtle warm brass
          success: '#10B981',   // Soft emerald
          danger: '#F43F5E',    // Soft rose
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'pit-inset': 'inset 0 10px 20px rgba(0, 0, 0, 0.95), inset 0 -2px 4px rgba(255, 255, 255, 0.04)',
        'board-3d': '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(197, 168, 128, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.08)',
        'seed-3d': '2px 5px 8px rgba(0, 0, 0, 0.85), inset -1px -2px 3px rgba(0, 0, 0, 0.6), inset 1px 1px 2px rgba(255, 255, 255, 0.9)',
      }
    },
  },
  plugins: [],
};
