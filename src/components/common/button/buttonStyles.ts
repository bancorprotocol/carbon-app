import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/common/variants';
import { cva } from 'class-variance-authority';

type ButtonVariants = VariantColor & VariantSize & VariantFullWidth;

export const buttonStyles = cva<ButtonVariants>(
  [
    'font-weight-500',
    'rounded-full px-30',
    'transition duration-300 ease-in-out',
    'disabled:cursor-not-allowed',
    'disabled:opacity-40',
    'flex justify-center items-center',
  ],
  {
    variants: {
      variant: {
        black: [
          'bg-black border-2 border-black !text-white',
          'hover:border-grey3 hover:disabled:black',
        ],
        white: [
          'bg-white border-2 border-white !text-black',
          'hover:border-grey4 hover:disabled:border-white',
        ],
        secondary: [
          'bg-emphasis border-2 border-emphasis !text-white',
          'hover:border-grey3 hover:disabled:border-emphasis',
        ],
        success: [
          'bg-green border-2 border-green !text-black',
          'hover:border-lightGreen hover:disabled:border-green',
        ],
        'success-light': [
          'bg-green/20 border-2 border-green/0 !text-green',
          'hover:border-lightGreen hover:!text-black hover:bg-green hover:disabled:border-green',
        ],
        error: [
          'bg-red border-2 border-red !text-black',
          'hover:border-redLight hover:disabled:border-red',
        ],
        'error-light': [
          'bg-red/25 !text-red',
          'hover:bg-red/50 hover:!text-white',
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
      variant: 'white',
      size: 'md',
    },
  }
);
