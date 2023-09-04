import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { Dispatch, FC, SetStateAction, KeyboardEvent } from 'react';
import { cn, wait } from 'utils/helpers';

interface Props extends ExplorerSearchProps {
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  isError?: boolean;
}

export const ExplorerSearchInput: FC<Props> = (props) => {
  const label =
    props.type === 'wallet'
      ? 'Search by wallet address'
      : 'Search by token pair';

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') props.setSearch('');
  };

  return (
    <input
      type="search"
      value={props.search}
      placeholder={label}
      aria-label={label}
      className={cn(
        'w-full flex-grow bg-black outline-none',
        props.isError && 'text-red'
      )}
      onChange={(e) => {
        props.setSearch(e.target.value);
        if (props.type === 'token-pair') {
          props.setShowSuggestions(true);
        }
      }}
      onFocus={() => props.setShowSuggestions(true)}
      onBlur={async () => {
        await wait(200);
        props.setShowSuggestions(false);
      }}
      onKeyDown={onKeyDownHandler}
    />
  );
};
