import { VariantColor } from 'components/common/variants';
import { cva } from 'class-variance-authority';

type LabelVariants = VariantColor;

export const labelStyles = cva<LabelVariants>([], {
  variants: {
    variant: {
      black: ['bg-primary', 'hover:bg-primary/25'],
      secondary: ['bg-black', 'dark:bg-white dark:text-neutral-800'],
      white: [
        'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-white',
      ],
      success: ['bg-success', 'hover:bg-success/25'],
      'success-light': ['bg-success', 'hover:bg-success/25'],
      error: ['bg-error', 'hover:bg-error'],
      'error-light': ['bg-error/25', 'hover:bg-error/25'],
    },
  },
  defaultVariants: {
    variant: 'black',
  },
});
