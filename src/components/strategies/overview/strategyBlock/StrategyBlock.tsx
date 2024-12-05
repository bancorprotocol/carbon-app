import { FC, useEffect, useId, useState } from 'react';
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
}

export const StrategyBlock: FC<Props> = ({
  strategy,
  className,
  isExplorer,
}) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        setVisible(entry.intersectionRatio > 0);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setVisible]);

  return (
    <li
      id={id}
      className={cn(
        'rounded-10 bg-background-900 grid h-[400px] grid-cols-1 grid-rows-[auto_auto_auto] gap-16 p-24',
        className
      )}
      data-testid={`${strategy.base.symbol}/${strategy.quote.symbol}`}
    >
      {visible && (
        <>
          <StrategyBlockHeader strategy={strategy} isExplorer={isExplorer} />
          <StrategyBlockInfo strategy={strategy} />
          <div
            className={cn(
              'rounded-8 border-background-800 grid grid-cols-2 grid-rows-[auto_auto] border-2',
              strategy.status === 'active' ? '' : 'opacity-50'
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
        </>
      )}
    </li>
  );
};
