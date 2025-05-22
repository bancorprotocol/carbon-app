import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Link, TradeSearch, useRouterState } from 'libs/routing';

const links = [
  {
    label: 'Liquidity Position',
    svg: <IconOverlapping className="hidden size-14 md:inline" />,
    to: '/trade/overlapping',
    text: 'Choose between a Concentrated and a Full-Range liquidity position.',
    id: 'overlapping',
  },
  {
    label: 'Limit / Range',
    svg: <IconDisposable className="hidden size-14 md:inline" />,
    to: '/trade/disposable',
    text: 'Buy or sell at a specific price, or gradually scale in or out of a position.',
    id: 'disposable',
  },
  {
    label: 'Recurring',
    svg: <IconRecurring className="hidden size-14 md:inline" />,
    to: '/trade/recurring',
    text: 'Create an automated trading cycle of buy low/sell high with two separate orders.',
    id: 'recurring',
  },
  {
    label: 'Swap',
    svg: <IconMarket className="hidden size-14 md:inline" />,
    to: '/trade/market',
    text: 'Instantly execute trades by directly trading against available strategies, with prices determined by current liquidity.',
    id: 'market',
  },
] as const;

export const TradeNav = () => {
  const { location } = useRouterState();
  const current = location.pathname.split('/').pop();
  return (
    <article className="bg-background-900 grid gap-16 p-16">
      <h2 id="trading-strateg-nav" className="text-16">
        Type
      </h2>
      <nav
        aria-labelledby="trading-strateg-nav"
        className="text-14 grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            id={link.id}
            to={link.to}
            from="/trade"
            search={(search: TradeSearch) => ({
              base: search.base,
              quote: search.quote,
              priceStart: search.priceStart,
              priceEnd: search.priceEnd,
              marketPrice: search.marketPrice,
            })}
            aria-current={current === link.id ? 'page' : 'false'}
            data-testid={link.id}
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
