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
      'bg-black-gradient border-2 border-black text-white',
      'hover:border-background-700 hover:disabled:black',
    ],
    white: [
      'bg-white-gradient border-2 border-transparent text-white',
      'hover:opacity-40 hover:disabled:border-white',
    ],
    secondary: [
      'bg-background-800 border-2 border-background-800 text-white',
      'hover:border-background-700 hover:disabled:border-background-800',
    ],
    success: [
      'bg-primary border-2 border-primary text-black',
      'hover:border-white/60 hover:disabled:border-primary',
    ],
    buy: [
      'bg-buy-gradient border-2 border-buy text-black',
      'hover:border-white/60 hover:text-black hover:bg-buy hover:disabled:border-buy',
    ],
    sell: [
      'bg-sell-gradient border-2 border-sell text-black',
      'hover:border-white/60 hover:text-black hover:bg-sell hover:disabled:border-sell',
    ],
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
    'transition-[border-color,opacity] duration-300 ease-in-out',
    'disabled:cursor-not-allowed',
    'disabled:opacity-40',
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
