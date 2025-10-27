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
    svg: <IconOverlappingStrategy className="hidden md:block size-20" />,
  },
  // TODO: currently not work, need to update simulator code
  // {
  //   id: 'recurring-limit',
  //   type: 'Intermediate',
  //   label: 'Recurring Limit',
  //   to: 'recurring',
  //   search: { sellIsRange: false, buyIsRange: false } as const,
  //   svg: <IconTwoRanges className="hidden md:block size-20" />,
  // },
  {
    id: 'recurring-range',
    type: 'Advanced',
    label: 'Recurring Range',
    to: 'recurring',
    search: { sellIsRange: true, buyIsRange: true } as const,
    svg: <IconTwoRanges className="hidden md:block size-20" />,
  },
];

export const SimInputStrategyType = () => {
  const { location } = useRouterState();
  const current = location.pathname;
  return (
    <nav className="surface rounded-full overflow-clip animate-slide-up flex-1 flex p-4 sm:gap-8 2xl:grid 2xl:rounded-2xl tab-list">
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
          replace={true}
          resetScroll={false}
          aria-current={current === link.to ? 'page' : 'false'}
          data-testid={link.id}
          className="tab-anchor px-8 py-8 grid place-items-center flex-1 text-white/60 hover:text-white hover:bg-main-400/60 aria-page:text-white aria-page:tab-focus 2xl:py-16 sm:px-24 2xl:justify-items-start"
        >
          <span className="text-12 sm:text-14">{link.type}</span>
          <div className="flex items-center gap-8 text-10 sm:text-16">
            {link.svg}
            <span>{link.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
};
