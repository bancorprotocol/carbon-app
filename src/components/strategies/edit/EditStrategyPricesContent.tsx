import { useLocation } from 'libs/routing';
import { Button } from 'components/common/button';
import { OrderCreate, useOrder } from 'components/strategies/create/useOrder';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { Strategy } from 'libs/queries';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { EditStrategyPricesBuySellBlock } from './EditStrategyPricesBuySellBlock';
import { carbonEvents } from 'services/googleTagManager';
import { useStrategyEventData } from '../create/useStrategyEventData';

type EditStrategyPricesContentProps = {
  type: 'editPrices' | 'renew';
  strategy: Strategy;
};

export const EditStrategyPricesContent = ({
  strategy,
  type,
}: EditStrategyPricesContentProps) => {
  const { renewStrategy, changeRateStrategy } = useUpdateStrategy();
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
  const {
    history: { back },
  } = useLocation();
  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });
  const handleOnActionClick = () => {
    const newOrder0 = {
      balance: strategy.order0.balance,
      startRate: order0.isRange ? order0.min : order0.price,
      endRate: order0.isRange ? order0.max : order0.price,
    };
    const newOrder1 = {
      balance: strategy.order1.balance,
      startRate: order1.isRange ? order1.min : order1.price,
      endRate: order1.isRange ? order1.max : order1.price,
    };

    type === 'renew'
      ? renewStrategy({
          ...strategy,
          order0: newOrder0,
          order1: newOrder1,
        })
      : changeRateStrategy(
          {
            ...strategy,
            order0: newOrder0,
            order1: newOrder1,
          },
          () => carbonEvents.strategyEdit.strategyChangeRates(strategyEventData)
        );
  };

  const isOrderValid = (order: OrderCreate) => {
    return order.isRange
      ? +order.min > 0 && +order.max > 0 && +order.max > +order.min
      : +order.price > 0;
  };

  return (
    <div className="flex w-full flex-col items-center space-y-20 space-y-20 text-center font-weight-500 md:w-[400px]">
      <EditStrategyOverlapTokens strategy={strategy} />
      <EditStrategyPricesBuySellBlock
        buy
        base={strategy?.base}
        quote={strategy?.quote}
        order={order0}
        balance={strategy.order0.balance}
        type={type}
      />
      <EditStrategyPricesBuySellBlock
        base={strategy?.base}
        quote={strategy?.quote}
        order={order1}
        balance={strategy.order1.balance}
        type={type}
      />
      <Button
        disabled={!isOrderValid(order0) || !isOrderValid(order1)}
        onClick={handleOnActionClick}
        className="mt-32"
        variant="white"
        size="lg"
        fullWidth
      >
        {type === 'renew' ? 'Renew Strategy' : 'Confirm Changes'}
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
