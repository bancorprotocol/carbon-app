import { animate } from 'framer-motion';
import { m } from 'libs/motion';
import { useEffect, useRef } from 'react';

interface Props {
  from: number;
  to: number;
  className: string;
  duration?: number;
  formatFn?: (value: number) => string;
}

export const AnimatedNumber = ({
  from,
  to,
  className,
  duration,
  formatFn,
}: Props) => {
  const nodeRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration: duration ?? 2,
      onUpdate(value) {
        node.textContent = formatFn ? formatFn(value) : value.toString();
      },
    });

    return () => controls.stop();
  }, [to]);

  return <m.p ref={nodeRef} className={className ?? ''} />;
};
