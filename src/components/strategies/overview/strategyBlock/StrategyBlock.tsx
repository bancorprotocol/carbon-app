import { CSSProperties, FC, useId } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';

import { cn } from 'utils/helpers';
import { StrategyBlockHeader } from './StrategyBlockHeader';
import { StrategyGraph } from './StrategyGraph';
import { StrategyBlockInfo } from './StrategyBlockInfo';

interface Props {
  strategy: StrategyWithFiat;
  className?: string;
  isExplorer?: boolean;
  style?: CSSProperties;
}

export const StrategyBlock: FC<Props> = ({
  strategy,
  className,
  style,
  isExplorer,
}) => {
  const id = useId();

  return (
    <li
      id={id}
      className={cn(
        'rounded-10 bg-background-900 grid grid-cols-1 grid-rows-[auto_auto_auto] gap-16 p-24',
        className,
      )}
      style={style}
      data-testid={`${strategy.base.symbol}/${strategy.quote.symbol}`}
    >
      <StrategyBlockHeader strategy={strategy} isExplorer={isExplorer} />
      <StrategyBlockInfo strategy={strategy} />
      <div
        className={cn(
          'rounded-8 border-background-800 grid grid-cols-2 grid-rows-[auto_auto] border-2',
          strategy.status === 'active' ? '' : 'opacity-50',
        )}
      >
        <StrategyBlockBuySell
          strategy={strategy}
          buy
          className="border-background-800 border-r-2"
        />
        <StrategyBlockBuySell strategy={strategy} />
        <div className="border-background-800 col-start-1 col-end-3 border-t-2">
          <StrategyGraph strategy={strategy} />
        </div>
      </div>
    </li>
  );
};
