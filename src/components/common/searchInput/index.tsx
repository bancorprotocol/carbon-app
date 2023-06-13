import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';
import { useTranslation } from 'libs/translations';
import { KeyboardEventHandler } from 'react';

interface Props {
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
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <IconSearch className="text-graphite dark:text-white-disabled absolute w-16 ms-14" />
      {value.length > 0 && (
        <button
          onClick={() => setValue('')}
          className="text-graphite hover:text-error absolute right-0 h-full me-14"
        >
          <IconClose className="w-12" />
        </button>
      )}

      <input
        autoFocus={autoFocus}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('common.placeholders.placeholder4') || ''}
        onKeyDown={onKeyDown}
        className={`${defaultClassName} ${className}`}
      />
    </div>
  );
};
