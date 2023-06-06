import {
  AriaAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { m } from 'libs/motion';

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
    // @ts-ignore
    <m.button
      className={buttonStyles({ variant, size, fullWidth, class: className })}
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
    </m.button>
  );
};
