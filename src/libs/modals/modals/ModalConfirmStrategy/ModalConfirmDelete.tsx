import { isGradientStrategy } from 'components/strategies/common/utils';
import { useModal } from 'hooks/useModal';
import { Modal } from '../../Modal';
import { ModalFC } from '../../modals.types';
import { Link } from 'libs/routing';

import { AnyStrategy, Strategy } from 'components/strategies/common/types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { Button } from 'components/common/button';
import { useDeleteStrategy } from 'components/strategies/useDeleteStrategy';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { useMemo } from 'react';
import { getEditPricesPage } from 'components/strategies/edit/utils';

export interface ModalConfirmDeleteData {
  strategy: AnyStrategy;
}

export const ModalConfirmDelete: ModalFC<ModalConfirmDeleteData> = ({
  id,
  data,
}) => {
  const { closeModal } = useModal();
  const { strategy } = data;
  const { deleteStrategy, deleteMutation, isProcessing } = useDeleteStrategy();
  const isAwaiting = deleteMutation.isPending;

  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);
  const isPending = deleteMutation.isPending || isProcessing;

  const isGradient = isGradientStrategy(strategy);

  const editPricePage = useMemo(() => {
    return getEditPricesPage(strategy as Strategy, 'editPrices');
  }, [strategy]);

  const onClick = () => {
    deleteStrategy(
      strategy,
      () => {},
      () => closeModal(id),
    );
  };

  const editPrices = () => closeModal(id);

  return (
    <Modal id={id} className="grid gap-16">
      <h2>Delete Strategy</h2>
      <IconTitleText
        variant="error"
        icon={<IconTrash className="size-24" />}
        title="Are you sure you would like to delete your strategy?"
        text="Deleting your strategy will result in all strategy data being lost and impossible to restore. All funds will be withdrawn to your wallet."
      />
      {!isGradient && (
        <article className="bg-main-900/40 grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded-2xl p-16">
          <h3 className="text-14 font-medium">Did you know?</h3>
          <Link
            onClick={editPrices}
            disabled={isAwaiting || isProcessing}
            to={editPricePage.to}
            params={{ strategyId: strategy.id }}
            search={editPricePage.search}
            className="btn-primary-gradient row-span-2 self-center"
          >
            Edit Prices
          </Link>
          <p className="text-12 text-white/80">
            Editing prices is cheaper and keeps your strategy working for you.
          </p>
        </article>
      )}

      <Button
        variant="white"
        onClick={onClick}
        loading={isPending}
        loadingChildren={loadingChildren}
        data-testid="delete-strategy-btn"
      >
        Delete Strategy
      </Button>
    </Modal>
  );
};
