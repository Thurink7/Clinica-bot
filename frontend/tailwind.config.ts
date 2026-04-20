import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        clinic: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          800: '#1e3a5f',
        },
      },
    },
  },
  plugins: [],
};

export default config;
