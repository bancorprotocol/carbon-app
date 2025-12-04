import { ModalHeaderProps } from 'libs/modals/modals.types';
import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useDialog } from 'hooks/useDialog';
import { useModal } from 'hooks/useModal';
import IconClose from 'assets/icons/X.svg?react';
import { cn } from 'utils/helpers';

export interface Props {
  children: ReactNode;
  id: string;
  className?: string;
  placement?: 'center' | 'side';
  onClose?: (id: string) => void;
  'data-testid'?: string;
}

export const Modal: FC<Props> = ({ children, ...props }) => {
  const { id, placement = 'center', className } = props;
  const { ref, open, lightDismiss } = useDialog();
  const { removeModal } = useModal();

  useEffect(() => {
    open();
  }, [open]);

  const onClose = useCallback(() => {
    removeModal(id);
    props.onClose?.(id);
  }, [id, props, removeModal]);

  return (
    <dialog
      className={cn('modal', placement)}
      id={id}
      ref={ref}
      onClick={lightDismiss}
      onClose={onClose}
      data-testid="modal-container"
    >
      <div className={className}>{children}</div>
    </dialog>
  );
};

export const ModalHeader: FC<ModalHeaderProps> = ({
  children,
  id,
  className,
}) => {
  const { closeModal } = useModal();
  return (
    <header className={cn('grid grid-flow-col items-center gap-16', className)}>
      {children}
      <button
        className="justify-self-end"
        onClick={() => closeModal(id)}
        aria-label="close modal"
        data-testid="modal-close"
      >
        <IconClose className="size-16" />
      </button>
    </header>
  );
};
