import { useLinearScale } from 'libs/d3/useLinearScale';
import { D3ChartSettings } from 'libs/d3/types';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { max, ScaleBand, scaleBand, ScaleLinear } from 'd3';

interface Props {
  dms: D3ChartSettings;
  data: SimulatorReturn['data'];
}

export const D3ChartSimulatorBalance = ({ dms, data }: Props) => {
  const xScale = scaleBand()
    .domain(['base', 'quote'])
    .range([0, dms.boundedWidth])
    .padding(0.1);

  const balanceCASH = data.length ? data[data.length - 1].balanceCASH : 0;
  const balanceRISK = data.length ? data[data.length - 1].balanceRISK : 0;

  const y = useLinearScale({
    domain: [max([balanceCASH, balanceRISK]) as number, 0],
    range: [0, dms.boundedHeight],
  });

  const percentage = (balanceRISK / (balanceCASH + balanceRISK)) * 100;

  if (data.length === 0) return null;

  return (
    <>
      <Bar
        id="base"
        xScale={xScale}
        yScale={y.scale}
        value={balanceRISK}
        percentage={percentage}
        dms={dms}
      />

      <Bar
        id="quote"
        xScale={xScale}
        yScale={y.scale}
        value={balanceCASH}
        percentage={100 - percentage}
        dms={dms}
      />
    </>
  );
};

interface BarProps {
  id: 'base' | 'quote';
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  value: number;
  dms: D3ChartSettings;
  percentage: number;
}
const Bar = ({ id, xScale, yScale, value, dms, percentage }: BarProps) => {
  const x = xScale(id);
  const y = yScale(value);
  const width = xScale.bandwidth();
  const color = id === 'base' ? '#D86371' : '#00B578';

  return (
    <>
      <rect
        x={x}
        y={value > 2 ? y : dms.boundedHeight - 2}
        width={width}
        height={dms.boundedHeight - y || 2}
        fill={color}
      />

      <text
        x={(x || 0) + width / 2}
        y={y - 30}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
      >
        {percentage.toFixed(2)} %
      </text>

      <text
        x={(x ?? 0) + width / 2}
        y={y - 10}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
      >
        {value.toFixed(2)}
      </text>
    </>
  );
};
