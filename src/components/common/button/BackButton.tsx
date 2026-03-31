import ChevronLeftIcon from 'assets/icons/chevron_left.svg?react';
import { cn } from 'utils/helpers';
import { ButtonHTMLProps } from '.';
import { backStyle } from './buttonStyles';

export const BackIcon = () => <ChevronLeftIcon className="size-24" />;

export const BackButton = ({ className, ...props }: ButtonHTMLProps) => {
  return (
    <button type="button" className={cn(backStyle, className)} {...props}>
      <BackIcon />
    </button>
  );
};
