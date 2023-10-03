import { FC } from 'react';
import { Strategy } from 'libs/queries';
import { m, mItemVariant } from 'libs/motion';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';

import { cn } from 'utils/helpers';
import { StrategyBlockRoi } from './StrategyBlockRoi';
import { StrategyBlockBudget } from './StrategyBlockBudget';
import { StrategyBlockHeader } from './StrategyBlockHeader';
import { StrategyGraph } from './StrategyGraph';

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
  console.log('Rerender');
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
      <div className="col-start-1 col-end-3 grid grid-cols-2 grid-rows-[auto_auto] rounded-8 border-2 border-emphasis">
        <StrategyBlockBuySell
          strategy={strategy}
          buy
          className="border-r-2 border-emphasis"
        />
        <StrategyBlockBuySell strategy={strategy} />
        <div className="col-start-1 col-end-3 border-t-2 border-emphasis">
          <StrategyGraph strategy={strategy} />
        </div>
      </div>
    </m.li>
  );
};
