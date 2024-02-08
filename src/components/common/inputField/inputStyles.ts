import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/common/variants';
import { cva } from 'class-variance-authority';

type InputVariants = VariantColor & VariantSize & VariantFullWidth;

export const inputStyles = cva<InputVariants>(
  [
    'bg-body',
    'dark:text-white',
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
        secondary: ['bg-black', 'dark:bg-white dark:text-neutral-900'],
        white: [
          'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white',
        ],
        success: [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-green',
          'focus:!outline-green',
        ],
        'success-light': [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-green',
          'focus:!outline-green',
        ],
        error: [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-red',
          'focus:outline-red',
        ],
        'error-light': [
          'outline',
          'outline-offset-2',
          'outline-2',
          'outline-red',
          'focus:outline-red',
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
  }
);
