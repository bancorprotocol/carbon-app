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
          'hover:border-neutral-700 hover:disabled:black',
        ],
        white: [
          'bg-white border-2 border-white !text-black',
          'hover:border-neutral-400 hover:disabled:border-white',
        ],
        secondary: [
          'bg-neutral-800 border-2 border-neutral-800 !text-white',
          'hover:border-neutral-700 hover:disabled:border-neutral-800',
        ],
        success: [
          'bg-primary border-2 border-primary !text-black',
          'hover:border-primary-light hover:disabled:border-primary',
        ],
        'success-light': [
          'bg-primary/20 border-2 border-primary/0 !text-primary',
          'hover:border-primary-light hover:!text-black hover:bg-primary hover:disabled:border-primary',
        ],
        error: [
          'bg-error border-2 border-error !text-black',
          'hover:border-errorLight hover:disabled:border-error',
        ],
        'error-light': [
          'bg-error/25 !text-error',
          'hover:bg-error/50 hover:!text-white',
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
