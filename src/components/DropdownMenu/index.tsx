import { m, Variants } from 'motion';
import { FC, ReactNode, useRef, useState } from 'react';
import { useOutsideClick } from 'hooks/useOutsideClick';

type Props = {
  button: string | ReactNode;
  children: ReactNode;
};

export const DropdownMenu: FC<Props> = ({ children, button }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <m.div
      ref={ref}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={'relative'}
    >
      <m.button onClick={() => setIsOpen(!isOpen)}>{button}</m.button>
      <m.div
        className={
          'absolute mt-10 -ml-20 min-w-[200px] rounded border border-b-lightGrey bg-primary-500/10 px-24 py-16 shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-darkGrey/30'
        }
        variants={menuVariants}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {children}
      </m.div>
    </m.div>
  );
};

const menuVariants: Variants = {
  open: {
    //clipPath: 'inset(0% 0% 0% 0% round 10px)',
    opacity: 1,
    scale: 1,
    y: '0px',
    x: '0px',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  closed: {
    //clipPath: 'inset(10% 50% 90% 50% round 10px)',
    opacity: 0,
    scale: 0.8,
    y: '-40px',
    x: '-30px',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.3,
    },
  },
};
