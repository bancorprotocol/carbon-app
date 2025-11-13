import { ModalProps } from 'libs/modals/modals.types';
import { FC, useEffect } from 'react';
import { useDialog } from 'hooks/useDialog';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';

export const Modal: FC<ModalProps> = ({ children, ...props }) => {
  const { id, placement = 'center', className } = props;
  const { ref, open, lightDismiss } = useDialog();
  const { removeModal } = useModal();

  useEffect(() => {
    open();
  }, [open]);

  const onClose = () => {
    props.onClose?.(id);
    removeModal(id);
  };

  return (
    <dialog
      className={cn('modal', placement)}
      id={id}
      ref={ref}
      onClick={lightDismiss}
      onClose={onClose}
    >
      <div className={className}>{children}</div>
    </dialog>
  );
};
