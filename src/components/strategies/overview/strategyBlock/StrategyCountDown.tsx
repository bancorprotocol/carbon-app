import { toUnixUTC } from 'components/simulator/utils';
import { GradientOrder, Strategy } from 'components/strategies/common/types';
import { isEmptyGradientOrder } from 'components/strategies/common/utils';
import { FC, RefObject, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  strategy: Strategy<GradientOrder>;
}

const M = 60;
const H = 60 * M;
const D = 24 * H;

const getRemaining = (min: number, max: number, now: number) => {
  if (now < min) return 0;
  if (now > max) return 0;
  return max - now;
};

export const StrategyCountDown: FC<Props> = ({ strategy }) => {
  const { min, max } = useMemo(() => {
    const buy = strategy.buy;
    const sell = strategy.sell;
    const orders = [buy, sell].filter((o) => !isEmptyGradientOrder(o));
    const starts = orders.map((o) => Number(o.startDate));
    const ends = orders.map((o) => Number(o.endDate));
    return {
      min: Math.min(...starts),
      max: Math.max(...ends),
    };
  }, [strategy.buy, strategy.sell]);
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const [now, setNow] = useState(() => Number(toUnixUTC(new Date())));
  const [remaining, setRemaining] = useState(() => getRemaining(min, max, now));
  const hasCountdown = remaining > 0;

  useEffect(() => {
    const update = () => {
      const now = Number(toUnixUTC(new Date()));
      const remaining = getRemaining(min, max, now);
      setNow(now);
      setRemaining(remaining);
    };
    update();
    const interval = setInterval(() => update(), 1000);
    return () => clearInterval(interval);
  }, [min, max]);

  const textClassName =
    'flex items-center gap-4 text-18 font-medium truncate @xs/strategy:text-24';

  return (
    <article className="grid bg-main-900/40 rounded-md border-main-800 border p-16 w-3/5">
      <h4 className="text-12 flex items-center gap-4 text-main-0/60 self-start">
        Countdown
      </h4>
      <p ref={containerRef} className={textClassName}>
        {now < min && <span className="text-primary">Starting Soon</span>}
        {now > max && <span className="text-warning">Expired</span>}
        {hasCountdown && (
          <CountDown container={containerRef} remaining={remaining} />
        )}
      </p>
    </article>
  );
};

const pad = (value: number) => value.toString().padStart(2, '0');
const cancelAnimations = (el: Element | null) => {
  el?.getAnimations().forEach((a) => a.cancel());
};

interface CountDownProps {
  remaining: number;
  container: RefObject<HTMLParagraphElement | null>;
}
const CountDown: FC<CountDownProps> = ({ remaining, container }) => {
  const days = Math.floor(remaining / D);
  const hours = Math.floor((remaining % D) / H);
  const minutes = Math.floor((remaining % H) / M);
  const seconds = remaining % M;
  const belowTen = useMemo(() => minutes < 10, [minutes]);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;
    if (belowTen) {
      const p = container.current;
      p?.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], {
        duration: 1000,
        iterations: Infinity,
        easing: 'steps(2, end)',
      });
      return () => cancelAnimations(p);
    } else {
      const colons = container.current?.querySelectorAll('.colon') ?? [];
      for (const colon of colons) {
        colon.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], {
          duration: 1000,
          iterations: Infinity,
          easing: 'steps(2, end)',
        });
      }
      return () => colons.forEach(cancelAnimations);
    }
  }, [container, belowTen]);

  if (days) {
    return (
      <>
        <span>{pad(days)}d</span>
        <span className="colon" aria-hidden>
          :
        </span>
        <span>{pad(hours)}h</span>
        <span className="colon" aria-hidden>
          :
        </span>
        <span>{minutes}m</span>
      </>
    );
  } else {
    return (
      <>
        <span>{pad(hours)}h</span>
        <span className="colon" aria-hidden>
          :
        </span>
        <span>{pad(minutes)}m</span>
        <span className="colon" aria-hidden>
          :
        </span>
        <span>{pad(seconds)}s</span>
      </>
    );
  }
};
