import { m, Variants } from 'libs/motion';
import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

type Props = {
  className?: string;
  close?: () => void | undefined;
  children: ReactNode;
};

export const Overlay: FC<Props> = ({ children, close, className }) => {
  return (
    <m.div
      onKeyDown={(e) => {
        if (e.key === 'Escape' && close) close();
      }}
      onClick={close}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'fixed inset-0 z-40 flex overflow-hidden bg-black/70 outline-none backdrop-blur focus:outline-none',
        className,
      )}
    >
      {children}
    </m.div>
  );
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
