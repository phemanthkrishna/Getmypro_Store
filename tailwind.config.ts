import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        blue: {
          brand: '#1A5FB8',
        },
        orange: {
          brand: '#F47820',
        },
        green: {
          brand: '#10B981',
        },
        red: {
          brand: '#EF4444',
        },
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
