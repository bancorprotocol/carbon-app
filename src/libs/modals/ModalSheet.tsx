import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Overlay } from 'libs/modals/Overlay';
import { ModalProps } from 'libs/modals/modals.types';

export const ModalSheet: FC<ModalProps> = ({
  children,
  id,
  title,
  showCloseButton = true,
  isLoading = false,
  onClose,
  'data-testid': testId,
}) => {
  const { closeModal } = useModal();
  const onCloseHandler = (id: string) => {
    onClose && onClose(id);
    closeModal(id);
  };

  return (
    <Overlay onClick={() => onCloseHandler(id)} className={'items-end'}>
      <m.div
        data-testid="modal-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="relative flex w-full flex-col gap-20 overflow-hidden rounded-t-10 border-0 bg-silver p-20 outline-none focus:outline-none">
          {isLoading && (
            <div className="statusBar absolute inset-x-0 top-0 h-6 bg-green/25" />
          )}
          <header data-testid={testId} className="flex justify-between">
            {typeof title === 'string' ? <h2>{title}</h2> : title}
            {showCloseButton && (
              <button
                data-testid="modal-close"
                className="p-4"
                onClick={() => onCloseHandler(id)}
              >
                <IconX className="w-12" />
              </button>
            )}
          </header>
          <div className="flex max-h-[70vh] flex-col gap-20 overflow-auto">
            {children}
          </div>
        </div>
      </m.div>
    </Overlay>
  );
};

const dropIn: Variants = {
  hidden: {
    height: '0%',
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      delay: 0,
      duration: 0.5,
    },
  },
  exit: {
    height: '0%',
    transition: {
      duration: 0.5,
    },
  },
};
