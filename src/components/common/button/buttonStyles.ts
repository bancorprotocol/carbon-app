import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/common/variants';
import { cva } from 'class-variance-authority';

type ButtonVariants = VariantColor & VariantSize & VariantFullWidth;

const variants = {
  variant: {
    black: ['bg-main-900 text-main-0 hover:bg-white/20 active:bg-white/30'],
    white: ['btn-on-surface'],
    secondary: ['btn-on-background'],
    success: ['btn-main-gradient'],
    buy: ['btn-buy-gradient text-main-950'],
    sell: ['btn-sell-gradient text-main-950'],
    error: [
      'bg-error border border-error text-main-950',
      'hover:border-main-0/60 hover:disabled:border-error',
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
  'btn-on-background grid size-40 place-items-center rounded-full p-0';
