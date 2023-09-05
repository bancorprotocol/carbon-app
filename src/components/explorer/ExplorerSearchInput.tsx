import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { FC, KeyboardEvent } from 'react';
import { ExplorerSearchInputContainer } from './ExplorerSearchInputContainer';

interface Props extends ExplorerSearchProps {
  isError?: boolean;
}

export const ExplorerSearchInput: FC<Props> = (props) => {
  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') props.setSearch('');
  };

  return (
    <ExplorerSearchInputContainer
      value={props.search}
      className={props.isError ? 'text-red' : ''}
      placeholder="Search by wallet address"
      aria-label="Search by wallet address"
      onKeyDown={onKeyDownHandler}
      search={props.search}
      setSearch={props.setSearch}
    />
  );
};
