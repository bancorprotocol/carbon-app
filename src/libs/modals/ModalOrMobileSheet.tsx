import { ModalProps } from 'libs/modals/modals.types';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { ModalSheet } from 'libs/modals/ModalSheet';
import { Modal } from 'libs/modals/Modal';
import { FC } from 'react';

export const ModalOrMobileSheet: FC<ModalProps> = ({ children, ...props }) => {
  const { belowBreakpoint } = useBreakpoints();

  if (belowBreakpoint('md')) {
    return <ModalSheet {...props}>{children}</ModalSheet>;
  }
  return <Modal {...props}>{children}</Modal>;
};
