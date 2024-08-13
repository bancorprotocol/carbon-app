import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { cn } from 'utils/helpers';
import { ButtonHTMLProps } from './button';

export const backStyle =
  'bg-background-900 hover:bg-background-800 grid size-40 place-items-center rounded-full p-12';
export const BackIcon = () => <IconChevronLeft className="size-16" />;

export const BackButton = ({ className, ...props }: ButtonHTMLProps) => {
  return (
    <button type="button" className={cn(backStyle, className)} {...props}>
      <BackIcon />
    </button>
  );
};
