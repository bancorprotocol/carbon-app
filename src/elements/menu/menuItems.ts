import { PathNames } from 'routing';
import { IS_TENDERLY_FORK } from 'web3/web3.constants';

export interface MenuItem {
  label: string;
  href: string;
}

export const menuItems: MenuItem[] = [
  {
    label: 'Trade',
    href: PathNames.trade,
  },
  {
    label: 'Strategies',
    href: PathNames.strategies,
  },
  ...(IS_TENDERLY_FORK
    ? [
        {
          label: 'Debug',
          href: PathNames.debug,
        },
      ]
    : []),
];
