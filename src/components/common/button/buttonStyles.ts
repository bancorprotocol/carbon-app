import {
  VariantColor,
  VariantFullWidth,
  VariantSize,
} from 'components/common/variants';
import { cva } from 'class-variance-authority';
import config from 'config';

type ButtonVariants = VariantColor & VariantSize & VariantFullWidth;

const variants = {
  variant: {
    black: [
      'bg-black-gradient text-white hover:bg-white/20 active:bg-white/30',
    ],
    white: [
      'bg-white-gradient bg-background-800 text-white hover:bg-background-700 active:bg-background-600',
    ],
    secondary: ['btn-secondary-gradient'],
    success: [
      'bg-primary border-2 border-primary text-black',
      'hover:border-white/60 hover:disabled:border-primary',
    ],
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

if (config.ui.useGradientBranding) {
  variants.variant.success = [
    'transition-[background-position] duration-500 bg-size-[200%] bg-gradient text-black',
    'hover:bg-right hover:disabled:bg-left',
  ];
}

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
