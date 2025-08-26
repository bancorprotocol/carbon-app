import { Link } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { PreviewRecurringStrategy } from 'components/trade/preview/recurring';
import { PreviewCommonStrategyType } from 'components/trade/preview/common';
import { PreviewRangeStrategy } from 'components/trade/preview/range';
import { PreviewLimitStrategy } from 'components/trade/preview/limit';

const sections = [
  {
    title: 'Exclusive to Carbon DeFi',
    items: [
      {
        to: '/trade/disposable',
        search: {},
        icon: <IconDisposable className="size-24" />,
        title: 'Limit',
        preview: <PreviewLimitStrategy />,
        targets: ['Traders', 'Institutions'],
      },
      {
        to: '/trade/disposable',
        search: { settings: 'range' as const },
        icon: <IconDisposable className="size-24" />,
        title: 'Range',
        preview: <PreviewRangeStrategy />,
        targets: ['Traders', 'Institutions'],
      },
      {
        to: '/trade/recurring',
        search: {},
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring',
        preview: <PreviewRecurringStrategy />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
    ],
  },
  {
    title: 'AMM Features',
    items: [
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Liquidity Position',
        search: {},
        preview: (
          <div className="size-[300px] rounded-2xl bg-black-gradient shrink-0 grid place-items-center">
            An animated chart later
          </div>
        ),
        targets: ['Liquidity Providers', 'Token Projects'],
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Full Range',
        search: {},
        preview: (
          <div className="size-[300px] rounded-2xl bg-black-gradient shrink-0 grid place-items-center">
            An animated chart later
          </div>
        ),
        targets: ['Liquidity Providers', 'Token Projects'],
      },
      {
        to: '/trade/market',
        icon: <IconMarket className="size-24" />,
        title: 'Swap',
        search: {},
        preview: (
          <div className="size-[300px] rounded-2xl bg-black-gradient shrink-0 grid place-items-center">
            Something here later
          </div>
        ),
        targets: ['Swappers'],
      },
    ],
  },
];

export const TradeList = () => {
  return (
    <>
      <PreviewCommonStrategyType />
      {sections.map((section, i) => (
        <section key={i} className="grid gap-24 col-span-2">
          <h2>{section.title}</h2>
          <nav className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-16">
            {section.items.map((item, i) => (
              <Link
                key={item.to}
                style={{ animationDelay: `${i * 50}ms` }}
                className="grid gap-16 rounded-2xl bg-white-gradient p-16 animate-scale-up"
                to={item.to}
                search={item.search}
              >
                <header className="flex items-center gap-16">
                  {item.icon}
                  <h3>{item.title}</h3>
                </header>
                {item.preview}
                <footer>
                  <ul className="flex gap-8 text-14">
                    {item.targets.map((target) => (
                      <li
                        className="px-8 py-4 rounded-sm border border-secondary/50 bg-secondary/5"
                        key={target}
                      >
                        {target}
                      </li>
                    ))}
                  </ul>
                </footer>
              </Link>
            ))}
          </nav>
        </section>
      ))}
    </>
  );
};
