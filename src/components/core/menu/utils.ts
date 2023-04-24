import { PathNames } from 'libs/routing';
import { carbonEvents } from 'services/events';

export const handleOnItemClick = (href: string) => {
  href === PathNames.strategies &&
    carbonEvents.navigation.navStrategyClick(undefined);
  href === PathNames.trade && carbonEvents.navigation.navTradeClick(undefined);
};
