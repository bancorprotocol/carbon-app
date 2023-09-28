import { FC } from 'react';
import { Strategy } from 'libs/queries';
import { m, mItemVariant } from 'libs/motion';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';

import { cn } from 'utils/helpers';
import { StrategyBlockRoi } from './StrategyBlockRoi';
import { StrategyBlockBudget } from './StrategyBlockBudget';
import { StrategyBlockHeader } from './StrategyBlockHeader';

interface Props {
  strategy: Strategy;
  className?: string;
  isExplorer?: boolean;
}

export const StrategyBlock: FC<Props> = ({
  strategy,
  className,
  isExplorer,
}) => {
  return (
    <m.li
      variants={mItemVariant}
      className={cn(
        'grid grid-cols-2 grid-rows-[auto_auto_auto] gap-16 rounded-10 bg-silver p-24',
        className
      )}
    >
      <StrategyBlockHeader strategy={strategy} isExplorer={isExplorer} />
      <StrategyBlockRoi roi={strategy.roi} />
      <StrategyBlockBudget strategy={strategy} />
      <StrategyBlockBuySell buy strategy={strategy} />
      <StrategyBlockBuySell strategy={strategy} />
    </m.li>
  );
};
