import Decimal from 'decimal.js';
import { useLocation } from 'libs/routing';
import { Button } from 'components/common/button';
import { Strategy } from 'libs/queries';
import { OrderCreate, useOrder } from 'components/strategies/create/useOrder';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { EditStrategyBudgetBuySellBlock } from './EditStrategyBudgetBuySellBlock';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { useModal } from 'hooks/useModal';
import { useEditStrategy } from '../create/useEditStrategy';
import { useStrategyEventData } from '../create/useStrategyEventData';
import { carbonEvents } from 'services/events';
import { useWeb3 } from 'libs/web3';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { FormEvent, useMemo } from 'react';
import { getStatusTextByTxStatus } from '../utils';

export type EditStrategyBudget = 'withdraw' | 'deposit';

type EditStrategyBudgetContentProps = {
  type: EditStrategyBudget;
  strategy: Strategy;
};

export const EditStrategyBudgetContent = ({
  strategy,
  type,
}: EditStrategyBudgetContentProps) => {
  const { withdrawBudget, depositBudget, isProcessing, updateMutation } =
    useUpdateStrategy();

  const order0: OrderCreate = useOrder({ ...strategy.order0, balance: '' });
  const order1: OrderCreate = useOrder({ ...strategy.order1, balance: '' });
  const { provider } = useWeb3();
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(strategy.base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(strategy.quote);
  const buyBudgetUsd = getFiatValueQuote(
    strategy.order0.balance,
    true
  ).toString();
  const sellBudgetUsd = getFiatValueBase(
    strategy.order1.balance,
    true
  ).toString();
  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;

  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });

  const { approval } = useEditStrategy(strategy, order0, order1);
  const { openModal } = useModal();

  const {
    history: { back },
  } = useLocation();

  const calculatedOrder0Budget = !!order0.budget
    ? new Decimal(strategy.order0.balance || 0)?.[
        type === 'withdraw' ? 'minus' : 'plus'
      ](new Decimal(order0.budget))
    : new Decimal(strategy.order0.balance || 0);

  const calculatedOrder1Budget = !!order1.budget
    ? new Decimal(strategy.order1.balance || 0)?.[
        type === 'withdraw' ? 'minus' : 'plus'
      ](new Decimal(order1.budget))
    : new Decimal(strategy.order1.balance || 0);

  const handleEvents = () => {
    type === 'withdraw'
      ? carbonEvents.strategyEdit.strategyWithdraw({
          ...strategyEventData,
          strategyId: strategy.id,
          buyBudget: strategy.order0.balance,
          buyBudgetUsd,
          sellBudget: strategy.order1.balance,
          sellBudgetUsd,
          buyLowWithdrawalBudget: strategyEventData.buyBudget,
          buyLowWithdrawalBudgetUsd: strategyEventData.buyBudgetUsd,
          sellHighWithdrawalBudget: strategyEventData.sellBudget,
          sellHighWithdrawalBudgetUsd: strategyEventData.sellBudgetUsd,
        })
      : carbonEvents.strategyEdit.strategyDeposit({
          ...strategyEventData,
          strategyId: strategy.id,
          buyBudget: strategy.order0.balance,
          buyBudgetUsd,
          sellBudget: strategy.order1.balance,
          sellBudgetUsd,
          buyLowDepositBudget: strategyEventData.buyBudget,
          buyLowDepositBudgetUsd: strategyEventData.buyBudgetUsd,
          sellHighDepositBudget: strategyEventData.sellBudget,
          sellHighDepositBudgetUsd: strategyEventData.sellBudgetUsd,
        });
  };

  const handleOnActionClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'withdraw') {
      depositOrWithdrawFunds();
    } else {
      if (approval.approvalRequired) {
        openModal('txConfirm', {
          approvalTokens: approval.tokens,
          onConfirm: depositOrWithdrawFunds,
          buttonLabel: `Confirm Deposit`,
          eventData: {
            ...strategyEventData,
            productType: 'strategy',
            approvalTokens: approval.tokens,
            buyToken: strategy.base,
            sellToken: strategy.quote,
            blockchainNetwork: provider?.network?.name || '',
          },
          context: 'depositStrategyFunds',
        });
      } else {
        depositOrWithdrawFunds();
      }
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
          order1.marginalPriceOption,
          handleEvents
        )
      : depositBudget(
          updatedStrategy,
          order0.marginalPriceOption,
          order1.marginalPriceOption,
          handleEvents
        );
  };

  const isOrdersBudgetValid = useMemo(() => {
    return +order0.budget > 0 || +order1.budget > 0;
  }, [order0.budget, order1.budget]);

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={(e) => handleOnActionClick(e)}
      onReset={() => back()}
      className="flex w-full flex-col gap-20 text-center font-weight-500 md:w-[400px]"
    >
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
        type="submit"
        disabled={!isOrdersBudgetValid}
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant="white"
        size="lg"
        fullWidth
      >
        {type === 'withdraw' ? 'Confirm Withdraw' : 'Confirm Deposit'}
      </Button>
      <Button
        type="reset"
        disabled={isLoading}
        variant="secondary"
        size="lg"
        fullWidth
      >
        Cancel
      </Button>
    </form>
  );
};
