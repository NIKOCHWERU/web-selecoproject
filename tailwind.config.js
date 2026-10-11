/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shadcn UI tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },

        // Theme color mappings:
        primary: {
          DEFAULT: '#0f2034',
          foreground: '#ffffff',
          navy: '#0f2034',
          dark: '#0a1624',
          light: '#162e4a',
          surface: '#12263f',
        },
        accent: {
          DEFAULT: '#b88917',
          foreground: '#0f2034',
          orange: '#b88917',
          light: '#d4a024',
          hover: '#a07612',
          soft: 'rgba(184, 137, 23, 0.12)',
        },
        secondary: {
          DEFAULT: '#ffffff',
          foreground: '#0f2034',
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
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
