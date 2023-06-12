import { FC, useState } from 'react';
import { Strategy, StrategyStatus } from 'libs/queries';
import { m, mItemVariant } from 'libs/motion';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockOrderStatus } from 'components/strategies/overview/strategyBlock/StrategyBlockOrderStatus';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { ReactComponent as IconDuplicate } from 'assets/icons/duplicate.svg';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { useBudgetWarning } from 'components/strategies/useBudgetWarning';

import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import { useOrder } from 'components/strategies/create/useOrder';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { carbonEvents } from 'services/events';
import { useTranslation } from 'libs/translations';

export const StrategyBlock: FC<{ strategy: Strategy }> = ({ strategy }) => {
  const { t } = useTranslation();
  const [manage, setManage] = useState(false);
  const { duplicate } = useDuplicateStrategy();
  const showBudgetWarning = useBudgetWarning(
    strategy.base,
    strategy.quote,
    strategy.order0.balance,
    strategy.order1.balance
  );

  const order0 = useOrder(strategy.order0);
  const order1 = useOrder(strategy.order1);
  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });

  const handleOnDuplicateClick = () => {
    carbonEvents.strategyEdit.strategyDuplicateClick({
      ...strategyEventData,
      strategyId: strategy.id,
    });
    duplicate(strategy);
  };

  return (
    <m.div
      variants={mItemVariant}
      className={`${
        strategy.status === StrategyStatus.Active ? 'bg-silver' : 'bg-content'
      } group space-y-20 rounded-10 p-20`}
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

            <div className="text-secondary flex">
              {t('pages.strategyOverview.card.title', {
                id: strategy.idDisplay,
              })}
            </div>
          </div>
        </div>
        <Tooltip element={t('pages.strategyOverview.card.tooltips.tooltip11')}>
          <span
            className={`pointer-events-none flex h-40 w-40 items-center justify-center rounded-8 border-2 border-emphasis bg-emphasis opacity-0 transition duration-300 ease-in-out hover:border-grey3 md:pointer-events-auto md:group-hover:opacity-100`}
            onClick={handleOnDuplicateClick}
          >
            <IconDuplicate className="h-18 w-18" />
          </span>
        </Tooltip>
      </div>
      <hr className="border-silver dark:border-emphasis" />
      <StrategyBlockBuySell buy strategy={strategy} />
      <StrategyBlockBuySell strategy={strategy} />
      <StrategyBlockOrderStatus
        status={strategy.status}
        strategyId={strategy.id}
        showBudgetWarning={showBudgetWarning}
        strategyEventData={{ ...strategyEventData, strategyId: strategy.id }}
      />
      <StrategyBlockManage
        manage={manage}
        setManage={setManage}
        strategy={strategy}
      />
    </m.div>
  );
};
