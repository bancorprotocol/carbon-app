import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from '../../ModalOrMobileSheet';
import { ModalFC } from '../../modals.types';
import { CartStrategy } from 'libs/queries';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { Button } from 'components/common/button';
import { useCartDuplicate } from 'components/strategies/create/useDuplicateStrategy';
import { cn } from 'utils/helpers';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { removeStrategyFromCart } from 'components/cart/utils';

export interface ModalCartConfirmDeleteData {
  strategy: CartStrategy;
}

export const ModalCartConfirmDelete: ModalFC<ModalCartConfirmDeleteData> = ({
  id,
  data,
}) => {
  const { closeModal } = useModal();
  const { strategy } = data;
  const duplicate = useCartDuplicate();

  const onClick = async () => {
    closeModal(id);
    removeStrategyFromCart(strategy);
  };

  const edit = () => {
    closeModal(id);
    duplicate(strategy);
  };

  return (
    <ModalOrMobileSheet id={id} title="Delete Strategy">
      <IconTitleText
        variant="error"
        icon={<IconTrash className="size-24" />}
        title="Are you sure you would like to delete your strategy?"
        text="Deleting your strategy will result in all strategy data being lost and impossible to restore. All funds will be withdrawn to your wallet."
      />
      <article className="bg-background-800 grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded p-16">
        <h3 className="text-14 font-weight-500">Did you know?</h3>
        <button
          onClick={edit}
          className={cn(
            'row-span-2 self-center',
            buttonStyles({ variant: 'success' })
          )}
        >
          Edit
        </button>
        <p className="text-12 text-white/80">
          Editing prices is cheaper and keeps your strategy working for you.
        </p>
      </article>

      <Button
        variant="success"
        onClick={onClick}
        data-testid="delete-strategy-btn"
      >
        Delete Strategy
      </Button>
    </ModalOrMobileSheet>
  );
};
