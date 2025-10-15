import { VariantColor } from 'components/common/variants';
import { cva } from 'class-variance-authority';

type LabelVariants = VariantColor;

export const labelStyles = cva<LabelVariants>([], {
  variants: {
    variant: {
      black: ['bg-primary', 'hover:bg-primary/25'],
      secondary: ['bg-black', 'bg-white text-main-800'],
      white: ['bg-main-800 text-white'],
      success: ['bg-success', 'hover:bg-success/25'],
      buy: ['bg-buy', 'hover:bg-buy/25'],
      sell: ['bg-sell', 'hover:bg-sell/25'],
      error: ['bg-error', 'hover:bg-error'],
    },
  },
  defaultVariants: {
    variant: 'black',
  },
});
