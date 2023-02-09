import { FC, ReactNode, useState } from 'react';
import { m, Variants } from 'libs/motion';
import { useTooltip } from 'libs/tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { Placement } from '@popperjs/core';

type Props = {
  children: ReactNode;
  element?: string | ReactNode;
  delay?: number;
  className?: string;
  placement?: Placement;
};

let timeout: NodeJS.Timeout;
let prevPopFunc: Function = () => {};

export const Tooltip: FC<Props> = ({
  children,
  element,
  delay = 300,
  className = 'min-w-[275px]',
  placement,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemRef, tooltipRef, styles } = useTooltip({
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

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
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={`relative ${isOpen ? 'z-10' : ''}`}
    >
      <m.div
        ref={itemRef}
        onMouseEnter={() => handleOnMouseEnter()}
        onMouseLeave={() => handleOnMouseLeave()}
        onClick={() => setIsOpen(!isOpen)}
      >
        {element ? element : <IconTooltip />}
      </m.div>
      <m.div
        ref={tooltipRef}
        className={`rounded border border-b-lightGrey bg-primary-500/10 px-24 py-16 shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-darkGrey/30 ${className}`}
        onMouseEnter={() => handleOnMouseEnter()}
        onMouseLeave={() => handleOnMouseLeave()}
        variants={menuVariants}
        style={{
          ...styles.popper,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {children}
      </m.div>
    </m.div>
  );
};

const menuVariants: Variants = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
  },
};
