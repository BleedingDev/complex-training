const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Modern Dark Theme Palette
        bg: '#020617',       // slate-950
        surface: '#0f172a',  // slate-900
        panel: '#1e293b',    // slate-800
        border: '#334155',   // slate-700
        text: '#f8fafc',     // slate-50
        muted: '#94a3b8',    // slate-400
        
        // Brand Colors (Violet/Indigo vibe)
        accent: '#6366f1',   // indigo-500
        accent2: '#a855f7',  // purple-500
        
        primary: colors.indigo,
        
        danger: '#ef4444',
        success: '#22c55e',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
