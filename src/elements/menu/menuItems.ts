import { PathNames } from 'routing';
import { isProduction } from 'utils/helpers';

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
  ...(isProduction
    ? []
    : [
        {
          label: 'Debug',
          href: PathNames.debug,
        },
      ]),
];
