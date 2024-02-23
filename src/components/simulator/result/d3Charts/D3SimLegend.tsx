import { ReactComponent as IconEye } from 'assets/icons/eye.svg';
import { ReactComponent as IconEyeDisabled } from 'assets/icons/eye-disabled.svg';
import { D3LegendItem, D3SimLegendEntry, D3SimLegendType } from 'libs/d3/types';
import { useId } from 'react';

interface Props {
  legend: D3SimLegendType;
  toggleLegend: (key: D3SimLegendEntry) => void;
}

export const D3SimLegend = ({ legend, toggleLegend }: Props) => {
  const onKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    const el = e.target as SVGGElement;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      (el.previousElementSibling as SVGGElement)?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      (el.nextElementSibling as SVGGElement)?.focus();
    }
  };
  return (
    <g transform="translate(16,16)">
      <rect
        x={0}
        y={0}
        width={195}
        height={156}
        rx={8}
        className="fill-emphasis"
      />
      <g transform="translate(12,16)" onKeyDown={onKeyDown}>
        {Object.entries(legend).map(([key, data]) => (
          <LegendItem
            key={key}
            data={data}
            onClick={() => toggleLegend(key as D3SimLegendEntry)}
          />
        ))}
      </g>
    </g>
  );
};

const LegendItem = ({
  data,
  onClick,
}: {
  data: D3LegendItem;
  onClick: () => void;
}) => {
  const id = useId();
  const { index, color, label, labelSecondary, isDisabled, isDashed } = data;
  const onKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <g
      role="checkbox"
      tabIndex={0}
      transform={`translate(0,${index * 25})`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      // @ts-ignore
      style={{ pointerEvents: 'bounding-box' }}
      className="cursor-pointer"
      aria-checked={!isDisabled}
      aria-labelledby={id}
    >
      <line
        x1={0}
        x2={10}
        y1={0}
        y2={0}
        stroke={color}
        strokeWidth={2}
        rx={1}
        strokeDasharray={isDashed ? 2 : 0}
      />
      <text id={id} x={17} y={5} fill="currentColor" className="text-14">
        {label}{' '}
        <tspan fill="currentColor" opacity={0.5}>
          {labelSecondary}
        </tspan>
      </text>

      {isDisabled ? (
        <IconEyeDisabled
          role="img"
          x={160}
          y={-6}
          width={14}
          height={14}
          className="text-white/60"
          aria-label="Closed eye icon"
        />
      ) : (
        <IconEye
          role="img"
          x={160}
          y={-6}
          width={14}
          height={14}
          className="text-green"
          aria-label="Opened eye icon"
        />
      )}
      <rect x="0" height="20" y="-7" fill="transparent" width="174" />
    </g>
  );
};
