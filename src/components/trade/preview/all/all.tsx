import { FullRangePreview } from './full-range';
import { LimitBuyPreview } from './limit-buy';
import { LimitSellPreview } from './limit-sell';
import { OverlappingPreview } from './overlapping';
import { RangeBuyPreview } from './range-buy';
import { RangeSellPreview } from './range-sell';
import { RecurringLimitLimitPreview } from './recurring-limit-limit';
import { RecurringLimitRangePreview } from './recurring-limit-range';
import { RecurringRangeLimitPreview } from './recurring-range-limit';
import { RecurringRangeRangePreview } from './recurring-range-range';
import IconDisposable from 'assets/icons/disposable.svg?react';
import IconRecurring from 'assets/icons/recurring.svg?react';
import IconOverlapping from 'assets/icons/overlapping.svg?react';

const items = [
  {
    title: 'Disposable',
    icon: <IconDisposable className="size-24" />,
    list: [
      {
        name: 'Limit Buy',
        svg: <LimitBuyPreview />,
      },
      {
        name: 'Limit Sell',
        svg: <LimitSellPreview />,
      },
      {
        name: 'Range Buy',
        svg: <RangeBuyPreview />,
      },
      {
        name: 'Range Sell',
        svg: <RangeSellPreview />,
      },
    ],
  },
  {
    title: 'Recurring',
    icon: <IconRecurring className="size-24" />,
    list: [
      {
        name: 'Recurring Limit / Limit',
        svg: <RecurringLimitLimitPreview />,
      },
      {
        name: 'Recurring Limit / Range',
        svg: <RecurringLimitRangePreview />,
      },
      {
        name: 'Recurring Range / Limit',
        svg: <RecurringRangeLimitPreview />,
      },
      {
        name: 'Recurring Range / Range',
        svg: <RecurringRangeRangePreview />,
      },
    ],
  },
  {
    title: 'Liquidity Position',
    icon: <IconOverlapping className="size-24" />,
    list: [
      {
        name: 'Liquidity Position',
        svg: <OverlappingPreview />,
      },
      {
        name: 'Full Range',
        svg: <FullRangePreview />,
      },
    ],
  },
];

export const AllPreview = () => {
  return (
    <ul className="grid gap-24">
      {items.map((item) => (
        <li key={item.title} className="grid gap-16">
          <header className="flex items-center gap-8">
            {item.icon}
            <h3>{item.title}</h3>
          </header>
          <ul className="grid gap-16 grid-cols-[repeat(auto-fill,minmax(335px,1fr))]">
            {item.list.map(({ name, svg }) => (
              <li
                key={name}
                className="grid gap-16 rounded-2xl surface w-fit p-16 animate-scale-up"
              >
                <h4 className="font-normal">{name}</h4>
                <div className="bg-main-900 rounded-2xl p-8 w-300">{svg}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
