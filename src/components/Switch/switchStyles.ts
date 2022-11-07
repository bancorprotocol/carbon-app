import { VariantColor, VariantIsOn, VariantSize } from 'components/variants';
import { cva } from 'class-variance-authority';

type SwitchVariants = VariantColor & VariantSize & VariantIsOn;

export const switchStyles = cva<SwitchVariants>(
  ['flex', 'cursor-pointer', 'rounded-full'],
  {
    variants: {
      variant: {
        primary: ['bg-primary-500'],
        secondary: ['bg-black dark:bg-white'],
        tertiary: ['bg-tertiary'],
        success: ['bg-success-500'],
        error: ['bg-error-500'],
      },
      size: {
        sm: ['h-20 w-[50px] p-3'],
        md: ['h-30 w-[60px] p-5'],
        lg: ['h-40 w-[90px] p-6'],
      },
      isOn: {
        true: 'justify-end',
        false: 'justify-start',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isOn: false,
    },
  }
);
