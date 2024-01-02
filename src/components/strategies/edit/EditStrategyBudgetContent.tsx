import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import { Button } from 'components/common/button';
import { Strategy } from 'libs/queries';
import { useRouter } from 'libs/routing';
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
import { isOverlappingStrategy } from '../overlapping/utils';
import { DepositOverlappingStrategy } from './overlapping/DepositOverlappingStrategy';
import { WithdrawOverlappingStrategy } from './overlapping/WithdrawOverlappingStrategy';

export type EditStrategyBudget = 'withdraw' | 'deposit';

type EditStrategyBudgetContentProps = {
  type: EditStrategyBudget;
  strategy: Strategy;
};

export const EditStrategyBudgetContent = ({
  strategy,
  type,
}: EditStrategyBudgetContentProps) => {
  const isOverlapping = isOverlappingStrategy(strategy);

  const { history } = useRouter();
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

  const calculatedOrder0Budget = !!order0.budget
    ? new SafeDecimal(strategy.order0.balance)?.[
        type === 'withdraw' ? 'minus' : 'plus'
      ](new SafeDecimal(order0.budget))
    : new SafeDecimal(strategy.order0.balance);

  const calculatedOrder1Budget = !!order1.budget
    ? new SafeDecimal(strategy.order1.balance)?.[
        type === 'withdraw' ? 'minus' : 'plus'
      ](new SafeDecimal(order1.budget))
    : new SafeDecimal(strategy.order1.balance);

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

  const getMarginalOption = (order: OrderCreate) => {
    if (!Number(order.budget) || !order.budget) return undefined;
    if (order.marginalPriceOption) return order.marginalPriceOption;

    return MarginalPriceOptions.reset;
  };

  const depositOrWithdrawFunds = () => {
    const buyOption = getMarginalOption(order0);
    const sellOption = getMarginalOption(order1);

    const updatedStrategy = {
      ...strategy,
      order0: {
        balance: calculatedOrder0Budget.toString(),
        startRate: order0.price || order0.min,
        endRate: order0.max,
        marginalRate: strategy.order0.marginalRate,
      },
      order1: {
        balance: calculatedOrder1Budget.toString(),
        startRate: order1.price || order1.min,
        endRate: order1.max,
        marginalRate: strategy.order1.marginalRate,
      },
    };

    const action = type === 'withdraw' ? withdrawBudget : depositBudget;
    void action(updatedStrategy, buyOption, sellOption, handleEvents);
  };

  const isOrdersBudgetValid = useMemo(() => {
    if (order0.budgetError) return false;
    if (order1.budgetError) return false;
    return +order0.budget > 0 || +order1.budget > 0;
  }, [order0.budget, order0.budgetError, order1.budget, order1.budgetError]);

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={(e) => handleOnActionClick(e)}
      onReset={() => history.back()}
      className="flex w-full flex-col gap-20 md:w-[400px]"
    >
      <EditStrategyOverlapTokens strategy={strategy} />
      {isOverlapping && type === 'deposit' && (
        <DepositOverlappingStrategy
          strategy={strategy}
          order0={order0}
          order1={order1}
        />
      )}
      {isOverlapping && type === 'withdraw' && (
        <WithdrawOverlappingStrategy
          strategy={strategy}
          order0={order0}
          order1={order1}
        />
      )}
      {!isOverlapping && (
        <>
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
        </>
      )}
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
