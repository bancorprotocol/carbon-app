import { VariantColor } from 'components/common/variants';
import { cva } from 'class-variance-authority';

type LabelVariants = VariantColor;

export const labelStyles = cva<LabelVariants>([], {
  variants: {
    variant: {
      black: ['bg-primary-500', 'hover:bg-primary-600'],
      secondary: ['bg-black', 'dark:bg-white dark:text-charcoal'],
      white: ['bg-lightGrey text-charcoal dark:bg-darkGrey dark:text-white'],
      success: ['bg-green', 'hover:bg-success-600'],
      'success-light': ['bg-green', 'hover:bg-success-600'],
      error: ['bg-red', 'hover:bg-error-600'],
      'error-light': ['bg-red/25', 'hover:bg-error-600/25'],
    },
  },
  defaultVariants: {
    variant: 'black',
  },
});
