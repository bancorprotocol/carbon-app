import { isOverlappingStrategy } from 'components/strategies/common/utils';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from '../../ModalOrMobileSheet';
import { ModalFC } from '../../modals.types';
import { Link } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Strategy } from 'libs/queries';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { cn } from 'utils/helpers';
import { Button } from 'components/common/button';
import { useDeleteStrategy } from 'components/strategies/useDeleteStrategy';
import { getStatusTextByTxStatus } from 'components/strategies/utils';

export interface ModalConfirmDeleteData {
  strategy: Strategy;
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

  const isOverlapping = isOverlappingStrategy(strategy);

  const onClick = () => {
    deleteStrategy(
      strategy,
      () => {},
      () => closeModal(id),
    );
  };

  const editPrices = () => closeModal(id);

  return (
    <ModalOrMobileSheet id={id} title="Delete Strategy">
      <IconTitleText
        variant="error"
        icon={<IconTrash className="size-24" />}
        title="Are you sure you would like to delete your strategy?"
        text="Deleting your strategy will result in all strategy data being lost and impossible to restore. All funds will be withdrawn to your wallet."
      />
      {!isOverlapping && (
        <article className="bg-background-800 grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded p-16">
          <h3 className="text-14 font-weight-500">Did you know?</h3>
          <Link
            onClick={editPrices}
            disabled={isAwaiting || isProcessing}
            to="/strategies/edit/$strategyId"
            params={{ strategyId: strategy.id }}
            search={{ editType: 'editPrices' }}
            className={cn(
              'row-span-2 self-center',
              buttonStyles({ variant: 'success' }),
            )}
          >
            Edit Prices
          </Link>
          <p className="text-12 text-white/80">
            Editing prices is cheaper and keeps your strategy working for you.
          </p>
        </article>
      )}

      <Button
        variant="success"
        onClick={onClick}
        loading={isPending}
        loadingChildren={loadingChildren}
        data-testid="delete-strategy-btn"
      >
        Delete Strategy
      </Button>
    </ModalOrMobileSheet>
  );
};
