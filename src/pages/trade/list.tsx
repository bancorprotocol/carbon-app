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
      <div className="size-[300px] rounded-2xl bg-black-gradient shrink-0"></div>
    ),
    values: [
      '100% Price Certainty',
      'Zero risk of sandwich attacks',
      'Built-in solver to fill your order using chain-wide liquidity',
    ],
  },
  {
    to: '/trade/disposable',
    icon: <IconDisposable className="size-24" />,
    title: 'Limit / Range',
    preview: <PreviewRangeStrategy />,
    values: [],
  },
  {
    to: '/trade/recurring',
    icon: <IconRecurring className="size-24" />,
    title: 'Recurring',
    preview: <PreviewRecurringStrategy />,
    values: [],
  },
  {
    to: '/trade/market',
    icon: <IconMarket className="size-24" />,
    title: 'Swap',
    preview: (
      <div className="size-[300px] rounded-2xl bg-black-gradient shrink-0"></div>
    ),
    values: [],
  },
];

export const TradeList = () => {
  return (
    <>
      <PreviewCommonStrategyType />
      <nav className="grid grid-cols-2 gap-16 col-span-2">
        {items.map((item) => (
          <Link
            key={item.to}
            className="grid gap-16 rounded-2xl bg-white-gradient p-16"
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
                  <li key={i}>{value}</li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
};
