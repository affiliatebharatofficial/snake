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
        game: {
          bg: '#0b0f19',
          card: '#131b2e',
          cardHover: '#1a243e',
          board: '#0f172a',
          accent: '#6366f1',
          gold: '#f59e0b',
          snake: '#ef4444',
          ladder: '#10b981',
          p1: '#ef4444', // Red
          p2: '#3b82f6', // Blue
          p3: '#10b981', // Green
          p4: '#f59e0b', // Yellow / Amber
        }
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dice-spin': 'diceSpin 0.6s ease-out',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-4%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.6))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.2))' },
        },
        diceSpin: {
          '0%': { transform: 'rotate(0deg) scale(0.8)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      boxShadow: {
        'neon-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.5)',
        'neon-gold': '0 0 20px -5px rgba(245, 158, 11, 0.5)',
        'neon-green': '0 0 20px -5px rgba(16, 185, 129, 0.5)',
        'neon-red': '0 0 20px -5px rgba(239, 68, 68, 0.5)',
        'inner-glow': 'inset 0 0 15px 0 rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
