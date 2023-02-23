import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { ModalEditStrategyBuySellBlock } from './ModalEditStrategyBuySellBlock';
import { useCreateStrategy } from 'components/strategies/create/useCreateStrategy';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { TokensOverlap } from 'components/common/tokensOverlap';

export type ModalEditStrategyData = {
  strategy: Strategy;
};

export const ModalEditStrategy: ModalFC<ModalEditStrategyData> = ({
  id,
  data: { strategy },
}) => {
  const { closeModal } = useModal();
  const { unPauseStrategy } = useUpdateStrategy();
  const { order0, order1 } = useCreateStrategy();
  const paddedID = strategy.id.padStart(9, '0');

  const handleOnActionClick = () => {
    unPauseStrategy({
      ...strategy,
      order0: {
        balance: strategy.order0.balance,
        startRate: order0.price || order0.min,
        endRate: order0.max,
      },
      order1: {
        balance: strategy.order1.balance,
        startRate: order1.price || order1.min,
        endRate: order1.max,
      },
    });
    closeModal(id);
  };

  return (
    <Modal className="dark:bg-silver/80" id={id} title={'Unpause Strategy'}>
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
        />
        <ModalEditStrategyBuySellBlock
          base={strategy?.token0}
          quote={strategy?.token1}
          order={order1}
          balance={strategy.order1.balance}
        />
        <Button
          disabled={
            (order0.isRange
              ? !!!order0.min || !!!order0.max
              : !!!order0.price) ||
            (order1.isRange ? !!!order1.min || !!!order1.max : !!!order1.price)
          }
          onClick={handleOnActionClick}
          className="mt-32"
          variant="white"
          size="lg"
          fullWidth
        >
          Renew Strategy
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
