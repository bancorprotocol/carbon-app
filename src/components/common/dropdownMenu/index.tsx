import { FC, ReactNode, useState } from 'react';
import { Placement } from '@popperjs/core';
import { useTooltip } from 'libs/tooltip';
import { m, Variants } from 'libs/motion';
import { useOutsideClick } from 'hooks/useOutsideClick';

type Props = {
  button: (onClick: () => void) => ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  className?: string;
  placement?: Placement;
};

export const DropdownMenu: FC<Props> = ({
  children,
  button,
  isOpen,
  setIsOpen,
  placement,
  className = '',
}) => {
  const outsideState = setIsOpen !== undefined && isOpen !== undefined;

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

  const [open, setOpen] = useState(false);
  useOutsideClick(itemRef, () =>
    outsideState ? setIsOpen(false) : setOpen(false)
  );
  const menuOpen = (outsideState && isOpen) || (!outsideState && open);

  return (
    <m.div
      ref={itemRef}
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
        className={`z-30 min-w-[200px] rounded border border-b-lightGrey px-24 py-16 shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-emphasis ${className}`}
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
  },
  closed: {
    opacity: 0,
  },
};
