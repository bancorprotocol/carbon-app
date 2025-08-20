import { Link } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { PreviewRecurringStrategy } from 'components/trade/preview/recurring';
import { PreviewCommonStrategyType } from 'components/trade/preview/common';
import { PreviewRangeStrategy } from 'components/trade/preview/range';

const items = [
  {
    to: '/trade/overlapping',
    icon: <IconOverlapping className="size-24" />,
    title: 'Liquidity Position',
    preview: (
      <div className="size-[300px] rounded-2xl bg-black-gradient shrink-0 grid place-items-center">
        An animated chart later
      </div>
    ),
    values: ['100% Price Certainty', 'Zero risk of sandwich attacks'],
  },
  {
    to: '/trade/disposable',
    icon: <IconDisposable className="size-24" />,
    title: 'Limit / Range',
    preview: <PreviewRangeStrategy />,
    values: ['Some value for this Disposable'],
  },
  {
    to: '/trade/recurring',
    icon: <IconRecurring className="size-24" />,
    title: 'Recurring',
    preview: <PreviewRecurringStrategy />,
    values: ['Some value for this Recurring'],
  },
  {
    to: '/trade/market',
    icon: <IconMarket className="size-24" />,
    title: 'Swap',
    preview: (
      <div className="size-[300px] rounded-2xl bg-black-gradient shrink-0 grid place-items-center">
        Something here later
      </div>
    ),
    values: ['The original Swap !'],
  },
];

export const TradeList = () => {
  return (
    <>
      <PreviewCommonStrategyType />
      <nav className="grid grid-cols-2 gap-16 col-span-2">
        {items.map((item, i) => (
          <Link
            key={item.to}
            style={{ animationDelay: `${i * 50}ms` }}
            className="grid gap-16 rounded-2xl bg-white-gradient p-16 animate-scale-up"
            to={item.to}
          >
            <header className="flex items-center gap-16">
              {item.icon}
              <h3>{item.title}</h3>
            </header>
            <div className="flex gap-16">
              {item.preview}
              <ul>
                {item.values.map((value, i) => (
                  <li key={i} className="flex items-center gap-8">
                    <svg
                      viewBox="0 0 100 100"
                      width="16"
                      height="16"
                      className="shrink-0"
                    >
                      <polygon
                        points="0,50 50,0 100,50 50,100"
                        fill="none"
                        stroke="var(--color-primary)"
                      />
                      <polygon
                        points="25,50 50,25 75,50 50,75"
                        fill="var(--color-primary)"
                      />
                    </svg>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
};
