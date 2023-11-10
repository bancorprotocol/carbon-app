import { ModalFC } from 'libs/modals/modals.types';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { Strategy } from 'libs/queries';
import { ReactComponent as IconCut } from 'assets/icons/cut.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
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
  const undercutDifference = 0.01;

  const undercutStrategy = () => {
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

    duplicate(undercuttedStrategy);
    closeModal(id);
  };

  const duplicateStrategy = () => {
    duplicate(strategy);
    closeModal(id);
  };

  const duplicateOptions = [
    {
      icon: IconCopy,
      title: 'Copy as Is',
      onClick: duplicateStrategy,
      description:
        'Duplicate the strategy with the existing values (price, budget)',
    },
    {
      icon: IconCut,
      title: 'Undercut the Strategy',
      onClick: undercutStrategy,
      description:
        'Set prices at 0.1% tighter spread and try to get filled ahead',
    },
  ];

  return (
    <ModalOrMobileSheet id={id} title="Duplicate Strategy">
      <p className="text-secondary font-weight-400">Select your option.</p>

      {duplicateOptions.map(({ icon: Icon, title, onClick, description }) => (
        <article
          key={title}
          className="grid grid-cols-[32px_1fr_auto] grid-rows-[auto_auto] gap-8 rounded bg-black/90 p-16"
        >
          <div className="row-span-2 flex h-32 w-32 items-center justify-center self-center rounded-full bg-green/25">
            <Icon className="h-16 w-16 text-green" />
          </div>
          <h3 className="text-14 font-weight-500">{title}</h3>
          <Button
            variant="white"
            type="button"
            onClick={onClick}
            aria-label={title.toLowerCase()}
            className="row-span-2 self-center"
          >
            Select
          </Button>
          <p className="text-12 font-weight-400 text-white/60">{description}</p>
        </article>
      ))}
    </ModalOrMobileSheet>
  );
};
