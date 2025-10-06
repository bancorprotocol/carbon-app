import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/common/variants';
import { cva } from 'class-variance-authority';

type ButtonVariants = VariantColor & VariantSize & VariantFullWidth;

const variants = {
  variant: {
    black: ['bg-black text-white hover:bg-white/20 active:bg-white/30'],
    white: ['btn-secondary-gradient'],
    secondary: ['btn-secondary-gradient'],
    success: ['btn-primary-gradient'],
    buy: ['btn-buy-gradient text-black'],
    sell: ['btn-sell-gradient text-black'],
    error: [
      'bg-error border-2 border-error text-black',
      'hover:border-white/60 hover:disabled:border-error',
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
};

export const buttonStyles = cva<ButtonVariants>(
  [
    'font-title font-medium',
    'rounded-full px-30',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'flex justify-center items-center',
  ],
  {
    variants,
    defaultVariants: {
      variant: 'white',
      size: 'md',
    },
  },
);

export const backStyle =
  'btn-secondary-gradient grid size-40 place-items-center rounded-full';
