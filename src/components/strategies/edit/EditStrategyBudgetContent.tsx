import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { useDeleteStrategy } from 'components/strategies/useDeleteStrategy';
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
import { EditBudgetOverlappingStrategy } from './overlapping/EditBudgetOverlappingStrategy';
import { getDeposit, strategyBudgetChanges, strategyHasChanged } from './utils';
import { cn } from 'utils/helpers';
import { useNextRender } from 'hooks/useNextRender';
import style from 'components/strategies/common/form.module.css';

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
  const {
    withdrawBudget,
    depositBudget,
    isProcessing,
    setIsProcessing,
    updateMutation,
  } = useUpdateStrategy();

  const order0: OrderCreate = useOrder(strategy.order0);
  const order1: OrderCreate = useOrder(strategy.order1);
  const buyBalance = strategy.order0.balance;
  const sellBalance = strategy.order1.balance;
  const { provider } = useWeb3();
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(strategy.base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(strategy.quote);
  const buyBudgetUsd = getFiatValueQuote(buyBalance, true).toString();
  const sellBudgetUsd = getFiatValueBase(buyBalance, true).toString();

  const { approval } = useEditStrategy(
    strategy,
    getDeposit(buyBalance, order0.budget),
    getDeposit(sellBalance, order1.budget)
  );

  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing || approval.isLoading;
  const showApproval = !!useNextRender(() => {
    const errors = document.querySelector('.error-message');
    const warnings = !!document.querySelector('.warning-message');
    const hasDistribution =
      isOverlapping && strategyBudgetChanges(strategy, order0, order1);
    return !errors && (!!warnings || hasDistribution);
  });

  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });

  const { openModal } = useModal();

  const handleEvents = () => {
    type === 'withdraw'
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

  const hasChanged = strategyHasChanged(strategy, order0, order1);

  const isDisabled = (form: HTMLFormElement) => {
    if (approval.isError) return true;
    if (!hasChanged) return true;
    if (!form.checkValidity()) return true;
    if (form.querySelector('.error-message')) return true;
    const checkbox = form.querySelector<HTMLInputElement>('.approve-warnings');
    return !!checkbox && !checkbox.checked;
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    if (type === 'withdraw') {
      const withdrawAll =
        (order0.budget || '0') === strategy.order0.balance &&
        (order1.budget || '0') === strategy.order1.balance;
      if (withdrawAll) {
        openWithdrawModal();
      } else {
        depositOrWithdrawFunds();
      }
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

  const getMarginalOption = (order: OrderCreate, initialBudget: string) => {
    if (isOverlapping) return order.marginalPrice;
    if (order.budget === initialBudget) return undefined;
    if (order.marginalPriceOption) return order.marginalPriceOption;
    return MarginalPriceOptions.reset;
  };

  const { deleteStrategy } = useDeleteStrategy();

  const openWithdrawModal = () => {
    openModal('withdrawOrDelete', {
      onWithdraw: depositOrWithdrawFunds,
      onDelete: () =>
        deleteStrategy(strategy, setIsProcessing, () =>
          carbonEvents.strategyEdit.strategyDelete({
            strategyId: strategy.id,
            ...strategyEventData,
          })
        ),
    });
  };

  const depositOrWithdrawFunds = () => {
    const buyOption = getMarginalOption(order0, strategy.order0.balance);
    const sellOption = getMarginalOption(order1, strategy.order1.balance);

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

    const actionFn = type === 'withdraw' ? withdrawBudget : depositBudget;
    void actionFn(updatedStrategy, buyOption, sellOption, handleEvents);
  };

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={submit}
      onReset={() => history.back()}
      className={cn('flex w-full flex-col gap-20 md:w-[400px]', style.form)}
      data-testid="edit-form"
    >
      <EditStrategyOverlapTokens strategy={strategy} />
      {isOverlapping && (
        <EditBudgetOverlappingStrategy
          strategy={strategy}
          order0={order0}
          order1={order1}
          action={type}
        />
      )}
      {!isOverlapping && (
        <>
          <EditStrategyBudgetBuySellBlock
            base={strategy?.base}
            quote={strategy?.quote}
            order={order1}
            initialBudget={sellBalance}
            isBudgetOptional={
              order1.budget === sellBalance && order0.budget !== buyBalance
            }
            type={type}
          />
          <EditStrategyBudgetBuySellBlock
            buy
            base={strategy?.base}
            quote={strategy?.quote}
            order={order0}
            initialBudget={buyBalance}
            isBudgetOptional={
              order0.budget === buyBalance && order1.budget !== sellBalance
            }
            type={type}
          />
        </>
      )}

      {showApproval && (
        <label className="rounded-10 bg-background-900 text-14 font-weight-500 flex items-center gap-8 p-20 text-white/60">
          <input
            type="checkbox"
            name="approval"
            data-testid="approve-warnings"
            required
          />
          I've reviewed the warning(s) but choose to proceed.
        </label>
      )}

      <Button
        type="submit"
        disabled={!hasChanged}
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant="white"
        size="lg"
        fullWidth
        data-testid="edit-submit"
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
