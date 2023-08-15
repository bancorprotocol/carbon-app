import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { Dispatch, FC, SetStateAction } from 'react';
import { cn, wait } from 'utils/helpers';

interface Props extends Omit<ExplorerSearchProps, 'filteredPairs'> {
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
}

export const ExplorerSearchInput: FC<Props> = (props) => {
  const placeholder =
    props.type === 'wallet'
      ? 'Search by wallet address'
      : 'Search by Token pair';

  return (
    <input
      type="text"
      value={props.search}
      placeholder={placeholder}
      className={cn('w-full flex-grow bg-black outline-none')}
      onChange={(e) => props.setSearch(e.target.value)}
      onFocus={() => props.setShowSuggestions(true)}
      onBlur={async () => {
        await wait(200);
        props.setShowSuggestions(false);
      }}
    />
  );
};
