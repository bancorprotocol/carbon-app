import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { Button } from 'components/common/button';
import { useOrder } from 'components/strategies/create/useOrder';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { Order, Strategy } from 'libs/queries';
import { useRouter } from 'libs/routing';
import { EditStrategyOverlapTokens } from 'components/strategies/edit/EditStrategyOverlapTokens';
import { EditStrategyPricesBuySellBlock } from 'components/strategies/edit/EditStrategyPricesBuySellBlock';
import { carbonEvents } from 'services/events';
import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
  getStatusTextByTxStatus,
} from 'components/strategies/utils';
import { isOverlappingStrategy } from 'components/strategies/overlapping/utils';
import { EditOverlappingStrategy } from 'components/strategies/edit/overlapping/EditOverlappingStrategy';
import { cn } from 'utils/helpers';
import { useEditStrategy } from '../create/useEditStrategy';
import { useModal } from 'hooks/useModal';
import { useWeb3 } from 'libs/web3';
import { getDeposit, strategyHasChanges } from './utils';
import style from './EditStrategy.module.css';

export type EditStrategyPrices = 'editPrices' | 'renew';

type EditStrategyPricesContentProps = {
  type: EditStrategyPrices;
  strategy: Strategy;
};

export const EditStrategyPricesContent = ({
  strategy,
  type,
}: EditStrategyPricesContentProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const isOverlapping = isOverlappingStrategy(strategy);
  const { history } = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [approvedWarnings, setApprovedWarnings] = useState(false);
  const { renewStrategy, changeRateStrategy, isProcessing, updateMutation } =
    useUpdateStrategy();
  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;
  const base = strategy.base;
  const quote = strategy.quote;

  const order0 = useOrder(
    type === 'renew'
      ? { ...strategy.order0, startRate: '', endRate: '' }
      : strategy.order0
  );
  const order1 = useOrder(
    type === 'renew'
      ? { ...strategy.order1, startRate: '', endRate: '' }
      : strategy.order1
  );

  const { provider } = useWeb3();
  const { approval } = useEditStrategy(
    strategy,
    getDeposit(strategy.order0.balance, order0.budget),
    getDeposit(strategy.order1.balance, order1.budget)
  );
  const { openModal } = useModal();

  const isOrdersOverlap = useMemo(() => {
    return checkIfOrdersOverlap(order0, order1);
  }, [order0, order1]);
  const isOrdersReversed = useMemo(() => {
    return checkIfOrdersReversed(order0, order1);
  }, [order0, order1]);

  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (approval.approvalRequired) {
      openModal('txConfirm', {
        approvalTokens: approval.tokens,
        onConfirm: update,
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
      update();
    }
  };

  const update = () => {
    const newOrder0 = {
      balance: order0.budget || strategy.order0.balance,
      startRate: (order0.isRange ? order0.min : order0.price) || '0',
      endRate: (order0.isRange ? order0.max : order0.price) || '0',
      marginalRate: order0.marginalPrice || strategy.order0.marginalRate,
    };
    const newOrder1 = {
      balance: order1.budget || strategy.order1.balance,
      startRate: (order1.isRange ? order1.min : order1.price) || '0',
      endRate: (order1.isRange ? order1.max : order1.price) || '0',
      marginalRate: order1.marginalPrice || strategy.order1.marginalRate,
    };

    const getMarginalOption = (oldOrder: Order, newOrder: Order) => {
      if (isOverlapping) return MarginalPriceOptions.maintain;
      if (oldOrder.startRate !== newOrder.startRate)
        return MarginalPriceOptions.reset;
      if (oldOrder.endRate !== newOrder.endRate)
        return MarginalPriceOptions.reset;
    };

    if (type === 'renew') {
      renewStrategy(
        {
          ...strategy,
          order0: newOrder0,
          order1: newOrder1,
        },
        () =>
          carbonEvents.strategyEdit.strategyRenew({
            ...strategyEventData,
            strategyId: strategy.id,
          })
      );
    } else {
      changeRateStrategy(
        {
          ...strategy,
          order0: newOrder0,
          order1: newOrder1,
        },
        getMarginalOption(strategy.order0, newOrder0),
        getMarginalOption(strategy.order1, newOrder1),
        () =>
          carbonEvents.strategyEdit.strategyEditPrices({
            ...strategyEventData,
            strategyId: strategy.id,
          })
      );
    }
  };

  useEffect(() => {
    const form = ref.current;
    if (!form) return;
    const hasError = !!form.querySelector('.error-message');
    const hasWarning = !!form.querySelector('.warning-message');
    const hasChanges = strategyHasChanges(strategy, order0, order1);
    setDisabled(hasError || !hasChanges || (hasWarning && !approvedWarnings));
  }, [order0, order1, strategy, approvedWarnings]);

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      ref={ref}
      onSubmit={submit}
      onReset={() => history.back()}
      className={cn(
        'flex w-full flex-col items-center gap-20 md:w-[400px]',
        style.form
      )}
      data-testid="edit-form"
    >
      <EditStrategyOverlapTokens strategy={strategy} />
      {isOverlapping && (
        <EditOverlappingStrategy
          strategy={strategy}
          order0={order0}
          order1={order1}
        />
      )}
      {!isOverlapping && (
        <>
          <EditStrategyPricesBuySellBlock
            base={strategy?.base}
            quote={strategy?.quote}
            order={order1}
            initialBudget={strategy.order1.balance}
            type={type}
            isOrdersOverlap={isOrdersOverlap}
            isOrdersReversed={isOrdersReversed}
          />
          <EditStrategyPricesBuySellBlock
            buy
            base={strategy?.base}
            quote={strategy?.quote}
            order={order0}
            initialBudget={strategy.order0.balance}
            type={type}
            isOrdersOverlap={isOrdersOverlap}
            isOrdersReversed={isOrdersReversed}
          />
        </>
      )}

      <label className={cn(style.approveWarnings)}>
        <input
          name="approve-warning"
          type="checkbox"
          data-testid="approve-warnings"
          onChange={(e) => setApprovedWarnings(!!e.target.checked)}
        />
        I've reviewed the warning(s) but choose to proceed.
      </label>

      <Button
        type="submit"
        disabled={disabled}
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant="white"
        size="lg"
        fullWidth
        data-testid="edit-submit"
      >
        {type === 'renew' ? 'Renew Strategy' : 'Confirm Changes'}
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
