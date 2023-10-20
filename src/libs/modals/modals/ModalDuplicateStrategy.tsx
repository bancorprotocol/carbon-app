import { ModalFC } from 'libs/modals/modals.types';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { Strategy } from 'libs/queries';
import { Link } from 'libs/routing';
import { ReactComponent as IconCut } from 'assets/icons/cut.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { cn } from 'utils/helpers';

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
    const strategySpread = strategy.order0;
    console.log('Undercutting strategy');
  };

  return (
    <ModalOrMobileSheet id={id}>
      <h2 className={'my-3'}>Duplicate Strategy</h2>
      <p className="text-secondary my-5 flex w-full items-center">
        Select your option.
      </p>
      <article className="grid grid-cols-[auto] grid-rows-[auto_auto] gap-8 rounded bg-emphasis p-16">
        <section className="grid grid-cols-[32px_1fr_auto] grid-rows-[auto_auto] gap-8 rounded bg-emphasis p-16">
          <IconCopy className="row-span-2 self-center" />
          <h3 className="grid text-14 font-weight-500">Copy as Is</h3>
          <Link
            onClick={() => duplicate(strategy)}
            // disabled={isAwaiting || isProcessing}
            // to={}
            search={{ type: 'price' }}
            className={cn(
              'row-span-2 self-center',
              buttonStyles({ variant: 'white' })
            )}
          >
            Select
          </Link>
          <p className="text-12 text-white/80">
            Set prices at 0.1% tighter spread and try to get filled ahead
          </p>
        </section>
        <section className="grid grid-cols-[32px_1fr_auto] grid-rows-[auto_auto] gap-8 rounded bg-emphasis p-16">
          <IconCut className="row-span-2 self-center" />
          <h3 className="text-14 font-weight-500">Undercut the Strategy</h3>
          <Link
            onClick={undercutStrategy}
            // disabled={isAwaiting || isProcessing}
            // to={}
            search={{ type: 'price' }}
            className={cn(
              'row-span-2 self-center',
              buttonStyles({ variant: 'white' })
            )}
          >
            Select
          </Link>
          <p className="text-12 text-white/80">
            Set prices at 0.1% tighter spread and try to get filled ahead
          </p>
        </section>
      </article>
    </ModalOrMobileSheet>
  );
};
