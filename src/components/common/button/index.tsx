import {
  AriaAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { cn } from 'utils/helpers';

export type ButtonHTMLProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  AriaAttributes;

export type ButtonProps = ButtonHTMLProps &
  VariantProps<typeof buttonStyles> & {
    loading?: boolean;
    loadingChildren?: string | ReactNode;
  };

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  fullWidth,
  className,
  loading,
  loadingChildren,
  ...props
}) => {
  return (
    <button
      className={cn(
        buttonStyles({ variant, size, fullWidth, class: className }),
      )}
      {...props}
      disabled={props.disabled || loading}
    >
      {loading ? (
        <>
          {loadingChildren || props.children}
          <span className="dot-pulse ml-30" />
        </>
      ) : (
        props.children
      )}
    </button>
  );
};
