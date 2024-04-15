import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
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
import { EditOverlappingStrategy } from './overlapping/EditOverlappingStrategy';
import { getDeposit } from './utils';
import style from './EditStrategy.module.css';
import { cn } from 'utils/helpers';

export type EditStrategyBudget = 'withdraw' | 'deposit';

type EditStrategyBudgetContentProps = {
  action: EditStrategyBudget;
  strategy: Strategy;
};

export const EditStrategyBudgetContent = ({
  strategy,
  action,
}: EditStrategyBudgetContentProps) => {
  const isOverlapping = isOverlappingStrategy(strategy);

  const { history } = useRouter();
  const { withdrawBudget, depositBudget, isProcessing, updateMutation } =
    useUpdateStrategy();

  const order0: OrderCreate = useOrder(strategy.order0);
  const order1: OrderCreate = useOrder(strategy.order1);
  const buyBalance = strategy.order0.balance;
  const sellBalance = strategy.order1.balance;
  const { provider } = useWeb3();
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(strategy.base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(strategy.quote);
  const buyBudgetUsd = getFiatValueQuote(buyBalance, true).toString();
  const sellBudgetUsd = getFiatValueBase(buyBalance, true).toString();
  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;

  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });

  const { approval } = useEditStrategy(
    strategy,
    getDeposit(buyBalance, order0.budget),
    getDeposit(sellBalance, order1.budget)
  );
  const { openModal } = useModal();

  const handleEvents = () => {
    action === 'withdraw'
      ? carbonEvents.strategyEdit.strategyWithdraw({
          ...strategyEventData,
          strategyId: strategy.id,
          buyBudget: buyBalance,
          buyBudgetUsd,
          sellBudget: buyBalance,
          sellBudgetUsd,
          buyLowWithdrawalBudget: strategyEventData.buyBudget,
          buyLowWithdrawalBudgetUsd: strategyEventData.buyBudgetUsd,
          sellHighWithdrawalBudget: strategyEventData.sellBudget,
          sellHighWithdrawalBudgetUsd: strategyEventData.sellBudgetUsd,
        })
      : carbonEvents.strategyEdit.strategyDeposit({
          ...strategyEventData,
          strategyId: strategy.id,
          buyBudget: buyBalance,
          buyBudgetUsd,
          sellBudget: buyBalance,
          sellBudgetUsd,
          buyLowDepositBudget: strategyEventData.buyBudget,
          buyLowDepositBudgetUsd: strategyEventData.buyBudgetUsd,
          sellHighDepositBudget: strategyEventData.sellBudget,
          sellHighDepositBudgetUsd: strategyEventData.sellBudgetUsd,
        });
  };

  const handleOnActionClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (action === 'withdraw') {
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
    if (isOverlapping) return MarginalPriceOptions.maintain;
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
        balance: order0.budget,
        startRate: order0.price || order0.min,
        endRate: order0.max,
        marginalRate: order0.marginalPrice,
      },
      order1: {
        balance: order1.budget,
        startRate: order1.price || order1.min,
        endRate: order1.max,
        marginalRate: order1.marginalPrice,
      },
    };

    const actionFn = action === 'withdraw' ? withdrawBudget : depositBudget;
    void actionFn(updatedStrategy, buyOption, sellOption, handleEvents);
  };

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={(e) => handleOnActionClick(e)}
      onReset={() => history.back()}
      className={cn('flex w-full flex-col gap-20 md:w-[400px]', style.form)}
      data-testid="edit-form"
    >
      <EditStrategyOverlapTokens strategy={strategy} />
      {isOverlapping && (
        <EditOverlappingStrategy
          strategy={strategy}
          order0={order0}
          order1={order1}
          fixAction={action}
        />
      )}
      {!isOverlapping && (
        <>
          <EditStrategyBudgetBuySellBlock
            base={strategy?.base}
            quote={strategy?.quote}
            order={order1}
            balance={sellBalance}
            isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
            type={action}
          />
          <EditStrategyBudgetBuySellBlock
            buy
            base={strategy?.base}
            quote={strategy?.quote}
            order={order0}
            balance={buyBalance}
            isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
            type={action}
          />
        </>
      )}

      <label className={cn(style.approveWarnings)}>
        <input
          name="approve-warning"
          type="checkbox"
          data-testid="approve-warnings"
        />
        I've reviewed the warning(s) but choose to proceed.
      </label>

      <Button
        type="submit"
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant="white"
        size="lg"
        fullWidth
        data-testid="edit-submit"
      >
        {action === 'withdraw' ? 'Confirm Withdraw' : 'Confirm Deposit'}
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
