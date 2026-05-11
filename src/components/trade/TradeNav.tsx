import IconDisposable from 'assets/icons/disposable.svg?react';
import IconRecurring from 'assets/icons/recurring.svg?react';
import IconOverlapping from 'assets/icons/overlapping.svg?react';
import IconMarket from 'assets/icons/market.svg?react';
import IconRange from 'assets/icons/range.svg?react';
import IconAuction from 'assets/icons/auction.svg?react';
import IconChannel from 'assets/icons/channel.svg?react';
import KeyboardArrowDownIcon from 'assets/icons/keyboard_arrow_down.svg?react';

import { Link, useRouterState } from 'libs/routing';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { FC, useMemo } from 'react';
import { useMenuCtx } from 'components/common/dropdownMenu/utils';
import { cn } from 'utils/helpers';
import style from './TradeNav.module.css';

type StrategyLink =
  (typeof types)[number]['groups'][number]['strategies'][number];
type ActivePage = {
  type: string;
  strategy: string;
};

const types = [
  {
    id: 'essentials',
    title: 'Essentials',
    groups: [
      {
        label: '',
        strategies: [
          {
            id: 'swap',
            name: 'Swap',
            to: '/trade/market' as const,
            search: undefined,
            icon: <IconMarket className="hidden md:block size-20" />,
            isNew: false,
          },
          {
            id: 'fullRange',
            name: 'Full range',
            to: '/trade/overlapping' as const,
            search: { preset: 'Infinity' },
            icon: <IconOverlapping className="hidden md:block size-20" />,
            isNew: false,
          },
          {
            id: 'overlapping',
            name: 'Concentrated',
            to: '/trade/overlapping' as const,
            search: undefined,
            icon: <IconOverlapping className="hidden md:block size-20" />,
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    groups: [
      {
        label: 'Price based strategies',
        strategies: [
          {
            id: 'limitBuy',
            name: 'Limit buy',
            to: '/trade/disposable' as const,
            search: { settings: 'limit' as const, direction: 'buy' as const },
            icon: <IconDisposable className="hidden md:block size-20" />,
            isNew: false,
          },
          {
            id: 'limitSell',
            name: 'Limit sell',
            to: '/trade/disposable' as const,
            search: { settings: 'limit' as const },
            icon: <IconDisposable className="hidden md:block size-20" />,
            isNew: false,
          },
          {
            id: 'recurringLimit',
            name: 'Recurring limit',
            to: '/trade/recurring' as const,
            search: { buySettings: 'limit', sellSettings: 'limit' } as const,
            icon: <IconRecurring className="hidden md:block size-20" />,
            isNew: false,
          },
        ],
      },
      {
        label: 'Time based strategies',
        strategies: [
          {
            id: 'auction-buy',
            name: 'Auction Buy',
            to: '/trade/auction' as const,
            search: { direction: 'buy' } as const,
            icon: <IconAuction className="hidden md:block size-20" />,
            isNew: true,
          },
          {
            id: 'auction-sell',
            name: 'Auction Sell',
            to: '/trade/auction' as const,
            search: { direction: 'sell' } as const,
            icon: <IconAuction className="hidden md:block size-20" />,
            isNew: true,
          },
          {
            id: 'quick-auction',
            name: 'Fast auction',
            to: '/trade/quick-auction' as const,
            search: {} as const,
            icon: <IconAuction className="hidden md:block size-20" />,
            isNew: true,
          },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    groups: [
      {
        label: 'Price based strategies',
        strategies: [
          {
            id: 'rangeBuy',
            name: 'Range buy',
            to: '/trade/disposable' as const,
            search: { settings: 'range' as const, direction: 'buy' as const },
            icon: <IconRange className="hidden md:block size-20" />,
            isNew: false,
          },
          {
            id: 'rangeSell',
            name: 'Range sell',
            to: '/trade/disposable' as const,
            search: { settings: 'range' as const },
            icon: <IconRange className="hidden md:block size-20" />,
            isNew: false,
          },
          {
            id: 'recurringRange',
            name: 'Recurring range',
            to: '/trade/recurring' as const,
            search: { buySettings: 'range', sellSettings: 'range' } as const,
            icon: <IconRecurring className="hidden md:block size-20" />,
            isNew: false,
          },
        ],
      },
      {
        label: 'Time based strategies',
        strategies: [
          {
            id: 'channel',
            name: 'Channel',
            to: '/trade/channel' as const,
            search: {} as const,
            icon: <IconChannel className="hidden md:block size-20" />,
            isNew: true,
          },
          {
            id: 'quick-channel',
            name: 'Fast channel',
            to: '/trade/quick-channel' as const,
            search: {} as const,
            icon: <IconChannel className="hidden md:block size-20" />,
            isNew: true,
          },
          {
            id: 'triangle',
            name: 'Triangle',
            to: '/trade/triangle' as const,
            search: {} as const,
            icon: <IconChannel className="hidden md:block size-20" />,
            isNew: true,
          },
          {
            id: 'quick-triangle',
            name: 'Fast triangle',
            to: '/trade/quick-triangle' as const,
            search: {} as const,
            icon: <IconChannel className="hidden md:block size-20" />,
            isNew: true,
          },
        ],
      },
    ],
  },
];

export const TradeNav = () => {
  const { location } = useRouterState();
  const { aboveBreakpoint } = useBreakpoints();

  const active = useMemo((): ActivePage | undefined => {
    for (const type of types) {
      for (const group of type.groups) {
        for (const strategy of group.strategies) {
          if (strategy.to === location.pathname) {
            if (!strategy.search)
              return { type: type.id, strategy: strategy.id };
            const sameSearch = Object.entries(strategy.search).every(
              ([key, value]) => {
                return (location.search as any)[key] === value;
              },
            );
            if (sameSearch) return { type: type.id, strategy: strategy.id };
          }
        }
      }
    }
    // TODO: find a better way to fallback to Recurring range range
    // Fallback to "Recurring Range Orders"
    return {
      type: 'advanced',
      strategy: 'recurringRange',
    };
  }, [location]);

  return (
    <div
      className="surface flex rounded-full overflow-clip animate-slide-up flex-1 sm:gap-8 2xl:grid 2xl:rounded-2xl tab-list p-4"
      style={{ animationDelay: '100ms' }}
    >
      {types.map(({ id, title, groups }) => (
        <DropdownMenu
          key={title}
          placement={aboveBreakpoint('2xl') ? 'right-start' : 'bottom'}
          className="rounded-xl p-8 grid gap-4"
          button={(attr) => (
            <button
              {...attr}
              aria-selected={active?.type === id}
              data-testid={id}
              className={cn(style.tradeType)}
            >
              <span className="text-14 sm:text-18 2xl:justify-self-start self-center">
                {title}
              </span>
              {groups.map(({ strategies }) => {
                return strategies.map(({ id, name, icon }) => (
                  <p
                    key={name}
                    hidden={id !== active?.strategy}
                    className="flex items-center gap-8 text-10 sm:text-16 justify-self-center 2xl:justify-self-start self-center"
                  >
                    {icon}
                    {name}
                  </p>
                ));
              })}
              <KeyboardArrowDownIcon className="self-center justify-self-end size-24 hidden 2xl:block -rotate-90" />
            </button>
          )}
        >
          {groups.map(({ label, strategies }) => (
            <>
              {label && (
                <h4 className="text-12 text-main-0/60 px-8">{label}</h4>
              )}
              {strategies.map((strategy) => (
                <StrategyLink
                  key={strategy.name}
                  strategy={strategy}
                  selected={active?.strategy === strategy.id}
                />
              ))}
            </>
          ))}
        </DropdownMenu>
      ))}
    </div>
  );
};

interface Props {
  strategy: StrategyLink;
  selected: boolean;
}

const StrategyLink: FC<Props> = (props) => {
  const menu = useMenuCtx();
  const { id, name, to, search, icon, isNew } = props.strategy;
  return (
    <Link
      key={name}
      role="menuitemradio"
      className="rounded-sm flex w-full items-center gap-8 p-12 hover:bg-main-900/40 data-[selected=true]:bg-main-900/60"
      to={to}
      search={(s) => ({
        base: s.base,
        quote: s.quote,
        marketPrice: s.marketPrice,
        chartStart: s.chartStart,
        chartEnd: s.chartEnd,
        ...search,
      })}
      replace={true}
      resetScroll={false}
      /* override default aria-page because of fullrange */
      data-selected={props.selected}
      data-testid={id}
      onClick={() => menu.setMenuOpen(false)}
    >
      {icon}
      <span className="flex-1">{name}</span>
      {isNew && (
        <span className="ps-8 text-14 text-secondary font-weight-500">
          New!
        </span>
      )}
    </Link>
  );
};
