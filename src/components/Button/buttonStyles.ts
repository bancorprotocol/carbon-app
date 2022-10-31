import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/variants';
import { cva } from 'class-variance-authority';

type ButtonVariants = VariantColor & VariantSize & VariantFullWidth;

export const buttonStyles = cva<ButtonVariants>(
  ['font-semibold', 'text-white', 'rounded-lg', 'rounded-br'],
  {
    variants: {
      variant: {
        primary: ['bg-primary-500', 'hover:bg-primary-600'],
        secondary: ['bg-secondary-500/20', 'hover:bg-secondary-600'],
        success: ['bg-success-500', 'hover:bg-success-600'],
        error: ['bg-error-500', 'hover:bg-error-600'],
      },
      size: {
        sm: ['text-sm', 'py-1', 'px-2'],
        md: ['text-base', 'py-2', 'px-4'],
        lg: ['text-lg', 'py-3', 'px-4'],
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
