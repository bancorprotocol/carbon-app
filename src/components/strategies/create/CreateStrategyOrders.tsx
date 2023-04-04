import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { UseQueryResult } from 'libs/queries';
import { Token } from 'libs/tokens';
import { BuySellBlock } from './BuySellBlock';
import { OrderCreate } from './useOrder';
import { items } from './variants';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useBudgetWarning } from '../useBudgetWarning';
import { carbonEvents } from 'services/googleTagManager';
import { useEffect } from 'react';
import { useStrategyEventData } from './useStrategyEventData';

type CreateStrategyOrdersProps = {
  base: Token | undefined;
  quote: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string>;
  token1BalanceQuery: UseQueryResult<string>;
  isCTAdisabled: boolean;
  createStrategy: () => void;
};

export const CreateStrategyOrders = ({
  base,
  quote,
  order0,
  order1,
  createStrategy,
  isCTAdisabled,
  token0BalanceQuery,
  token1BalanceQuery,
}: CreateStrategyOrdersProps) => {
  const showBudgetWarning = useBudgetWarning(
    base,
    quote,
    order0.budget,
    order1.budget
  );
  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });
  const budgetWarningMessage =
    'Strategies with low budget might be ignored during trading due to gas considerations';

  useEffect(() => {
    carbonEvents.strategy.strategyWarningShow({
      message: budgetWarningMessage,
    });
  }, [showBudgetWarning]);

  const onCreateStrategy = () => {
    carbonEvents.strategy.strategyCreateClick(strategyEventData);
    createStrategy();
  };

  return (
    <>
      <m.div variants={items}>
        <BuySellBlock
          base={base!}
          quote={quote!}
          order={order0}
          buy
          tokenBalanceQuery={token1BalanceQuery}
          isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
        />
      </m.div>
      <m.div variants={items}>
        <BuySellBlock
          base={base!}
          quote={quote!}
          order={order1}
          tokenBalanceQuery={token0BalanceQuery}
          isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
        />
      </m.div>
      {showBudgetWarning && (
        <div
          className={'font-auto flex items-center gap-6 px-25 text-warning-500'}
        >
          <div>
            <IconWarning className={'h-14 w-14'} />
          </div>
          <span className="font-mono text-12">{budgetWarningMessage}</span>
        </div>
      )}
      <m.div variants={items}>
        <Button
          variant={'success'}
          size={'lg'}
          fullWidth
          onClick={onCreateStrategy}
          disabled={isCTAdisabled}
        >
          Create Strategy
        </Button>
      </m.div>
    </>
  );
};
