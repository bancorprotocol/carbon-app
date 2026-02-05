import { HTMLAttributes, KeyboardEventHandler, useEffect, useRef } from 'react';
import IconSearch from 'assets/icons/search.svg?react';
import IconClose from 'assets/icons/times.svg?react';
import { cn } from 'utils/helpers';

type InputProps = HTMLAttributes<HTMLInputElement>;
interface Props extends InputProps {
  value: string;
  setValue: (value: string) => void;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export const SearchInput = ({
  value,
  setValue,
  className,
  ...inputProps
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Force autofocus when dialog open: we need that because dialog don't support tabIndex
    setTimeout(() => ref.current?.focus());
  }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-16 px-16 py-8 input-container',
        className,
      )}
    >
      <IconSearch className="text-main-0-disabled w-16" />
      <input
        {...inputProps}
        ref={ref}
        name="search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        className="placeholder-white-disabled flex-1 bg-transparent focus:outline-hidden"
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
          type="button"
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
