import Tippy, { TippyProps } from '@tippyjs/react/headless';
import { FC, ReactNode } from 'react';
import { useSpring, m } from 'framer-motion';
import { Instance } from 'tippy.js';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { cn } from 'utils/helpers';

interface Props extends TippyProps {
  element: ReactNode;
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
  damping?: number;
  delay?: number;
  stiffness?: number;
  hideOnClick?: boolean;
}

export const Tooltip: FC<Props> = ({
  element,
  className = '',
  iconClassName = '',
  maxWidth = 350,
  disabled = false,
  damping = 15,
  stiffness = 300,
  delay = 500,
  hideOnClick = false,
  children = (
    <span>
      <IconTooltip className={cn('size-18', iconClassName)} />
    </span>
  ),
  ...props
}) => {
  const springConfig = { damping, stiffness };
  const initialScale = 0.5;
  const opacity = useSpring(0, springConfig);
  const scale = useSpring(initialScale, springConfig);

  const onMount = () => {
    scale.set(1);
    opacity.set(1);
  };

  const onHide = ({ unmount }: Instance) => {
    const cleanup = scale.onChange((value) => {
      if (value <= initialScale) {
        cleanup();
        unmount();
      }
    });

    scale.set(initialScale);
    opacity.set(0);
  };

  if (disabled) {
    return children;
  }

  return (
    <Tippy
      appendTo={() => document.body}
      hideOnClick={hideOnClick}
      delay={delay}
      render={(attrs) => (
        <m.div
          className={cn(
            'border-background-800 bg-background-800/30 text-14 rounded border px-24 py-16 text-white shadow-lg backdrop-blur-2xl',
            className,
          )}
          style={{ scale, opacity, maxWidth }}
          data-testid="tippy-tooltip"
          {...attrs}
        >
          {element}
        </m.div>
      )}
      interactive
      offset={[0, 8]}
      animation={true}
      onMount={onMount}
      onHide={onHide}
      {...props}
    >
      {children}
    </Tippy>
  );
};
