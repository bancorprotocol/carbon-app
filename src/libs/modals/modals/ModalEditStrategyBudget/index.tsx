import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useOrder } from 'components/strategies/create/useOrder';
import { ModalEditStrategyBudgetBuySellBlock } from './ModalEditStrategyBudgetBuySellBlock';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import BigNumber from 'bignumber.js';

export type ModalEditStrategyBudgetData = {
  strategy: Strategy;
  type: 'deposit' | 'withdraw';
};

export const ModalEditStrategyBudget: ModalFC<ModalEditStrategyBudgetData> = ({
  id,
  data: { strategy, type },
}) => {
  const { closeModal } = useModal();
  const { withdrawBudget } = useUpdateStrategy();
  const order0 = useOrder({ ...strategy.order0, balance: '0' });
  const order1 = useOrder({ ...strategy.order1, balance: '0' });
  const paddedID = strategy.id.padStart(9, '0');

  const handleOnActionClick = () => {
    withdrawBudget({
      ...strategy,
      order0: {
        balance: new BigNumber(strategy.order0.balance)
          .minus(new BigNumber(order0.budget))
          .toString(),
        startRate: order0.price || order0.min,
        endRate: order0.max,
      },
      order1: {
        balance: new BigNumber(strategy.order1.balance)
          .minus(new BigNumber(order1.budget))
          .toString(),
        startRate: order1.price || order1.min,
        endRate: order1.max,
      },
    });
    closeModal(id);
  };

  return (
    <Modal
      className="dark:bg-silver"
      id={id}
      title={type === 'deposit' ? 'Deposit Budget' : 'Withdraw Budget'}
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
        <ModalEditStrategyBudgetBuySellBlock
          buy
          base={strategy?.token0}
          quote={strategy?.token1}
          order={order0}
          balance={strategy.order0.balance}
          isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
        />
        <ModalEditStrategyBudgetBuySellBlock
          base={strategy?.token0}
          quote={strategy?.token1}
          order={order1}
          balance={strategy.order1.balance}
          isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
        />
        <Button
          disabled={
            (+order0.budget === 0 || !!!order0.budget) &&
            (+order1.budget === 0 || !!!order1.budget)
          }
          onClick={handleOnActionClick}
          className="mt-32"
          variant="white"
          size="lg"
          fullWidth
        >
          {type === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdraw'}
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
