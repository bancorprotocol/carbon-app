import { Link, useRouterState } from '@tanstack/react-router';
import { useTradeCtx } from './TradeContext';
import { ReactComponent as IconBuyLimit } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { TradeTypeSelection } from 'libs/routing/routes/trade';
import { ReactNode } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';

interface TradeLink {
  id: TradeTypeSelection;
  title: string;
  label: string;
  description: string;
  to: string;
  svg: ReactNode;
}

export const links = [
  {
    label: 'Spot',
    title: 'Market',
    description: 'Trade against the available strategies',
    svg: <IconMarket className="size-16" />,
    to: '/trade/market',
    id: 'market',
  },
  {
    label: 'Limit / Range',
    title: 'Limit Order',
    description: 'A single disposable buy or sell order at a specific price',
    svg: <IconBuyLimit className="size-16" />,
    to: '/trade/disposable',
    id: 'disposable',
  },
  {
    label: 'Recurring',
    title: 'Recurring Order',
    description:
      'Create buy and sell orders (limit or range) that are linked together. Newly acquired funds automatically rotate between them, creating an endless trading cycle without need for manual intervention',
    svg: <IconRecurring className="size-16" />,
    to: '/trade/recurring',
    id: 'recurring',
  },
  {
    label: 'Concentrated',
    title: 'Concentrated Liquidity',
    description:
      'A concentrated position where you buy and sell in a custom price range, used to create a bid-ask fee tier that moves as the market does',
    svg: <IconOverlappingStrategy className="size-16" />,
    to: '/trade/overlapping',
    id: 'overlapping',
  },
] as const;

const LinkTooltip = ({ link }: { link: TradeLink }) => {
  return (
    <hgroup>
      <h4>{link.title}</h4>
      <p>{link.description}</p>
    </hgroup>
  );
};

export const TradeNav = () => {
  const search = useTradeCtx();
  const { location } = useRouterState();
  const current = location.pathname.split('/').pop();

  const base = search.base.address;
  const quote = search.quote.address;

  return (
    <nav aria-label="type of strategy" className="grid grid-cols-2 gap-8">
      {links.map((link) => (
        <Tooltip
          key={link.id}
          hideOnClick
          element={<LinkTooltip link={link} />}
        >
          <Link
            id={link.id}
            to={link.to}
            search={{ base, quote }}
            aria-current={current === link.id ? 'page' : 'false'}
            className="rounded-8 flex items-center justify-center gap-8 border border-transparent bg-black p-8 text-white/60 aria-[current=page]:border-white aria-[current=page]:text-white"
          >
            {link.svg}
            {link.label}
          </Link>
        </Tooltip>
      ))}
    </nav>
  );
};
