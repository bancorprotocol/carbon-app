import BigNumber from 'bignumber.js';
import { Button } from 'components/common/button';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import { OrderCreate, useOrder } from 'components/strategies/create/useOrder';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { EditTypes } from './EditStrategyMain';
import { useLocation } from '@tanstack/react-location';
import { EditStrategyBudgetBuySellBlock } from './EditStrategyBudgetBuySellBlock';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';

type EditStrategyBudgetContentProps = {
  type: EditTypes;
  strategy: Strategy;
};

export const EditStrategyBudgetContent = ({
  strategy,
  type,
}: EditStrategyBudgetContentProps) => {
  const { withdrawBudget, depositBudget } = useUpdateStrategy();
  const order0: OrderCreate = useOrder({ ...strategy.order0, balance: '0' });
  const order1: OrderCreate = useOrder({ ...strategy.order1, balance: '0' });
  const token0Amount = useGetTokenBalance(strategy.token1).data;
  const token1Amount = useGetTokenBalance(strategy.token0).data;
  const {
    history: { back },
  } = useLocation();

  const calculatedOrder0Budget = new BigNumber(strategy.order0.balance)?.[
    `${type === 'withdraw' ? 'minus' : 'plus'}`
  ](new BigNumber(order0.budget));

  const calculatedOrder1Budget = new BigNumber(strategy.order1.balance)?.[
    `${type === 'withdraw' ? 'minus' : 'plus'}`
  ](new BigNumber(order1.budget));

  const handleOnActionClick = () => {
    const updatedStrategy = {
      ...strategy,
      order0: {
        balance: calculatedOrder0Budget.toString(),
        startRate: order0.price || order0.min,
        endRate: order0.max,
      },
      order1: {
        balance: calculatedOrder1Budget.toString(),
        startRate: order1.price || order1.min,
        endRate: order1.max,
      },
    };

    type === 'withdraw'
      ? withdrawBudget(
          updatedStrategy,
          order0.marginalPriceOption,
          order1.marginalPriceOption
        )
      : depositBudget(
          updatedStrategy,
          order0.marginalPriceOption,
          order1.marginalPriceOption
        );
  };

  const isOrdersBudgetValid = () => {
    if (type === 'withdraw') {
      return (
        calculatedOrder0Budget.gte(0) &&
        calculatedOrder1Budget.gte(0) &&
        (+order0.budget > 0 || +order1.budget > 0)
      );
    }
    return (
      new BigNumber(token0Amount || 0).gte(order0.budget) &&
      new BigNumber(token1Amount || 0).gte(order1.budget) &&
      (+order0.budget > 0 || +order1.budget > 0)
    );
  };

  return (
    <div className="flex w-full flex-col items-center space-y-20 space-y-20 text-center font-weight-500 md:w-[400px]">
      <EditStrategyOverlapTokens strategy={strategy} />
      <EditStrategyBudgetBuySellBlock
        buy
        base={strategy?.token0}
        quote={strategy?.token1}
        order={order0}
        balance={strategy.order0.balance}
        isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
        type={type}
      />
      <EditStrategyBudgetBuySellBlock
        base={strategy?.token0}
        quote={strategy?.token1}
        order={order1}
        balance={strategy.order1.balance}
        isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
        type={type}
      />
      <Button
        disabled={!isOrdersBudgetValid()}
        onClick={handleOnActionClick}
        className="mt-32"
        variant="white"
        size="lg"
        fullWidth
      >
        {type === 'withdraw' ? 'Confirm Withdraw' : 'Confirm Deposit'}
      </Button>
      <Button
        onClick={() => back()}
        className="mt-16"
        variant="secondary"
        size="lg"
        fullWidth
      >
        Cancel
      </Button>
    </div>
  );
};
