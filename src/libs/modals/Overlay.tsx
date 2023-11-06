import { m, Variants } from 'libs/motion';
import { FC, MouseEventHandler, ReactNode } from 'react';

type Props = {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  children: ReactNode;
};

export const Overlay: FC<Props> = ({ children, onClick, className }) => {
  return (
    <m.div
      onClick={onClick}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`fixed inset-0 z-40 flex overflow-hidden bg-black/70 outline-none backdrop-blur focus:outline-none ${className}`}
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
