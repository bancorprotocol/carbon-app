import { D3ChartCandlesticks } from './D3ChartCandlesticks';
import { useState } from 'react';
import { D3ChartSettingsProps, D3ChartCandlestickData } from './../../types';
import { D3ChartProvider } from './../../D3ChartProvider';

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
    <D3ChartProvider settings={settings} data={slicedData}>
      <D3ChartCandlesticks />
    </D3ChartProvider>
  );
};
