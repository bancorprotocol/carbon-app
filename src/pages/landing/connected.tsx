import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { ReactComponent as IconRange } from 'assets/icons/range.svg';
import { OverlappingPreview } from 'components/trade/preview/all/overlapping';
import { FullRangePreview } from 'components/trade/preview/all/full-range';
import { LimitSellPreview } from 'components/trade/preview/all/limit-sell';
import { LimitBuyPreview } from 'components/trade/preview/all/limit-buy';
import { RecurringLimitLimitPreview } from 'components/trade/preview/all/recurring-limit-limit';
import { RangeSellPreview } from 'components/trade/preview/all/range-sell';
import { RecurringRangeRangePreview } from 'components/trade/preview/all/recurring-range-range';
import { ExplorerHeader } from 'components/explorer/ExplorerHeader';
import { PreviewCommonStrategyType } from 'components/trade/preview/common';
import { RangeBuyPreview } from 'components/trade/preview/all/range-buy';
import config from 'config';

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
        preview: <LimitSellPreview className="bg-black rounded-2xl" />,
        description:
          'Exchange one token for another at the current market price.',
        unique: false,
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Concentrated Liquidity Position',
        description:
          'Provide liquidity in your chosen price range - collect fees that auto-compound, with no preset fee tiers.',
        search: {},
        preview: <OverlappingPreview className="bg-black rounded-2xl" />,
        unique: false,
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Full Range Liquidity Position',
        description:
          'Provide liquidity from zero to infinity for continuous exposure, auto-compounding fees, with no preset fee tiers.',
        search: {},
        preview: <FullRangePreview className="bg-black rounded-2xl" />,
        unique: false,
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
        title: 'Limit Buy',
        description:
          'Buy the dip. Set an exact buy price with full price certainty.',
        preview: <LimitBuyPreview className="bg-black rounded-2xl" />,
        unique: false,
      },
      {
        to: '/trade/disposable',
        search: {},
        icon: <IconDisposable className="size-24" />,
        title: 'Limit Sell',
        description:
          'Sell the rally. Set an exact sell price with full price certainty.',
        preview: <LimitSellPreview className="bg-black rounded-2xl" />,
        unique: false,
      },
      {
        to: '/trade/recurring',
        search: {},
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Limit',
        description:
          'A continuous buy low, sell high strategy made up of linked buy and sell limit orders. Fund one or both orders, with newly acquired tokens automatically funding the opposite linked order.',
        preview: (
          <RecurringLimitLimitPreview className="bg-black rounded-2xl" />
        ),
        unique: true,
      },
    ],
  },

  {
    title: 'Professional Tools',
    id: 'professional',
    items: [
      {
        to: '/trade/disposable',
        search: { settings: 'range' as const, direction: 'buy' as const },
        icon: <IconRange className="size-24" />,
        title: 'Range Order',
        description:
          'Scale into a position over a custom price range to buy gradually as the price falls.',
        preview: <RangeSellPreview className="bg-black rounded-2xl" />,
        unique: true,
      },
      {
        to: '/trade/disposable',
        search: { settings: 'range' as const, direction: 'sell' as const },
        icon: <IconRange className="size-24" />,
        title: 'Range Order',
        description:
          'Scale out of a position over a custom price range to sell gradually as the price rises.',
        preview: <RangeBuyPreview className="bg-black rounded-2xl" />,
        unique: true,
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
          'Linked range orders create a continuous buy low, sell high strategy where newly acquired tokens automatically fund the opposite order.',
        preview: (
          <RecurringRangeRangePreview className="bg-black rounded-2xl" />
        ),
        unique: true,
      },
    ],
  },
];

export const ConnectedLandingPage = () => {
  const [active, setActive] = useState('basic');
  return (
    <>
      {config.ui.tradeCount && <ExplorerHeader />}
      <div className="mx-auto grid w-full gap-32 p-16 max-w-[1920px]">
        <div
          role="tablist"
          className="tab-list place-self-center flex rounded-2xl px-16"
        >
          {tabs.map(({ title, id }) => (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              aria-selected={active === id}
              aria-controls={`tabpanel-${id}`}
              onClick={() => setActive(id)}
              className="text-white/60 tab-anchor aria-selected:tab-focus py-8 px-16 text-16 lg:text-2xl lg:py-16 lg:px-24"
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
            <ul className="place-self-center flex gap-24 flex-wrap justify-center px-16">
              {items.map((item) => (
                <li
                  key={item.title}
                  className="surface p-16 grid gap-16 w-[300px] md:w-[350px] rounded-2xl"
                >
                  <header className="flex items-center gap-8">
                    {item.icon}
                    <h3 className="text-16">{item.title}</h3>
                  </header>
                  <p className="text-14">{item.description}</p>
                  <div className="grid relative">
                    <Link to={item.to} search={item.search}>
                      {item.preview}
                    </Link>
                    {item.unique && (
                      <svg
                        width="135"
                        height="35"
                        viewBox="0 0 135 35"
                        className="absolute -right-36 top-16"
                      >
                        <polygon
                          points="115,20 133,20 115,30"
                          fill="var(--color-main-600)"
                        />
                        <path
                          d="M4.93521 2.30119C5.64826 1.05809 6.97184 0.291443 8.40492 0.291443H129.088C131.297 0.291443 133.088 2.0823 133.088 4.29144V18.2914C133.088 20.5006 131.297 22.2914 129.088 22.2914H8.40492C6.97184 22.2914 5.64826 21.5248 4.93521 20.2817L0.919948 13.2817C0.212894 12.0491 0.212894 10.5338 0.919949 9.30119L4.93521 2.30119Z"
                          fill="url(#svg-brand-gradient)"
                        />
                        <text
                          x="20"
                          y="6"
                          height="14"
                          width="85"
                          fontSize="12"
                          dominantBaseline="hanging"
                        >
                          Carbon Unique
                        </text>
                      </svg>
                    )}
                  </div>
                  <Link
                    to={item.to}
                    search={item.search}
                    className="btn-primary-gradient text-center "
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
    </>
  );
};
