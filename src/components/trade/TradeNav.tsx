import { Link, useRouterState } from '@tanstack/react-router';
import { useTradeCtx } from './TradeContext';
import { ReactComponent as IconBuyLimit } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';

export const links = [
  {
    label: 'Limit / Range',
    svg: <IconBuyLimit className="size-16" />,
    to: '/trade/disposable',
    text: 'A single disposable buy or sell order at a specific price',
    id: 'disposable',
  },
  {
    label: 'Recurring',
    svg: <IconRecurring className="size-16" />,
    to: '/trade/recurring',
    text: 'Create buy and sell orders (limit or range) that are linked together. Newly acquired funds automatically rotate between them, creating an endless trading cycle without need for manual intervention',
    id: 'recurring',
  },
  {
    label: 'Concentrated',
    svg: <IconOverlappingStrategy className="size-16" />,
    to: '/trade/overlapping',
    text: 'A concentrated position where you buy and sell in a custom price range, used to create a bid-ask fee tier that moves as the market does',
    id: 'overlapping',
  },
  {
    label: 'Spot',
    svg: <IconMarket className="size-16" />,
    to: '/trade/market',
    text: '',
    id: 'market',
  },
] as const;

export const TradeNav = () => {
  const search = useTradeCtx();
  const { location } = useRouterState();
  const current = location.pathname.split('/').pop();

  const base = search.base.address;
  const quote = search.quote.address;

  return (
    <article className="bg-background-900 grid gap-20 rounded p-20">
      <h2 id="trading-strateg-nav" className="text-18">
        Trading Strategy
      </h2>
      <nav
        aria-labelledby="trading-strateg-nav"
        className="grid grid-cols-2 gap-8"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            id={link.id}
            to={link.to}
            search={{ base, quote }}
            aria-current={current === link.id ? 'page' : 'false'}
            data-testId={link.id}
            className="rounded-8 flex items-center justify-center gap-8 border border-transparent bg-black p-8 text-white/60 hover:border-white aria-[current=page]:border-white aria-[current=page]:text-white"
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
