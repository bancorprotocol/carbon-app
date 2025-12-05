import { useEffect, useRef } from 'react';
import { Loading } from './Loading';
import { cn } from 'utils/helpers';

interface Props {
  value?: number;
  className?: string;
  delay?: number;
  /** Delta to remove from the value at initialization, will be added in rolling animation */
  initDelta?: number;
  loadingWidth: string;
  format: (value: number) => string;
}

export const RollingNumber = ({
  value,
  format,
  delay,
  className,
  loadingWidth,
  initDelta = 0,
}: Props) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const anims = useRef<Promise<Animation>[]>(null);
  const lastTrades = useRef(0);

  useEffect(() => {
    if (typeof value !== 'number' || !value) return;
    let tradesChanged = false;
    const start = async () => {
      const from = lastTrades.current || value - initDelta;
      const to = value;
      const letters = ref.current!.children;
      // Initial animation
      if (!lastTrades.current) {
        const initAnims: Promise<Animation>[] = [];
        const next = format(from).split('');
        for (let i = 0; i < next.length; i++) {
          const v = next[i];
          if (!'0123456789'.includes(v)) continue;
          const anim = letters[i]?.animate(
            [{ transform: `translateY(-${v}0%)` }],
            {
              duration: 1000,
              delay: i * 100,
              fill: 'forwards',
              easing: 'cubic-bezier(1,-0.54,.65,1.46)',
            },
          );
          if (anim) initAnims.push(anim.finished);
        }
        await Promise.allSettled(initAnims);
      }
      // Wait for lingering animations if any
      await Promise.allSettled(anims.current ?? []);
      anims.current = [];
      let previous = format(from - 1).split('');
      for (let value = from; value <= to; value++) {
        const next = format(value).split('');
        for (let i = 0; i < next.length; i++) {
          if (tradesChanged) return;
          const v = next[i];
          if (!'0123456789'.includes(v)) continue;
          if (previous[i] === next[i]) continue;
          const anim = letters[i].animate(
            [{ transform: `translateY(-${v}0%)` }],
            {
              duration: 1000,
              delay: delay ?? 2000,
              fill: 'forwards',
              easing: 'cubic-bezier(1,.11,.55,.79)',
            },
          );
          anims.current.push(anim.finished);
        }
        previous = next;
        await Promise.allSettled(anims.current ?? []);
        lastTrades.current = value;
      }
    };
    start();
    return () => {
      tradesChanged = true;
    };
  }, [format, value, delay, initDelta]);

  if (typeof value !== 'number' || !value) {
    return <Loading height={40} width={loadingWidth} fontSize="36px" />;
  }

  const initial = format(value - initDelta);
  return (
    <p
      ref={ref}
      className={cn(
        'text-36 font-title flex h-[40px] overflow-hidden leading-40',
        className,
      )}
    >
      {initial.split('').map((v, i) => {
        if (!'0123456789'.includes(v)) return <span key={i}>{v}</span>;
        return (
          <span key={i} className="grid h-max text-center">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </span>
        );
      })}
    </p>
  );
};
