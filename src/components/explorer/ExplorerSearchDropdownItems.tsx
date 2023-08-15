import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { Link, PathNames } from 'libs/routing';
import { FC } from 'react';

type Props = Pick<ExplorerSearchProps, 'setSearch'>;

export const ExplorerSearchDropdownItems: FC<Props> = ({ setSearch }) => (
  <>
    <div>
      <Link to={PathNames.explorer('wallet')} onClick={() => setSearch('')}>
        Wallet
      </Link>
    </div>
    <div>
      <Link to={PathNames.explorer('token-pair')} onClick={() => setSearch('')}>
        Token Pair
      </Link>
    </div>
  </>
);
