import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { ReactComponent as IconSlow } from 'assets/icons/slow.svg';
import { ReactComponent as IconFast } from 'assets/icons/fast.svg';
import { Link, TradeSearch, useRouterState } from 'libs/routing';
import { staticTypePages } from './TradeType';

const staticLinks = [
  {
    label: 'Liquidity Position',
    svg: <IconOverlapping className="hidden size-18 md:inline" />,
    to: '/trade/overlapping',
    text: 'Choose between a Concentrated and a Full-Range liquidity position.',
    id: 'overlapping',
  },
  {
    label: 'Limit / Range',
    svg: <IconDisposable className="hidden size-18 md:inline" />,
    to: '/trade/disposable' as const,
    text: 'Buy or sell at a specific price, or gradually scale in or out of a position.',
    id: 'disposable',
  },
  {
    label: 'Recurring',
    svg: <IconRecurring className="hidden size-18 md:inline" />,
    to: '/trade/recurring' as const,
    text: 'Create an automated trading cycle of buy low/sell high with two separate orders.',
    id: 'recurring',
  },
  {
    label: 'Swap',
    svg: <IconMarket className="hidden size-18 md:inline" />,
    to: '/trade/market' as const,
    text: 'Instantly execute trades by directly trading against available strategies, with prices determined by current liquidity.',
    id: 'market',
  },
];

const gradientLinks = [
  {
    label: 'Auction',
    svg: <IconSlow className="hidden size-14 md:inline" />,
    to: '/trade/auction' as const,
    text: '',
    id: 'auction',
  },
  {
    label: 'Quick Auction',
    svg: <IconFast className="hidden size-16 md:inline" />,
    to: '/trade/quick-auction' as const,
    text: '',
    testId: 'strategy-gradient-regular',
    id: 'quick-auction',
  },
  {
    label: 'Custom',
    svg: <IconSlow className="hidden size-14 md:inline" />,
    to: '/trade/custom' as const,
    text: '',
    id: 'custom',
  },
  {
    label: 'Quick Custom',
    svg: <IconFast className="hidden size-16 md:inline" />,
    to: '/trade/quick-custom' as const,
    text: '',
    testId: 'strategy-gradient-quick',
    id: 'quick-custom',
  },
];

export const TradeNav = () => {
  const { location } = useRouterState();
  const current = location.pathname;
  const links = staticTypePages.includes(current) ? staticLinks : gradientLinks;

  if (current === '/trade') return;

  return (
    <nav
      aria-labelledby="trading-strateg-nav"
      className="bg-white-gradient text-14 grid grid-flow-row md:max-2xl:grid-flow-col gap-8 rounded-2xl overflow-clip xl:max-2xl:rounded-e-full animate-slide-up"
      style={{ animationDelay: '100ms' }}
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
            chartStart: search.chartStart,
            chartEnd: search.chartEnd,
            marketPrice: search.marketPrice,
          })}
          aria-current={current === link.to ? 'page' : 'false'}
          data-testid={link.id}
          className="hover:border-background-400 flex items-center justify-center gap-8 border-b border-transparent p-8 text-white/60 aria-[current=page]:bg-black-gradient aria-[current=page]:text-white"
        >
          {link.svg}
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
