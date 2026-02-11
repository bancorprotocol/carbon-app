import { FC } from 'react';
import { Dexes } from 'services/uniswap/utils';
import { DexIcon } from './DexIcon';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { dexNames } from './utils';
import IconCheck from 'assets/icons/check.svg?react';

interface Props {
  fetching: Record<string, boolean>;
}

export const MigrationFetching: FC<Props> = ({ fetching }) => {
  const someFetching = Object.values(fetching).some((isFetching) => isFetching);
  // Remove duplicated icons
  const dexes = Object.keys(fetching)
    .filter((dex) => dex.endsWith('v2'))
    .sort();
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
      <ul className="p-8">
        {Object.entries(fetching).map(([dex, isFetching]) => (
          <li key={dex} className="flex items-center gap-8 px-16 py-8">
            <DexIcon dex={dex as Dexes} className="size-24" />
            <span className="mr-auto">{dexNames[dex as Dexes]}</span>
            <FetchIndicator isFetching={isFetching} />
          </li>
        ))}
      </ul>
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
