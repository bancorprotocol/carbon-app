import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { ModalEditStrategyBuySellBlock } from '../../../../components/strategies/edit/ModalEditStrategyBuySellBlock';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useOrder } from 'components/strategies/create/useOrder';
import { OrderCreate } from 'components/strategies/create/useOrder';

export type ModalEditStrategyData = {
  strategy: Strategy;
  type: 'renew' | 'changeRates';
};

export const ModalEditStrategy: ModalFC<ModalEditStrategyData> = ({
  id,
  data: { strategy, type },
}) => {
  const { closeModal } = useModal();
  const { renewStrategy, changeRateStrategy } = useUpdateStrategy();
  const order0 = useOrder(strategy.order0);
  const order1 = useOrder(strategy.order1);

  const paddedID = strategy.id.padStart(9, '0');

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
      : changeRateStrategy({
          ...strategy,
          order0: newOrder0,
          order1: newOrder1,
        });
    closeModal(id);
  };

  const isOrderValid = (order: OrderCreate) => {
    return order.isRange ? +order.min > 0 && +order.max > 0 : +order.price > 0;
  };

  return (
    <Modal id={id} title={type === 'renew' ? 'Renew Strategy' : 'Edit Price'}>
      <div className="mt-24 flex flex-col items-center space-y-20 text-center font-weight-500">
        <div
          className={
            'flex w-full items-center space-x-10 rounded-10 bg-black p-15 font-mono'
          }
        >
          <TokensOverlap
            className="h-32 w-32"
            tokens={[strategy.token0, strategy.token1]}
          />
          <div>
            {
              <div className="flex gap-6">
                <span>{strategy.token0.symbol}</span>
                <div className="text-secondary !text-16">/</div>
                <span>{strategy.token1.symbol}</span>
              </div>
            }
            <div className="text-secondary flex gap-8">
              <span>{paddedID.slice(0, 3)}</span>
              <span>{paddedID.slice(3, 6)}</span>
              <span>{paddedID.slice(6, 9)}</span>
            </div>
          </div>
        </div>
        <ModalEditStrategyBuySellBlock
          buy
          base={strategy?.token0}
          quote={strategy?.token1}
          order={order0}
          balance={strategy.order0.balance}
          type={type}
        />
        <ModalEditStrategyBuySellBlock
          base={strategy?.token0}
          quote={strategy?.token1}
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
          onClick={() => closeModal(id)}
          className="mt-16"
          variant="black"
          size="lg"
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
