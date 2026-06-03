import { toUnixUTC } from 'components/simulator/utils';
import { GradientOrder, Strategy } from 'components/strategies/common/types';
import { isEmptyGradientOrder } from 'components/strategies/common/utils';
import { FC, useEffect, useMemo, useState } from 'react';

interface Props {
  strategy: Strategy<GradientOrder>;
}

const M = 60;
const H = 60 * M;
const D = 24 * H;

const getRemaining = (min: number, max: number) => {
  const now = Number(toUnixUTC(new Date()));
  console.log({
    min: new Date(min * 1000),
    max: new Date(max * 1000),
    now: new Date(now * 1000),
  });
  if (now < min) return 0;
  if (now > max) return 0;
  return max - now;
};

const formatCountDown = (remaining: number) => {
  const days = Math.floor(remaining / D);
  const hours = Math.floor((remaining % D) / H);
  const minutes = Math.floor((remaining % H) / M);
  const seconds = remaining % M;
  if (days) {
    return `${days}d ${hours}h ${minutes}m`;
  } else {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
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
  const now = Number(toUnixUTC(new Date()));

  const [remaining, setRemaining] = useState(() => getRemaining(min, max));

  useEffect(() => {
    setRemaining(getRemaining(min, max));
    const interval = setInterval(() => {
      setRemaining(getRemaining(min, max));
    }, 1000);
    return () => clearInterval(interval);
  }, [min, max]);

  return (
    <article className="grid bg-main-900/40 rounded-md border-main-800 border p-16 w-3/5">
      <h4 className="text-12 flex items-center gap-4 text-main-0/60 self-start">
        Countdown
      </h4>
      <p className="grid items-center text-18 font-medium truncate @xs/strategy:text-24">
        {now < min && <span className="text-primary">Starting Soon</span>}
        {now > max && <span className="text-warning">Expired</span>}
        {!!remaining && formatCountDown(remaining)}
      </p>
    </article>
  );
};
