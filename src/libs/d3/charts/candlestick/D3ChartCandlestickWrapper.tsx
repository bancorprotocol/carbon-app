import { StrategyInputDispatch } from 'hooks/useStrategyInput';
import { SimChartWrapper } from 'libs/d3/sim/SimulatorChartWrapper';
import { SimulatorInputSearch } from 'libs/routing/routes/sim';
import { D3ChartCandlesticks } from './D3ChartCandlesticks';
import { useState } from 'react';
import { D3ChartSettingsProps, CandlestickData } from './../../types';

type Props = {
  data: CandlestickData[];
  settings: D3ChartSettingsProps;
  dispatch: StrategyInputDispatch;
  state: SimulatorInputSearch;
};

const brushSize = 130;

export const D3ChartCandlestickWrapper = ({
  data,
  settings,
  dispatch,
  state,
}: Props) => {
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
      {(dms) => (
        <D3ChartCandlesticks
          state={state}
          dispatch={dispatch}
          data={data}
          dms={dms}
        />
      )}
    </SimChartWrapper>
  );
};
