import { Link } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { PreviewRecurringLimitStrategy } from 'components/trade/preview/recurring-limit';
import { PreviewLimitStrategy } from 'components/trade/preview/limit';
import { PreviewOverlappingStrategy } from 'components/trade/preview/overlapping';
import { PreviewFullRangeStrategy } from 'components/trade/preview/full-range';
import { AllPreview } from 'components/trade/preview/all/all';
import { PreviewCommonStrategyType } from 'components/trade/preview/common';
import { WalletConnect } from 'components/common/walletConnect';
import { PreviewRecurringRangeStrategy } from 'components/trade/preview/recurring-range';

const sections = [
  {
    title: 'Auto Compounding Strategies',
    items: [
      {
        to: '/trade/recurring',
        search: {},
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Limit',
        preview: <PreviewRecurringLimitStrategy />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
      {
        to: '/trade/recurring',
        search: {
          buySettings: 'range' as const,
          sellSettings: 'range' as const,
        },
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Range',
        preview: <PreviewRecurringRangeStrategy />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Liquidity Position',
        search: {},
        preview: <PreviewOverlappingStrategy />,
        targets: ['Liquidity Providers', 'Token Projects'],
      },
    ],
  },
  {
    title: 'AMM Features',
    items: [
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
      {
        to: '/trade/disposable',
        search: {},
        icon: <IconDisposable className="size-24" />,
        title: 'Limit',
        preview: <PreviewLimitStrategy />,
        targets: ['Traders', 'Institutions'],
      },
      // {
      //   to: '/trade/disposable',
      //   search: { settings: 'range' as const },
      //   icon: <IconDisposable className="size-24" />,
      //   title: 'Range',
      //   preview: <PreviewRangeStrategy />,
      //   targets: ['Traders', 'Institutions'],
      // },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Full Range',
        search: {},
        preview: <PreviewFullRangeStrategy />,
        targets: ['Liquidity Providers', 'Token Projects'],
      },
    ],
  },
];

export const TradeList = () => {
  return (
    <div className="grid gap-40 justify-items-center">
      <PreviewCommonStrategyType />
      <WalletConnect />
      {sections.map((section, i) => (
        <section key={i} className="grid gap-16 justify-self-center">
          <h2>{section.title}</h2>
          <nav className="grid grid-cols-3 gap-16">
            {section.items.map((item, i) => (
              <Link
                key={i}
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
      <hr className="w-[50%]" />
      <section className="grid gap-32">
        <h2 className="text-center">Discover All strategies</h2>
        <AllPreview />
      </section>
    </div>
  );
};
