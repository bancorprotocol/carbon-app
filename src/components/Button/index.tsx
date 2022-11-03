import {
  AriaAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
} from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonStyles } from 'components/Button/buttonStyles';

type ButtonHTMLProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  AriaAttributes;

type ButtonProps = ButtonHTMLProps & VariantProps<typeof buttonStyles>;

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  fullWidth,
  className,
  ...props
}) => {
  return (
    <button
      className={buttonStyles({ variant, size, fullWidth, class: className })}
      {...props}
    />
  );
};
