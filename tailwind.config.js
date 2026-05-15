/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',           // noir profond
        parchment: '#e8e6e1',     // gris parchemin
        error: {
          DEFAULT: '#ff2e2e',     // accent rouge HTTP 500
          50: '#ffe5e5',
          900: '#5a0000',
        },
        terminal: '#00ff88',      // vert terminal
        bone: '#1a1a1a',
        ash: '#2a2a2a',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
