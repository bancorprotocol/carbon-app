import {
  VariantColor,
  VariantIsOn,
  VariantSize,
} from 'components/common/variants';
import { cva } from 'class-variance-authority';

type SwitchVariants = VariantColor & VariantSize & VariantIsOn;

export const switchStyles = cva<SwitchVariants>(
  ['flex', 'cursor-pointer', 'rounded-full'],
  {
    variants: {
      variant: {
        black: ['bg-black'],
        secondary: ['bg-silver'],
        white: ['bg-white/90'],
        success: ['bg-green'],
        'success-light': ['bg-green/20'],
        error: ['bg-red'],
        'error-light': ['bg-red/25'],
      },
      size: {
        sm: ['h-16 w-[32px] p-3'],
        md: ['h-30 w-[60px] p-5'],
        lg: ['h-40 w-[90px] p-6'],
      },
      isOn: {
        true: 'justify-end',
        false: 'justify-start',
      },
    },
    defaultVariants: {
      variant: 'black',
      size: 'md',
      isOn: false,
    },
  }
);
