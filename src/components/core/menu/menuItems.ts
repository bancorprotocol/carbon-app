import { Pathnames } from 'libs/routing';
import { isProduction } from 'utils/helpers';

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
    href: '/trade',
  },
  {
    label: 'Explore',
    href: '/explore',
  },
  {
    label: 'Simulate',
    href: '/simulate',
  },
  ...(isProduction
    ? []
    : [
        {
          label: 'Debug',
          href: '/debug',
        } as MenuItem,
      ]),
];
