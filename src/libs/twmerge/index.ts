import { extendTailwindMerge } from 'tailwind-merge';

type AdditionalClassGroupIDs =
  | 'textColors'
  | 'bgColors'
  | 'borderColors'
  | 'outlineColors'
  | 'rounded';

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
  'secondary',
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

export const customTwMerge = extendTailwindMerge<AdditionalClassGroupIDs>({
  // ↓ Override elements from the default config
  //   It has the same shape as the `extend` object, so we're going to skip it here.
  override: {},
  // ↓ Extend values from the default config
  extend: {
    // ↓ Add values to existing theme scale or create a new one
    theme: {
      spacing: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    // ↓ Add values to existing class groups or define new ones
    classGroups: {
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
      rounded: [
        {
          rounded: [
            'full',
            'DEFAULT',
            '0',
            '2',
            '4',
            '6',
            '8',
            '10',
            '12',
            '14',
            '16',
            '18',
            '20',
            '22',
            '24',
            '26',
            '28',
            '30',
            '32',
            '34',
            '36',
            '38',
            '40',
            '42',
            '44',
            '46',
            '48',
            '50',
          ],
        },
      ],
    },
    // ↓ Here you can define additional conflicts across class groups
    conflictingClassGroups: {
      px: ['pr', 'pl'],
      size: ['h', 'w'],
    },
    // ↓ Define conflicts between postfix modifiers and class groups
    conflictingClassGroupModifiers: {},
  },
});
