import { ReactComponent as IconCut } from 'assets/icons/cut.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { Button } from 'components/common/button';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';

export type ModalDuplicateStrategyData = {
  strategy: Strategy;
};

export const getUndercutStrategy = (
  strategy: Strategy,
  undercutDifference: number
): Strategy => {
  const multiplyRate = (rate: string, factor: number) =>
    new SafeDecimal(rate).times(factor).toString();

  const undercuttedStrategy = {
    ...strategy,
    order0: {
      ...strategy.order0,
      startRate: multiplyRate(
        strategy.order0.startRate,
        1 + undercutDifference
      ),
      endRate: multiplyRate(strategy.order0.endRate, 1 + undercutDifference),
    },
    order1: {
      ...strategy.order1,
      startRate: multiplyRate(
        strategy.order1.startRate,
        1 - undercutDifference
      ),
      endRate: multiplyRate(strategy.order1.endRate, 1 - undercutDifference),
    },
  };

  return undercuttedStrategy;
};

export const ModalDuplicateStrategy: ModalFC<ModalDuplicateStrategyData> = ({
  id,
  data: { strategy },
}) => {
  const { closeModal } = useModal();
  const { duplicate } = useDuplicateStrategy();
  const undercutDifference = 0.001;

  const undercutStrategy = () => {
    const undercuttedStrategy = getUndercutStrategy(
      strategy,
      undercutDifference
    );

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
      testId: 'duplicate-strategy-btn',
    },
    {
      icon: IconCut,
      title: 'Undercut the Strategy',
      onClick: undercutStrategy,
      description: `Set prices at ${
        undercutDifference * 100
      }% tighter spread and try to get filled ahead`,
      testId: 'undercut-strategy-btn',
    },
  ];

  return (
    <ModalOrMobileSheet id={id} title="Duplicate Strategy">
      <h2 className="text-secondary font-weight-400">Select your option.</h2>

      {duplicateOptions.map(
        ({ icon: Icon, title, onClick, description, testId }) => (
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
              onClick={onClick}
              className="row-span-2 self-center"
              data-testid={testId}
            >
              Select
            </Button>
            <p className="text-12 font-weight-400 text-white/60">
              {description}
            </p>
          </article>
        )
      )}
    </ModalOrMobileSheet>
  );
};
