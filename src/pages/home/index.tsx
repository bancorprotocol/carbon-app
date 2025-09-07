import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { PreviewFullRangeStrategy } from 'components/trade/preview/full-range';
import { PreviewCommonStrategyType } from 'components/trade/preview/common';
import { PreviewRecurringRangeStrategy } from 'components/trade/preview/recurring-range';
import { useEffect, useId } from 'react';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { Button } from 'components/common/button';
import style from './index.module.css';
import { OverlappingPreview } from 'components/trade/preview/all/overlapping';
import { FullRangePreview } from 'components/trade/preview/all/full-range';
import { LimitSellPreview } from 'components/trade/preview/all/limit-sell';
import { RecurringLimitLimitPreview } from 'components/trade/preview/all/recurring-limit-limit';
import { RangeSellPreview } from 'components/trade/preview/all/range-sell';
import { RecurringRangeRangePreview } from 'components/trade/preview/all/recurring-range-range';
import { AllPreview } from 'components/trade/preview/all/all';

const sections = [
  {
    title: 'Basic',
    id: 'basic' as const,
    items: [
      {
        to: '/trade/market',
        icon: <IconMarket className="size-24" />,
        title: 'Swap',
        search: {},
        preview: (
          <div className="size-[250px] rounded-2xl bg-black-gradient shrink-0 grid place-items-center">
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
        preview: <OverlappingPreview />,
        targets: ['Liquidity Providers', 'Token Projects'],
      },
      {
        to: '/trade/overlapping',
        icon: <IconOverlapping className="size-24" />,
        title: 'Full Range',
        search: {},
        preview: <FullRangePreview />,
        targets: ['Liquidity Providers', 'Token Projects'],
      },
    ],
  },
  {
    title: 'Advanced',
    id: 'advanced' as const,
    items: [
      {
        to: '/trade/disposable',
        search: {},
        icon: <IconDisposable className="size-24" />,
        title: 'Limit',
        preview: <LimitSellPreview />,
        targets: ['Traders', 'Institutions'],
      },
      {
        to: '/trade/recurring',
        search: {},
        icon: <IconRecurring className="size-24" />,
        title: 'Recurring Limit',
        preview: <RecurringLimitLimitPreview />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
    ],
  },

  {
    title: 'Professional',
    id: 'professional' as const,
    items: [
      {
        to: '/trade/disposable',
        search: { settings: 'range' as const },
        icon: <IconDisposable className="size-24" />,
        title: 'Range',
        preview: <RangeSellPreview />,
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
        preview: <RecurringRangeRangePreview />,
        targets: ['Stablecoin Projects', 'Advance Traders'],
      },
    ],
  },
];

export const TradeList = () => {
  const widgetId = useId();
  const { type = 'orders', level = 'basic' } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const setType = (type: 'orders' | 'liquidity') => {
    navigate({ search: { type }, replace: true, resetScroll: false });
  };
  const setLevel = (level: 'basic' | 'advanced' | 'professional') => {
    navigate({ search: { level }, replace: true, resetScroll: false });
  };
  useEffect(() => {
    const root = document.getElementById('root')!;
    const widget = document.getElementById(widgetId)!;
    root.classList.add('hide-bg');
    let top = true;
    const handler = () => {
      if (top !== window.scrollY < 100) {
        top = window.scrollY < 100;
        if (window.scrollY > 100) {
          root.classList.remove('hide-bg');
          widget.dataset.hidden = 'true';
        } else {
          root.classList.add('hide-bg');
          widget.dataset.hidden = 'false';
        }
      }
    };
    document.addEventListener('scroll', handler);
    return () => {
      root.classList.remove('hide-bg');
      document.removeEventListener('scroll', handler);
    };
  }, [widgetId]);

  return (
    <div className="grid gap-80 py-80 overflow-x-clip">
      <hgroup className="grid gap-8 place-self-center">
        <h1 className="flex items-center justify-center">
          <span className="text-[60px]">CARBON</span>
          <span className="text-24 text-gradient writing-sideways">DEFI</span>
        </h1>
        <p className="text-18">
          The future of <span className="text-gradient">DEFI</span> is already
          here
        </p>
      </hgroup>
      <PreviewCommonStrategyType />
      <div id={widgetId} className={style.main}>
        <section className={style.mainChart}>
          <header className="flex items-center justify-between">
            <RadioGroup className="text-20">
              <Radio
                checked={type === 'orders'}
                onChange={() => setType('orders')}
              >
                Orders
              </Radio>
              <Radio
                checked={type === 'liquidity'}
                onChange={() => setType('liquidity')}
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
          {type === 'orders' && (
            <>
              <PreviewRecurringRangeStrategy
                running
                className="grid-flow-row md:grid-flow-col h-[250px] lg:h-[300px] xl:h-[500px]"
              />
              <p className="text-18">
                <b className="text-buy">Buy</b> low,{' '}
                <b className="text-sell">Sell</b> High, earn{' '}
                <b className="text-gradient">more</b> with CarbonDefi
              </p>
            </>
          )}
          {type === 'liquidity' && (
            <>
              <PreviewFullRangeStrategy
                running
                className="grid-flow-row md:grid-flow-col h-[250px] lg:h-[300px] xl:h-[500px]"
              />
              <p className="text-18">Ensure Liquidity for your community</p>
            </>
          )}
        </section>
      </div>
      <div className="grid gap-40 max-w-[1920px] w-full">
        <RadioGroup className="place-self-center text-20 p-8 gap-24">
          {sections.map(({ id, title }) => (
            <Radio
              key={id}
              checked={level === id}
              onChange={() => setLevel(id)}
              className="py-12 px-24"
            >
              {title}
            </Radio>
          ))}
        </RadioGroup>
        {sections.map((section, i) => (
          <section key={i} hidden={section.id !== level}>
            <nav className="flex flex-wrap place-self-center gap-16">
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
      <section className="grid gap-32 w-full max-w-[1920px] mx-auto mt-[150px] px-24">
        <h2 className="text-center">Discover All strategies</h2>
        <AllPreview />
      </section>
    </div>
  );
};
