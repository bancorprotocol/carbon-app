import { FC, ReactNode } from 'react';
import {
  AnimatePresence,
  domAnimation,
  LazyMotion as FramerLazyMotion,
  m,
  Variants,
} from 'framer-motion';
import { mItemVariant, mListVariant } from 'libs/motion/motionVariants';

export const LazyMotion: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <FramerLazyMotion features={domAnimation} strict>
      {children}
    </FramerLazyMotion>
  );
};

export type { Variants };

export { m, AnimatePresence, mItemVariant, mListVariant };
