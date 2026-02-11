import { FC } from 'react';
import { Dexes } from 'services/uniswap/utils';
import { DexIcon } from './DexIcon';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { dexNames } from './utils';
import IconCheck from 'assets/icons/check.svg?react';
import { useQueryClient } from '@tanstack/react-query';
import { useWagmi } from 'libs/wagmi';
import { QueryKey } from 'libs/queries';

interface Props {
  fetching: Record<string, boolean>;
}

export const MigrationFetching: FC<Props> = ({ fetching }) => {
  const cache = useQueryClient();
  const { user } = useWagmi();

  const someFetching = Object.values(fetching).some((isFetching) => isFetching);
  // Remove duplicated icons
  const dexes = Object.keys(fetching)
    .filter((dex) => dex.endsWith('v2'))
    .sort();

  const refetch = (dex: string) => {
    if (!user) return;
    cache.invalidateQueries({
      queryKey: QueryKey.dexMigration(dex as Dexes, user),
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
          <FetchIndicator isFetching={someFetching} />
        </button>
      )}
    >
      <menu role="menu" className="p-8 grid gap-8">
        {Object.entries(fetching).map(([dex, isFetching]) => (
          <button
            role="menuitem"
            onClick={() => refetch(dex)}
            key={dex}
            className="rounded-sm flex items-center gap-8 p-8 hover:bg-main-900/40"
          >
            <DexIcon dex={dex as Dexes} className="size-24" />
            <span className="mr-auto">{dexNames[dex as Dexes]}</span>
            <FetchIndicator isFetching={isFetching} />
          </button>
        ))}
      </menu>
    </DropdownMenu>
  );
};

const FetchIndicator = ({ isFetching }: { isFetching: boolean }) => {
  if (isFetching) {
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
  } else {
    return <IconCheck className="size-24" />;
  }
};
