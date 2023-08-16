import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { Dispatch, FC, SetStateAction, KeyboardEvent } from 'react';
import { cn, wait } from 'utils/helpers';

interface Props extends ExplorerSearchProps {
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  onSearchHandler: (v?: string) => void;
  isError?: boolean;
}

export const ExplorerSearchInput: FC<Props> = (props) => {
  const placeholder =
    props.type === 'wallet'
      ? 'Search by wallet address'
      : 'Search by Token pair';

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      return props.setSearch('');
    }
    if (e.key !== 'Enter') {
      return;
    }
    if (
      !props.isError &&
      props.search.length > 0 &&
      props.filteredPairs.length > 0
    ) {
      if (props.type === 'token-pair') {
        const slug =
          `${props.filteredPairs[0].baseToken.symbol}-${props.filteredPairs[0].quoteToken.symbol}`.toLowerCase();
        props.setShowSuggestions(false);
        return props.onSearchHandler(slug);
      }

      return props.onSearchHandler();
    }
  };

  return (
    <input
      type="text"
      value={props.search}
      placeholder={placeholder}
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
