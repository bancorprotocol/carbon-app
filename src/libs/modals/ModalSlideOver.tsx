import { FC } from 'react';
import { m, Variants } from 'libs/motion';
import { useModal } from 'hooks/useModal';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Overlay } from 'libs/modals/Overlay';
import { ModalProps } from 'libs/modals/modals.types';
import { cn } from 'utils/helpers';
import styles from './modal.module.css';

export const ModalSlideOver: FC<ModalProps> = ({
  children,
  id,
  title,
  showCloseButton = true,
}) => {
  const { closeModal } = useModal();

  return (
    <Overlay
      close={() => closeModal(id)}
      className={cn('justify-end', styles.modalSlider)}
    >
      <m.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full py-16 max-w-390 md:max-w-420 lg:max-w-480 xl:max-w-580"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="surface backdrop-blur-xs p-25 relative flex h-full w-full flex-col border-0 rounded-2xl outline-hidden focus:outline-hidden">
          <div
            className={`flex items-center ${
              title ? 'justify-between' : 'justify-end'
            }`}
          >
            <>
              {typeof title === 'string' ? (
                <h2 className="m-0">{title}</h2>
              ) : (
                title
              )}
            </>
            <div>
              {showCloseButton ? (
                <button className="p-4" onClick={() => closeModal(id)}>
                  <IconX className="w-12" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="overflow-y-auto">{children}</div>
        </div>
      </m.div>
    </Overlay>
  );
};

const dropIn: Variants = {
  hidden: {
    x: '100vh',
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      duration: 0.5,
    },
  },
  exit: {
    x: '100vh',
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};
