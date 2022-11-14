import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';

interface Props {
  value: string;
  setValue: (value: string) => void;
  className?: string;
}

const defaultClassName =
  'block border border-silver pl-[38px] pr-[38px] dark:placeholder-white-disabled dark:bg-charcoal dark:border-grey';

export const SearchInput = ({ value, setValue, className }: Props) => {
  return (
    <div className="relative">
      <IconSearch className="text-graphite dark:text-white-disabled absolute ml-14 w-16" />
      {value.length > 0 && (
        <button
          onClick={() => setValue('')}
          className="text-graphite hover:text-error absolute right-0 mr-14 h-full"
        >
          <IconClose className="w-12" />
        </button>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        className={`${defaultClassName} ${className}`}
      />
    </div>
  );
};
