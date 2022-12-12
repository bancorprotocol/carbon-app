import { VariantColor } from 'components/variants';
import { cva } from 'class-variance-authority';

type LabelVariants = VariantColor;

export const labelStyles = cva<LabelVariants>([], {
  variants: {
    variant: {
      primary: ['bg-primary-500', 'hover:bg-primary-600'],
      secondary: ['bg-black', 'dark:bg-white dark:text-charcoal'],
      tertiary: ['bg-lightGrey text-charcoal dark:bg-darkGrey dark:text-white'],
      success: ['bg-success-500', 'hover:bg-success-600'],
      error: ['bg-error-500', 'hover:bg-error-600'],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
