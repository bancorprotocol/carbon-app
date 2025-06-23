import { FC } from 'react';
import { StrategyBlockTradeCount } from 'components/strategies/overview/strategyBlock/StrategyBlockTradeCount';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { cn } from 'utils/helpers';
import { Order, StrategyWithFiat } from 'components/strategies/common/types';

interface Props {
  strategy: StrategyWithFiat<Order>;
}

export const StrategyBlockInfo: FC<Props> = ({ strategy }) => {
  return (
    <div
      className={cn('flex gap-16', {
        'opacity-50': strategy.status !== 'active',
      })}
    >
      <StrategyBlockTradeCount strategy={strategy} />
      <StrategyBlockBudget strategy={strategy} />
    </div>
  );
};
