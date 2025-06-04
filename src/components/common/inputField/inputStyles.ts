import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/common/variants';
import { cva } from 'class-variance-authority';

type InputVariants = VariantColor & VariantSize & VariantFullWidth;

export const inputStyles = cva<InputVariants>(
  [
    'bg-black',
    'text-white',
    'rounded-full',
    'px-30',
    'outline-none',
    'focus:outline',
    'focus:outline-offset-2',
    'focus:outline-2',
    'focus:outline-primary-500',
  ],
  {
    variants: {
      variant: {
        black: ['bg-primary-500', 'hover:bg-primary-600'],
        secondary: ['bg-black', 'bg-white text-background-900'],
        white: ['bg-background-800 text-white'],
        success: [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-primary',
          'focus:outline-primary',
        ],
        buy: [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-buy',
          'focus:outline-buy',
        ],
        sell: [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-sell',
          'focus:outline-sell',
        ],
        error: [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-error',
          'focus:outline-error',
        ],
      },
      size: {
        sm: ['text-12', 'h-30'],
        md: ['text-14', 'h-40'],
        lg: ['text-16', 'h-50'],
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
