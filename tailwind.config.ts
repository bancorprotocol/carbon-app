import type { Config } from 'tailwindcss';
import { formatRgb } from 'culori';

function createTwConfigValues(start: number, end: number, step: number) {
  const remBase = 16;
  const obj = {};
  for (let i = start; i <= end; i = i + step) {
    obj[i] = `${i / remBase}rem`;
  }
  return obj;
}

const oklch = (l: number, c: number, h: number) => {
  const result = formatRgb(`oklch(${l} ${c} ${h} / 0)`);
  return result.replace(', 0)', ', <alpha-value>)');
};
const lighten = (l: number, amount: number) => Math.min(l + amount, 1);
const darken = (l: number, amount: number) => Math.max(l - amount, 0);

const lightDark = (l: number, c: number, h: number) => ({
  light: oklch(lighten(l, 0.2), c, h),
  DEFAULT: oklch(l, c, h),
  dark: oklch(darken(l, 0.5), c, h),
});

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      aria: {
        'current-page': 'current="page"',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    // colors: ({ colors }) => {
    //   // Background color variables
    //   const hue = 0;
    //   const chroma = 0; // Recommended 0.01, 0.02
    //   return {
    //     white: colors.white,
    //     transparent: colors.transparent,
    //     primaryGradient: {
    //       first: lightDark(0.7985, 0.132, 159.5), // #67D79F
    //       middle: lightDark(0.7292, 0.127, 214.3), // #10BBD8
    //       last: lightDark(0.7617, 0.119, 184.67), // #3DCABB
    //     },
    //   };
    // },
    // spacing: createTwConfigValues(0, 100, 1),
    animation: {
      // none: 'none',
      // spin: 'spin 1s linear infinite',
      // ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      // pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      // bounce: 'bounce 1s infinite',
      fade: 'fade var(--duration, 200ms) var(--delay, 0s)',
      slideUp:
        'fade var(--duration, 400ms) var(--delay, 0s) var(--easing, cubic-bezier(0.16, 1, 0.3, 1)) both, translateY var(--duration, 400ms) var(--delay, 0s) var(--easing, cubic-bezier(0.16, 1, 0.3, 1)) both',
      scaleUp:
        'fade var(--duration, 400ms) var(--delay, 0s) var(--easing, cubic-bezier(0.16, 1, 0.3, 1)) both, scale var(--duration, 400ms) var(--delay, 0s) var(--easing, cubic-bezier(0.16, 1, 0.3, 1)) both',
    },
    // borderColor: ({ theme }) => ({
    //   ...theme('colors'),
    //   DEFAULT: theme('colors.gray.200', 'currentColor'),
    // }),
    // borderRadius: {
    //   ...createTwConfigValues(0, 50, 2),
    //   DEFAULT: '16px',
    //   full: '9999px',
    // },
    // fontFamily: {
    //   text: ['Carbon-Text', 'system-ui', 'sans-serif'],
    //   title: ['Carbon-Title', 'system-ui', 'sans-serif'],
    // },
    // fontSize: {
    //   10: ['0.625rem', { lineHeight: '0.875rem' }],
    //   12: ['0.75rem', { lineHeight: '1rem' }],
    //   14: ['0.875rem', { lineHeight: '1.25rem' }],
    //   16: ['1rem', { lineHeight: '1.5rem' }],
    //   18: ['1.125rem', { lineHeight: '1.75rem' }],
    //   20: ['1.25rem', { lineHeight: '1.75rem' }],
    //   24: ['1.5rem', { lineHeight: '2rem' }],
    //   30: ['1.875rem', { lineHeight: '2.25rem' }],
    //   36: ['2.25rem', { lineHeight: '2.5rem' }],
    // },
    // fontWeight: {
    //   'weight-100': '100',
    //   'weight-200': '200',
    //   'weight-300': '300',
    //   'weight-400': '400',
    //   'weight-500': '500',
    //   'weight-600': '600',
    //   'weight-700': '700',
    //   'weight-800': '800',
    //   'weight-900': '900',
    // },
    keyframes: {
      spin: {
        to: {
          transform: 'rotate(360deg)',
        },
      },
      ping: {
        '75%, 100%': {
          transform: 'scale(2)',
          opacity: '0',
        },
      },
      pulse: {
        '50%': {
          opacity: '.5',
        },
      },
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
        },
        '50%': {
          transform: 'none',
          animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
        },
      },
      fade: {
        from: {
          opacity: '0',
        },
      },
      translateY: {
        from: {
          transform: 'translateY(20px)',
        },
      },
      scale: {
        from: {
          transform: 'scale(var(--from-scale, 0.8))',
        },
      },
    },
  },
} as Config;
