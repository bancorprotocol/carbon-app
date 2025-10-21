import { ReactComponent as IconTwoRanges } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping.svg';
import { Link, useRouterState } from 'libs/routing';

const items = [
  {
    id: 'overlapping',
    type: 'Essentials',
    label: 'Liquidity Position',
    to: 'overlapping',
    search: {},
    svg: <IconOverlappingStrategy className="size-20" />,
  },
  {
    id: 'recurring',
    type: 'Intermediate',
    label: 'Recurring Limit',
    to: 'recurring',
    search: { sellIsRange: false, buyIsRange: false } as const,
    svg: <IconTwoRanges className="size-20" />,
  },
  {
    id: 'recurring',
    type: 'Advanced',
    label: 'Recurring Range',
    to: 'recurring',
    search: { sellIsRange: true, buyIsRange: true } as const,
    svg: <IconTwoRanges className="size-20" />,
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
      className="surface 2xl:grid flex gap-8 content-start rounded-2xl xl:max-2xl:rounded-full overflow-clip animate-slide-up p-8 2xl:p-0 tab-list"
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
            ...link.search,
          })}
          resetScroll={false}
          aria-current={current === link.to ? 'page' : 'false'}
          data-testid={link.id}
          className="px-8 py-12 sm:px-24 grid place-items-center gap-8 flex-1 text-white/60 aria-page:text-white aria-page:bg-main-500 hover:bg-main-400 aria-page:hover:bg-main-400 bg-main-500/40 2xl:py-16 2xl:flex 2xl:justify-between"
        >
          {link.type}:{link.svg}
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
