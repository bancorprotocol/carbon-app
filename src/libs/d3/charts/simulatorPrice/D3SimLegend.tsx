import {
  D3LegendItem,
  D3SimLegendEntry,
  D3SimLegendType,
} from 'libs/d3/charts/simulatorPrice/D3ChartSimulatorPrice';
import { ReactComponent as IconEye } from 'assets/icons/eye.svg';
import { ReactComponent as IconEyeDisabled } from 'assets/icons/eye-disabled.svg';

interface Props {
  legend: D3SimLegendType;
  toggleLegend: (key: D3SimLegendEntry) => void;
}

export const D3SimLegend = ({ legend, toggleLegend }: Props) => {
  return (
    <g transform={`translate(16,16)`}>
      <rect
        x={0}
        y={0}
        width={195}
        height={156}
        className={'fill-darkSilver'}
        rx={8}
      />
      <g transform={`translate(12,14)`}>
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
  const { index, color, label, labelSecondary, isDisabled } = data;

  return (
    <g
      transform={`translate(0,${index * 25})`}
      onClick={onClick}
      // @ts-ignore
      style={{ pointerEvents: 'bounding-box' }}
      className={'cursor-pointer'}
    >
      <rect x={0} y={0} width={8} height={2} fill={color} rx={1} />
      <text x={15} y={6} fill={'currentColor'} className={'text-14'}>
        {label}{' '}
        <tspan fill={'currentColor'} opacity={0.5}>
          {labelSecondary}
        </tspan>
      </text>

      {isDisabled ? (
        <IconEyeDisabled
          x={160}
          y={-6}
          className={'text-white/60'}
          width={14}
          height={14}
        />
      ) : (
        <IconEye
          x={160}
          y={-6}
          className={'text-green'}
          width={14}
          height={14}
        />
      )}
    </g>
  );
};
