import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import WarningIcon from 'assets/icons/warning.svg?react';
import CloseIcon from 'assets/icons/close.svg?react';
import { ReactNode, useMemo } from 'react';
import { useModal } from 'hooks/useModal';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import { ModalProps } from '../modals.types';

interface ModalGenericInfoData {
  title: string;
  text?: string | ReactNode;
  variant?: 'warning' | 'error';
  onConfirm: () => any;
  buttonLabel?: string;
}

export default function ModalGenericInfo({
  id,
  data: { variant = 'error', title, text, buttonLabel = 'Confirm', onConfirm },
}: ModalProps<ModalGenericInfoData>) {
  const { closeModal } = useModal();

  const icon = useMemo(() => {
    switch (variant) {
      case 'warning':
        return <WarningIcon className="size-24" />;
      case 'error':
        return <CloseIcon className="size-24" />;
      default:
        return <WarningIcon className="size-24" />;
    }
  }, [variant]);

  return (
    <Modal id={id} className="grid gap-16">
      <ModalHeader id={id} />
      <div>
        <IconTitleText
          variant={variant}
          icon={icon}
          title={title}
          text={text}
        />
      </div>
      <button
        className="btn-main-gradient"
        onClick={() => {
          closeModal(id);
          onConfirm();
        }}
      >
        {buttonLabel}
      </button>
      <button className="btn-on-surface" onClick={() => closeModal(id)}>
        Cancel
      </button>
    </Modal>
  );
}
