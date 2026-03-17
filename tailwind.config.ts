import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        ds: {
          bg:           '#09090B',
          surface:      '#131316',
          border:       '#27272A',
          text:         '#FAFAFA',
          muted:        '#A1A1AA',
          brand:        '#6366F1',
          'brand-light':'#818CF8',
          'brand-dark': '#4338CA',
          success:      '#22C55E',
          error:        '#EF4444',
          warning:      '#F59E0B',
        },
        orange: { brand: '#F47820' },
        green:  { brand: '#22C55E' },
        red:    { brand: '#EF4444' },
      },
      minHeight: {
        '13': '52px',
        '12': '48px',
      },
    },
  },
  plugins: [],
}

export default config
