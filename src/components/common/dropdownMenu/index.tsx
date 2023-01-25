import { FC, ReactNode, useState } from 'react';
import { useTooltip } from 'libs/tooltip';
import { m, Variants } from 'libs/motion';
import { useOutsideClick } from 'hooks/useOutsideClick';

type Props = {
  button: (onClick: () => void) => ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  className?: string;
};

export const DropdownMenu: FC<Props> = ({
  children,
  button,
  className,
  isOpen,
  setIsOpen,
}) => {
  const outsideState = setIsOpen !== undefined && isOpen !== undefined;

  const { itemRef, tooltipRef, styles } = useTooltip({
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
        className={`${className} min-w-[200px] rounded border border-b-lightGrey bg-primary-500/10 px-24 py-16 shadow-lg backdrop-blur-2xl dark:border-darkGrey dark:bg-darkGrey/30`}
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
