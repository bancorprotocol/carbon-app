import { ReactComponent as IconCut } from 'assets/icons/cut.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { Button } from 'components/common/button';
import { getDuplicateStrategyParams } from 'components/strategies/create/useDuplicateStrategy';
import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { Strategy } from 'libs/queries';
import { getUndercutStrategy } from './utils';
import { useNavigate } from 'libs/routing';

export type ModalDuplicateStrategyData = {
  strategy: Strategy;
};

export const ModalDuplicateStrategy: ModalFC<ModalDuplicateStrategyData> = ({
  id,
  data: { strategy },
}) => {
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const undercutDifference = 0.001;

  const duplicate = (strategy: Strategy) => {
    const search = getDuplicateStrategyParams(strategy);
    navigate({ to: '/strategies/create', search });
  };

  const undercutStrategy = () => {
    const undercutStrategy = getUndercutStrategy(strategy, undercutDifference);
    duplicate(undercutStrategy);
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
      <h2 className="text-14 font-weight-400 text-white/60">
        Select your option.
      </h2>

      {duplicateOptions.map(
        ({ icon: Icon, title, onClick, description, testId }) => (
          <article
            key={title}
            className="grid grid-cols-[32px_1fr_auto] grid-rows-[auto_auto] gap-8 rounded bg-black/90 p-16"
          >
            <div className="bg-primary/25 size-32 row-span-2 flex items-center justify-center self-center rounded-full">
              <Icon className="text-primary size-16" />
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
