import { Button } from 'components/common/button';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Link, PathNames, useLocation } from 'libs/routing';
import { carbonEvents } from 'services/events';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn, isPathnameMatch } from 'utils/helpers';

export const CreateStrategyCTA = () => {
  const { belowBreakpoint } = useBreakpoints();

  return (
    <Link to={PathNames.createStrategy}>
      <Button
        variant="success"
        onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
        className={cn({
          'flex h-56 w-56 items-center justify-center rounded-full !p-0':
            belowBreakpoint('md'),
        })}
      >
        {belowBreakpoint('md') ? (
          <IconPlus className={'h-14 w-14'} />
        ) : (
          'Create Strategy'
        )}
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
    <div className={cn('fixed', 'bottom-100', 'right-30', 'md:hidden')}>
      <CreateStrategyCTA />
    </div>
  );
};
