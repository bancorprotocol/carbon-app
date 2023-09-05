import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { FC, KeyboardEvent } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconClose } from 'assets/icons/times.svg';
import styles from './explorer.module.css';

interface Props extends ExplorerSearchProps {
  isError?: boolean;
}

export const ExplorerSearchInput: FC<Props> = (props) => {
  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') props.setSearch('');
  };

  return (
    <div className={styles.inputContainer}>
      <input
        name="search"
        type="search"
        value={props.search}
        placeholder="Search by wallet address"
        aria-label="Search by wallet address"
        className={cn(styles.searchInput, props.isError && 'text-red')}
        onKeyDown={onKeyDownHandler}
        onChange={(e) => props.setSearch(e.target.value)}
      />
      {!!props.search && (
        <button type="reset" aria-label="Clear">
          <IconClose className="w-12" />
        </button>
      )}
    </div>
  );
};
