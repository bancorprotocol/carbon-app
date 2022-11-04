import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/variants';
import { cva } from 'class-variance-authority';

type ButtonVariants = VariantColor & VariantSize & VariantFullWidth;

export const buttonStyles = cva<ButtonVariants>(
  ['font-weight-500', 'text-white', 'rounded-full px-30'],
  {
    variants: {
      variant: {
        primary: ['bg-primary-500', 'hover:bg-primary-600'],
        secondary: ['bg-black', 'dark:bg-white dark:text-charcoal'],
        tertiary: [
          'bg-lightGrey text-charcoal dark:bg-darkGrey dark:text-white',
        ],
        success: ['bg-success-500', 'hover:bg-success-600'],
        error: ['bg-error-500', 'hover:bg-error-600'],
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
      variant: 'primary',
      size: 'md',
    },
  }
);
