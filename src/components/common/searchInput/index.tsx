import { KeyboardEventHandler } from 'react';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';

type InputProps = JSX.IntrinsicElements['input'];
interface Props extends InputProps {
  value: string;
  setValue: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const defaultClassName =
  'block pl-[38px] pr-[38px] dark:placeholder-white-disabled dark:bg-charcoal rounded-full focus:outline-none';

export const SearchInput = ({
  value,
  setValue,
  className,
  autoFocus,
  onKeyDown,
  ...inputProps
}: Props) => {
  return (
    <div className="relative">
      <IconSearch className="text-graphite dark:text-white-disabled absolute ml-14 w-16" />
      {value.length > 0 && (
        <button
          aria-label="clear search"
          data-testid="clear-search"
          onClick={() => setValue('')}
          className="text-graphite hover:text-error absolute right-0 mr-14 h-full"
        >
          <IconClose className="w-12" />
        </button>
      )}

      <input
        {...inputProps}
        autoFocus={autoFocus}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        onKeyDown={onKeyDown}
        className={`${defaultClassName} ${className}`}
      />
    </div>
  );
};
