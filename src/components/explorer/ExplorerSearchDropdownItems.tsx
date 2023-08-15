import { useLocation } from '@tanstack/react-location';
import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { Link, PathNames } from 'libs/routing';
import { FC } from 'react';

type Props = Pick<ExplorerSearchProps, 'setSearch'>;

export const ExplorerSearchDropdownItems: FC<Props> = ({ setSearch }) => {
  const { current } = useLocation();

  const items = [
    {
      label: 'Wallet',
      href: PathNames.explorer('wallet'),
    },
    {
      label: 'Token Pair',
      href: PathNames.explorer('token-pair'),
    },
  ];

  return (
    <div className={'flex w-full flex-col space-y-10 font-weight-500'}>
      {items.map(({ label, href }) => (
        <Link key={href} to={href} onClick={() => setSearch('')}>
          {label}
        </Link>
      ))}
    </div>
  );
};
