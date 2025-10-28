import { Link } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { ReactComponent as IconMarket } from 'assets/icons/market.svg';
import { ReactComponent as IconRange } from 'assets/icons/range.svg';
import { ReactComponent as IconArrowCircle } from 'assets/icons/arrow-circle.svg';
import { ReactComponent as IconShield } from 'assets/icons/shield.svg';
import { ReactComponent as IconMultiOrder } from 'assets/icons/multi-order.svg';
import { useTrending } from 'libs/queries/extApi/tradeCount';
import { useMemo } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { RollingNumber } from 'components/common/RollingNumber';

const types = [
  {
    title: 'Essentials',
    description:
      'The foundation of every DEX: core features for trading and liquidity',
    trades: [
      {
        name: 'Swap',
        to: '/trade/market' as const,
        search: {},
        icon: <IconMarket className="size-24" />,
      },
      {
        name: 'Liquidity Position',
        to: '/trade/overlapping' as const,
        search: {},
        icon: <IconOverlapping className="size-24" />,
      },
    ],
    targets: ['Casual', 'Newbie'],
  },
  {
    title: 'Intermediate',
    description:
      'Tailored trading options for greater precision and absolute price certainty',
    trades: [
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
    targets: ['Advanced', 'Experts'],
  },
  {
    title: 'Advanced',
    description:
      'Customizable strategies for scaling, and automating buy low, sell high trades - unique to Carbon DeFi.',
    trades: [
      {
        name: 'Range Order',
        to: '/trade/disposable' as const,
        search: { settings: 'range' as const },
        icon: <IconRange className="size-24" />,
      },
      {
        name: 'Recurring Range Orders',
        to: '/trade/recurring' as const,
        icon: <IconRecurring className="size-24" />,
      },
    ],
    targets: ['Professional', 'Quants'],
  },
];

export const UnconnectedLandingPage = () => {
  const trending = useTrending();

  const sentence = useMemo(() => {
    if (!trending.data) {
      return (
        <p className="invisible font-title text-xl md:text-3xl">
          Hide to prevent layout shift
        </p>
      );
    }
    const trades = trending.data.totalTradeCount;
    const strategies = trending.data.tradeCount.length;
    if (!trades || !strategies) return;
    const format = (value: number) => {
      return prettifyNumber(value, { isInteger: true });
    };
    return (
      <p className="font-title flex gap-4 justify-center text-xl md:text-3xl">
        <RollingNumber
          className="text-xl md:text-3xl"
          value={strategies}
          loadingWidth="1ch"
          format={format}
        />
        <span>trading strategies powering</span>
        <RollingNumber
          className="text-xl md:text-3xl"
          value={trades}
          loadingWidth="1ch"
          format={format}
        />
        <span>trades</span>
      </p>
    );
  }, [trending.data]);

  return (
    <section className="grid content-start gap-24 mx-auto p-16">
      <hgroup className="grid gap-24">
        <h1 className="text-3xl lg:text-5xl text-center text-gradient leading-[1.5] gradient-direction-[90deg]">
          Control Your Trading Strategies
        </h1>
        {sentence}
      </hgroup>
      <ol className="grid gap-8">
        <li className="flex items-center gap-16 bg-black/20 px-16 py-8 rounded-md">
          <b className="text-gradient text-nowrap">Step 1</b>
          <span>Connect your wallet</span>
        </li>
        <li className="flex items-center gap-16 bg-black/20 px-16 py-8 rounded-md">
          <b className="text-gradient text-nowrap">Step 2</b>
          <span>Create your trading strategy</span>
        </li>
        <li className="flex items-center gap-16 bg-black/20 px-16 py-8 rounded-md">
          <b className="text-gradient text-nowrap">Step 3</b>
          <span>
            Sit back and let the market come to you - buy and sell on your terms
          </span>
        </li>
      </ol>
      <article className="grid gap-16">
        <h2 className="text-18">Choose your Trading Strategy</h2>
        <ul className="flex sm:justify-center flex-wrap gap-24">
          {types.map((item) => (
            <li
              className="flex flex-col gap-16 p-24 surface sm:w-[300px] rounded-2xl"
              key={item.title}
            >
              <h3 className="text-xl">{item.title}</h3>
              <p className="text-14 text-white/60 flex-1">{item.description}</p>
              <Link
                to="/explore/strategies"
                className="flex items-center gap-8"
              >
                <span className="text-gradient gradient-direction-[90deg]">
                  Explore Strategies
                </span>
                <IconArrowCircle className="size-20 fill-gradient" />
              </Link>
              <nav aria-label="strategy types" className="grid gap-8">
                {item.trades.map((trade) => (
                  <Link
                    to={trade.to}
                    search={trade.search}
                    key={trade.name}
                    className="btn-on-surface flex items-center gap-16 px-16 py-16 text-14"
                  >
                    {trade.icon}
                    <span>{trade.name}</span>
                  </Link>
                ))}
              </nav>
              <ul className="flex gap-8">
                {item.targets.map((target) => (
                  <span
                    key={target}
                    className="px-8 py-4 text-12 bg-main-600/40 text-white/40 rounded-md"
                  >
                    {target}
                  </span>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </article>
      <article className="grid gap-24">
        <h2 className="text-center text-3xl">Carbon DeFi User Benefits</h2>
        <ul className="flex justify-center flex-wrap gap-40">
          <li className="flex gap-8 items-center">
            <IconShield className="size-20" />
            <span>MEV Sandwich Attack Immunity</span>
          </li>
          <li className="flex gap-8 items-center">
            <IconMultiOrder className="size-20" />
            <span>100% Price Certainty</span>
          </li>
          <li className="flex gap-8 items-center">
            <IconDisposable className="size-20" />
            <span>Multi-Order Strategies</span>
          </li>
        </ul>
      </article>
    </section>
  );
};
