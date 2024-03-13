import { FormEvent, useMemo, useState } from 'react';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { Button } from 'components/common/button';
import { OrderCreate, useOrder } from 'components/strategies/create/useOrder';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { Order, Strategy } from 'libs/queries';
import { useRouter } from 'libs/routing';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { EditStrategyPricesBuySellBlock } from './EditStrategyPricesBuySellBlock';
import { carbonEvents } from 'services/events';
import { useStrategyEventData } from '../create/useStrategyEventData';
import { checkIfOrdersOverlap } from '../utils';
import { getStatusTextByTxStatus } from '../utils';
import { isOverlappingStrategy } from '../overlapping/utils';
import { EditPriceOverlappingStrategy } from './overlapping/EditPriceOverlappingStrategy';
import { useStrategyWarning } from '../useWarning';

export type EditStrategyPrices = 'editPrices' | 'renew';

type EditStrategyPricesContentProps = {
  type: EditStrategyPrices;
  strategy: Strategy;
};

export const EditStrategyPricesContent = ({
  strategy,
  type,
}: EditStrategyPricesContentProps) => {
  const isOverlapping = isOverlappingStrategy(strategy);
  const { history } = useRouter();
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
  const [overlappingError, setOverlappingError] = useState('');
  const isOrderValid = (order: OrderCreate): boolean => {
    if (order.budgetError) return false;
    if (!order.isRange) return !order.priceError;
    if (order.rangeError) return false;
    if (overlappingError) return false;
    return +order.min > 0 && +order.max > 0 && +order.max > +order.min;
  };
  const isInvalid = !isOrderValid(order0) || !isOrderValid(order1);
  const warnings = useStrategyWarning({
    base,
    quote,
    order0,
    order1,
    isOverlapping,
    invalidForm: isInvalid,
  });

  const isOrdersOverlap = useMemo(() => {
    return checkIfOrdersOverlap(order0, order1);
  }, [order0, order1]);

  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });
  const handleOnActionClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      if (oldOrder.startRate !== newOrder.startRate)
        return MarginalPriceOptions.reset;
      if (oldOrder.endRate !== newOrder.endRate)
        return MarginalPriceOptions.reset;
    };

    type === 'renew'
      ? renewStrategy(
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
        )
      : changeRateStrategy(
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
  };

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={(e) => handleOnActionClick(e)}
      onReset={() => history.back()}
      className="flex w-full flex-col items-center gap-20 font-weight-500 md:w-[400px]"
      data-testid="edit-form"
    >
      <EditStrategyOverlapTokens strategy={strategy} />
      {isOverlapping && (
        <EditPriceOverlappingStrategy
          strategy={strategy}
          order0={order0}
          order1={order1}
          setOverlappingError={setOverlappingError}
        />
      )}
      {!isOverlapping && (
        <>
          <EditStrategyPricesBuySellBlock
            base={strategy?.base}
            quote={strategy?.quote}
            order={order1}
            balance={strategy.order1.balance}
            type={type}
            isOrdersOverlap={isOrdersOverlap}
          />
          <EditStrategyPricesBuySellBlock
            buy
            base={strategy?.base}
            quote={strategy?.quote}
            order={order0}
            balance={strategy.order0.balance}
            type={type}
            isOrdersOverlap={isOrdersOverlap}
          />
        </>
      )}

      {warnings.formHasWarning && !isInvalid && (
        <label className="flex items-center gap-8 rounded-10 bg-background-900 p-20 text-14 font-weight-500 text-white/60">
          <input
            type="checkbox"
            value={warnings.approvedWarnings.toString()}
            onChange={(e) => warnings.setApprovedWarnings(e.target.checked)}
            data-testid="approve-warnings"
          />
          I've reviewed the warning(s) but choose to proceed.
        </label>
      )}

      <Button
        type="submit"
        disabled={isInvalid || warnings.shouldApproveWarnings}
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
