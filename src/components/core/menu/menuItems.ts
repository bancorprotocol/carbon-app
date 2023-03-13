import { PathNames } from 'libs/routing';
import { isProduction } from 'utils/helpers';

export interface MenuItem {
  label: string;
  href: string;
}

export const menuItems: MenuItem[] = [
  {
    label: 'Strategies',
    href: PathNames.strategies,
  },
  {
    label: 'Trade',
    href: PathNames.trade,
  },
  ...(isProduction
    ? []
    : [
        {
          label: 'Debug',
          href: PathNames.debug,
        },
      ]),
];
