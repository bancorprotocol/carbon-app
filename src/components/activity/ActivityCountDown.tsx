import { FC, useEffect, useState } from 'react';
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
  const delta = await new Promise<number>((res) => {
    if (!animations.length) return res(0);
    animations.forEach((a) => {
      const timing = a.effect?.getComputedTiming();
      const delta = Number(timing?.duration) * Number(timing?.progress);
      // const delta = Number(a.currentTime ?? 0) - Number(a.startTime ?? 0);
      a.onfinish = () => res(delta);
    });
  });
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
      };
      circle?.animate([{ strokeDashoffset: -1 * perimeter }], options);
      arrow?.animate([{ transform: 'rotate(720deg)' }], options);
      lines?.animate([{ transform: 'translateY(15px) scale(0)' }], options);
    }
  }, [isFetching, time]);
  return { count };
};

const radius = 35;
const perimeter = 2 * Math.PI * radius;

export const ActivityCountDown: FC<Props> = ({ time }) => {
  const amount = useIsFetching({ queryKey: QueryKey.activities({}) });
  const { count } = useCountDown(time, amount > 0);
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 100 100"
      fill="none"
      style={{
        ['--time' as any]: `${time - 5}s`,
      }}
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="white"
        strokeWidth="6"
        strokeOpacity="0.2"
      />
      <g className="origin-center" id="arrow">
        <g className="origin-top" id="lines">
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
        id="circle"
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
