import { FC, ReactNode, useId, useState } from 'react';
import { Placement } from '@popperjs/core';
import { useTooltip } from 'libs/tooltip';
import { m, Variants } from 'libs/motion';
import { useOutsideClick } from 'hooks/useOutsideClick';

export interface MenuTriggerAttributes {
  onClick: () => void;
  'aria-expanded': boolean;
  'aria-controls': string;
  'aria-haspopup': 'menu';
}

type Props = {
  button: (attr: MenuTriggerAttributes) => ReactNode;
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
  const tooltipId = useId();
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

  const triggerAttributes = {
    'aria-expanded': menuOpen,
    'aria-controls': tooltipId,
    'aria-haspopup': 'menu' as const,
    onClick: () => {
      if (outsideState) setIsOpen(!isOpen);
      else setOpen(!open);
    },
  };

  return (
    <m.div
      ref={itemRef}
      initial={false}
      animate={menuOpen ? 'open' : 'closed'}
      className={'relative'}
    >
      {button(triggerAttributes)}
      <m.div
        role="menu"
        id={tooltipId}
        ref={tooltipRef}
        className={`z-30 min-w-[200px] rounded border border-b-lightGrey shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-emphasis ${className}`}
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
