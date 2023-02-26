import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useOrder } from 'components/strategies/create/useOrder';

export type ModalEditStrategyBudgetData = {
  strategy: Strategy;
  type: 'add' | 'remove';
};

export const ModalEditStrategyBudget: ModalFC<ModalEditStrategyBudgetData> = ({
  id,
  data: { strategy, type },
}) => {
  const { closeModal } = useModal();
  const order0 = useOrder(strategy.order0);
  const order1 = useOrder(strategy.order1);

  const paddedID = strategy.id.padStart(9, '0');

  const handleOnActionClick = () => {
    closeModal(id);
  };

  return (
    <Modal
      className="dark:bg-silver"
      id={id}
      title={type === 'add' ? 'Add Budget' : 'Remove Budget'}
    >
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
        <Button
          onClick={handleOnActionClick}
          className="mt-32"
          variant="white"
          size="lg"
          fullWidth
        >
          {type === 'add' ? 'Confirm Deposit' : 'Confirm Withdraw'}
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
