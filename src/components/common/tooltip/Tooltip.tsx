import Tippy, { TippyProps } from '@tippyjs/react/headless';
import { FC, ReactNode } from 'react';
import { useSpring, m } from 'framer-motion';
import { Instance } from 'tippy.js';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';

export const Tooltip: FC<TippyProps & { element: ReactNode }> = ({
  element,
  children = <IconTooltip className={'h-18 w-18'} />,
  maxWidth = 350,
  ...props
}) => {
  const springConfig = { damping: 15, stiffness: 300 };
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

  return (
    <Tippy
      render={(attrs) => (
        <m.div
          className={`rounded border border-darkGrey bg-darkGrey/30 px-24 py-16 shadow-lg backdrop-blur-2xl`}
          style={{ scale, opacity, maxWidth }}
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
