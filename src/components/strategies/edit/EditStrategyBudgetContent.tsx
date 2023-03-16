import BigNumber from 'bignumber.js';
import { useLocation } from 'libs/routing';
import { Button } from 'components/common/button';
import { Strategy } from 'libs/queries';
import { OrderCreate, useOrder } from 'components/strategies/create/useOrder';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { EditStrategyBudgetBuySellBlock } from './EditStrategyBudgetBuySellBlock';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { useModal } from 'hooks/useModal';
import { useEditStrategy } from '../create/useEditStrategy';

type EditStrategyBudgetContentProps = {
  type: 'withdraw' | 'deposit';
  strategy: Strategy;
};

export const EditStrategyBudgetContent = ({
  strategy,
  type,
}: EditStrategyBudgetContentProps) => {
  const { withdrawBudget, depositBudget } = useUpdateStrategy();
  const order0: OrderCreate = useOrder({ ...strategy.order0, balance: '' });
  const order1: OrderCreate = useOrder({ ...strategy.order1, balance: '' });
  const { approval } = useEditStrategy(strategy, order0, order1);
  const { openModal } = useModal();

  const {
    history: { back },
  } = useLocation();

  const calculatedOrder0Budget = !!order0.budget
    ? new BigNumber(strategy.order0.balance)?.[
        `${type === 'withdraw' ? 'minus' : 'plus'}`
      ](new BigNumber(order0.budget))
    : new BigNumber(strategy.order0.balance);

  const calculatedOrder1Budget = !!order1.budget
    ? new BigNumber(strategy.order1.balance)?.[
        `${type === 'withdraw' ? 'minus' : 'plus'}`
      ](new BigNumber(order1.budget))
    : new BigNumber(strategy.order1.balance);

  const handleOnActionClick = () => {
    if (approval.approvalRequired) {
      openModal('txConfirm', {
        approvalTokens: approval.tokens,
        onConfirm: depositOrWithdrawFunds,
        buttonLabel: `Confirm ${type === 'withdraw' ? 'Withdraw' : 'Deposit'}`,
      });
    } else {
      depositOrWithdrawFunds();
    }
  };

  const depositOrWithdrawFunds = () => {
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
    return +order0.budget > 0 || +order1.budget > 0;
  };

  return (
    <div className="flex w-full flex-col items-center space-y-20 space-y-20 text-center font-weight-500 md:w-[400px]">
      <EditStrategyOverlapTokens strategy={strategy} />
      <EditStrategyBudgetBuySellBlock
        buy
        base={strategy?.base}
        quote={strategy?.quote}
        order={order0}
        balance={strategy.order0.balance}
        isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
        type={type}
      />
      <EditStrategyBudgetBuySellBlock
        base={strategy?.base}
        quote={strategy?.quote}
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
