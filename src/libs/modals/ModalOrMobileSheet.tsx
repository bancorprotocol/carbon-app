import { useBreakpoints } from 'hooks/useBreakpoints';
import { Modal, ModalProps } from './Modal';
import { ModalSheet } from './ModalSheet';

export const ModalOrMobileSheet = (props: ModalProps) => {
  const { belowBreakpoint } = useBreakpoints();

  if (belowBreakpoint('md')) {
    return <ModalSheet {...props} />;
  }

  return <Modal {...props} />;
};
