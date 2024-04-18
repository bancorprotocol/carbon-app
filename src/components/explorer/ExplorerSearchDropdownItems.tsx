import { Link } from 'libs/routing';
import { FC } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconCheck } from 'assets/icons/v.svg';
import { useExplorerParams } from './useExplorerParams';

interface Props {
  setSearch: (sarch: string) => void;
}

export const ExplorerSearchDropdownItems: FC<Props> = ({ setSearch }) => {
  const { type: currentType } = useExplorerParams();
  const items = [
    {
      type: 'wallet' as const,
      label: 'Wallet',
      active: currentType === 'wallet',
    },
    {
      type: 'token-pair' as const,
      label: 'Token Pair',
      active: currentType === 'token-pair',
    },
  ];

  return (
    <div className="font-weight-400 flex w-full flex-col space-y-10">
      {items.map(({ label, type, active }) => (
        <Link
          key={type}
          to="/explore/$type"
          params={{ type }}
          onClick={() => setSearch('')}
          className={cn(
            'rounded-6 p-10 hover:bg-black',
            active && 'flex items-center justify-between'
          )}
        >
          <span> {label}</span>
          <IconCheck className={cn('w-14', !active && 'hidden')} />
        </Link>
      ))}
    </div>
  );
};
