import { ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTwoRanges } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping.svg';
import { SimulatorType } from 'libs/routing/routes/sim';
import { Link, useRouterState } from 'libs/routing';

interface ItemProps {
  id: string;
  label: string;
  to: SimulatorType;
  svg: ReactNode;
  tooltipText: string;
}
const items: ItemProps[] = [
  {
    id: 'overlapping',
    label: 'Liquidity Position',
    to: 'overlapping',
    svg: <IconOverlappingStrategy className="size-20" />,
    tooltipText:
      'Choose between a Concentrated and a Full-Range liquidity position.',
  },
  {
    id: 'recurring',
    label: 'Recurring',
    to: 'recurring',
    svg: <IconTwoRanges className="size-20" />,
    tooltipText:
      'Create an automated trading cycle of buy low/sell high with two separate orders.',
  },
];

const style = {
  animationDelay: '100ms',
  '--tab-background':
    'linear-gradient(var(--color-main-900)) padding-box, var(--main-gradient) border-box',
};

export const SimInputStrategyType = () => {
  const { location } = useRouterState();
  const current = location.pathname;
  return (
    <nav
      className="bg-white-gradient 2xl:grid xl:flex grid gap-8 content-start rounded-2xl xl:max-2xl:rounded-full overflow-clip animate-slide-up p-8 2xl:p-0 tab-list"
      style={style}
    >
      {items.map((link) => (
        <Link
          key={link.id}
          id={link.id}
          to={link.to}
          from="/simulate"
          search={(search) => ({
            base: search.base,
            quote: search.quote,
            start: search.start,
            end: search.end,
          })}
          resetScroll={false}
          aria-current={current === link.to ? 'page' : 'false'}
          data-testid={link.id}
          className="flex items-center gap-8 border-b border-transparent py-16 px-24 text-white/60 aria-page:tab-focus rounded-md xl:max-2xl:rounded-full tab-anchor"
        >
          {link.svg}
          {link.label}
          <Tooltip
            element={link.tooltipText}
            iconClassName="ml-auto size-14 text-white/60"
          />
        </Link>
      ))}
    </nav>
  );
};
