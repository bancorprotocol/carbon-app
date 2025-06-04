import { Link, useRouterState } from 'libs/routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn, isPathnameMatch } from 'utils/helpers';
import { buttonStyles } from 'components/common/button/buttonStyles';

export const CreateStrategyCTAMobile = () => {
  const { pathname } = useRouterState().location;

  const showCTA = isPathnameMatch(pathname, '/', [
    '/portfolio',
    '/portfolio/strategies/portfolio',
    '/portfolio/strategies/portfolio/token/$address',
  ]);

  if (!showCTA) return;

  return (
    <Link
      aria-label="Create Strategy"
      to="/trade"
      className={cn(
        buttonStyles({ variant: 'success' }),
        'bottom-100 right-30 place-center fixed grid size-56 rounded-full p-0 md:hidden',
      )}
      data-testid="create-strategy-mobile"
    >
      <IconPlus className="size-14" />
    </Link>
  );
};
