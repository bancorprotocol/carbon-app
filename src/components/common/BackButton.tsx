import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { cn } from 'utils/helpers';

interface Props {
  onClick: () => void;
  className?: string;
}

export const BackButton = ({ onClick, className }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'bg-background-900 hover:bg-background-800 grid size-40 place-items-center rounded-full p-12',
        className
      )}
    >
      <IconChevronLeft className="size-16" />
    </button>
  );
};
