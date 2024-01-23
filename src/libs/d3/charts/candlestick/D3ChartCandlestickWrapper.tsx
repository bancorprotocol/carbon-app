import { SimChartWrapper } from 'libs/d3/sim/SimulatorChartWrapper';
import { D3ChartCandlesticks } from './D3ChartCandlesticks';
import { useState } from 'react';
import { D3ChartSettingsProps, D3ChartCandlestickData } from './../../types';

type Props = {
  data: D3ChartCandlestickData[];
  settings: D3ChartSettingsProps;
};

const brushSize = 130;

export const D3ChartCandlestickWrapper = ({ data, settings }: Props) => {
  const [brushExtent] = useState<[number, number]>();

  if (!data.length) {
    return <pre>Loading...</pre>;
  }

  const initialBrushExtent = [
    data[data.length - brushSize].date,
    data[data.length - 1].date,
  ];

  const slicedData = brushExtent
    ? data.filter((d) => d.date > brushExtent[0] && d.date < brushExtent[1])
    : data.filter(
        (d) => d.date > initialBrushExtent[0] && d.date < initialBrushExtent[1]
      );

  return (
    <SimChartWrapper settings={settings}>
      {(dms) => <D3ChartCandlesticks data={slicedData} dms={dms} />}
    </SimChartWrapper>
  );
};
