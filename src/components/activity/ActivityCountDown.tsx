import { useList } from 'hooks/useList';
import { DependencyList, FC, useEffect, useState } from 'react';
import style from './ActivityCountDown.module.css';

interface Props {
  time: number;
}

export const useCountDown = (time: number, deps?: DependencyList) => {
  const [count, setCount] = useState(time);
  useEffect(() => {
    setCount(time);
    const interval = setInterval(() => setCount((v) => Math.max(--v, 0)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return count;
};

const radius = 35;
const perimeter = 2 * Math.PI * radius;

export const ActivityCountDown: FC<Props> = ({ time }) => {
  const { all } = useList();
  // reset the countdown when the new request is made
  const count = useCountDown(time, [all]);
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 100 100"
      fill="none"
      style={{
        ['--time' as any]: `${time}s`,
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
      <g className={style.arrow}>
        <g className={style.lines}>
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
        className={style.circle}
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
