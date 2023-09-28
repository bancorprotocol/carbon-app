import { Button } from 'components/common/button';
import { Link, PathNames, useLocation } from 'libs/routing';
import { carbonEvents } from 'services/events';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { isPathnameMatch } from 'utils/helpers';

export const CreateStrategyCTA = () => {
  return (
    <Link to={PathNames.createStrategy} data-testid="create-strategy-desktop">
      <Button
        variant="success"
        onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
      >
        Create Strategy
      </Button>
    </Link>
  );
};

export const CreateStrategyCTAMobile = () => {
  const {
    current: { pathname },
  } = useLocation();

  const showCTA = isPathnameMatch(pathname, '/', [
    PathNames.strategies,
    PathNames.portfolio,
    PathNames.portfolioToken('0x'),
  ]);

  if (!showCTA) {
    return null;
  }

  return (
    <Link
      to={PathNames.createStrategy}
      className="fixed bottom-100 right-30 md:hidden"
      data-testid="create-strategy-mobile"
    >
      <Button
        aria-label="Create Strategy"
        variant="success"
        className="flex h-56 w-56 items-center justify-center rounded-full !p-0"
        onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
      >
        <IconPlus className={'h-14 w-14'} />
      </Button>
    </Link>
  );
};
