/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          dark: '#1A0F0A',
          board: '#2E180D',
          pit: '#190B05',
          rim: '#5C3317',
          accent: '#A0522D',
          gold: '#D4AF37',
          light: '#DEB887',
        },
        ota: {
          DEFAULT: '#10B981', // Winner green
          light: '#34D399',
        },
        ope: {
          DEFAULT: '#EF4444', // Red
          light: '#F87171',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'wood-pattern': "radial-gradient(circle at 50% 50%, #3D1E0E 0%, #1E0D05 100%)",
        'pit-gradient': "radial-gradient(circle at 50% 50%, #0F0603 0%, #2A140A 100%)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.6s ease-in-out 1',
      }
    },
  },
  plugins: [],
};
