import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { inputStyles } from 'components/common/inputField/inputStyles';
import { cn } from 'utils/helpers';

type InputHTMLProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type InputCustomProps = Omit<InputHTMLProps, 'size'>;

export type InputProps = InputCustomProps & VariantProps<typeof inputStyles>;

export const Input: FC<InputProps> = ({
  variant,
  size,
  fullWidth,
  className,
  ...props
}) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-10 top-1/2 size-20 -translate-y-1/2 transform">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute right-10 top-1/2 size-20 -translate-y-1/2 transform">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      </div>
      <input
        className={cn(
          inputStyles({ variant, size, fullWidth, class: className }),
        )}
        {...props}
      />
    </div>
  );
};
