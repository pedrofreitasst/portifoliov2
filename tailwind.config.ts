import type { Config } from 'tailwindcss';

/**
 * Type scale — base 18px, ratio 1.25 (major third)
 * 18 → 22.5 → 28 → 35 → 44 → 55 → 69
 * Hero display tops out near step 6 (~69px), matching the ~67 you saw.
 */
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
        page: {
          white: '#FFFFFF',
          black: '#000000',
        },
        accent: {
          DEFAULT: '#F5A623',
          deep: '#B76203',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Darker Grotesque', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Jost', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Jost', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // step 0 — was 18; bumped to 20 for on-screen testing
        body: ['1.25rem', { lineHeight: '1.65' }], // 20
        nav: ['1.25rem', { lineHeight: '1.4' }], // 20
        // Tailwind defaults remapped so leftover text-base/text-sm don't sit at 16/14 on the live UI
        base: ['1.25rem', { lineHeight: '1.65' }], // 20 (was 16)
        sm: ['1.25rem', { lineHeight: '1.5' }], // 20 for UI leftovers (meta stays separate)
        // step ~1
        'ui-lg': ['1.375rem', { lineHeight: '1.45' }], // 22
        // step 2
        title: ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 28
        // step 3
        section: [
          'clamp(2rem, 3.5vw, 2.25rem)',
          { lineHeight: '1.15', letterSpacing: '-0.015em' },
        ], // ~32–36
        // step 4–5
        'section-lg': [
          'clamp(2.25rem, 4.5vw, 2.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ], // ~36–44
        // step 6
        display: [
          'clamp(2.75rem, 7vw, 4.25rem)',
          { lineHeight: '1.05', letterSpacing: '-0.02em' },
        ], // ~44–68
        'display-sm': [
          'clamp(2rem, 4vw, 2.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.015em' },
        ],
        // meta only (copyright) — one step below body
        meta: ['0.875rem', { lineHeight: '1.5' }], // 14
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
