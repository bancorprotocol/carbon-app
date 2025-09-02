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
import { PreviewRecurringRangeStrategy } from 'components/trade/preview/recurring-range';
import { PreviewRangeStrategy } from 'components/trade/preview/range';
import { useState } from 'react';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { Button } from 'components/common/button';
import style from './list.module.css';

const sections = [
  {
    title: 'Basic',
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
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Liquidity Position',
        search: {},
        preview: <PreviewOverlappingStrategy />,
        targets: ['Liquidity Providers', 'Token Projects'],
      },
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
  {
    title: 'Advanced',
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
        to: '/trade/recurring',
        search: {},
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Limit',
        preview: <PreviewRecurringLimitStrategy />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
    ],
  },

  {
    title: 'Professional',
    items: [
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
        search: {
          buySettings: 'range' as const,
          sellSettings: 'range' as const,
        },
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Range',
        preview: <PreviewRecurringRangeStrategy />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
    ],
  },
];

export const TradeList = () => {
  const [type, setType] = useState('recurring');
  return (
    <div className="grid gap-200">
      <PreviewCommonStrategyType />
      <div className={style.main}>
        <section className={style.mainChart}>
          <header className="flex items-center justify-between">
            <RadioGroup className="text-20">
              <Radio
                checked={type === 'recurring'}
                onChange={() => setType('recurring')}
              >
                Orders
              </Radio>
              <Radio
                checked={type === 'full-range'}
                onChange={() => setType('full-range')}
              >
                Liquidity
              </Radio>
            </RadioGroup>
            <Button variant="success" className="px-16 py-8 flex gap-8">
              Create
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
              >
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
              </svg>
            </Button>
          </header>
          <div className="self-start w-[500px] h-[500px] me-[300px]">
            {type === 'recurring' && <PreviewRecurringRangeStrategy />}
            {type === 'full-range' && <PreviewFullRangeStrategy />}
          </div>
          <p className="text-18">
            <b className="text-buy">Buy</b> low,{' '}
            <b className="text-sell">Sell</b> High, earn{' '}
            <b className="text-gradient">more</b> with CarbonDefi
          </p>
        </section>
      </div>
      <div className="grid gap-120">
        {sections.map((section, i) => (
          <section key={i} className={style.section}>
            <h2>{section.title}</h2>
            <nav className="grid grid-cols-3 gap-16">
              {section.items.map((item, i) => (
                <Link
                  key={i}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="grid gap-16 rounded-2xl bg-black-gradient p-16 animate-scale-up border-1 border-white/20"
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
      </div>
      <section className="grid gap-32">
        <h2 className="text-center">Discover All strategies</h2>
        <AllPreview />
      </section>
    </div>
  );
};
