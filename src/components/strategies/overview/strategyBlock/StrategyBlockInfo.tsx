import { FC } from 'react';
import { StrategyBlockTradeCount } from 'components/strategies/overview/strategyBlock/StrategyBlockTradeCount';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { isGradientStrategy } from 'components/strategies/common/utils';
import { StrategyCountDown } from './StrategyCountDown';

interface Props {
  strategy: AnyStrategyWithFiat;
}

export const StrategyBlockInfo: FC<Props> = ({ strategy }) => {
  const isGradient = isGradientStrategy(strategy);
  return (
    <div
      aria-disabled={strategy.status !== 'active'}
      className="flex gap-16 aria-disabled:opacity-50"
    >
      {isGradient ? (
        <StrategyCountDown strategy={strategy} />
      ) : (
        <StrategyBlockTradeCount strategy={strategy} />
      )}
      <StrategyBlockBudget strategy={strategy} />
    </div>
  );
};
