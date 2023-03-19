import { FC, useState } from 'react';
import { Strategy, StrategyStatus } from 'libs/queries';
import { m, mItemVariant } from 'libs/motion';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockOrderStatus } from 'components/strategies/overview/strategyBlock/StrategyBlockOrderStatus';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { ReactComponent as IconDuplicate } from 'assets/icons/duplicate.svg';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';

export const StrategyBlock: FC<{ strategy: Strategy }> = ({ strategy }) => {
  const paddedID = strategy.id.padStart(9, '0');
  const [manage, setManage] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { aboveBreakpoint } = useBreakpoints();
  const { duplicate } = useDuplicateStrategy();

  return (
    <m.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      variants={mItemVariant}
      className={`${
        strategy.status === StrategyStatus.Active ? 'bg-silver' : 'bg-content'
      } space-y-20 rounded-10 p-20`}
    >
      <div className="flex justify-between">
        <div className={'flex space-x-10'}>
          <TokensOverlap
            className="h-40 w-40"
            tokens={[strategy.base, strategy.quote]}
          />
          <div>
            {
              <div className="flex gap-6">
                <span>{strategy.base.symbol}</span>
                <div className="text-secondary !text-16">/</div>
                <span>{strategy.quote.symbol}</span>
              </div>
            }

            <div className="text-secondary flex gap-8">
              <span>{paddedID.slice(0, 3)}</span>
              <span>{paddedID.slice(3, 6)}</span>
              <span>{paddedID.slice(6, 9)}</span>
            </div>
          </div>
        </div>
        {aboveBreakpoint('md') && (
          <span
            onClick={() => duplicate(strategy)}
            className={`${
              isHovering ? 'visible' : 'invisible'
            } flex h-40 w-40 items-center justify-center rounded-8 border-2 border-emphasis bg-emphasis transition duration-300 ease-in-out hover:border-grey3`}
          >
            <IconDuplicate className="h-18 w-18" />
          </span>
        )}
      </div>
      <hr className="border-silver dark:border-emphasis" />
      <StrategyBlockBuySell buy strategy={strategy} />
      <StrategyBlockBuySell strategy={strategy} />
      <StrategyBlockOrderStatus status={strategy.status} />
      <StrategyBlockManage
        manage={manage}
        setManage={setManage}
        strategy={strategy}
      />
    </m.div>
  );
};
