import { FC, ReactNode, useRef } from 'react';
import { useModal } from './ModalProvider';
import { useModalOutsideClick } from './useModalOutsideClick';
import { m, Variants } from 'framer-motion';

type Props = {
  children: ReactNode;
  id: string;
};

const dropIn: Variants = {
  hidden: {
    y: '-100vh',
    opacity: 0,
    scale: 1,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    scale: 0,
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
      duration: 0.7,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.7,
    },
  },
};

export const Modal: FC<Props> = ({ children, id }) => {
  const { closeModal } = useModal();
  const ref = useRef<HTMLDivElement>(null);
  useModalOutsideClick(id, ref, closeModal);

  return (
    <m.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 px-3 outline-none backdrop-blur focus:outline-none`}
    >
      <m.div
        className="relative my-6 mx-auto w-full max-w-xl"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          ref={ref}
          className="relative flex max-h-[70vh] w-full flex-col overflow-y-auto rounded-2xl border-0 bg-gray-400 p-10 outline-none focus:outline-none"
        >
          {children}
        </div>
      </m.div>
    </m.div>
  );
};
