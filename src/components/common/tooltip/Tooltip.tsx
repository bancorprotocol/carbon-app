import Tippy, { TippyProps } from '@tippyjs/react/headless';
import { FC, isValidElement, ReactNode } from 'react';
import { useSpring, m } from 'framer-motion';
import { Instance } from 'tippy.js';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import ReactDOMServer from 'react-dom/server';
import { carbonEvents } from 'services/events';

export const Tooltip: FC<
  TippyProps & {
    element: ReactNode;
    className?: string;
    iconClassName?: string;
    sendEventOnMount?: {
      buy?: boolean | undefined;
    };
    disabled?: boolean;
  }
> = ({
  element,
  className = '',
  iconClassName = '',
  maxWidth = 350,
  sendEventOnMount,
  disabled = false,
  children = (
    <IconTooltip
      className={`h-18 w-18 ${iconClassName ? iconClassName : ''}`}
    />
  ),
  ...props
}) => {
  const springConfig = { damping: 15, stiffness: 300 };
  const initialScale = 0.5;
  const opacity = useSpring(0, springConfig);
  const scale = useSpring(initialScale, springConfig);

  const onMount = () => {
    scale.set(1);
    opacity.set(1);
    sendEventOnMount &&
      carbonEvents.strategy.strategyTooltipShow({
        buy: sendEventOnMount?.buy,
        message: isValidElement(element)
          ? ReactDOMServer.renderToString(element)
          : element
          ? element.toString()
          : '',
      });
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
      hideOnClick={false}
      delay={500}
      render={(attrs) => (
        <m.div
          className={`rounded border border-darkGrey bg-darkGrey/30 px-24 py-16 text-14 text-white shadow-lg backdrop-blur-2xl ${className}`}
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
      <div>{children}</div>
    </Tippy>
  );
};
