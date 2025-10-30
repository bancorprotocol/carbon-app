import { Link, useRouterState } from 'libs/routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { isPathnameMatch } from 'utils/helpers';

export const CreateStrategyCTAMobile = () => {
  const { pathname } = useRouterState().location;

  const showCTA = isPathnameMatch(pathname, '/', [
    '/portfolio',
    '/portfolio/distribution',
    '/portfolio/distribution/token/$address',
  ]);

  if (!showCTA) return;

  return (
    <Link
      aria-label="Create Strategy"
      to="/trade"
      className="btn-primary-gradient bottom-100 right-30 place-items-center fixed grid size-56 rounded-full p-0 md:hidden"
      data-testid="create-strategy-mobile"
    >
      <IconPlus className="size-24" />
    </Link>
  );
};
