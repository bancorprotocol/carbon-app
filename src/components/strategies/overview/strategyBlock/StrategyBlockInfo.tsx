import { FC } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { StrategyBlockTradeCount } from 'components/strategies/overview/strategyBlock/StrategyBlockTradeCount';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { cn } from 'utils/helpers';

interface Props {
  strategy: StrategyWithFiat;
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
