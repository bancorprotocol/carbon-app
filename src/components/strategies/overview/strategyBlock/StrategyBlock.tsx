import { FC, useState } from 'react';
import { Strategy, StrategyStatus } from 'queries';
import { m, mItemVariant } from 'motion';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockOrderStatus } from 'components/strategies/overview/strategyBlock/StrategyBlockOrderStatus';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';

export const StrategyBlock: FC<{ strategy: Strategy }> = ({ strategy }) => {
  const paddedID = String(strategy.id).padStart(9, '0');
  const [manage, setManage] = useState(false);

  return (
    <m.div
      variants={mItemVariant}
      className={`${
        strategy.status === StrategyStatus.Active ? 'bg-silver' : 'bg-content'
      } space-y-20 rounded-10 p-20`}
    >
      <div className={'flex space-x-10'}>
        <TokensOverlap
          className="h-40 w-40"
          tokens={[strategy.token0, strategy.token1]}
        />
        <div>
          {strategy.name ? (
            <>{strategy.name}</>
          ) : (
            <div className="flex gap-6">
              <span>{strategy.token0.symbol}</span>
              <div className="text-secondary">/</div>
              <span>{strategy.token1.symbol}</span>
            </div>
          )}

          <div className="text-secondary flex gap-8">
            <span>{paddedID.slice(0, 3)}</span>
            <span>{paddedID.slice(3, 6)}</span>
            <span>{paddedID.slice(6, 9)}</span>
            {strategy.name && (
              <>
                <div>·</div>
                <div className="flex gap-4">
                  <span>{strategy.token0.symbol}</span>
                  <div>/</div>
                  <span>{strategy.token1.symbol}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <hr className="border-silver dark:border-emphasis" />
      <StrategyBlockBuySell buy strategy={strategy} />
      <StrategyBlockBuySell strategy={strategy} />
      <StrategyBlockOrderStatus status={strategy.status} />
      <StrategyBlockManage manage={manage} setManage={setManage} />
    </m.div>
  );
};
