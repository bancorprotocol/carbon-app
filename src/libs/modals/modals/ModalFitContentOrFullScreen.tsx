import { useBreakpoints } from 'hooks/useBreakpoints';
import { Modal, ModalProps } from '../Modal';
import { ModalFullScreen } from '../ModalFullscreen';

export const ModalFitContentOrFullScreen = (props: ModalProps) => {
  const { belowBreakpoint } = useBreakpoints();

  if (belowBreakpoint('md')) {
    return <ModalFullScreen {...props} />;
  }

  return <Modal {...props} />;
};
