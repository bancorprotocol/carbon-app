import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { ReactComponent as IconRange } from 'assets/icons/range.svg';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';

import { Link, useRouterState } from 'libs/routing';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { FC, useMemo } from 'react';
import { useMenuCtx } from 'components/common/dropdownMenu/utils';
import { cn } from 'utils/helpers';
import style from './TradeNav.module.css';

type StrategyLink = (typeof types)[number]['strategies'][number];
type ActivePage = {
  type: string;
  strategy: StrategyLink;
};

const types = [
  {
    title: 'Essentials',
    strategies: [
      {
        name: 'Swap',
        to: '/trade/market' as const,
        search: undefined,
        icon: <IconMarket className="hidden md:block size-20" />,
      },
      {
        name: 'Liquidity Position',
        to: '/trade/overlapping' as const,
        search: undefined,
        icon: <IconOverlapping className="hidden md:block size-20" />,
      },
      {
        name: 'Full Range',
        to: '/trade/overlapping' as const,
        search: {},
        icon: <IconOverlapping className="hidden md:block size-20" />,
      },
    ],
  },
  {
    title: 'Intermediate',
    strategies: [
      {
        name: 'Limit Buy',
        to: '/trade/disposable' as const,
        search: { settings: 'limit' as const, direction: 'buy' as const },
        icon: <IconDisposable className="hidden md:block size-20" />,
      },
      {
        name: 'Limit Sell',
        to: '/trade/disposable' as const,
        search: { settings: 'limit' as const, direction: 'sell' as const },
        icon: <IconDisposable className="hidden md:block size-20" />,
      },
      {
        name: 'Recurring Limit',
        to: '/trade/recurring' as const,
        search: { buySettings: 'limit', sellSettings: 'limit' } as const,
        icon: <IconRecurring className="hidden md:block size-20" />,
      },
    ],
  },
  {
    title: 'Advanced',
    strategies: [
      {
        name: 'Range Buy',
        to: '/trade/disposable' as const,
        search: { settings: 'range' as const, direction: 'buy' as const },
        icon: <IconRange className="hidden md:block size-20" />,
      },
      {
        name: 'Range Sell',
        to: '/trade/disposable' as const,
        search: { settings: 'range' as const, direction: 'sell' as const },
        icon: <IconRange className="hidden md:block size-20" />,
      },
      {
        name: 'Recurring Range',
        to: '/trade/recurring' as const,
        search: { buySettings: 'range', sellSettings: 'range' } as const,
        icon: <IconRecurring className="hidden md:block size-20" />,
      },
      //   {
      //     label: 'Auction',
      //     svg: <IconSlow className="hidden size-14 md:inline" />,
      //     to: '/trade/auction' as const,
      //     text: '',
      //     id: 'auction',
      //   },
      //   {
      //     label: 'Quick Auction',
      //     svg: <IconFast className="hidden size-16 md:inline" />,
      //     to: '/trade/quick-auction' as const,
      //     text: '',
      //     testId: 'strategy-gradient-regular',
      //     id: 'quick-auction',
      //   },
      //   {
      //     label: 'Custom',
      //     svg: <IconSlow className="hidden size-14 md:inline" />,
      //     to: '/trade/custom' as const,
      //     text: '',
      //     id: 'custom',
      //   },
      //   {
      //     label: 'Quick Custom',
      //     svg: <IconFast className="hidden size-16 md:inline" />,
      //     to: '/trade/quick-custom' as const,
      //     text: '',
      //     testId: 'strategy-gradient-quick',
      //     id: 'quick-custom',
      //   },
    ],
  },
];

export const TradeNav = () => {
  const { location } = useRouterState();
  const { aboveBreakpoint } = useBreakpoints();

  //TODO: MAKE RANGE THE DEFAULT SETTINGS FOR THE ORDERS

  const active = useMemo((): ActivePage | undefined => {
    for (const type of types) {
      for (const strategy of type.strategies) {
        if (strategy.to === location.pathname) {
          if (!strategy.search) return { type: type.title, strategy };
          const sameSearch = Object.entries(strategy.search).every(
            ([key, value]) => {
              return (location.search as any)[key] === value;
            },
          );
          if (sameSearch) return { type: type.title, strategy };
        }
      }
    }
    // TODO: find a better way to fallback to Recurring range range
    // Fallback to "Recurring Range Orders"
    return {
      type: types[2].title,
      strategy: types[2].strategies[1],
    };
  }, [location]);

  return (
    <div
      className="surface flex rounded-full overflow-clip animate-slide-up flex-1 sm:gap-8 2xl:grid 2xl:rounded-2xl"
      style={{ animationDelay: '100ms' }}
    >
      {types.map(({ title, strategies }) => (
        <DropdownMenu
          key={title}
          placement={aboveBreakpoint('2xl') ? 'right-start' : 'bottom-end'}
          className="rounded-xl p-8 grid gap-4"
          button={(attr) => (
            <button
              {...attr}
              aria-selected={active?.type === title}
              className={cn(style.tradeType)}
            >
              <span className="text-14 sm:text-18 2xl:justify-self-start self-center">
                {title}
              </span>
              {strategies.map(({ name, icon }) => (
                <p
                  key={name}
                  hidden={name !== active?.strategy.name}
                  className="flex items-center gap-8 text-12 sm:text-16 justify-self-center 2xl:justify-self-start self-center"
                >
                  {icon}
                  {name}
                </p>
              ))}
              <ChevronIcon className="self-center justify-self-end size-16 hidden 2xl:block -rotate-90" />
            </button>
          )}
        >
          {strategies.map((strategy) => (
            <StrategyLink key={strategy.name} strategy={strategy} />
          ))}
        </DropdownMenu>
      ))}
    </div>
  );
};

const StrategyLink: FC<{ strategy: StrategyLink }> = (props) => {
  const menu = useMenuCtx();
  const { name, to, search, icon } = props.strategy;
  return (
    <Link
      key={name}
      role="menuitemradio"
      className="rounded-sm flex w-full items-center gap-8 p-12 hover:bg-black/40 aria-page:bg-black/60"
      to={to}
      search={search}
      onClick={() => menu.setMenuOpen(false)}
    >
      {icon}
      <span>{name}</span>
    </Link>
  );
};
