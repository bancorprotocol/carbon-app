import { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { useModal } from 'hooks/useModal';
import Sheet from 'react-modal-sheet';

type Props = {
  children: ReactNode;
  id: string;
  title?: string | ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClose?: (id: string) => void;
};

export const ModalSheet: FC<Props> = ({
  children,
  id,
  title,
  size = 'sm',
  showCloseButton = true,
  isLoading = false,
  onClose,
}) => {
  const { closeModal } = useModal();
  const [isOpen, setOpen] = useState(false);

  const onCloseHandler = useCallback(
    (id: string) => {
      setOpen(false);
      onClose && onClose(id);
      setTimeout(() => {
        closeModal(id);
      }, 500);
    },
    [closeModal, onClose]
  );

  useEffect(() => {
    setOpen(true);
  }, [id, onCloseHandler]);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => onCloseHandler(id)}
      detent="content-height"
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};
