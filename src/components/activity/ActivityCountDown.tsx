import { FC, useCallback, useEffect, useId, useState } from 'react';
import { useActivity } from './ActivityProvider';

interface Props {
  time: number;
}

const finishRemainingAnimations = (element: HTMLElement | null) => {
  const animations = element?.getAnimations() ?? [];
  const operations = animations.map(async (a) => {
    await a.finished;
    if (element?.offsetParent == null) return; // cannot commit style to not rendered element, check null and undefined
    a.commitStyles();
    a.cancel();
  });
  return Promise.all(operations);
};

const commitAnimationStyle = (element: HTMLElement | null) => {
  const animations = element?.getAnimations() ?? [];
  animations.forEach((a) => {
    if (element?.offsetParent == null) return;
    a.commitStyles();
    a.cancel();
  });
};

interface AnimationOptions {
  element: HTMLElement | null;
  keyframes: Keyframe[];
  duration: number;
}
async function runAnimationAfterLast(options: AnimationOptions) {
  const { element, keyframes, duration } = options;
  const beforeFinished = Date.now();
  await finishRemainingAnimations(element);
  const delta = Date.now() - beforeFinished;
  return element?.animate(keyframes, {
    duration: Math.max(duration - delta, 0),
    fill: 'forwards',
  });
}

const radius = 35;
const perimeter = 2 * Math.PI * radius;

export const ActivityCountDown: FC<Props> = ({ time }) => {
  const baseId = useId();
  const { fetchStatus } = useActivity();
  const [count, setCount] = useState(time);
  const id = useCallback((name: string) => `${baseId}-${name}`, [baseId]);

  useEffect(() => {
    const arrow = document.getElementById(id('arrow'));
    const lines = document.getElementById(id('lines'));
    const circle = document.getElementById(id('circle'));
    const text = document.getElementById(id('text'));
    if (fetchStatus === 'idle') {
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
      for (const el of [circle, arrow, lines]) commitAnimationStyle(el);
      circle?.animate([{ strokeDashoffset: -1 * perimeter }], options);
      arrow?.animate([{ transform: 'rotate(720deg)' }], options);
      lines?.animate([{ transform: 'translateY(15px) scale(0)' }], options);
      text?.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.5)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        options,
      );
    }

    return () => {};
  }, [fetchStatus, time, id]);

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 100 100"
      fill="none"
      aria-label={`${count}seconds until next refresh`}
    >
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
