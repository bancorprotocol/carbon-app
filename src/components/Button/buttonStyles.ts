import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/variants';
import { cva } from 'class-variance-authority';

type ButtonVariants = VariantColor & VariantSize & VariantFullWidth;

export const buttonStyles = cva<ButtonVariants>(
  ['font-weight-600', 'text-white', 'rounded-full px-30'],
  {
    variants: {
      variant: {
        primary: ['bg-primary-500', 'hover:bg-primary-600'],
        secondary: ['bg-secondary-500/20', 'hover:bg-secondary-600'],
        success: ['bg-success-500', 'hover:bg-success-600'],
        error: ['bg-error-500', 'hover:bg-error-600'],
      },
      size: {
        sm: ['text-14', 'h-30'],
        md: ['text-16', 'h-40'],
        lg: ['text-18', 'h-50'],
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
