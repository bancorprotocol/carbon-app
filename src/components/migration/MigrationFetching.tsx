import { FC } from 'react';
import { Dexes } from 'services/uniswap/utils';
import { DexIcon } from './DexIcon';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { dexNames } from './utils';
import { FetchStatus, useQueryClient } from '@tanstack/react-query';
import { useWagmi } from 'libs/wagmi';
import { QueryKey } from 'libs/queries';
import IconCheck from 'assets/icons/check.svg?react';
import IconFails from 'assets/icons/X.svg?react';

interface QueryState {
  dex: Dexes;
  status: 'error' | 'success' | 'pending';
  fetchStatus: FetchStatus;
}

interface Props {
  queryState: QueryState[];
}

export const MigrationFetching: FC<Props> = ({ queryState }) => {
  const cache = useQueryClient();
  const { user } = useWagmi();

  const someFetching = queryState.some(
    ({ fetchStatus }) => fetchStatus === 'fetching',
  );
  const someError = queryState.some(({ status }) => status === 'error');
  // Remove duplicated icons
  const dexes = queryState
    .map((q) => q.dex)
    .filter((dex) => dex.endsWith('v2'))
    .sort();

  const refetch = (dex: Dexes) => {
    if (!user) return;
    cache.invalidateQueries({
      queryKey: QueryKey.dexMigration(dex, user),
    });
  };

  return (
    <DropdownMenu
      button={(attr) => (
        <button
          {...attr}
          className="btn-on-background place-self-start flex gap-8 items-center"
        >
          <ul className="flex">
            {dexes.map((dex) => (
              <li key={dex} className="-ml-8">
                <DexIcon dex={dex as Dexes} className="size-24" />
              </li>
            ))}
          </ul>
          <span className="text-14">Positions from dexes</span>
          <FetchIndicator isFetching={someFetching} hasError={someError} />
        </button>
      )}
    >
      <menu role="menu" className="p-8 grid gap-8">
        {queryState.map((q) => (
          <button
            role="menuitem"
            onClick={() => refetch(q.dex)}
            key={q.dex}
            className="rounded-sm flex items-center gap-8 p-8 hover:bg-main-900/40"
          >
            <DexIcon dex={q.dex} className="size-24" />
            <span className="mr-auto pe-8">{dexNames[q.dex]}</span>
            <FetchIndicator
              isFetching={q.fetchStatus === 'fetching'}
              hasError={q.status === 'error'}
            />
          </button>
        ))}
      </menu>
    </DropdownMenu>
  );
};

interface IndicatorProps {
  isFetching: boolean;
  hasError: boolean;
}

const FetchIndicator: FC<IndicatorProps> = (props) => {
  if (props.isFetching) {
    return (
      <div className="animate-spin">
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="white"
            strokeWidth="6"
            strokeDasharray="100"
          />
        </svg>
      </div>
    );
  }
  if (props.hasError) {
    return (
      <div className="size-24 grid place-items-center">
        <IconFails className="size-18 text-error" />
      </div>
    );
  }
  return <IconCheck className="size-24 text-success" />;
};
