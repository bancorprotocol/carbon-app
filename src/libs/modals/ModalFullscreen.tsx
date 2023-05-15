import { FC, ReactNode } from 'react';
import { useModal } from 'hooks/useModal';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';

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
    <m.div
      onClick={(e) => e.stopPropagation()}
      className={`h-90vh fixed bottom-0 z-40 flex w-full flex-col overflow-hidden rounded-t-40 bg-emphasis p-20`}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {isLoading && (
        <div
          className={'statusBar absolute -mt-20 -ml-20 h-6 w-full bg-green/25'}
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
            <button className={'p-10'} onClick={() => closeModal(id)}>
              <IconX className={'w-12'} />
            </button>
          ) : null}
        </div>
      </div>

      <div>{children}</div>
    </m.div>
  );
};

const dropIn: Variants = {
  hidden: {
    //y: '100vh',
    height: '0%',
    // scale: 0.7,
    // opacity: 0,
  },
  visible: {
    // y: 0,
    height: '100%',
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      duration: 0.5,
      // type: 'spring',
      // damping: 20,
      //  mass: 0.9,
      //  stiffness: 200,
    },
  },
  exit: {
    // y: '100vh',
    height: '0%',
    // opacity: 0,
    // scale: 0.7,
    transition: {
      duration: 0.5,
    },
  },
};
