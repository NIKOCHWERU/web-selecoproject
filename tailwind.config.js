/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#071426',
          royal: '#0B1F3A',
          dark: '#030B17',
          surface: '#0E223D',
        },
        gold: {
          accent: '#C9A227',
          bright: '#D4AF37',
          soft: 'rgba(201,162,39,0.12)',
        },
        offwhite: '#F8F7F2',
        corporate: 'rgba(7,20,38,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 4px 20px -2px rgba(7,20,38,0.05)',
        gold: '0 0 25px -5px rgba(201,162,39,0.25)',
      },
    },
  },
  plugins: [],
};
