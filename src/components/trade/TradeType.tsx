import { ReactComponent as IconPriceBased } from 'assets/icons/price-based.svg';
import { ReactComponent as IconGradient } from 'assets/icons/gradient.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Link, TradeSearch, useRouterState } from 'libs/routing';

export const staticTypePages = [
  '/trade/disposable',
  '/trade/recurring',
  '/trade/overlapping',
  '/trade/market',
];
const gradientTypePages = [
  '/trade/auction',
  '/trade/custom',
  '/trade/quick-auction',
  '/trade/quick-custom',
];

const links = [
  {
    label: 'Price Based',
    svg: <IconPriceBased className="hidden size-16 md:inline" />,
    to: '/trade/overlapping' as const,
    text: '',
    testId: 'strategy-type-static',
    pages: staticTypePages,
  },
  {
    label: 'Gradient',
    svg: <IconGradient className="hidden size-16 md:inline" />,
    to: '/trade/auction' as const,
    text: '',
    testId: 'strategy-type-gradient',
    pages: gradientTypePages,
  },
];

export const TradeType = () => {
  const { location } = useRouterState();
  const current = location.pathname;
  return (
    <article className="bg-background-900 grid gap-16 p-16">
      <h2 id="trading-strateg-nav" className="text-16">
        Strategy Types
      </h2>
      <nav
        aria-labelledby="trading-strateg-nav"
        className="text-14 grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        {links.map((link, i) => (
          <Link
            key={i}
            to={link.to}
            from="/trade"
            search={(search: TradeSearch) => ({
              base: search.base,
              quote: search.quote,
              marketPrice: search.marketPrice,
            })}
            aria-current={link.pages.includes(current) ? 'page' : 'false'}
            data-testid={link.testId}
            className="rounded-8 hover:border-background-400 flex items-center justify-center gap-8 border border-transparent bg-black p-8 text-white/60 aria-[current=page]:border-white aria-[current=page]:text-white"
          >
            {link.svg}
            {link.label}
            <Tooltip element={link.text} iconClassName="size-14" />
          </Link>
        ))}
      </nav>
    </article>
  );
};
