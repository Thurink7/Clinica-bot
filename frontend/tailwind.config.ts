import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',
          secondary: '#1E40AF',
          light: '#DBEAFE',
          muted: '#F3F4F6',
        },
        clinic: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          800: '#1e40af',
        },
      },
    },
  },
  plugins: [],
};

export default config;
