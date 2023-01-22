import { m, Variants } from 'libs/motion';
import { FC, ReactNode, useRef, useState } from 'react';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';

type Props = {
  children: ReactNode;
  element?: string | ReactNode;
  delay?: number;
};

let timeout: NodeJS.Timeout;
let prevPopFunc: Function = () => {};

export const Tooltip: FC<Props> = ({ children, element, delay = 300 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOnMouseEnter = () => {
    prevPopFunc();
    clearInterval(timeout);
    setIsOpen(true);
  };

  const handleOnMouseLeave = () => {
    prevPopFunc = () => setIsOpen(false);
    timeout = setTimeout(() => setIsOpen(false), delay);
  };

  return (
    <m.div
      ref={ref}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={`relative ${isOpen ? 'z-10' : 'z-0'}`}
    >
      <m.div
        onMouseEnter={() => handleOnMouseEnter()}
        onMouseLeave={() => handleOnMouseLeave()}
        onClick={() => setIsOpen(!isOpen)}
      >
        {element ? element : <IconTooltip />}
      </m.div>
      <m.div
        className={
          'absolute mt-10 -ml-80 min-w-[200px] rounded border border-b-lightGrey bg-primary-500/10 px-24 py-16 shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-darkGrey/30'
        }
        onMouseEnter={() => handleOnMouseEnter()}
        onMouseLeave={() => handleOnMouseLeave()}
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
    opacity: 1,
    scale: 1,
    y: '0px',
    x: '0px',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.2,
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.8,
    y: '-40px',
    x: '-30px',
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.2,
    },
  },
};
