import { FC } from 'react';
import { StrategyBlockTradeCount } from 'components/strategies/overview/strategyBlock/StrategyBlockTradeCount';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { Order, StrategyWithFiat } from 'components/strategies/common/types';

interface Props {
  strategy: StrategyWithFiat<Order>;
}

export const StrategyBlockInfo: FC<Props> = ({ strategy }) => {
  return (
    <div
      aria-disabled={strategy.status !== 'active'}
      className="flex gap-16 aria-disabled:opacity-50"
    >
      <StrategyBlockTradeCount strategy={strategy} />
      <StrategyBlockBudget strategy={strategy} />
    </div>
  );
};
