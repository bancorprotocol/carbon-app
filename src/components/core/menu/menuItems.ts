import { PathNames } from 'libs/routing';
import { isProduction } from 'utils/helpers';

export interface MenuItem {
  label: string;
  href: string;
  hrefMatches: Array<string>;
}

export const menuItems: MenuItem[] = [
  {
    label: 'My Strategies',
    href: PathNames.strategies,
    hrefMatches: [
      PathNames.strategies,
      PathNames.createStrategy,
      PathNames.editStrategy,
      PathNames.portfolio,
      PathNames.portfolioToken('0x'),
    ],
  },
  {
    label: 'Trade',
    href: PathNames.trade,
    hrefMatches: [PathNames.trade],
  },
  {
    label: 'Explorer',
    href: PathNames.explorer('wallet'),
    hrefMatches: [
      PathNames.explorer('wallet'),
      PathNames.explorer('token-pair'),
    ],
  },
  ...(isProduction
    ? []
    : [
        {
          label: 'Debug',
          href: PathNames.debug,
          hrefMatches: [PathNames.debug],
        },
      ]),
];
