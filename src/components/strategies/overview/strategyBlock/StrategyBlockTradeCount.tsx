import { FC } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { StrategyWithFiat } from 'libs/queries';

interface Props {
  strategy: StrategyWithFiat;
}

export const StrategyBlockTradeCount: FC<Props> = ({ strategy }) => {
  const count = prettifyNumber(strategy.tradeCount, {
    abbreviate: true,
    decimals: 0,
  });
  return (
    <article className="rounded-8 border-background-800 flex w-2/5 flex-col border-2 p-16">
      <h4 className="text-12 flex items-center gap-4 text-white/60">Trades</h4>
      <p className="text-18 font-weight-500 truncate">{count}</p>
    </article>
  );
};
