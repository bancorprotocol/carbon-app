import { PathNames } from 'routing';

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
  {
    label: 'Debug',
    href: PathNames.debug,
  },
];
