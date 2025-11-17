const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1120',
        surface: '#0f172a',
        panel: '#111827',
        border: '#1f2937',
        text: '#e5e7eb',
        muted: '#9ca3af',
        accent: '#f59e0b',
        accent2: '#14b8a6',
        danger: '#f87171',
        success: '#22c55e',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0,0,0,0.45)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
};
