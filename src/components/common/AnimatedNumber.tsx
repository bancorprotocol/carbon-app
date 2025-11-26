import { useEffect, useRef } from 'react';

interface TweenOptions {
  from: number;
  to: number;
  duration: number;
  delay?: number;
  ease?: (t: number) => number;
}

async function* tween({
  from,
  to,
  duration,
  delay = 0,
  ease = (t) => t, // Default linear easing
}: TweenOptions): AsyncGenerator<number> {
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const startTime = performance.now();
  let currentTime = startTime;
  let elapsed = 0;

  while (elapsed < duration) {
    const t = Math.min(1, elapsed / duration);
    const easedT = ease(t);
    const currentValue = from + (to - from) * easedT;
    yield currentValue;

    currentTime = await new Promise<number>((resolve) =>
      requestAnimationFrame(resolve),
    );

    elapsed = currentTime - startTime;
  }
  yield to;
}

interface Props {
  from: number;
  to: number;
  className: string;
  duration?: number;
  formatFn?: (value: number) => string;
  'data-testid'?: string;
}

export const AnimatedNumber = ({
  from,
  to,
  className,
  duration,
  formatFn,
  'data-testid': testid,
}: Props) => {
  const nodeRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    let close = false;
    const animate = async () => {
      const animation = tween({
        from,
        to,
        duration: duration ?? 2000,
        ease: (x) => 1 - Math.pow(1 - x, 3), // ease-out
      });
      for await (const value of animation) {
        if (close) return;
        const text = formatFn ? formatFn(value) : value.toString();
        node.textContent = text;
      }
    };
    animate();
    return () => {
      close = true;
    };
  }, [duration, formatFn, from, to]);

  return <p ref={nodeRef} className={className ?? ''} data-testid={testid}></p>;
};
