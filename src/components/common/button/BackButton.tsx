import IconChevronLeft from 'assets/icons/chevron-left.svg?react';
import { cn } from 'utils/helpers';
import { ButtonHTMLProps } from '.';
import { backStyle } from './buttonStyles';

export const BackIcon = () => <IconChevronLeft className="size-16" />;

export const BackButton = ({ className, ...props }: ButtonHTMLProps) => {
  return (
    <button type="button" className={cn(backStyle, className)} {...props}>
      <BackIcon />
    </button>
  );
};
