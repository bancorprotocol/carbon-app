import { Dispatch, FC, KeyboardEvent } from 'react';
import { ExplorerSearchInputContainer } from './ExplorerSearchInputContainer';

interface Props {
  invalid: boolean;
  search: string;
  setSearch: Dispatch<string>;
}

export const ExplorerSearchInput: FC<Props> = ({
  invalid,
  search,
  setSearch,
}) => {
  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') setSearch('');
  };

  return (
    <ExplorerSearchInputContainer
      value={search}
      className={invalid ? 'text-red' : ''}
      placeholder="Search by wallet address"
      aria-label="Search by wallet address"
      onKeyDown={onKeyDownHandler}
      search={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};
