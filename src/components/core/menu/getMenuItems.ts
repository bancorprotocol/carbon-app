import { Pathnames } from 'libs/routing';
import { isProduction } from 'utils/helpers';

export interface MenuItem {
  label: string;
  href: Pathnames;
}

export const getMenuItems = (noPriceHistory: boolean): MenuItem[] => {
  return [
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
    ...(noPriceHistory
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
};
