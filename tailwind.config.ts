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
        display: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Sora', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Sora', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        // step 0 — was 18; bumped to 20 for on-screen testing
        // Body/base/sm 20 -> 19 for Sora (x-height 0.534 vs Jost 0.46, ~17% wider); nav stays 20.
        body: ['1.1875rem', { lineHeight: '1.65' }], // 19 (was 20)
        nav: ['1.25rem', { lineHeight: '1.4' }], // 20
        // Tailwind defaults remapped so leftover text-base/text-sm don't sit at 16/14 on the live UI
        base: ['1.1875rem', { lineHeight: '1.65' }], // 19 (Tailwind default 16)
        sm: ['1.1875rem', { lineHeight: '1.5' }], // 19 for UI leftovers (meta stays separate)
        // step ~1
        'ui-lg': ['1.375rem', { lineHeight: '1.45' }], // 22
        // step 2
        // Display sizes scaled ~0.82x for Fraunces (cap height 0.70 vs Darker Grotesque 0.56),
        // tracking relaxed and leading opened slightly for the taller serif.
        title: ['1.5rem', { lineHeight: '1.25', letterSpacing: '0' }], // 24 (was 28)
        // step 3
        section: [
          'clamp(1.625rem, 3vw, 1.875rem)',
          { lineHeight: '1.2', letterSpacing: '-0.01em' },
        ], // ~26-30 (was ~32-36)
        // step 4–5
        'section-lg': [
          'clamp(1.875rem, 3.75vw, 2.25rem)',
          { lineHeight: '1.15', letterSpacing: '-0.01em' },
        ], // ~30-36 (was ~36-44)
        // step 6
        display: [
          'clamp(2.25rem, 5.75vw, 3.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.01em' },
        ], // ~36-56 (was ~44-68)
        'display-sm': [
          'clamp(1.75rem, 3.25vw, 2.25rem)',
          { lineHeight: '1.15', letterSpacing: '-0.01em' },
        ], // ~28-36 (was ~32-44)
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
