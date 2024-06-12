import { ReactNode } from 'react';
import { Pathnames, StrategyCreateSearch } from 'libs/routing';
import { ReactComponent as IconBuyRange } from 'assets/icons/buy-range.svg';
import { ReactComponent as IconBuyLimit } from 'assets/icons/buy-limit.svg';
import { ReactComponent as IconTwoRanges } from 'assets/icons/two-ranges.svg';
import { ReactComponent as IconOverlappingStrategy } from 'assets/icons/overlapping-strategy.svg';

interface StrategyTypeItem {
  id: string;
  label: string;
  description: string;
  benefits: { summary: string; details: string }[];
  to: Pathnames;
  search: StrategyCreateSearch;
  isRecommended?: boolean;
  svg: ReactNode;
}

export const getStrategyTypeItem = (
  base: string,
  quote: string
): StrategyTypeItem[] => [
  {
    label: 'Limit Order',
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
    svg: <IconBuyLimit className="w-full" />,
    to: '/strategies/create',
    search: {
      base,
      quote,
      strategyType: 'disposable',
      strategyDirection: 'buy',
      strategySettings: 'limit',
    },
    isRecommended: true,
    id: 'buy-limit',
  },
  {
    label: 'Range Order',
    description:
      'A single disposable buy or sell order within a custom price range',
    benefits: [
      {
        summary: 'Scale In or Out',
        details:
          'No need to time the market or create multiple orders within two desired price points.',
      },
      {
        summary: 'Irreversible Partial Fills',
        details:
          'Whether partially or fully filled, trades are irreversible, and you no longer need to worry about an order being undone should the market retrace.',
      },
      {
        summary: 'Adjustable',
        details:
          'Easily adjust prices without having to withdraw and redeposit funds, saving time and gas.',
      },
      {
        summary: 'No trading or gas fees on filled orders',
        details:
          'Makers pay no gas when a trade is executed, and there are currently no maker fees on Carbon DeFi.',
      },
    ],
    svg: <IconBuyRange className="w-full" />,
    to: '/strategies/create',
    search: {
      base,
      quote,
      strategyType: 'disposable',
      strategyDirection: 'buy',
      strategySettings: 'range',
    },
    isRecommended: true,
    id: 'range-order',
  },
  {
    label: 'Recurring Order',
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
    svg: <IconTwoRanges className="w-full" />,
    to: '/strategies/create',
    search: {
      base,
      quote,
      strategyType: 'recurring',
      strategySettings: 'range',
    },
    isRecommended: true,
    id: 'two-ranges',
  },
  {
    label: 'Concentrated Liquidity',
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
    svg: <IconOverlappingStrategy className="w-full" />,
    to: '/strategies/create',
    search: {
      base,
      quote,
      strategyType: 'recurring',
      strategySettings: 'overlapping',
    },
    id: 'overlapping',
  },
];
