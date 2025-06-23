import { Pathnames } from 'libs/routing';
import { isProduction } from 'utils/helpers';
import config from 'config';

export interface MenuItem {
  label: string;
  href: Pathnames;
  testid: string;
}

export const getMenuItems = () => {
  const items = [
    {
      label: 'Portfolio',
      href: '/portfolio',
      testid: 'my-strategies-page',
    },
    {
      label: 'Trade',
      href: '/trade/disposable',
      testid: 'trade-page',
    },
    {
      label: 'Explore',
      href: '/explore',
      testid: 'explore-page',
    },
  ];
  if (config.ui.showSimulator) {
    items.push({
      label: 'Simulate',
      href: '/simulate',
      testid: 'simulate-page',
    });
  }
  if (!isProduction) {
    items.push({
      label: 'Debug',
      href: '/debug',
      testid: 'debug-page',
    });
  }
  return items;
};

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
