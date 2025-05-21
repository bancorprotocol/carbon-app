import { Pathnames } from 'libs/routing';
import { isProduction } from 'utils/helpers';
import config from 'config';

export interface MenuItem {
  label: string;
  href: Pathnames;
  testid: string;
}

export const menuItems: MenuItem[] = [
  {
    label: 'Portfolio',
    href: '/portfolio',
    testid: 'my-strategies-page',
  },
  {
    label: 'Trade',
    href: '/trade',
    testid: 'trade-page',
  },
  {
    label: 'Explore',
    href: '/explore',
    testid: 'explore-page',
  },
  ...(!config.ui.showSimulator
    ? []
    : [
        {
          label: 'Simulate',
          href: '/simulate',
          testid: 'simulate-page',
        } as MenuItem,
      ]),
  ...(isProduction
    ? []
    : [
        {
          label: 'Debug',
          href: '/debug',
          testid: 'debug-page',
        } as MenuItem,
      ]),
];
