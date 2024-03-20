import { useList } from 'hooks/useList';
import { DependencyList, FC, useEffect, useState } from 'react';

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

export const ActivityCountDown: FC<Props> = ({ time }) => {
  const { all } = useList();
  // reset the countdown when the new request is made
  const count = useCountDown(time, [all]);
  const perimeter = 2 * Math.PI * 40;
  return (
    <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="white"
        strokeWidth="6"
        strokeOpacity="0.2"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="var(--primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={perimeter}
        strokeDashoffset={Math.round(perimeter * (1 - count / time))}
        style={{
          transform: 'rotate(270deg)',
          transformOrigin: 'center',
          transition: 'stroke-dashoffset 0.2s ease',
        }}
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
