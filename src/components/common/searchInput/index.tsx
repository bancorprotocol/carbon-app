import { HTMLAttributes, KeyboardEventHandler } from 'react';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';
import { cn } from 'utils/helpers';

type InputProps = HTMLAttributes<HTMLInputElement>;
interface Props extends InputProps {
  value: string;
  setValue: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export const SearchInput = ({
  value,
  setValue,
  className,
  autoFocus,
  ...inputProps
}: Props) => {
  return (
    <div
      className={cn(
        'flex items-center gap-16 border border-transparent bg-black px-16 py-8 focus-within:border-white',
        className,
      )}
    >
      <IconSearch className="text-white-disabled w-16" />
      <input
        {...inputProps}
        autoFocus={autoFocus}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        className="placeholder-white-disabled flex-1 bg-transparent focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !!value) {
            e.stopPropagation();
            setValue('');
          }
          inputProps.onKeyDown?.(e);
        }}
      />
      {value.length > 0 && (
        <button
          aria-label="clear search"
          data-testid="clear-search"
          onClick={() => setValue('')}
          className="text-graphite hover:text-error"
        >
          <IconClose className="w-12" />
        </button>
      )}
    </div>
  );
};
