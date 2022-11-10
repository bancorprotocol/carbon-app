import { FC, ReactNode, useRef } from 'react';
import { useModal } from './ModalProvider';
import { useModalOutsideClick } from './useModalOutsideClick';
import { m, Variants } from 'motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';

type Props = {
  children: ReactNode;
  id: string;
  title?: string | ReactNode;
  showCloseButton?: boolean;
};

export const Modal: FC<Props> = ({
  children,
  id,
  title,
  showCloseButton = true,
}) => {
  const { closeModal, minimizeModal } = useModal();
  const ref = useRef<HTMLDivElement>(null);
  useModalOutsideClick(id, ref, closeModal);

  return (
    <m.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-primary-500/50 px-3 outline-none backdrop-blur focus:outline-none`}
    >
      <m.div
        className="relative my-6 mx-auto w-full max-w-[485px]"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          ref={ref}
          className="relative flex w-full flex-col rounded-16 border-0 bg-white p-30 outline-none focus:outline-none dark:bg-black"
        >
          <div className={'flex justify-between'}>
            <div>{typeof title === 'string' ? <h2>{title}</h2> : title}</div>

            <div>
              {showCloseButton ? (
                <button
                  className={'rotate-90 text-30'}
                  onClick={() => minimizeModal(id)}
                >
                  {'>'}
                </button>
              ) : null}
            </div>

            <div>
              {showCloseButton ? (
                <button className={''} onClick={() => closeModal(id)}>
                  <IconX className={'w-16'} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </m.div>
    </m.div>
  );
};

const dropIn: Variants = {
  hidden: {
    y: '100vh',
    //opacity: 0,
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

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.7,
    },
  },
};
