/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  safelist: [
    'bg-primary-50','bg-primary-100','bg-primary-600','bg-primary-700','bg-primary-800','bg-primary-900',
    'text-primary-400','text-primary-500','text-primary-600','text-primary-700',
    'bg-gold-50','bg-gold-100','bg-gold-500','bg-gold-600',
    'text-gold-400','text-gold-500','text-gold-600','text-gold-700',
    'bg-green-50','bg-green-100','text-green-600',
    'bg-purple-50','text-purple-600',
    'border-primary-200','border-primary-400','border-primary-500',
    'shadow-primary-600/20','shadow-primary-600/30','shadow-gold-500/20','shadow-gold-500/30',
  ],
  theme: {
    extend: {
      screens: {
        'custom': '750px',
      },

      colors: {
        // Legacy colors (used by admin/coordinator/register pages)
        primary: {
          50:  '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#1d4ed8', 700: '#1e40af',
          800: '#1e3a8a', 900: '#1e3270',
        },
        gold: {
          50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047',
          400: '#facc15', 500: '#DAA737', 600: '#ca8a04', 700: '#a16207',
        },
        // SPL Brand Colors
        'royal':   '#002366',   // Royal Blue — primary brand
        'royal-dark':  '#001a4d',
        'royal-mid':   '#002d80',
        'royal-light': '#0033a0',
        'gold':    '#ffd700',   // Gold — primary accent
        'gold-dim':    '#e9c349',
        'gold-muted':  '#c9a227',
        // SPL Dark Surface tokens
        'surface-container-high':    '#131318',
        'surface-container-highest': '#1c1c21',
        'surface-container-low':     '#0b0b0f',
        'surface-container':         '#131318',
        'surface-dim':               '#0b0b0f',
        'surface-variant':           '#444650',
        'surface':                   '#0b0b0f',
        'on-surface':                '#e4e1e9',
        'on-surface-variant':        '#c4c6d0',
        'outline-variant':           '#444650',
        'background':                '#0b0b0f',
        'on-background':             '#e4e1e9',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body:     ['Manrope', 'sans-serif'],
        label:    ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        full:    '0.75rem',
      },
    },
  },
  plugins: [],
}
