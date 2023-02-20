import { FC, ReactNode } from 'react';
import { useModal } from 'hooks/useModal';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Overlay } from 'libs/modals/Overlay';

type Props = {
  children: ReactNode;
  id: string;
  title?: string | ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const getSize = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return 'max-w-[580px]';
    case 'md':
      return 'max-w-[480px]';
    default:
      return 'max-w-[380px]';
  }
};

export const ModalSlideOver: FC<Props> = ({
  children,
  id,
  title,
  size = 'sm',
  showCloseButton = true,
}) => {
  const { closeModal } = useModal();

  const sizeClass = getSize(size);

  return (
    <Overlay onClick={() => closeModal(id)} className={`justify-end`}>
      <m.div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${sizeClass}`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="relative flex h-screen w-full flex-col border-0 bg-silver p-25 outline-none focus:outline-none">
          <div className={'flex items-center justify-between'}>
            <>
              {typeof title === 'string' ? (
                <h2 className={'m-0'}>{title}</h2>
              ) : (
                title
              )}
            </>
            <div>
              {showCloseButton ? (
                <button className={'ml-20 p-4'} onClick={() => closeModal(id)}>
                  <IconX className={'w-12'} />
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
