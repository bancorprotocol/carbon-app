import { Pathnames } from 'libs/routing';
import { isProduction } from 'utils/helpers';
import config from 'config';

export interface MenuItem {
  label: string;
  href: Pathnames;
}

export const menuItems: MenuItem[] = [
  {
    label: 'My Strategies',
    href: '/',
  },
  {
    label: 'Trade',
    href: '/trade/overview/type',
  },
  {
    label: 'Explore',
    href: '/explore',
  },
  ...(!config.isSimulatorEnabled
    ? []
    : [
        {
          label: 'Simulate',
          href: '/simulate',
        } as MenuItem,
      ]),
  ...(isProduction
    ? []
    : [
        {
          label: 'Debug',
          href: '/debug',
        } as MenuItem,
      ]),
];
