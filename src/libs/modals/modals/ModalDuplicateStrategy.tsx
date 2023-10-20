import { ModalFC } from 'libs/modals/modals.types';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { Strategy } from 'libs/queries';
import { ReactComponent as IconCut } from 'assets/icons/cut.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { cn } from 'utils/helpers';
import { Button } from 'components/common/button';
import Decimal from 'decimal.js';

export type ModalDuplicateStrategyData = {
  strategy: Strategy;
};

export const ModalDuplicateStrategy: ModalFC<ModalDuplicateStrategyData> = ({
  id,
  data: { strategy },
}) => {
  const { closeModal } = useModal();
  const { duplicate } = useDuplicateStrategy();

  const undercutStrategy = () => {
    const undercutDifference = 0.01;
    const undercuttedStrategy = {
      ...strategy,
      order0: {
        ...strategy.order0,
        startRate: new Decimal(strategy.order0.startRate)
          .times(1 + undercutDifference)
          .toString(),
        endRate: new Decimal(strategy.order0.endRate)
          .times(1 + undercutDifference)
          .toString(),
      },
      order1: {
        ...strategy.order1,
        startRate: new Decimal(strategy.order1.startRate)
          .times(1 - undercutDifference)
          .toString(),
        endRate: new Decimal(strategy.order1.endRate)
          .times(1 - undercutDifference)
          .toString(),
      },
    };

    closeModal(id);
    duplicate(undercuttedStrategy);
  };

  const duplicateStrategy = () => {
    closeModal(id);
    duplicate(strategy);
  };

  return (
    <ModalOrMobileSheet id={id} title="Duplicate Strategy">
      <p className="text-secondary font-weight-400">Select your option.</p>

      <article className="grid grid-cols-[32px_1fr_auto] grid-rows-[auto_auto] gap-8 rounded bg-black/90 p-16">
        <div className="row-span-2 flex h-32 w-32 items-center justify-center self-center rounded-full bg-green/25">
          <IconCopy className="h-16 w-16 text-green" />
        </div>
        <h3 className="grid text-14 font-weight-500">Copy as Is</h3>
        <Button
          onClick={duplicateStrategy}
          className={cn(
            'row-span-2 self-center',
            buttonStyles({ variant: 'white' })
          )}
        >
          Select
        </Button>
        <p className="text-12 font-weight-400 text-white/60">
          Duplicate the strategy with the existing values (price, budget)
        </p>
      </article>
      <article className="grid grid-cols-[32px_1fr_auto] grid-rows-[auto_auto] gap-8 rounded bg-black/90 p-16">
        <div className="row-span-2 flex h-32 w-32 items-center justify-center self-center rounded-full bg-green/25">
          <IconCut className="h-16 w-16 text-green" />
        </div>
        <h3 className="grid text-14 font-weight-500">Undercut the Strategy</h3>
        <Button
          onClick={undercutStrategy}
          className={cn(
            'row-span-2 self-center',
            buttonStyles({ variant: 'white' })
          )}
        >
          Select
        </Button>
        <p className="text-12 text-white/80">
          Set prices at 0.1% tighter spread and try to get filled ahead
        </p>
      </article>
    </ModalOrMobileSheet>
  );
};
