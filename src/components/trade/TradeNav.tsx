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
    svg: <IconBuyLimit className="hidden size-14 md:inline" />,
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
    label: 'Concentrated',
    svg: <IconOverlappingStrategy className="hidden size-14 md:inline" />,
    to: '/trade/overlapping',
    text: 'Buy and sell within custom parameters with custom fee tier and auto-compounding fees.',
    id: 'overlapping',
  },
  {
    label: 'Spot',
    svg: <IconMarket className="hidden size-14 md:inline" />,
    to: '/trade/market',
    text: 'Instantly execute trades by directly trading against available strategies, with prices determined by current liquidity.',
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
        className="text-14 grid grid-cols-2 gap-8"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            id={link.id}
            to={link.to}
            search={{ base, quote }}
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
