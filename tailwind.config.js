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
        // Theme color mappings:
        // navy #0f2034 -> primary
        // orange #b88917 -> accent
        // white #ffffff -> secondary
        primary: {
          DEFAULT: '#0f2034',
          navy: '#0f2034',
          dark: '#0a1624',
          light: '#162e4a',
          surface: '#12263f',
        },
        accent: {
          DEFAULT: '#b88917',
          orange: '#b88917',
          light: '#d4a024',
          hover: '#a07612',
          soft: 'rgba(184, 137, 23, 0.12)',
        },
        secondary: {
          DEFAULT: '#ffffff',
          white: '#ffffff',
        },
        orange: {
          DEFAULT: '#b88917',
          accent: '#b88917',
          light: '#d4a024',
          soft: 'rgba(184, 137, 23, 0.12)',
        },
        navy: {
          DEFAULT: '#0f2034',
          deep: '#0f2034',
          royal: '#132840',
          dark: '#0a1624',
          surface: '#152b45',
        },
        gold: {
          accent: '#b88917',
          bright: '#d4a024',
          soft: 'rgba(184, 137, 23, 0.12)',
        },
        offwhite: '#ffffff',
        corporate: 'rgba(15, 32, 52, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 4px 20px -2px rgba(15, 32, 52, 0.05)',
        gold: '0 0 25px -5px rgba(184, 137, 23, 0.25)',
        accent: '0 0 25px -5px rgba(184, 137, 23, 0.25)',
        primary: '0 4px 20px -2px rgba(15, 32, 52, 0.15)',
      },
    },
  },
  plugins: [],
};
