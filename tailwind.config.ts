import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // OnFrontiers Brand Colors
        // Primary - Teal
        primary: {
          DEFAULT: '#005755',
          light: '#28BEAF',
          dark: '#003c3d',
          50: '#ecfffd',
          100: '#d0fefa',
          200: '#a7faf6',
          300: '#6bf3ef',
          400: '#28e3df',
          500: '#28BEAF',
          600: '#0ba296',
          700: '#0e817a',
          800: '#116662',
          900: '#005755',
          950: '#003c3d',
        },
        // Secondary - Blue
        secondary: {
          DEFAULT: '#2389C1',
          light: '#2DA1E2',
          dark: '#1E6D9A',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#2DA1E2',
          500: '#2389C1',
          600: '#1E6D9A',
          700: '#1a5a80',
          800: '#1b4a69',
          900: '#1c3f58',
          950: '#13293b',
        },
        // Semantic colors
        error: {
          DEFAULT: '#E94F74',
          light: '#f5899f',
          dark: '#c4284c',
        },
        warning: {
          DEFAULT: '#ED6C02',
          light: '#ff9800',
          dark: '#c55a00',
        },
        success: {
          DEFAULT: '#1DC068',
          light: '#4cdc8e',
          dark: '#169952',
        },
        // Gray scale
        gray: {
          50: '#f6f7f7',
          100: '#e9ebea',
          200: '#d5d8d7',
          300: '#b5bab8',
          400: '#8f9693',
          500: '#727a77',
          600: '#5c6361',
          700: '#4c5150',
          800: '#404443',
          900: '#383b3a',
          950: '#161d1c',
        },
        // shadcn/ui theme tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        heading: ['var(--font-campton)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.25' }],
        'heading-md': ['1.5rem', { lineHeight: '1.3' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'elevated-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'inner-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
