import { Order, StrategyWithFiat } from 'components/strategies/common/types';
import { FC } from 'react';
import { prettifyNumber } from 'utils/helpers';

interface Props {
  strategy: StrategyWithFiat<Order>;
}

export const StrategyBlockTradeCount: FC<Props> = ({ strategy }) => {
  const count = prettifyNumber(strategy.tradeCount, {
    abbreviate: true,
    decimals: 0,
  });
  return (
    <article className="bg-black/20 rounded-md border-main-800 grid w-2/5 border p-16">
      <h4 className="text-12 flex items-center gap-4 text-white/60 self-start">
        Trades
      </h4>
      <p className="text-18 font-medium truncate @xs/strategy:text-24">
        {count}
      </p>
    </article>
  );
};
