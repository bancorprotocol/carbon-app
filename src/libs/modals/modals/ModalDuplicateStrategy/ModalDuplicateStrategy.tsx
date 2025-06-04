import { ReactComponent as IconCut } from 'assets/icons/cut.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { Button } from 'components/common/button';
import { useDuplicate } from 'components/strategies/create/useDuplicateStrategy';
import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { Strategy } from 'libs/queries';
import { getUndercutStrategy } from './utils';
import { getStrategyType } from 'components/strategies/common/utils';
import { useNavigate } from '@tanstack/react-router';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import { NATIVE_TOKEN_ADDRESS, isGasTokenToHide } from 'utils/tokens';

export type ModalDuplicateStrategyData = {
  strategy: Strategy;
};

export const ModalDuplicateStrategy: ModalFC<ModalDuplicateStrategyData> = ({
  id,
  data: { strategy },
}) => {
  const navigate = useNavigate();
  const strategyType = getStrategyType(strategy);
  const duplicate = useDuplicate();
  const { closeModal } = useModal();
  const undercutDifference = 0.001;

  const undercutStrategy = () => {
    if (strategyType === 'overlapping') {
      // Reduce spread by 0.1% for overlapping strategies
      const spread = getRoundedSpread(strategy) * 0.99;
      // Force native token address if gas token is different
      let baseAddress = strategy.base.address;
      let quoteAddress = strategy.quote.address;
      if (isGasTokenToHide(baseAddress)) baseAddress = NATIVE_TOKEN_ADDRESS;
      if (isGasTokenToHide(quoteAddress)) quoteAddress = NATIVE_TOKEN_ADDRESS;

      navigate({
        to: '/trade/overlapping',
        search: {
          base: baseAddress,
          quote: quoteAddress,
          min: strategy.order0.startRate,
          max: strategy.order1.endRate,
          spread: spread.toString(),
        },
      });
    } else {
      const undercut = getUndercutStrategy(strategy, undercutDifference);
      duplicate(undercut);
    }
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
            <div className="bg-primary/25 row-span-2 flex size-32 items-center justify-center self-center rounded-full">
              <Icon className="text-primary size-16" />
            </div>
            <h3 className="text-14 font-weight-500">{title}</h3>
            <Button
              variant="success"
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
        ),
      )}
    </ModalOrMobileSheet>
  );
};
