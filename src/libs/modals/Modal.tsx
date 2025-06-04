import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Overlay } from 'libs/modals/Overlay';
import { ModalProps } from 'libs/modals/modals.types';

const getSize = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return 'max-w-[580px]';
    case 'md':
      return 'max-w-[480px]';
    default:
      return 'max-w-[390px]';
  }
};

export const Modal: FC<ModalProps> = ({
  children,
  id,
  title,
  size = 'sm',
  showCloseButton = true,
  isPending = false,
  onClose,
  'data-testid': testId,
}) => {
  const { closeModal } = useModal();

  const onCloseHandler = (id: string) => {
    if (onClose) onClose(id);
    closeModal(id);
  };

  const sizeClass = getSize(size);

  return (
    <Overlay
      close={() => onCloseHandler(id)}
      className="px-content items-center justify-center"
    >
      <m.div
        data-testid="modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`relative mx-auto w-full ${sizeClass}`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          data-testid={testId}
          className="rounded-10 bg-background-900 relative flex w-full flex-col gap-20 overflow-hidden border-0 p-20 outline-none focus:outline-none"
        >
          {isPending && (
            <div className="statusBar bg-primary/25 absolute inset-x-0 top-0 h-6" />
          )}
          <header className="flex justify-between">
            {typeof title === 'string' ? (
              <h2 id="modal-title">{title}</h2>
            ) : (
              title
            )}
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
    y: '100vh',
    scale: 0.7,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      duration: 0.5,
      type: 'spring',
      damping: 20,
      mass: 1,
      stiffness: 200,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    scale: 0.7,
    transition: {
      duration: 0.5,
    },
  },
};
