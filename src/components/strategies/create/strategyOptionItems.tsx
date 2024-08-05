import { ReactNode } from 'react';
import { ReactComponent as IconBuyLimit } from 'assets/icons/disposable.svg';
import { ReactComponent as IconTwoRanges } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { TradeTypeSelection } from 'libs/routing/routes/trade';

interface StrategyOptionItem {
  id: TradeTypeSelection;
  title: string;
  label: string;
  description: string;
  benefits: { summary: string; details: string }[];
  to: string;
  isRecommended?: boolean;
  svg: ReactNode;
}

export const strategyOptionItems = (): StrategyOptionItem[] => [
  {
    label: 'Limit / Range',
    title: 'Limit Order',
    description: 'A single disposable buy or sell order at a specific price',
    benefits: [
      {
        summary: 'Orders are irreversible',
        details:
          'Similar to a limit order on a centralized exchange, an order will not be undone should the market retrace.',
      },
      {
        summary: 'Adjustable',
        details:
          'Easily edit without withdrawing funds. Adjust orders onchain, saving time and gas.',
      },
      {
        summary: 'No trading or gas fees on filled orders',
        details:
          'Makers pay no gas when a trade is executed, and there are currently no maker fees on Carbon DeFi.',
      },
    ],
    svg: <IconBuyLimit className="size-28" />,
    to: '../disposable',
    isRecommended: true,
    id: 'disposable',
  },
  {
    label: 'Recurring',
    title: 'Recurring Order',
    description:
      'Create buy and sell orders (limit or range) that are linked together. Newly acquired funds automatically rotate between them, creating an endless trading cycle without need for manual intervention',
    benefits: [
      {
        summary: 'Rotating Liquidity',
        details:
          'Tokens acquired in a buy order instantaneously fund the linked sell order and vice versa. Compound profits with a custom trading strategy designed to run continuously.',
      },
      {
        summary: 'Adjustable',
        details:
          'Easily edit without withdrawing funds. Adjust orders onchain, saving time and gas.',
      },
      {
        summary: 'No trading or gas fees on filled orders',
        details:
          'Makers pay no gas when a trade is executed, and there are currently no maker fees on Carbon DeFi.',
      },
    ],
    svg: <IconTwoRanges className="size-28" />,
    to: '../recurring',
    isRecommended: true,
    id: 'recurring',
  },
  {
    label: 'Concentrated',
    title: 'Concentrated Liquidity',
    description:
      'A concentrated position where you buy and sell in a custom price range, used to create a bid-ask fee tier that moves as the market does',
    benefits: [
      {
        summary: 'No trading or gas fees on filled orders',
        details:
          'Makers pay no gas when a trade is executed, and there are currently no maker fees on Carbon DeFi.',
      },
      {
        summary: 'Adjustable',
        details:
          ' Easily edit your price range and position size without having to withdraw and redeposit into a new position, saving you time, gas and a whole lotta headache.',
      },
      {
        summary: 'Auto-compounding profits',
        details: 'Your profits stay within your position, earning you more!',
      },
    ],
    svg: <IconOverlappingStrategy className="size-28" />,
    to: '../overlapping',
    id: 'overlapping',
  },
  {
    label: 'Spot',
    title: 'Market',
    description: 'Trade against the available strategies',
    benefits: [
      {
        summary: 'Instant Fulfilement',
        details: '',
      },
    ],
    svg: <IconMarket className="size-28" />,
    to: '../market',
    id: 'market',
  },
];
