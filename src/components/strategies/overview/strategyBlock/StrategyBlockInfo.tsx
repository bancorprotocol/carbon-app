import { FC } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { StrategyBlockRoi } from 'components/strategies/overview/strategyBlock/StrategyBlockRoi';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';

interface Props {
  strategy: StrategyWithFiat;
  showStrategyRoi?: boolean;
}

export const StrategyBlockInfo: FC<Props> = ({ strategy, showStrategyRoi }) => {
  return (
    <>
      {!!showStrategyRoi && <StrategyBlockRoi strategy={strategy} />}
      <StrategyBlockBudget strategy={strategy} fullWidth={!showStrategyRoi} />
    </>
  );
};
