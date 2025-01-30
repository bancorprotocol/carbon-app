import { cn } from 'utils/helpers';
import { useD3ChartCtx } from './D3ChartContext';

interface Props {
  type: 'buy' | 'sell';
  minOutOfScale: boolean;
  maxOutOfScale: boolean;
  color: string;
}

export const D3ChartPriceOutOfScale = ({
  type,
  minOutOfScale,
  maxOutOfScale,
  color,
}: Props) => {
  const { dms } = useD3ChartCtx();
  const stopColor1 = minOutOfScale ? 'black' : color;
  const stopColor2 = minOutOfScale ? color : 'black';
  const stopOpacity1 = minOutOfScale ? 0 : undefined;
  const stopOpacity2 = minOutOfScale ? undefined : 0;
  const yRect = minOutOfScale ? dms.boundedHeight - 30 : -1;

  return (
    <>
      <defs>
        <linearGradient
          id={`gradient-out-of-range-${type}`}
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop offset="0%" stopColor={stopColor1} stopOpacity={stopOpacity1} />
          <stop
            offset="100%"
            stopColor={stopColor2}
            stopOpacity={stopOpacity2}
          />
        </linearGradient>
      </defs>
      <g
        className={cn('transition-all duration-500', {
          'hidden opacity-0': !(minOutOfScale || maxOutOfScale),
          'opacity-100': minOutOfScale || maxOutOfScale,
        })}
      >
        <rect
          x={0}
          y={yRect}
          height={30}
          width={dms.boundedWidth}
          fill={`url(#gradient-out-of-range-${type})`}
          opacity={0.5}
        />
      </g>
    </>
  );
};
