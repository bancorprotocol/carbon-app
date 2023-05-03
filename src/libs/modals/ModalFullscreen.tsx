import { FC, ReactNode } from 'react';
import { useModal } from 'hooks/useModal';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Overlay } from 'libs/modals/Overlay';

type ModalFullScreenProps = {
  children: ReactNode;
  id: string;
  title?: string | ReactNode;
  showCloseButton?: boolean;
  isLoading?: boolean;
};

export const ModalFullScreen: FC<ModalFullScreenProps> = ({
  children,
  id,
  title,
  showCloseButton = true,
  isLoading = false,
}) => {
  const { closeModal } = useModal();

  return (
    <Overlay
      onClick={() => closeModal(id)}
      className={'items-center justify-center'}
    >
      <m.div
        onClick={(e) => e.stopPropagation()}
        className={`relative mx-auto h-full w-full`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={`relative flex h-full w-full flex-col overflow-hidden border-0 bg-white p-20 outline-none focus:outline-none dark:bg-emphasis`}
        >
          {isLoading && (
            <div
              className={
                'statusBar absolute -mt-20 -ml-20 h-6 w-full bg-green/25'
              }
            />
          )}
          <div className={'flex justify-between'}>
            <div>
              {typeof title === 'string' ? (
                <h2 className={'m-0'}>{title}</h2>
              ) : (
                title
              )}
            </div>
            <div>
              {showCloseButton ? (
                <button className={'p-4'} onClick={() => closeModal(id)}>
                  <IconX className={'w-12'} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="h-full overflow-y-hidden">{children}</div>
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
