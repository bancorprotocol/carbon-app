import { VariantColor, VariantIsOn, VariantSize } from 'components/variants';
import { cva } from 'class-variance-authority';

type SwitchVariants = VariantColor & VariantSize & VariantIsOn;

export const switchStyles = cva<SwitchVariants>(
  ['flex', 'cursor-pointer', 'rounded-full'],
  {
    variants: {
      variant: {
        primary: ['bg-primary-500'],
        secondary: ['bg-secondary-500'],
        success: ['bg-success-500'],
        error: ['bg-error-500'],
      },
      size: {
        sm: ['h-[50px] w-[160px] p-2'],
        md: ['h-[80px] w-[240px] p-2'],
        lg: ['h-[100px] w-[320px] p-3'],
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
