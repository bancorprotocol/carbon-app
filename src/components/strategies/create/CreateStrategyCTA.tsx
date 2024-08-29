import { Button } from 'components/common/button';
import { Link, useRouterState } from 'libs/routing';
import { carbonEvents } from 'services/events';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { isPathnameMatch } from 'utils/helpers';

export const CreateStrategyCTAMobile = () => {
  const { pathname } = useRouterState().location;

  const showCTA = isPathnameMatch(pathname, '/', [
    '/',
    '/strategies/portfolio',
    '/strategies/portfolio/token/$address',
  ]);

  if (!showCTA) {
    return null;
  }

  return (
    <Link
      to="/trade/disposable"
      className="bottom-100 right-30 fixed md:hidden"
      data-testid="create-strategy-mobile"
    >
      <Button
        aria-label="Create Strategy"
        variant="success"
        className="flex size-56 items-center justify-center rounded-full p-0"
        onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
      >
        <IconPlus className="size-14" />
      </Button>
    </Link>
  );
};
