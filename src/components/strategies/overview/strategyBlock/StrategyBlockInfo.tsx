import { FC } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { StrategyBlockTradeCount } from 'components/strategies/overview/strategyBlock/StrategyBlockTradeCount';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';

interface Props {
  strategy: StrategyWithFiat;
}

export const StrategyBlockInfo: FC<Props> = ({ strategy }) => {
  return (
    <div className="flex gap-16">
      <StrategyBlockTradeCount strategy={strategy} />
      <StrategyBlockBudget strategy={strategy} />
    </div>
  );
};
