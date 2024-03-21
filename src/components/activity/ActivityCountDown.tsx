import { FC, useCallback, useEffect, useId, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';

interface Props {
  time: number;
}

interface AnimationOptions {
  element: HTMLElement | null;
  keyframes: Keyframe[];
  duration: number;
}
async function runAnimationAfterLast(options: AnimationOptions) {
  const { element, keyframes, duration } = options;
  const animations = element?.getAnimations() ?? [];
  const beforeFinished = Date.now();
  await new Promise<void>((res) => {
    if (!animations.length) return res();
    animations.forEach((a) => (a.onfinish = () => res()));
  });
  const delta = Date.now() - beforeFinished;
  return element?.animate(keyframes, {
    duration: duration - delta,
    fill: 'forwards',
  });
}

export const useCountDown = (time: number, isFetching: boolean) => {
  const [count, setCount] = useState(time);
  useEffect(() => {
    const arrow = document.getElementById('arrow');
    const lines = document.getElementById('lines');
    const circle = document.getElementById('circle');
    const text = document.getElementById('text');
    if (!isFetching) {
      runAnimationAfterLast({
        element: circle,
        keyframes: [
          { strokeDashoffset: perimeter },
          { strokeDashoffset: 0.1 * perimeter },
        ],
        duration: time * 1000,
      });
      runAnimationAfterLast({
        element: arrow,
        keyframes: [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(324deg)' }, // 0.9 * 360
        ],
        duration: time * 1000,
      });
      runAnimationAfterLast({
        element: lines,
        keyframes: [
          { transform: 'translateY(15px) scale(0)' },
          { transform: 'translateY(0) scale(1)' },
        ],
        duration: time * 1000,
      });
      setCount(time);
      const i = setInterval(() => setCount((v) => Math.max(--v, 0)), 1000);
      return () => clearInterval(i);
    } else {
      const options: KeyframeAnimationOptions = {
        duration: 1000,
        easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
      };
      arrow?.animate([{ transform: 'rotate(720deg)' }], options);
      lines?.animate([{ transform: 'translateY(15px) scale(0)' }], options);
      circle?.animate([{ strokeDashoffset: -1 * perimeter }], options);
      text?.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.5)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        options
      );
    }
  }, [isFetching, time]);
  return { count };
};

const radius = 35;
const perimeter = 2 * Math.PI * radius;

export const ActivityCountDown: FC<Props> = ({ time }) => {
  const baseId = useId();
  const amount = useIsFetching({ queryKey: QueryKey.activities({}) });
  const [count, setCount] = useState(time);

  const id = useCallback((name: string) => `${baseId}-${name}`, [baseId]);

  useEffect(() => {
    const arrow = document.getElementById(id('arrow'));
    const lines = document.getElementById(id('lines'));
    const circle = document.getElementById(id('circle'));
    const text = document.getElementById(id('text'));
    if (amount === 0) {
      runAnimationAfterLast({
        element: circle,
        keyframes: [
          { strokeDashoffset: perimeter },
          { strokeDashoffset: 0.1 * perimeter },
        ],
        duration: time * 1000,
      });
      runAnimationAfterLast({
        element: arrow,
        keyframes: [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(324deg)' }, // 0.9 * 360
        ],
        duration: time * 1000,
      });
      runAnimationAfterLast({
        element: lines,
        keyframes: [
          { transform: 'translateY(15px) scale(0)' },
          { transform: 'translateY(0) scale(1)' },
        ],
        duration: time * 1000,
      });
      setCount(time);
      const i = setInterval(() => setCount((v) => Math.max(--v, 0)), 1000);
      return () => clearInterval(i);
    } else {
      const options: KeyframeAnimationOptions = {
        duration: 1000,
        easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
      };
      arrow?.animate([{ transform: 'rotate(720deg)' }], options);
      lines?.animate([{ transform: 'translateY(15px) scale(0)' }], options);
      circle?.animate([{ strokeDashoffset: -1 * perimeter }], options);
      text?.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.5)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        options
      );
    }
  }, [amount, time, id]);

  return (
    <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="white"
        strokeWidth="6"
        strokeOpacity="0.2"
      />
      <g className="origin-center" id={id('arrow')}>
        <g className="origin-top" id={id('lines')}>
          <line
            x1="60"
            x2="48"
            y1="15"
            y2="1"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="60"
            x2="48"
            y1="15"
            y2="29"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      </g>
      <circle
        id={id('circle')}
        className="origin-center -rotate-[90deg]"
        cx="50"
        cy="50"
        r={radius}
        stroke="var(--primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={perimeter}
      />
      <text
        id={id('text')}
        className="origin-center"
        x="50"
        y="55"
        fontSize="30"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {count}
      </text>
    </svg>
  );
};
