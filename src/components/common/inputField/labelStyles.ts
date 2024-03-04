import { VariantColor } from 'components/common/variants';
import { cva } from 'class-variance-authority';

type LabelVariants = VariantColor;

export const labelStyles = cva<LabelVariants>([], {
  variants: {
    variant: {
      black: ['bg-primary-500', 'hover:bg-primary-600'],
      secondary: ['bg-black', 'bg-white text-background-900'],
      white: ['bg-background-800 text-white'],
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
