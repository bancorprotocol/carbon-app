import { useLinearScale } from 'libs/d3/useLinearScale';
import { D3ChartSettings } from 'libs/d3/types';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { max, scaleBand } from 'd3';

interface Props {
  dms: D3ChartSettings;
  data: SimulatorReturn['data'];
}

export const D3ChartSimulatorBalance = ({ dms, data }: Props) => {
  const xScale = scaleBand()
    .domain(['tkn1', 'tkn2'])
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
      <rect
        x={xScale('tkn1')}
        y={y.scale(balanceCASH)}
        width={xScale.bandwidth()}
        height={dms.boundedHeight - y.scale(balanceCASH)}
        fill="teal"
      />

      <text
        x={(xScale('tkn1') ?? 0) + xScale.bandwidth() / 2}
        y={y.scale(balanceCASH) - 10}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
      >
        {balanceCASH.toFixed(2)}
      </text>

      <text
        x={(xScale('tkn1') ?? 0) + xScale.bandwidth() / 2}
        y={y.scale(balanceCASH) - 30}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
      >
        {(100 - percentage).toFixed(2)} %
      </text>

      <rect
        x={xScale('tkn2')}
        y={balanceRISK ? y.scale(balanceRISK) : dms.boundedHeight - 2}
        width={xScale.bandwidth()}
        height={dms.boundedHeight - y.scale(balanceRISK) || 2}
        fill="red"
      />

      <text
        x={(xScale('tkn2') ?? 0) + xScale.bandwidth() / 2}
        y={y.scale(balanceRISK) - 30}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
      >
        {percentage.toFixed(2)} %
      </text>

      <text
        x={(xScale('tkn2') ?? 0) + xScale.bandwidth() / 2}
        y={y.scale(balanceRISK) - 10}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
      >
        {balanceRISK.toFixed(2)}
      </text>
    </>
  );
};
