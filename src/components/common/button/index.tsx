import {
  AriaAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
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
  VariantProps<typeof buttonStyles> & { loading?: boolean };

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  fullWidth,
  className,
  loading,
  ...props
}) => {
  return (
    // @ts-ignore
    <m.button
      className={buttonStyles({ variant, size, fullWidth, class: className })}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-max text-white">{props.children}</div>
          <div className="dot-pulse ml-20" />
        </div>
      ) : (
        props.children
      )}
    </m.button>
  );
};
