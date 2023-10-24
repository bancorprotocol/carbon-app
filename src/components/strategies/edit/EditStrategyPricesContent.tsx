import { FormEvent, useMemo } from 'react';
import { useLocation } from 'libs/routing';
import { Button } from 'components/common/button';
import { OrderCreate, useOrder } from 'components/strategies/create/useOrder';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { Strategy } from 'libs/queries';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { EditStrategyPricesBuySellBlock } from './EditStrategyPricesBuySellBlock';
import { carbonEvents } from 'services/events';
import { useStrategyEventData } from '../create/useStrategyEventData';
import { checkIfOrdersOverlap } from '../utils';
import { getStatusTextByTxStatus } from '../utils';

export type EditStrategyPrices = 'editPrices' | 'renew';

type EditStrategyPricesContentProps = {
  type: EditStrategyPrices;
  strategy: Strategy;
};

export const EditStrategyPricesContent = ({
  strategy,
  type,
}: EditStrategyPricesContentProps) => {
  const { renewStrategy, changeRateStrategy, isProcessing, updateMutation } =
    useUpdateStrategy();
  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;

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

  const isOrdersOverlap = useMemo(() => {
    return checkIfOrdersOverlap(order0, order1);
  }, [order0, order1]);

  const {
    history: { back },
  } = useLocation();
  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });
  const handleOnActionClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newOrder0 = {
      balance: strategy.order0.balance,
      startRate: (order0.isRange ? order0.min : order0.price) || '0',
      endRate: (order0.isRange ? order0.max : order0.price) || '0',
      marginalRate: strategy.order0.marginalRate,
    };
    const newOrder1 = {
      balance: strategy.order1.balance,
      startRate: (order1.isRange ? order1.min : order1.price) || '0',
      endRate: (order1.isRange ? order1.max : order1.price) || '0',
      marginalRate: strategy.order1.marginalRate,
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
          () =>
            carbonEvents.strategyEdit.strategyEditPrices({
              ...strategyEventData,
              strategyId: strategy.id,
            })
        );
  };

  const isOrderValid = (order: OrderCreate) => {
    if (!order.isRange) {
      return true;
    }

    return +order.min > 0 && +order.max > 0 && +order.max > +order.min;
  };

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={(e) => handleOnActionClick(e)}
      onReset={() => back()}
      className="flex w-full flex-col items-center gap-20 font-weight-500 md:w-[400px]"
    >
      <EditStrategyOverlapTokens strategy={strategy} />
      <EditStrategyPricesBuySellBlock
        buy
        base={strategy?.base}
        quote={strategy?.quote}
        order={order0}
        balance={strategy.order0.balance}
        type={type}
        isOrdersOverlap={isOrdersOverlap}
      />
      <EditStrategyPricesBuySellBlock
        base={strategy?.base}
        quote={strategy?.quote}
        order={order1}
        balance={strategy.order1.balance}
        type={type}
        isOrdersOverlap={isOrdersOverlap}
      />

      <Button
        type="submit"
        disabled={!isOrderValid(order0) || !isOrderValid(order1)}
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant={'white'}
        size="lg"
        fullWidth
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
