import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {

        ink: {
          DEFAULT: '#0A0A0B', 
          50: '#16161A',
          100: '#131316',     
          200: '#1F1F23',     
        },
        cream: {
          DEFAULT: '#F2EFEA', 
          muted: '#B5B2AC',   
          dim: '#6E6B66',     
        },
        stone: {
          DEFAULT: '#7A766F', 
          dark: '#4A4742',
        },
        ember: {
          DEFAULT: '#D93A1F', 
          dim: '#A02D17',     
        },
      },
      fontFamily: {

        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
