import { Button } from 'components/common/button';
import { Link, PathNames, useRouterState } from 'libs/routing';
import { carbonEvents } from 'services/events';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { isPathnameMatch } from 'utils/helpers';
import { buttonStyles } from 'components/common/button/buttonStyles';

export const CreateStrategyCTA = () => {
  return (
    <Link
      to={PathNames.createStrategy}
      className={buttonStyles({ variant: 'success' })}
      data-testid="create-strategy-desktop"
      onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
    >
      Create Strategy
    </Link>
  );
};

export const CreateStrategyCTAMobile = () => {
  const { pathname } = useRouterState().location;

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
