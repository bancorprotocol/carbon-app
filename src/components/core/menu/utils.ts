import { Pathnames } from 'libs/routing';
import { carbonEvents } from 'services/events';

const paths: { [key: string]: Pathnames } = {
  strategies: '/',
  trade: '/trade',
};

export const handleOnItemClick = (href: string) => {
  href === paths.strategies &&
    carbonEvents.navigation.navStrategyClick(undefined);
  href === paths.trade && carbonEvents.navigation.navTradeClick(undefined);
};
