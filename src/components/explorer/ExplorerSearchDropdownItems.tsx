import { Link, PathNames } from 'libs/routing';
import { FC } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconCheck } from 'assets/icons/v.svg';
import { useExplorerParams } from './useExplorerParams';

interface Props {
  setSearch: (sarch: string) => void;
}

export const ExplorerSearchDropdownItems: FC<Props> = ({ setSearch }) => {
  const { type } = useExplorerParams();
  const items = [
    {
      label: 'Wallet',
      href: PathNames.explorer('wallet'),
      active: type === 'wallet',
    },
    {
      label: 'Token Pair',
      href: PathNames.explorer('token-pair'),
      active: type === 'token-pair',
    },
  ];

  return (
    <div className={'flex w-full flex-col space-y-10 font-weight-400'}>
      {items.map(({ label, href, active }) => (
        <Link
          key={href}
          to={href}
          onClick={() => setSearch('')}
          className={cn(
            'hover:bg-body rounded-6 p-10',
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
