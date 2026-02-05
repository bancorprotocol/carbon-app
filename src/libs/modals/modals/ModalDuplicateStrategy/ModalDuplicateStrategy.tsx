import IconCut from 'assets/icons/cut.svg?react';
import IconCopy from 'assets/icons/copy.svg?react';
import { useDuplicate } from 'components/strategies/create/useDuplicateStrategy';
import { useModal } from 'hooks/useModal';
import { ModalProps } from 'libs/modals/modals.types';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import { StaticOrder, Strategy } from 'components/strategies/common/types';
import { getUndercutStrategy } from './utils';
import {
  isEmptyGradientOrder,
  isGradientStrategy,
  isOverlappingStrategy,
} from 'components/strategies/common/utils';
import { useNavigate } from '@tanstack/react-router';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import { NATIVE_TOKEN_ADDRESS, isGasTokenToHide } from 'utils/tokens';
import { StrategyDirection } from 'libs/routing';

interface ModalDuplicateStrategyData {
  strategy: Strategy<StaticOrder>;
}

export default function ModalDuplicateStrategy({
  id,
  data: { strategy },
}: ModalProps<ModalDuplicateStrategyData>) {
  const navigate = useNavigate();
  const duplicate = useDuplicate();
  const { closeModal } = useModal();
  const undercutDifference = 0.001;

  const undercutStrategy = () => {
    if (isGradientStrategy(strategy)) {
      // TODO: implement gradient undercut
      const directions: StrategyDirection[] = [];
      if (!isEmptyGradientOrder(strategy.buy)) directions.push('buy');
      if (!isEmptyGradientOrder(strategy.sell)) directions.push('sell');
      navigate({
        to: '/trade/custom',
        search: {
          base: strategy.base.address,
          quote: strategy.quote.address,
          directions,
          buy_SD_: strategy.buy._sD_,
          buy_ED_: strategy.buy._eD_,
          buy_SP_: strategy.buy._sP_,
          buy_EP_: strategy.buy._eP_,
          sell_SD_: strategy.sell._sD_,
          sell_ED_: strategy.sell._eD_,
          sell_SP_: strategy.sell._sP_,
          sell_EP_: strategy.sell._eP_,
        },
      });
    } else if (isOverlappingStrategy(strategy)) {
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
          min: strategy.buy.min,
          max: strategy.sell.max,
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
    <Modal id={id} className="grid gap-16">
      <ModalHeader id={id}>
        <h2>Duplicate Strategy</h2>
      </ModalHeader>
      <h3 className="text-14 font-normal text-main-0/60">
        Select your option.
      </h3>

      {duplicateOptions.map(
        ({ icon: Icon, title, onClick, description, testId }) => (
          <article
            key={title}
            className="flex gap-16 rounded-2xl bg-main-800 p-16"
          >
            <div className="bg-primary/25 row-span-2 flex size-32 items-center justify-center self-center rounded-full">
              <Icon className="text-primary size-16" />
            </div>
            <hgroup className="grid flex-1">
              <h3 className="text-14 font-medium">{title}</h3>
              <p className="text-12 font-normal text-main-0/60">
                {description}
              </p>
            </hgroup>
            <button
              onClick={onClick}
              className="btn-on-surface row-span-2 self-center"
              data-testid={testId}
            >
              Select
            </button>
          </article>
        ),
      )}
    </Modal>
  );
}
