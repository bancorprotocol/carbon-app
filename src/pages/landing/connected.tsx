import { Link } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { ReactComponent as IconRange } from 'assets/icons/range.svg';

import { OverlappingPreview } from 'components/trade/preview/all/overlapping';
import { FullRangePreview } from 'components/trade/preview/all/full-range';
import { LimitSellPreview } from 'components/trade/preview/all/limit-sell';
import { RecurringLimitLimitPreview } from 'components/trade/preview/all/recurring-limit-limit';
import { RangeSellPreview } from 'components/trade/preview/all/range-sell';
import { RecurringRangeRangePreview } from 'components/trade/preview/all/recurring-range-range';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import config from 'config';
import { useState } from 'react';
import { PreviewCommonStrategyType } from 'components/trade/preview/common';

const tabs = [
  {
    title: 'Basic Tools',
    id: 'basic',
    items: [
      {
        to: '/trade/market',
        icon: <IconMarket className="size-24" />,
        title: 'Swap',
        search: {},
        preview: <LimitSellPreview className="bg-black-gradient rounded-2xl" />,
        description:
          'Text about this Type of strategy, the benefits of it and what kind of users it fits',
        targets: ['Swappers'],
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Concentrated Liquidity Position',
        description:
          'Text about this Type of strategy, the benefits of it and what kind of users it fits',
        search: {},
        preview: (
          <OverlappingPreview className="bg-black-gradient rounded-2xl" />
        ),
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Full Range Liquidity Position',
        description:
          'Text about this Type of strategy, the benefits of it and what kind of users it fits',
        search: {},
        preview: <FullRangePreview className="bg-black-gradient rounded-2xl" />,
      },
    ],
  },
  {
    title: 'Advanced Tools',
    id: 'advanced',
    items: [
      {
        to: '/trade/disposable',
        search: {},
        icon: <IconDisposable className="size-24" />,
        title: 'Limit Order',
        description:
          'Text about this Type of strategy, the benefits of it and what kind of users it fits',
        preview: <LimitSellPreview className="bg-black-gradient rounded-2xl" />,
      },
      {
        to: '/trade/recurring',
        search: {},
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Limit',
        description:
          'Text about this Type of strategy, the benefits of it and what kind of users it fits',
        preview: (
          <RecurringLimitLimitPreview className="bg-black-gradient rounded-2xl" />
        ),
      },
    ],
  },

  {
    title: 'Professional Tools',
    id: 'professional',
    items: [
      {
        to: '/trade/disposable',
        search: { settings: 'range' as const },
        icon: <IconRange className="size-24" />,
        title: 'Range Order',
        description:
          'Text about this Type of strategy, the benefits of it and what kind of users it fits',
        preview: <RangeSellPreview className="bg-black-gradient rounded-2xl" />,
      },
      {
        to: '/trade/recurring',
        search: {
          buySettings: 'range' as const,
          sellSettings: 'range' as const,
        },
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Range',
        description:
          'Text about this Type of strategy, the benefits of it and what kind of users it fits',
        preview: (
          <RecurringRangeRangePreview className="bg-black-gradient rounded-2xl" />
        ),
      },
    ],
  },
];

export const ConnectedLandingPage = () => {
  const [active, setActive] = useState('basic');
  return (
    <div className="grid content-start gap-40">
      {config.ui.tradeCount && <ExplorerHeader />}
      <div
        role="tablist"
        className="tab-list place-self-center flex rounded-2xl"
      >
        {tabs.map(({ title, id }) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            aria-selected={active === id}
            aria-controls={`tabpanel-${id}`}
            onClick={() => setActive(id)}
            className="text-white/60 tab-anchor aria-selected:tab-focus aria-selected:text-white py-16 px-24 text-2xl"
          >
            {title}
          </button>
        ))}
      </div>
      {tabs.map(({ id, items }) => (
        <div
          key={id}
          role="tabpanel"
          id={`tabpanel-${id}`}
          hidden={active !== id}
          aria-labelledby={`tab-${id}`}
        >
          <ul className="place-self-center flex gap-24">
            {items.map((item) => (
              <li
                key={item.title}
                className="bg-white-gradient p-16 grid gap-16 w-[350px] rounded-2xl"
              >
                <header className="flex items-center gap-8">
                  {item.icon}
                  <h3 className="text-16">{item.title}</h3>
                </header>
                <p className="text-14">{item.description}</p>
                {item.preview}
                <Link
                  to={item.to}
                  search={item.search}
                  className="btn-primary-gradient text-center"
                >
                  Trade
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <PreviewCommonStrategyType />
    </div>
  );
};
