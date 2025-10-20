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
        icon: <IconMarket className="size-24" />,
      },
      {
        name: 'Liquidity Position',
        to: '/trade/overlapping' as const,
        search: undefined,
        icon: <IconOverlapping className="size-24" />,
      },
    ],
  },
  {
    title: 'Intermediate',
    strategies: [
      {
        name: 'Limit Order',
        to: '/trade/disposable' as const,
        search: { settings: 'limit' as const },
        icon: <IconDisposable className="size-24" />,
      },
      {
        name: 'Recurring Limit Orders',
        to: '/trade/recurring' as const,
        search: { buySettings: 'limit', sellSettings: 'limit' } as const,
        icon: <IconRecurring className="size-24" />,
      },
    ],
  },
  {
    title: 'Advanced',
    strategies: [
      {
        name: 'Range Order',
        to: '/trade/disposable' as const,
        search: { settings: 'range' as const },
        icon: <IconRange className="size-24" />,
      },
      {
        name: 'Recurring Range Orders',
        to: '/trade/recurring' as const,
        search: undefined,
        icon: <IconRecurring className="size-24" />,
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
  }, [location]);

  return (
    <div
      className="surface 2xl:grid md:flex grid content-start rounded-2xl xl:max-2xl:rounded-full overflow-clip animate-slide-up"
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
              className="py-16 px-24 text-start flex gap-8 items-center justify-between  flex-1"
            >
              {active?.type === title ? (
                <div className="grid text-12 text-nowrap">
                  <span>{title}</span>
                  <p className="flex items-center gap-8 text-16">
                    {active.strategy.icon}
                    {active.strategy.name}
                  </p>
                </div>
              ) : (
                <span className="text-18">{title}</span>
              )}
              <ChevronIcon className="size-16 2xl:-rotate-90" />
            </button>
          )}
        >
          {strategies.map((strategy) => (
            <StrategyLink
              key={strategy.name}
              strategy={strategy}
              active={active}
            />
          ))}
        </DropdownMenu>
      ))}
    </div>
  );
};

const StrategyLink: FC<{ strategy: StrategyLink; active?: ActivePage }> = (
  props,
) => {
  const menu = useMenuCtx();
  const { name, to, search, icon } = props.strategy;
  return (
    <Link
      key={name}
      role="menuitemradio"
      className="rounded-sm flex w-full items-center gap-x-10 p-12 hover:bg-black/40 aria-page:bg-black/60"
      to={to}
      search={search}
      aria-current={props.active?.strategy?.name === name}
      onClick={() => menu.setMenuOpen(false)}
    >
      {icon}
      <span>{name}</span>
    </Link>
  );
};
