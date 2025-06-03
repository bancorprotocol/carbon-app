import { extendTailwindMerge } from 'tailwind-merge';

type AdditionalClassGroupIDs =
  | 'fontWeights'
  | 'textColors'
  | 'bgColors'
  | 'borderColors'
  | 'outlineColors'
  | 'animation'
  | 'transformBox';

const colors = [
  'white',
  'transparent',
  'primary',
  'error',
  'sell',
  'buy',
  'success',
  'warning',
  'black',
  'primaryGradient-first',
  'primaryGradient-middle',
  'primaryGradient-last',
  'background-50',
  'background-100',
  'background-200',
  'background-300',
  'background-400',
  'background-500',
  'background-600',
  'background-700',
  'background-800',
  'background-900',
];

const createConfigValues = (start: number, end: number, step: number) =>
  Array.from({ length: Math.ceil((end - start) / step) + 1 }, (_, i) =>
    (start + i * step).toString(),
  );

export const customTwMerge = extendTailwindMerge<AdditionalClassGroupIDs>({
  override: {},
  extend: {
    theme: {},
    classGroups: {
      fontWeights: [
        {
          font: [
            'weight-100',
            'weight-200',
            'weight-300',
            'weight-400',
            'weight-500',
            'weight-600',
            'weight-700',
            'weight-800',
            'weight-900',
          ],
        },
      ],
      textColors: [
        {
          text: colors,
        },
      ],
      bgColors: [
        {
          bg: colors,
        },
      ],
      borderColors: [
        {
          border: colors,
        },
      ],
      outlineColors: [
        {
          outline: colors,
        },
      ],
      transformBox: [
        {
          transformBox: ['content', 'border', 'fill', 'stroke', 'view'],
        },
      ],
      animation: [
        {
          animate: [
            'none',
            'spin',
            'ping',
            'pulse',
            'bounce',
            'fade',
            'slideUp',
            'scaleUp',
          ],
        },
      ],
      rounded: [
        {
          rounded: ['full', 'DEFAULT', ...createConfigValues(0, 50, 2)],
        },
      ],
    },
    conflictingClassGroups: {
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      p: ['pt', 'pb', 'pr', 'pl'],
      size: ['h', 'w'],
    },

    conflictingClassGroupModifiers: {},
  },
});
