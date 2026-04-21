import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './stories/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        'aios-primary': {
          DEFAULT: '#A78BFA',
          hsl: 'hsl(var(--aios-primary))',
        },
        'aios-secondary': {
          DEFAULT: '#7C3AED',
          hsl: 'hsl(var(--aios-secondary))',
        },
        'aios-accent': {
          DEFAULT: '#C9B298',
          hsl: 'hsl(var(--aios-accent))',
        },
        'aios-bg': 'hsl(var(--aios-bg))',
        'aios-card-bg': 'hsl(var(--aios-card-bg))',
        'aios-border': 'hsl(var(--aios-border))',
        'aios-text-primary': 'hsl(var(--aios-text-primary))',
        'aios-text-secondary': 'hsl(var(--aios-text-secondary))',
        'aios-text-muted': 'hsl(var(--aios-text-muted))',
        'aios-success': 'hsl(var(--aios-success))',
        'aios-warning': 'hsl(var(--aios-warning))',
        'aios-error': 'hsl(var(--aios-error))',
        'aios-info': 'hsl(var(--aios-info))',
      },
      borderRadius: {
        none: '0',
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.375rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        full: '9999px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
