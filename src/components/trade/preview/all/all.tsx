import { FullRange } from './full-range';
import { LimitBuyPreview } from './limit-buy';
import { LimitSellPreview } from './limit-sell';
import { OverlappingPreview } from './overlapping';
import { RangeBuyPreview } from './range-buy';
import { RangeSellPreview } from './range-sell';
import { RecurringLimitLimitPreview } from './recurring-limit-limit';
import { RecurringLimitRangePreview } from './recurring-limit-range';
import { RecurringRangeLimitPreview } from './recurring-range-limit';
import { RecurringRangeRangePreview } from './recurring-range-range';

const items = [
  {
    title: 'Disposable',
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
    list: [
      {
        name: 'Liquidity Position',
        svg: <OverlappingPreview />,
      },
      {
        name: 'Full Range',
        svg: <FullRange />,
      },
    ],
  },
];

export const AllPreview = () => {
  return (
    <ul className="grid gap-24">
      {items.map((item) => (
        <li key={item.title} className="grid gap-16">
          <h3>{item.title}</h3>
          <ul className="grid gap-16 grid-cols-[repeat(auto-fit,300px)]">
            {item.list.map(({ name, svg }) => (
              <li
                key={name}
                className="grid gap-16 rounded-2xl bg-white-gradient p-16 animate-scale-up"
              >
                <h4 className="font-normal">{name}</h4>
                <div className="bg-black-gradient rounded-2xl p-8">{svg}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
