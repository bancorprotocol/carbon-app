import { FC, ReactNode, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { m, Variants } from 'libs/motion';
import { useOutsideClick } from 'hooks/useOutsideClick';

type Props = {
  button: (onClick: () => void) => ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  className?: string;
  right?: boolean;
};

export const DropdownMenu: FC<Props> = ({
  children,
  button,
  className,
  isOpen,
  setIsOpen,
  right,
}) => {
  const outsideState = setIsOpen !== undefined && isOpen !== undefined;
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { styles } = usePopper(ref.current, tooltipRef.current);

  const [open, setOpen] = useState(false);
  useOutsideClick(ref, () =>
    outsideState ? setIsOpen(false) : setOpen(false)
  );
  const menuOpen = (outsideState && isOpen) || (!outsideState && open);

  return (
    <m.div
      ref={ref}
      initial={false}
      animate={menuOpen ? 'open' : 'closed'}
      className={'relative'}
    >
      {button(() => {
        if (outsideState) setIsOpen(!isOpen);
        else setOpen(!open);
      })}
      <m.div
        ref={tooltipRef}
        className={`${className} ${
          right ? 'right-0' : 'left-0'
        } absolute z-50 mt-10 min-w-[200px] rounded border border-b-lightGrey bg-primary-500/10 px-24 py-16 shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-darkGrey/30`}
        variants={menuVariants}
        style={{ ...styles.popper, pointerEvents: menuOpen ? 'auto' : 'none' }}
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
