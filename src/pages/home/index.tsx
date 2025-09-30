import { Link } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { ReactComponent as IconRange } from 'assets/icons/range.svg';
import { ReactComponent as IconArrowCircle } from 'assets/icons/arrow-circle.svg';
import { ReactComponent as IconShield } from 'assets/icons/shield.svg';
import { ReactComponent as IconMultiOrder } from 'assets/icons/multi-order.svg';
import { ReactComponent as IconNativeOrder } from 'assets/icons/native-order.svg';

import { OverlappingPreview } from 'components/trade/preview/all/overlapping';
import { FullRangePreview } from 'components/trade/preview/all/full-range';
import { LimitSellPreview } from 'components/trade/preview/all/limit-sell';
import { RecurringLimitLimitPreview } from 'components/trade/preview/all/recurring-limit-limit';
import { RangeSellPreview } from 'components/trade/preview/all/range-sell';
import { RecurringRangeRangePreview } from 'components/trade/preview/all/recurring-range-range';

const sections = [
  {
    title: 'Basic',
    id: 'basic' as const,
    items: [
      {
        to: '/trade/market',
        icon: <IconMarket className="size-24" />,
        title: 'Swap',
        search: {},
        preview: (
          <div className="size-[250px] rounded-2xl bg-black-gradient shrink-0 grid place-items-center">
            Something here later
          </div>
        ),
        targets: ['Swappers'],
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Liquidity Position',
        search: {},
        preview: <OverlappingPreview />,
        targets: ['Liquidity Providers', 'Token Projects'],
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Full Range',
        search: {},
        preview: <FullRangePreview />,
        targets: ['Liquidity Providers', 'Token Projects'],
      },
    ],
  },
  {
    title: 'Advanced',
    id: 'advanced' as const,
    items: [
      {
        to: '/trade/disposable',
        search: {},
        icon: <IconDisposable className="size-24" />,
        title: 'Limit',
        preview: <LimitSellPreview />,
        targets: ['Traders', 'Institutions'],
      },
      {
        to: '/trade/recurring',
        search: {},
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Limit',
        preview: <RecurringLimitLimitPreview />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
    ],
  },

  {
    title: 'Professional',
    id: 'professional' as const,
    items: [
      {
        to: '/trade/disposable',
        search: { settings: 'range' as const },
        icon: <IconDisposable className="size-24" />,
        title: 'Range',
        preview: <RangeSellPreview />,
        targets: ['Traders', 'Institutions'],
      },
      {
        to: '/trade/recurring',
        search: {
          buySettings: 'range' as const,
          sellSettings: 'range' as const,
        },
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Range',
        preview: <RecurringRangeRangePreview />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
    ],
  },
];

const types = [
  {
    title: 'Basic Tools',
    description:
      'Core DeFi primitives that are common and provide good solution for most requirements',
    trades: [
      {
        name: 'Swap',
        to: '/trade/market' as const,
        search: {},
        icon: <IconMarket className="size-24" />,
      },
      {
        name: 'Liquidity Position',
        to: '/trade/overlapping' as const,
        search: {},
        icon: <IconOverlapping className="size-24" />,
      },
    ],
    targets: ['Casual', 'Newbie'],
  },
  {
    title: 'Advanced Tools',
    description:
      'A powerful set of options to design advanced, flexible trading strategies with full control',
    trades: [
      {
        name: 'Limit Order',
        to: '/trade/disposable' as const,
        search: {},
        icon: <IconDisposable className="size-24" />,
      },
      {
        name: 'Recurring Limit',
        to: '/trade/recurring' as const,
        icon: <IconRecurring className="size-24" />,
      },
    ],
    targets: ['Advanced', 'Experts'],
  },
  {
    title: 'Professional Tools',
    description:
      'Fully customizable strategies with advanced sophistication offering exclusive options only on Carbon DeFi',
    trades: [
      {
        name: 'Range Order',
        to: '/trade/disposable' as const,
        search: { settings: 'range' },
        icon: <IconRange className="size-24" />,
      },
      {
        name: 'Recurring Range',
        to: '/trade/recurring' as const,
        search: { buySettings: 'range', sellSettings: 'range' },
        icon: <IconRecurring className="size-24" />,
      },
    ],
    targets: ['Professional', 'Quants'],
  },
];

export const TradeList = () => {
  return (
    <section className="grid content-start gap-24 max-w-[1920px] mx-auto">
      <hgroup className="grid gap-24">
        <h1 className="text-5xl text-center text-gradient leading-[1.5]">
          Control You Trading Strategies
        </h1>
        <p className="font-title text-3xl text-center">
          200,000 trading strategies powering 250,000 trades
        </p>
      </hgroup>
      <ol className="grid gap-8 gradient-direction-[to_bottom]">
        <li className="flex items-center gap-16 bg-black/20 px-16 py-8 rounded-md">
          <b className="text-gradient">Step 1</b>
          <span>Connect your wallet</span>
        </li>
        <li className="flex items-center gap-16 bg-black/20 px-16 py-8 rounded-md">
          <b className="text-gradient">Step 2</b>
          <span>Create your trading strategy</span>
        </li>
        <li className="flex items-center gap-16 bg-black/20 px-16 py-8 rounded-md">
          <b className="text-gradient">Step 3</b>
          <span>
            Sit back and let the market come to you - buy and sell on your terms
          </span>
        </li>
      </ol>
      <article className="grid gap-16">
        <h2 className="text-18">Choose your Trading Strategy</h2>
        <ul className="grid grid-flow-col gap-24">
          {types.map((item) => (
            <li
              className="grid gap-16 p-24 bg-white-gradient w-[300px] rounded-2xl"
              key={item.title}
            >
              <h3 className="text-xl">{item.title}</h3>
              <p className="text-14 text-white/60">{item.description}</p>
              <Link to="/trade" className="flex items-center gap-8">
                <span className="text-gradient">Explore Strategies</span>
                <IconArrowCircle className="size-20 fill-gradient" />
              </Link>
              <nav aria-label="strategy types" className="grid gap-16">
                {item.trades.map((trade) => (
                  <Link
                    to={trade.to}
                    search={trade.search}
                    key={trade.name}
                    className="btn-tertiary-gradient flex items-center gap-16"
                  >
                    {trade.icon}
                    <span>{trade.name}</span>
                  </Link>
                ))}
              </nav>
              <ul className="flex gap-8">
                {item.targets.map((target) => (
                  <span
                    key={target}
                    className="px-8 py-4 text-12 bg-new-primary/40 text-white/40 rounded-md"
                  >
                    {target}
                  </span>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </article>
      <article className="grid gap-24">
        <h2 className="text-center text-3xl">Carbon DeFi user benefits</h2>
        <ul className="flex justify-center gap-40">
          <li className="flex gap-8 items-center">
            <IconShield className="size-20" />
            <span>MEV Sandwich Attack Resistant</span>
          </li>
          <li className="flex gap-8 items-center">
            <IconMultiOrder className="size-20" />
            <span>Multi-Order Strategies</span>
          </li>
          <li className="flex gap-8 items-center">
            <IconNativeOrder className="size-20" />
            <span>Native Limit Orders</span>
          </li>
        </ul>
      </article>
    </section>
  );
};
